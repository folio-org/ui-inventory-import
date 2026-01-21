import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Button, Icon, Pane, SearchField } from '@folio/stripes/components';
import { parseFilters } from '@folio/stripes/smart-components';
import renderFilter from './renderFilter';
import searchPanePropTypes from './searchPanePropTypes';
import css from './SearchPane.css';


function ChannelsSearchPane(props) {
  const {
    defaultWidth,
    searchValue,
    getSearchHandlers,
    onSubmitSearch,
    searchField,
    query,
    updateQuery,
  } = props;
  const searchHandlers = getSearchHandlers();

  const stripes = useStripes();
  const onChangeIndex = (e) => {
    const qindex = e.target.value;
    stripes.logger.log('action', `changed query-index to '${qindex}'`);
    updateQuery({ qindex });
  };

  const intl = useIntl();
  const searchableIndexes = ['name', 'id', 'message'].map(x => (
    { value: x, label: intl.formatMessage({ id: `ui-inventory-import.channels.index.${x}` }) }
  ));

  const filterStruct = parseFilters(query.filters);

  return (
    <Pane
      defaultWidth={defaultWidth}
      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
    >
      <form onSubmit={onSubmitSearch}>
        <div className={css.searchGroupWrap}>
          <FormattedMessage id="ui-inventory-import.searchInputLabel">
            { ([ariaLabel]) => (
              <SearchField
                data-test-harvestables-search-input
                id="input-harvestables-search"
                autoFocus
                ariaLabel={ariaLabel}
                className={css.searchField}
                searchableIndexes={searchableIndexes}
                selectedIndex={query.qindex}
                value={searchValue.query}
                marginBottom0
                onChangeIndex={onChangeIndex}
                onChange={searchHandlers.query}
                onClear={searchHandlers.reset}
                name="query"
                inputref={searchField}
              />
            )}
          </FormattedMessage>
          <Button
            buttonStyle="primary"
            disabled={!searchValue.query || searchValue.query === ''}
            fullWidth
            id="clickable-harvestables-search"
            marginBottom0
            type="submit"
          >
            <FormattedMessage id="stripes-smart-components.search" />
          </Button>
        </div>

        <div className={css.resetButtonWrap}>
          <Button
            buttonStyle="none"
            id="clickable-reset-all"
            disabled={false}
            onClick={() => {
              updateQuery({ qindex: '', query: undefined, sort: undefined, filters: undefined });
              searchHandlers.reset();
            }}
          >
            <Icon icon="times-circle-solid">
              <FormattedMessage id="stripes-smart-components.resetAll" />
            </Icon>
          </Button>
        </div>

        {renderFilter(intl, filterStruct, updateQuery, 'enabled',
          ['true', 'false'])}
        {renderFilter(intl, filterStruct, updateQuery, 'jobClass',
          ['OaiPmhResource', 'XmlBulkResource', 'HarvestConnectorResource', 'StatusResource'])}
        {renderFilter(intl, filterStruct, updateQuery, 'currentStatus',
          ['NEW', 'OK', 'WARN', 'ERROR', 'RUNNING', 'FINISHED', 'KILLED'],
          true)}

      </form>
    </Pane>
  );
}


ChannelsSearchPane.propTypes = searchPanePropTypes;


export default ChannelsSearchPane;

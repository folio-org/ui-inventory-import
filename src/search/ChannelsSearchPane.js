import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
import { parseFilters } from '@folio/stripes/smart-components';
import MainSearchArea from './MainSearchArea';
import renderFilter from './renderFilter';
import searchPanePropTypes from './searchPanePropTypes';


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
  const searchableIndexes = ['', 'name', 'id'].map(x => ({
    value: x,
    label: intl.formatMessage({ id: `ui-inventory-import.channels.index.${x || 'all'}` }),
  }));

  const filterStruct = parseFilters(query.filters);

  return (
    <Pane
      defaultWidth={defaultWidth}
      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
    >
      <form onSubmit={onSubmitSearch}>
        <MainSearchArea
          key="channels"
          searchValue={searchValue}
          searchField={searchField}
          searchHandlers={searchHandlers}
          onChangeIndex={onChangeIndex}
          searchableIndexes={searchableIndexes}
          query={query}
          updateQuery={updateQuery}
        />
        {renderFilter(intl, filterStruct, updateQuery, 'enabled', ['true', 'false'])}
        {renderFilter(intl, filterStruct, updateQuery, 'type', ['XML'])}
      </form>
    </Pane>
  );
}


ChannelsSearchPane.propTypes = searchPanePropTypes;


export default ChannelsSearchPane;

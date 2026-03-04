import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Button, Icon, SearchField } from '@folio/stripes/components';
import css from './SearchPane.css';

function MainSearchArea({ type, indexes, searchValue, searchField, getSearchHandlers, query, updateQuery }) {
  const intl = useIntl();
  const stripes = useStripes();
  const searchHandlers = getSearchHandlers();

  const searchableIndexes = indexes.map(x => ({
    value: x,
    label: intl.formatMessage({ id: `ui-inventory-import.${type}.index.${x || 'all'}` }),
  }));

  const onChangeIndex = (e) => {
    const qindex = e.target.value;
    stripes.logger.log('action', `changed query-index to '${qindex}'`);
    updateQuery({ qindex });
  };

  return (
    <>
      <>
        <div className={css.searchGroupWrap}>
          <FormattedMessage id="ui-inventory-import.searchInputLabel">
            { ([ariaLabel]) => (
              <SearchField
                id={`input-${type}-search`}
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
            id={`clickable-${type}-search`}
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
      </>
    </>
  );
}

export default MainSearchArea;

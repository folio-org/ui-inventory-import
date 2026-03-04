import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon, SearchField } from '@folio/stripes/components';
import css from './SearchPane.css';


function MainSearchArea({ key, searchValue, searchField, searchHandlers, onChangeIndex, searchableIndexes, query, updateQuery }) {
  return (
    <>
      <>
        <div className={css.searchGroupWrap}>
          <FormattedMessage id="ui-inventory-import.searchInputLabel">
            { ([ariaLabel]) => (
              <SearchField
                id={`input-${key}-search`}
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
            id={`clickable-${key}-search`}
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

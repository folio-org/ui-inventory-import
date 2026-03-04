import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';
import { parseFilters } from '@folio/stripes/smart-components';
import MainSearchArea from './MainSearchArea';
import renderDateFilterPair from './renderDateFilterPair';
import searchPanePropTypes from './searchPanePropTypes';


function RecordsSearchPane(props) {
  const {
    defaultWidth,
    searchValue,
    getSearchHandlers,
    onSubmitSearch,
    searchField,
    query,
    updateQuery,
  } = props;
  const intl = useIntl();
  const filterStruct = parseFilters(query.filters);

  return (
    <Pane
      defaultWidth={defaultWidth}
      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
    >
      <form onSubmit={onSubmitSearch}>
        <MainSearchArea
          type="records"
          indexes={['', 'recordNumber', 'channelName']}
          searchValue={searchValue}
          searchField={searchField}
          getSearchHandlers={getSearchHandlers}
          query={query}
          updateQuery={updateQuery}
        />
        {renderDateFilterPair(intl, filterStruct, updateQuery, 'timeStamp', true)}
      </form>
    </Pane>
  );
}


RecordsSearchPane.propTypes = searchPanePropTypes;


export default RecordsSearchPane;

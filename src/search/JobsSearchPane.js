import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';
import { parseFilters } from '@folio/stripes/smart-components';
import MainSearchArea from './MainSearchArea';
import renderFilter from './renderFilter';
import renderDateFilterPair from './renderDateFilterPair';
import renderNumericFilterPair from './renderNumericFilterPair';
import searchPanePropTypes from './searchPanePropTypes';


function JobsSearchPane(props) {
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
          type="jobs"
          indexes={['', 'channelName', 'message']}
          searchValue={searchValue}
          searchField={searchField}
          getSearchHandlers={getSearchHandlers}
          query={query}
          updateQuery={updateQuery}
        />
        {renderFilter(intl, filterStruct, updateQuery, 'status/jobs.column.status',
          ['RUNNING', 'PAUSED', 'DONE', 'INTERRUPTED'], true)}
        {renderNumericFilterPair(intl, filterStruct, updateQuery, 'records')}
        {renderDateFilterPair(intl, filterStruct, updateQuery, 'started')}
        {renderDateFilterPair(intl, filterStruct, updateQuery, 'finished')}
      </form>
    </Pane>
  );
}


JobsSearchPane.propTypes = searchPanePropTypes;


export default JobsSearchPane;

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
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
  const searchHandlers = getSearchHandlers();

  const stripes = useStripes();
  const onChangeIndex = (e) => {
    const qindex = e.target.value;
    stripes.logger.log('action', `changed query-index to '${qindex}'`);
    updateQuery({ qindex });
  };

  const intl = useIntl();
  const searchableIndexes = ['', 'channelName', 'message'].map(x => ({
    value: x,
    label: intl.formatMessage({ id: `ui-inventory-import.jobs.index.${x || 'all'}` }),
  }));

  const filterStruct = parseFilters(query.filters);

  return (
    <Pane
      defaultWidth={defaultWidth}
      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
    >
      <form onSubmit={onSubmitSearch}>
        <MainSearchArea
          key="jobs"
          searchValue={searchValue}
          searchField={searchField}
          searchHandlers={searchHandlers}
          onChangeIndex={onChangeIndex}
          searchableIndexes={searchableIndexes}
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

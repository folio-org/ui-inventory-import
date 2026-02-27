import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocation, Link } from 'react-router-dom';
import { AppIcon } from '@folio/stripes/core';
import { LoadingPane, Paneset, Pane, MultiColumnList, MCLPagingTypes, NoValue } from '@folio/stripes/components';
import { ColumnManager, SearchAndSortQuery } from '@folio/stripes/smart-components';
import parseSort from '../util/parseSort';
import formatDateTime from '../util/formatDateTime';
import useDurationFormatter from '../util/useDurationFormatter';
import JobsSearchPane from '../search/JobsSearchPane';
import ErrorMessage from '../components/ErrorMessage';
import packageInfo from '../../package';


function Jobs({
  data,
  query,
  resultCount,
  updateQuery,
  error,
  hasLoaded,
  pageAmount,
  onNeedMoreData,
  children,
}) {
  const location = useLocation();
  const formatDuration = useDurationFormatter('narrow');

  const columnMapping = {
    channelName: <FormattedMessage id="ui-inventory-import.jobs.column.channelName" />,
    status: <FormattedMessage id="ui-inventory-import.jobs.column.status" />,
    amountImported: <FormattedMessage id="ui-inventory-import.jobs.column.amountImported" />,
    duration: <FormattedMessage id="ui-inventory-import.jobs.column.duration" />,
    started: <FormattedMessage id="ui-inventory-import.jobs.column.started" />,
    finished: <FormattedMessage id="ui-inventory-import.jobs.column.finished" />,
    type: <FormattedMessage id="ui-inventory-import.jobs.column.type" />,
    message: <FormattedMessage id="ui-inventory-import.jobs.column.message" />,
  };

  const formatter = {
    channelName: r => (
      <Link to={`${packageInfo.stripes.route}/jobs/${r.id}${location.search}`}>{r.channelName}</Link>
    ),
    status: r => <FormattedMessage id={`ui-inventory-import.jobs.column.status.${r.status}`} />,
    started: r => formatDateTime(r.started),
    finished: r => (r.finished ? formatDateTime(r.finished) : <NoValue />),
    duration: r => {
      if (!r.finished) return <NoValue />;
      return formatDuration(Math.floor((new Date(r.finished) - new Date(r.started)) / 1000));
    },
    type: r => r.importType,
  };

  const paneTitle = !data.channel ?
    <FormattedMessage id="ui-inventory-import.nav.jobs" /> :
    <FormattedMessage
      id="ui-inventory-import.nav.jobs-for"
      values={{ name: data.channel.name }}
    />;

  const sortKeys = parseSort(query.sort);
  const sortedColumn = sortKeys[0]?.key;
  const sortDirection = sortKeys[0]?.descending ? 'descending' : 'ascending';

  return (
    <SearchAndSortQuery>
      {
        (sasqParams) => {
          return (
            <Paneset id="jobs-paneset">
              <JobsSearchPane
                {...sasqParams}
                defaultWidth="20%"
                query={query}
                updateQuery={updateQuery}
              />
              {
                error ? <ErrorMessage message={error} /> :
                  !hasLoaded ? <LoadingPane /> :
                  <ColumnManager
                    id="jobs-visible-columns"
                    columnMapping={columnMapping}
                    excludeKeys={['channelName']}
                    persist
                  >
                    {({ renderColumnsMenu, visibleColumns }) => (
                      <Pane
                        appIcon={<AppIcon app="harvester-admin" />}
                        defaultWidth="fill"
                        padContent={false}
                        height="100%"
                        paneTitle={paneTitle}
                        paneSub={<FormattedMessage id="ui-inventory-import.resultCount" values={{ count: resultCount }} />}
                        actionMenu={() => renderColumnsMenu}
                      >
                        <MultiColumnList
                          autosize
                          id="list-jobs"
                          visibleColumns={visibleColumns}
                          columnMapping={columnMapping}
                          columnWidths={{
                            channelName: '20%',
                            status: '100px',
                            amountImported: '90px',
                            duration: '100px',
                            started: '230px',
                            finished: '230px',
                            type: '110px',
                            message: '450px',
                          }}
                          formatter={formatter}
                          contentData={data.jobs}
                          totalCount={resultCount}
                          onHeaderClick={sasqParams.onSort}
                          nonInteractiveHeaders={['duration']}
                          pageAmount={pageAmount}
                          onNeedMoreData={onNeedMoreData}
                          sortedColumn={sortedColumn}
                          sortDirection={sortDirection}
                          pagingType={MCLPagingTypes.PREV_NEXT}
                        />
                      </Pane>
                    )}
                  </ColumnManager>
              }
              {children}
            </Paneset>
          );
        }
      }
    </SearchAndSortQuery>
  );
}


Jobs.propTypes = {
  data: PropTypes.shape({
    channel: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }), // optional
    jobs: PropTypes.arrayOf(
      PropTypes.shape({
        // XXX fill in
      }).isRequired,
    ).isRequired,
  }).isRequired,
  query: PropTypes.object.isRequired,
  resultCount: PropTypes.number,
  updateQuery:PropTypes.func.isRequired,
  error: PropTypes.string,
  hasLoaded: PropTypes.bool.isRequired,
  pageAmount: PropTypes.number.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  ]),
};


export default Jobs;

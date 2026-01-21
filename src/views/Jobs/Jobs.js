import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { AppIcon } from '@folio/stripes/core';
import { LoadingPane, Paneset, Pane, MultiColumnList, MCLPagingTypes } from '@folio/stripes/components';
import { ColumnManager, SearchAndSortQuery } from '@folio/stripes/smart-components';
import { message2stats, summarizeStats } from '../../util/message2stats';
import parseSort from '../../util/parseSort';
import formatDateTime from '../../util/formatDateTime';
import JobsSearchPane from '../../search/JobsSearchPane';
import ErrorMessage from '../../components/ErrorMessage';
import packageInfo from '../../../package';


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
  const intl = useIntl();

  const columnMapping = {
    name: <FormattedMessage id="ui-inventory-import.jobs.column.name" />,
    status: <FormattedMessage id="ui-inventory-import.jobs.column.status" />,
    amountHarvested: <FormattedMessage id="ui-inventory-import.jobs.column.amountHarvested" />,
    seconds: <FormattedMessage id="ui-inventory-import.jobs.column.seconds" />,
    started: <FormattedMessage id="ui-inventory-import.jobs.column.started" />,
    finished: <FormattedMessage id="ui-inventory-import.jobs.column.finished" />,
    type: <FormattedMessage id="ui-inventory-import.jobs.column.type" />,
    message: <FormattedMessage id="ui-inventory-import.jobs.column.message" />,
  };

  const formatter = {
    status: r => <FormattedMessage id={`ui-inventory-import.channels.column.currentStatus.${r.status}`} />,
    amountHarvested: r => {
      const stats = message2stats(r.message);
      return `${r.amountHarvested} (${stats?.instances?.loaded})`;
    },
    started: r => formatDateTime(r.started),
    finished: r => formatDateTime(r.finished),
    seconds: r => Math.trunc((new Date(r.finished) - new Date(r.started)) / 1000),
    type: r => <FormattedMessage id={`ui-inventory-import.channels.field.jobClass.${r.type}`} />,
    message: r => (r.message?.match('Instances_processed') ? summarizeStats(intl, r.message) : r.message),
  };

  const paneTitle = !data.harvestable ?
    <FormattedMessage id="ui-inventory-import.nav.jobs" /> :
    <FormattedMessage
      id="ui-inventory-import.nav.jobs-for"
      values={{ name: data.harvestable.name }}
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
                    excludeKeys={['name']}
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
                            name: '20%',
                            status: '80px',
                            amountHarvested: '110px',
                            seconds: '70px',
                            started: '200px',
                            finished: '200px',
                            type: '110px',
                            message: '450px',
                          }}
                          formatter={formatter}
                          contentData={data.jobs}
                          totalCount={resultCount}
                          onHeaderClick={sasqParams.onSort}
                          nonInteractiveHeaders={['seconds']}
                          pageAmount={pageAmount}
                          onNeedMoreData={onNeedMoreData}
                          sortedColumn={sortedColumn}
                          sortDirection={sortDirection}
                          pagingType={MCLPagingTypes.PREV_NEXT}
                          onRowClick={(event, rec) => updateQuery({ _path: `${packageInfo.stripes.route}/jobs/${rec.id}` })}
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
    harvestable: PropTypes.shape({
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

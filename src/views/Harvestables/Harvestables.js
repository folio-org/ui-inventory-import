import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { useStripes, IfPermission, AppIcon } from '@folio/stripes/core';
import { LoadingPane, Paneset, Pane, MultiColumnList, PaneMenu, MenuSection, Button, Icon, MCLPagingTypes } from '@folio/stripes/components';
import { parseFilters, ColumnManager, SearchAndSortQuery } from '@folio/stripes/smart-components';
import { message2stats, summarizeStats } from '../../util/message2stats';
import viewLogTranslationTag from '../../util/viewLogTranslationTag';
import parseSort from '../../util/parseSort';
import formatDateTime from '../../util/formatDateTime';
import HarvestablesSearchPane from '../../search/HarvestablesSearchPane';
import ErrorMessage from '../../components/ErrorMessage';
import packageInfo from '../../../package';


/*
 * Server-side limitations mean that queries submitted to
 * mod-harvester-admin cannot include filtering criteria and that the
 * data returned is not sorted according to the `orderBy`
 * parameter. Since the total size of the data-set is small, we do the
 * filtering and sorting by hand here in the display component.
 *
 * DO NOT TRY THIS AT HOME.
 */
function manuallyFilterAndSort(query, raw) {
  const { filters, sort } = query;
  const filterStruct = parseFilters(filters);
  const sortKeys = parseSort(sort);

  const filterKeys = Object.keys(filterStruct).sort();
  const filtered = raw.filter(entry => {
    for (let i = 0; i < filterKeys.length; i++) {
      const key = filterKeys[i];
      const values = filterStruct[key];
      if (values.indexOf(entry[key]) === -1) return false;
    }
    return true;
  });

  if (sortKeys.length === 0) return filtered;

  return filtered.sort((a, b) => {
    for (let i = 0; i < sortKeys.length; i++) {
      const { key, descending } = sortKeys[i];
      if (a[key] === b[key]) continue; // eslint-disable-line no-continue
      const tmp = a[key] < b[key] ? -1 : 1;
      return descending ? -tmp : tmp;
    }

    // All keys were equal in value
    return 0;
  });
}


// For reasons I do not understand, the two sections of this menu
// render side-by-side instead of one above the other. To mitigate
// this, I am currently separating the two columns of menu items with
// unbreakable spaces, but this is clearly unsatisfactory. See the
// Slack thread beginning at
// https://folio-project.slack.com/archives/C210UCHQ9/p1651229725562429
//
function renderActionsMenu(search, renderedColumnsMenu) {
  return (
    <PaneMenu>
      <IfPermission perm="harvester-admin.harvestables.item.post">
        <MenuSection id="actions-menu-section" label={<FormattedMessage id="ui-inventory-import.actions.new" />}>
          {['oaiPmh', 'xmlBulk', 'connector', 'status'].map(type => (
            <FormattedMessage key={type} id={`ui-inventory-import.actions.new.harvestable.${type}`}>
              {ariaLabel => (
                <Button
                  id={`clickable-new-harvestable-${type}`}
                  aria-label={ariaLabel}
                  to={`/ha/harvestables/create/${type}${search}`}
                  buttonStyle="dropdownItem"
                  marginBottom0
                >
                  <Icon icon="plus-sign">
                    <FormattedMessage id={`ui-inventory-import.actions.new.harvestable.${type}`} />
                  </Icon>
                </Button>
              )}
            </FormattedMessage>
          ))}
        </MenuSection>
      </IfPermission>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {renderedColumnsMenu}
    </PaneMenu>
  );
}


function Harvestables({
  data,
  query,
  updateQuery,
  error,
  hasLoaded,
  pageAmount,
  onNeedMoreData,
  children,
}) {
  const intl = useIntl();
  const location = useLocation();
  const stripes = useStripes();

  const columnMapping = {
    name: <FormattedMessage id="ui-inventory-import.harvestables.column.name" />,
    currentStatus: <FormattedMessage id="ui-inventory-import.harvestables.column.currentStatus" />,
    records: <FormattedMessage id="ui-inventory-import.harvestables.column.records" />,
    lastHarvestFinished: <FormattedMessage id="ui-inventory-import.harvestables.column.lastHarvestFinished" />,
    enabled: <FormattedMessage id="ui-inventory-import.harvestables.column.enabled" />,
    jobClass: <FormattedMessage id="ui-inventory-import.harvestables.column.jobClass" />,
    id: <FormattedMessage id="ui-inventory-import.harvestables.column.id" />,
    message: <FormattedMessage id="ui-inventory-import.harvestables.column.message" />,
  };

  if (stripes.hasPerm('harvester-admin.harvestables.log.get')) {
    columnMapping.logFile = <FormattedMessage id="ui-inventory-import.harvestables.column.logFile" />;
    columnMapping.oldJobs = <FormattedMessage id="ui-inventory-import.harvestables.column.oldJobs" />;
  }

  const formatter = {
    enabled: r => <FormattedMessage id={`ui-inventory-import.harvestables.column.enabled.${r.enabled}`} />,
    jobClass: r => <FormattedMessage id={`ui-inventory-import.harvestables.column.jobClass.${r.jobClass}`} />,
    currentStatus: r => <FormattedMessage id={`ui-inventory-import.harvestables.column.currentStatus.${r.currentStatus}`} />,
    records: r => {
      const stats = message2stats(r.message);
      return stats?.instances?.loaded;
    },
    lastHarvestFinished: r => formatDateTime(r.lastHarvestFinished),
    message: r => (r.message?.match('Instances_processed') ? summarizeStats(intl, r.message) : r.message),
    logFile: r => (
      <Button
        id={`clickable-log-file-${r.id}`}
        onClick={(e) => {
          e.stopPropagation();
          updateQuery({ _path: `${packageInfo.stripes.route}/harvestables/${r.id}/logs` });
        }}
        marginBottom0
      >
        <FormattedMessage id={viewLogTranslationTag(r)} />
      </Button>
    ),
    oldJobs: r => (
      <Button
        id={`clickable-old-logs-${r.id}`}
        onClick={(e) => {
          e.stopPropagation();
          updateQuery({ _path: `${packageInfo.stripes.route}/harvestables/${r.id}/jobs` });
        }}
        marginBottom0
      >
        <FormattedMessage id="ui-inventory-import.button.old-jobs" />
      </Button>
    ),
  };

  const harvestables = manuallyFilterAndSort(query, data.harvestables);
  const sortKeys = parseSort(query.sort);
  const sortedColumn = sortKeys[0]?.key;
  const sortDirection = sortKeys[0]?.descending ? 'descending' : 'ascending';

  return (
    <SearchAndSortQuery>
      {
        (sasqParams) => {
          return (
            <Paneset id="harvestables-paneset">
              <HarvestablesSearchPane
                {...sasqParams}
                defaultWidth="20%"
                query={query}
                updateQuery={updateQuery}
              />
              {
                error ? <ErrorMessage message={error} /> :
                  !hasLoaded ? <LoadingPane /> :
                  <ColumnManager
                    id="harvestable-visible-columns"
                    columnMapping={columnMapping}
                    excludeKeys={['name']}
                    persist
                  >
                    {({ renderColumnsMenu, visibleColumns }) => (
                      <Pane
                        appIcon={<AppIcon app="harvester-admin" />}
                        defaultWidth="fill"
                        padContent={false}
                        paneTitle={<FormattedMessage id="ui-inventory-import.nav.harvestables" />}
                        paneSub={<FormattedMessage id="ui-inventory-import.resultCount" values={{ count: harvestables.length }} />}
                        actionMenu={() => renderActionsMenu(location.search, renderColumnsMenu)}
                      >
                        <MultiColumnList
                          autosize
                          id="list-harvestables"
                          visibleColumns={visibleColumns}
                          columnMapping={columnMapping}
                          columnWidths={{
                            name: '400px',
                            currentStatus: '90px',
                            records: '90px',
                            lastHarvestFinished: '210px',
                            enabled: '80px',
                            jobClass: '150px',
                            id: '80px',
                            message: '600px',
                          }}
                          formatter={formatter}
                          contentData={harvestables}
                          totalCount={harvestables.length}
                          onHeaderClick={sasqParams.onSort}
                          sortedColumn={sortedColumn}
                          sortDirection={sortDirection}
                          pageAmount={pageAmount}
                          onNeedMoreData={onNeedMoreData}
                          pagingType={MCLPagingTypes.PREV_NEXT}
                          onRowClick={(event, rec) => updateQuery({ _path: `${packageInfo.stripes.route}/harvestables/${rec.id}` })}
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


Harvestables.propTypes = {
  data: PropTypes.shape({
    harvestables: PropTypes.arrayOf(
      PropTypes.shape({
      }).isRequired,
    ).isRequired,
  }).isRequired,
  query: PropTypes.object.isRequired,
  updateQuery:PropTypes.func.isRequired,
  error: PropTypes.string,
  hasLoaded: PropTypes.bool.isRequired,
  pageAmount: PropTypes.number.isRequired,
  onNeedMoreData: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};


export default Harvestables;

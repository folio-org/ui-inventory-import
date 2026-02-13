import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { useStripes, IfPermission, AppIcon } from '@folio/stripes/core';
import { LoadingPane, Paneset, Pane, MultiColumnList, PaneMenu, MenuSection, Button, Icon, MCLPagingTypes } from '@folio/stripes/components';
import { ColumnManager, SearchAndSortQuery } from '@folio/stripes/smart-components';
import viewLogTranslationTag from '../util/viewLogTranslationTag';
import parseSort from '../util/parseSort';
import ChannelsSearchPane from '../search/ChannelsSearchPane';
import ErrorMessage from '../components/ErrorMessage';
import packageInfo from '../../package';


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
      <IfPermission perm="inventory-update.import.channels.item.post">
        <MenuSection id="actions-menu-section" label={<FormattedMessage id="ui-inventory-import.actions.new" />}>
          {['xml'].map(type => (
            <FormattedMessage key={type} id={`ui-inventory-import.actions.new.channel.${type}`}>
              {ariaLabel => (
                <Button
                  id={`clickable-new-channel-${type}`}
                  aria-label={ariaLabel}
                  to={`channels/create/${type}${search}`}
                  buttonStyle="dropdownItem"
                  marginBottom0
                >
                  <Icon icon="plus-sign">
                    <FormattedMessage id={`ui-inventory-import.actions.new.channel.${type}`} />
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


function Channels({
  data,
  query,
  updateQuery,
  error,
  hasLoaded,
  pageAmount,
  onNeedMoreData,
  children,
}) {
  const location = useLocation();
  const stripes = useStripes();

  const columnMapping = {
    name: <FormattedMessage id="ui-inventory-import.channels.column.name" />,
    enabled: <FormattedMessage id="ui-inventory-import.channels.column.enabled" />,
    type: <FormattedMessage id="ui-inventory-import.channels.column.type" />,
    id: <FormattedMessage id="ui-inventory-import.channels.column.id" />,
  };

  if (stripes.hasPerm('inventory-update.import.job-logs.collection.get')) {
    columnMapping.logFile = <FormattedMessage id="ui-inventory-import.channels.column.logFile" />;
    columnMapping.oldJobs = <FormattedMessage id="ui-inventory-import.channels.column.oldJobs" />;
  }

  const formatter = {
    enabled: r => <FormattedMessage id={`ui-inventory-import.channels.column.enabled.${r.enabled}`} />,
    type: r => <FormattedMessage id={`ui-inventory-import.channels.column.type.${r.type.toUpperCase()}`} />,
    logFile: r => (
      <Button
        id={`clickable-log-file-${r.id}`}
        onClick={(e) => {
          e.stopPropagation();
          updateQuery({ _path: `${packageInfo.stripes.route}/channels/${r.id}/logs` });
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
          updateQuery({ _path: `${packageInfo.stripes.route}/channels/${r.id}/jobs` });
        }}
        marginBottom0
      >
        <FormattedMessage id="ui-inventory-import.button.old-jobs" />
      </Button>
    ),
  };

  const channels = data.channels;
  const sortKeys = parseSort(query.sort);
  const sortedColumn = sortKeys[0]?.key;
  const sortDirection = sortKeys[0]?.descending ? 'descending' : 'ascending';

  return (
    <SearchAndSortQuery>
      {
        (sasqParams) => {
          return (
            <Paneset id="channels-paneset">
              <ChannelsSearchPane
                {...sasqParams}
                defaultWidth="20%"
                query={query}
                updateQuery={updateQuery}
              />
              {
                error ? <ErrorMessage message={error} /> :
                  !hasLoaded ? <LoadingPane /> :
                  <ColumnManager
                    id="channel-visible-columns"
                    columnMapping={columnMapping}
                    excludeKeys={['name']}
                    persist
                  >
                    {({ renderColumnsMenu, visibleColumns }) => (
                      <Pane
                        appIcon={<AppIcon app="inventory-update" />}
                        defaultWidth="fill"
                        padContent={false}
                        paneTitle={<FormattedMessage id="ui-inventory-import.nav.channels" />}
                        paneSub={<FormattedMessage id="ui-inventory-import.resultCount" values={{ count: channels.length }} />}
                        actionMenu={() => renderActionsMenu(location.search, renderColumnsMenu)}
                      >
                        <MultiColumnList
                          autosize
                          id="list-channels"
                          visibleColumns={visibleColumns}
                          columnMapping={columnMapping}
                          columnWidths={{
                            name: '400px',
                            enabled: '80px',
                            type: '150px',
                            id: '300px',
                          }}
                          formatter={formatter}
                          contentData={channels}
                          totalCount={channels.length}
                          onHeaderClick={sasqParams.onSort}
                          sortedColumn={sortedColumn}
                          sortDirection={sortDirection}
                          pageAmount={pageAmount}
                          onNeedMoreData={onNeedMoreData}
                          pagingType={MCLPagingTypes.PREV_NEXT}
                          onRowClick={(event, rec) => updateQuery({ _path: `./channels/${rec.id}` })}
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


Channels.propTypes = {
  data: PropTypes.shape({
    channels: PropTypes.arrayOf(
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


export default Channels;

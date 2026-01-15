import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HasCommand, LoadingPane, Pane, checkScope } from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import formatDateTime from '../../util/formatDateTime';
import HarvestableLogHeader from './HarvestableLogHeader';
import HarvestableLogPlainText from './HarvestableLogPlainText';
import HarvestableLogFailedRecords from './HarvestableLogFailedRecords';
import css from '../Styles.css';


const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) e.preventDefault();
    if (!disabled) handler();
  };
};


const HarvestableLog = (props) => {
  const {
    data,
    handlers,
    refreshLog,
  } = props;

  const record = data.record;
  if (!record) return <LoadingPane />;
  const title = record.name;
  const status = record.currentStatus || record.status;

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(handlers.onClose),
    },
  ];

  const paneTitle = (
    <>
      {record.name}
      &nbsp;
      ({formatDateTime(record.started)})
      {status &&
        <>
          {' '}&mdash;{' '}
          <span className={`${css.status} ${css[`status_${status}`]}`}>
            <FormattedMessage id={`ui-inventory-import.harvestables.column.currentStatus.${status}`} />
          </span>
        </>
      }
    </>
  );

  return (
    <HasCommand commands={shortcuts} isWithinScope={checkScope} scope={document.body}>
      <Pane
        appIcon={<AppIcon app="harvester-admin" />}
        centerContent
        defaultWidth="60%"
        id="pane-logs"
        paneTitle={paneTitle}
        dismissible
        onClose={handlers.onClose}
      >
        <TitleManager record={title}>
          <HarvestableLogHeader record={record} />
          <HarvestableLogPlainText record={record} log={data.plainTextLog} refreshLog={refreshLog} />
          <HarvestableLogFailedRecords failedRecords={data.failedRecords} />
        </TitleManager>
      </Pane>
    </HasCommand>
  );
};


HarvestableLog.propTypes = {
  data: PropTypes.shape({
    record: PropTypes.shape({
      name: PropTypes.string.isRequired,
      started: PropTypes.string,
      currentStatus: PropTypes.string, // .isRequired for harvestable, not for previous-job
      status: PropTypes.string // Sometimes we get this instead of currentStatus
    }),
    plainTextLog: PropTypes.string,
    failedRecords: PropTypes.shape({}),
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  refreshLog: PropTypes.func.isRequired,
};


export default HarvestableLog;

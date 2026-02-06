import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { HasCommand, LoadingPane, Pane, KeyValue, Accordion, MultiColumnList, checkScope } from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import formatDateTime from '../util/formatDateTime';
import ChannelLogFailedRecords from './ChannelLog/ChannelLogFailedRecords';
import css from './Styles.css';


const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) e.preventDefault();
    if (!disabled) handler();
  };
};


const FullJob = (props) => {
  const {
    data,
    handlers,
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
      {record.channelName}
      &nbsp;
      ({formatDateTime(record.started)})
      {status &&
        <>
          {' '}&mdash;{' '}
          <span className={`${css.status} ${css[`status_${status}`]}`}>
            <FormattedMessage id={`ui-inventory-import.jobs.column.status.${status}`} />
          </span>
        </>
      }
    </>
  );

  return (
    <HasCommand commands={shortcuts} isWithinScope={checkScope} scope={document.body}>
      <Pane
        appIcon={<AppIcon app="inventory-import" />}
        centerContent
        defaultWidth="60%"
        id="pane-full-job"
        paneTitle={paneTitle}
        dismissible
        onClose={handlers.onClose}
      >
        <TitleManager record={title}>
          {record.finished ? (
            <p>
              <FormattedMessage
                id="ui-inventory-import.jobs.caption.completed"
                values={{
                  count: record.amountImported,
                  seconds: ((new Date(record.finished) - new Date(record.started)) / 1000).toFixed(3),
                }}
              />
            </p>
          ) : (
            <p>
              <FormattedMessage id="ui-inventory-import.jobs.caption.notComplete" />
            </p>
          )}
          {/* XXX display record.finished somehow */}
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.jobs.field.transformationPipeline" />}
            value={data.transformationPipeline?.name}
          />
          <ChannelLogFailedRecords failedRecords={data.failedRecords} />

          <Accordion
            id="job-logs"
            label={<FormattedMessage
              id="ui-inventory-import.logs.countLogLiines"
              values={{ count: data.logs?.totalRecords }}
            />}
          >
            <MultiColumnList
              id="list-log-lines"
              visibleColumns={['timeStamp', 'line']}
              columnMapping={{
                timeStamp: <FormattedMessage id="ui-inventory-import.logs.field.timeStamp" />,
                line: <FormattedMessage id="ui-inventory-import.logs.field.line" />,
              }}
              columnWidths={{ timeStamp: '240px', line: '500px' }}
              formatter={{}}
              contentData={data.logs?.logLines}
              totalCount={data.logs?.totalRecords}
            />
          </Accordion>
        </TitleManager>
      </Pane>
    </HasCommand>
  );
};


FullJob.propTypes = {
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
};


export default FullJob;

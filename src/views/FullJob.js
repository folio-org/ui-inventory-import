/* eslint-disable react/jsx-no-bind */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { HasCommand, LoadingPane, Pane, Row, Col, KeyValue, Accordion, MultiColumnList, Button, checkScope } from '@folio/stripes/components';
import { AppIcon, TitleManager, CalloutContext } from '@folio/stripes/core';
import formatDateTime from '../util/formatDateTime';
import ChannelLogFailedRecords from './ChannelLog/ChannelLogFailedRecords';
import css from './Styles.css';
import packageInfo from '../../package';


const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) e.preventDefault();
    if (!disabled) handler();
  };
};


const FullJob = (props) => {
  const callout = useContext(CalloutContext);

  const {
    data,
    handlers,
    updateQuery,
  } = props;

  const record = data.record;
  if (!record) return <LoadingPane />;
  const title = record.channelName;
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

  async function pauseJob() {
    try {
      await handlers.pause();
    } catch (response) {
      const body = await response.text();
      // It turns out that statusText is omitted in many service's responses, and that's just how it is
      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage
          id="ui-inventory-import.pause.failure"
          values={{
            channelName: record.channelName,
            status: response.status,
            body,
          }}
        />
      });
      return;
    }

    callout.sendCallout({
      message: <FormattedMessage id="ui-inventory-import.pause.success" values={{ channelName: record.channelName }} />
    });
  }

  async function resumeJob() {
    try {
      await handlers.resume();
    } catch (response) {
      const body = await response.text();
      // It turns out that statusText is omitted in many service's responses, and that's just how it is
      callout.sendCallout({
        type: 'error',
        message: <FormattedMessage
          id="ui-inventory-import.resume.failure"
          values={{
            channelName: record.channelName,
            status: response.status,
            body,
          }}
        />
      });
      return;
    }

    callout.sendCallout({
      message: <FormattedMessage id="ui-inventory-import.resume.success" values={{ channelName: record.channelName }} />
    });
  }

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
              &nbsp;
              &nbsp;
              {status === 'RUNNING' ? (
                <Button
                  id="clickable-pause"
                  buttonStyle="primary"
                  onClick={pauseJob}
                  marginBottom0
                >
                  <FormattedMessage id="ui-inventory-import.button.pause" />
                </Button>
              ) : (
                <Button
                  id="clickable-resume"
                  buttonStyle="primary"
                  onClick={resumeJob}
                  marginBottom0
                >
                  <FormattedMessage id="ui-inventory-import.button.resume" />
                </Button>
              )}
            </p>
          )}
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.jobs.field.channelName" />}
                value={<Link to={`${packageInfo.stripes.route}/channels/${record.channelId}`}>{record.channelName}</Link>}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.jobs.field.transformationPipeline" />}
                value={<Link to={`/settings${packageInfo.stripes.route}/pipeline/${data.transformationPipeline?.id}`}>{data.transformationPipeline?.name}</Link>}
              />
            </Col>
          </Row>
          <ChannelLogFailedRecords failedRecords={data.failedRecords} updateQuery={updateQuery} />

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
      channelName: PropTypes.string.isRequired,
      started: PropTypes.string,
      currentStatus: PropTypes.string, // .isRequired for harvestable, not for previous-job
      status: PropTypes.string // Sometimes we get this instead of currentStatus
    }),
    plainTextLog: PropTypes.string,
    failedRecords: PropTypes.shape({}),
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    pause: PropTypes.func.isRequired,
    resume: PropTypes.func.isRequired,
  }),
};


export default FullJob;

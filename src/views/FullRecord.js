import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ObjectInspector } from 'react-inspector';
import { HasCommand, LoadingPane, Pane, Row, Col, KeyValue, Accordion, checkScope } from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import formatDateTime from '../util/formatDateTime';


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
      ({formatDateTime(record.timeStamp)})
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
        <TitleManager record={record.channelName}>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.channelName" />}
                value={<Link to={`/invimp/channels/${record.channelId}`}>{record.channelName}</Link>}
              />
            </Col>
            <Col xs={8}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.sourceFileName" />}
                value={record.sourceFileName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.importJob" />}
                value={<Link to={`/invimp/jobs/${record.importJobId}`}>{record.importJobId}</Link>}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.timeStamp" />}
                value={record.timeStamp}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.recordNumber" />}
                value={record.recordNumber}
              />
            </Col>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.instanceHrid" />}
                value={record.transformedRecord?.instance?.hrid}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-inventory-import.records.field.instanceTitle" />}
                value={record.transformedRecord?.instance?.title}
              />
            </Col>
          </Row>

          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.records.field.errors" />}
            value={<ObjectInspector data={record.recordErrors} expandLevel={2} />}
          />

          <Accordion
            closedByDefault
            id="original-record"
            label={<FormattedMessage id="ui-inventory-import.records.field.originalRecord" />}
          >
            <pre>{record.originalRecord}</pre>
          </Accordion>
          <Accordion
            id="transformed-record"
            label={<FormattedMessage id="ui-inventory-import.records.field.transformedRecord" />}
          >
            <ObjectInspector
              data={record.transformedRecord}
              expandLevel={1}
              sortObjectKeys
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
      timeStamp: PropTypes.string,
    }),
  }).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
};


export default FullJob;

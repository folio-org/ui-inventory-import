import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Download from '@axetroy/react-download';
import { Accordion, Loading, NoValue, Button, Icon } from '@folio/stripes/components';


const HarvestableLogPlainText = ({ record, log, refreshLog }) => {
  let fileName;
  if (log) {
    const m = log.match(/Begin processing of (.*)/m);
    if (m) fileName = m[1];
  }

  const status = record.currentStatus;
  const logStatus = status === 'RUNNING' ? 'running' : 'previous';
  const logLabel = (
    <>
      <FormattedMessage id={`ui-inventory-import.logs.plainTextLog.${logStatus}`} />
      {fileName ? ` (${fileName})` : ''}
    </>
  );

  return (
    <Accordion
      id="logs-plain"
      label={logLabel}
      closedByDefault
    >
      <br />
      <Button
        data-test-refresh-logs
        id="clickable-refresh-logs"
        marginBottom0
        onClick={refreshLog}
      >
        <Icon icon="refresh">
          <FormattedMessage id="ui-inventory-import.logs.plainTextLog.refresh" />
        </Icon>
      </Button>

      &nbsp;&nbsp;

      <Download file="harvester-log.txt" content={log || ''}>
        <Button
          data-test-download-logs
          id="clickable-download-logs"
          marginBottom0
        >
          <Icon icon="download">
            <FormattedMessage id="ui-inventory-import.logs.plainTextLog.download" />
          </Icon>
        </Button>
      </Download>

      {typeof log === 'undefined' ? <Loading /> :
        !log ? <NoValue /> :
        <pre>{log}</pre>
      }
    </Accordion>
  );
};


HarvestableLogPlainText.propTypes = {
  record: PropTypes.shape({
    message: PropTypes.string,
    currentStatus: PropTypes.string, // .isRequired for harvestable, not for previous-job
  }).isRequired,
  log: PropTypes.string,
  refreshLog: PropTypes.func.isRequired,
};


export default HarvestableLogPlainText;

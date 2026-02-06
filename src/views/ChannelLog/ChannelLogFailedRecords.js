import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ObjectInspector from 'react-inspector';
import { useStripes } from '@folio/stripes/core';
import { Loading, MultiColumnList, Accordion } from '@folio/stripes/components';
import { errors2react } from '../../util/summarizeErrors';


const ChannelLogFailedRecords = ({ failedRecords }) => {
  const stripes = useStripes();
  const visibleColumns = ['recordNumber', 'instanceHrid', 'instanceTitle', 'errors', 'timeStamp'];

  const columnMapping = {
    recordNumber: <FormattedMessage id="ui-inventory-import.failed-records.recordNumber" />,
    instanceHrid: <FormattedMessage id="ui-inventory-import.failed-records.instanceHrid" />,
    instanceTitle: <FormattedMessage id="ui-inventory-import.failed-records.instanceTitle" />,
    errors: <FormattedMessage id="ui-inventory-import.failed-records.errors" />,
    timeStamp: <FormattedMessage id="ui-inventory-import.failed-records.timeStamp" />,
  };

  const resultsFormatter = {
    instanceHrid: r => r.transformedRecord?.instance?.hrid,
    instanceTitle: r => r.transformedRecord?.instance?.title,
    errors: r => errors2react(r.recordErrors),
  };

  return (
    <Accordion
      id="logs-failed"
      label={<FormattedMessage
        id="ui-inventory-import.logs.countFailedRecords"
        values={{ count: failedRecords?.failedRecords.length }}
      />}
    >
      {!failedRecords ? <Loading /> :
      <>
        <MultiColumnList
          id="harvest-failedRecords-table"
          columnIdPrefix="harvest-failedRecords-table"
          visibleColumns={visibleColumns}
          columnMapping={columnMapping}
          columnWidths={{
            recordNumber: '150px',
            instanceHrid: '120px',
            instanceTitle: '300px',
          }}
          contentData={failedRecords.failedRecords}
          formatter={resultsFormatter}
        />
        {stripes.config.showDevInfo &&
          <Accordion
            id="harvest-failedRecords-devinfo"
            label={<FormattedMessage id="ui-inventory-import.accordion.devinfo" />}
            closedByDefault
          >
            <ObjectInspector
              data={failedRecords}
              expandLevel={2}
              sortObjectKeys
            />
          </Accordion>
        }
      </>
      }
    </Accordion>
  );
};


ChannelLogFailedRecords.propTypes = {
  failedRecords: PropTypes.shape({
    totalRecords: PropTypes.number.isRequired,
    failedRecords: PropTypes.arrayOf(
      PropTypes.shape({
        // XXX add individual fields
      }).isRequired,
    ).isRequired,
  }),
};


export default ChannelLogFailedRecords;

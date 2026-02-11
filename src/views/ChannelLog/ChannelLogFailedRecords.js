import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ObjectInspector from 'react-inspector';
import { useStripes } from '@folio/stripes/core';
import { Loading, MultiColumnList, Accordion } from '@folio/stripes/components';
import { errors2react } from '../../util/summarizeErrors';
import packageInfo from '../../../package';


const ChannelLogFailedRecords = ({ failedRecords, updateQuery }) => {
  const stripes = useStripes();
  const visibleColumns = ['recordNumber', 'instanceHrid', 'instanceTitle', 'errors', 'timeStamp'];

  const columnMapping = {
    recordNumber: <FormattedMessage id="ui-inventory-import.records.field.recordNumber" />,
    instanceHrid: <FormattedMessage id="ui-inventory-import.records.field.instanceHrid" />,
    instanceTitle: <FormattedMessage id="ui-inventory-import.records.field.instanceTitle" />,
    errors: <FormattedMessage id="ui-inventory-import.records.field.errors" />,
    timeStamp: <FormattedMessage id="ui-inventory-import.records.field.timeStamp" />,
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
          onRowClick={(event, rec) => {
            // When we go to the Failed Records section, the query and
            // filters that we used in the Jobs section become
            // inapplicable. They must be removed from the URL to
            // prevent backend errors.
            updateQuery({
              _path: `${packageInfo.stripes.route}/records/${rec.id}`,
              filters: undefined,
            });
          }}
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

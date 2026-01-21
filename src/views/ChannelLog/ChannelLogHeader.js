import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { MultiColumnList } from '@folio/stripes/components';
import { message2stats } from '../../util/message2stats';


const ChannelLogHeader = ({ record }) => {
  const stats = message2stats(record.message);

  const visibleColumns = ['summary', 'instances', 'holdings', 'items'];

  const columnMapping = {
    summary: <FormattedMessage id="ui-inventory-import.summary-table.summary" />,
    instances: <FormattedMessage id="ui-inventory-import.summary-table.instances" />,
    holdings: <FormattedMessage id="ui-inventory-import.summary-table.holdings" />,
    items: <FormattedMessage id="ui-inventory-import.summary-table.items" />,
  };

  const contentData = !stats ? [] : ['processed', 'loaded', 'deleted', 'failed'].map(caption => {
    const values = {
      summary: <FormattedMessage id={`ui-inventory-import.summary-label.${caption}`} />,
    };
    visibleColumns.slice(1).forEach(col => {
      values[col] = stats[col]?.[caption];
    });
    return values;
  });

  const resultsFormatter = {};

  return (
    <MultiColumnList
      id="harvest-summary-table"
      columnIdPrefix="harvest-summary-table"
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      columnWidths={{}}
      contentData={contentData}
      formatter={resultsFormatter}
    />
  );
};


ChannelLogHeader.propTypes = {
  record: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};


export default ChannelLogHeader;

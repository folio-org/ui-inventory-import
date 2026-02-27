import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import FullRecord from '../views/FullRecord';
import packageInfo from '../../package';


const FullRecordRoute = ({ resources, mutator }) => {
  return (
    <FullRecord
      data={{
        record: resources.failedRecord.records[0],
      }}
      handlers={{
        onClose: () => mutator.query.update({ _path: `${packageInfo.stripes.route}/records` })
      }}
    />
  );
};


FullRecordRoute.manifest = {
  query: {},
  failedRecord: {
    type: 'okapi',
    path: 'inventory-import/failed-records/:{recId}',
  },
};

FullRecordRoute.propTypes = {
  resources: PropTypes.shape({
    failedRecord: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};


export default stripesConnect(FullRecordRoute);

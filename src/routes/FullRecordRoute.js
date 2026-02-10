import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import FullRecord from '../views/FullRecord';
import packageInfo from '../../package';


// There is no WASAPI for GET inventory-import/failed-records/:{recId}
// so we can't simply fetch the record we want. Instead we rely on
// this page only every being invoked as part of the
// list-of-failed-records page populated by RecordsRoute.js, and
// assume that its "records" resource is alreaduy populated. We use
// match.params.recId to pull out the selected record, and pass that
// down to the view.

const FullRecordRoute = ({ resources, mutator, match }) => {
  const handleClose = () => {
    mutator.query.update({ _path: `${packageInfo.stripes.route}/records` });
  };

  const records = resources.records.records || [];
  const matching = records.filter(x => x.id === match.params.recId);

  return (
    <FullRecord
      data={{
        record: matching[0],
      }}
      handlers={{ onClose: handleClose }}
    />
  );
};


FullRecordRoute.manifest = {
  query: {},
  records: {
    // No need to specify anything to do for this resource,
    // all the work happens when RecordsRoute is loaded.
  },
};

FullRecordRoute.propTypes = {
  resources: PropTypes.shape({
    records: PropTypes.shape({
      failed: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
          message: PropTypes.string.isRequired,
        })
      ]).isRequired,
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
      other: PropTypes.shape({
        totalRecords: PropTypes.number.isRequired,
      }),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default stripesConnect(FullRecordRoute);

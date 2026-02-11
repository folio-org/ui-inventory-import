import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import FullJob from '../views/FullJob';
import packageInfo from '../../package';


const FullJobRoute = ({ resources, mutator }) => {
  const handleClose = () => {
    mutator.query.update({ _path: `${packageInfo.stripes.route}/jobs` });
  };

  return (
    <FullJob
      data={{
        record: resources.job.records[0],
        transformationPipeline: resources.transformationPipeline.records[0],
        failedRecords: resources.failedRecords.records[0],
        logs: resources.logs.records[0],
      }}
      handlers={{ onClose: handleClose }}
      updateQuery={mutator.query.update}
    />
  );
};


FullJobRoute.manifest = Object.freeze({
  query: {},
  job: {
    type: 'okapi',
    path: 'inventory-import/import-jobs/:{recId}',
  },
  transformationPipeline: {
    type: 'okapi',
    path: (_q, _p, _r, _l, props) => {
      const rec = props.resources?.job?.records?.[0];
      if (!rec) return {};
      return `inventory-import/transformations/${rec.transformation}`;
    },
  },
  logs: {
    type: 'okapi',
    path: 'inventory-import/job-logs?query=importJobId=:{recId}',
  },
  failedRecords: {
    type: 'okapi',
    path: 'inventory-import/failed-records?query=importJobId=:{recId}',
  },
});


FullJobRoute.propTypes = {
  resources: PropTypes.shape({
    job: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({}).isRequired,
      ).isRequired,
    }).isRequired,
    failedRecords: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({}).isRequired,
      ).isRequired,
    }).isRequired,
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


export default stripesConnect(FullJobRoute);

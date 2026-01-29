import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import { makePFV } from '../search/queryFunction';
import Jobs from '../views/Jobs';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


function JobsRoute({ stripes, resources, mutator, children }) {
  let [source, setSource] = useState(); // eslint-disable-line prefer-const
  if (!source) {
    source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'reportTitles');
    setSource(source);
  } else {
    source.update({ resources, mutator }, 'reportTitles');
  }

  const handleNeedMoreData = (_askAmount, index) => {
    source.fetchOffset(index);
  };

  const error = resources.jobs.failed ? resources.jobs.failed.message : undefined;
  const hasLoaded = resources.jobs.hasLoaded;

  return (
    <Jobs
      data={{
        jobs: resources.jobs.records,
      }}
      query={resources.query}
      resultCount={resources.jobs.other?.totalRecords}
      updateQuery={mutator.query.update}
      error={error}
      hasLoaded={hasLoaded}
      pageAmount={RESULT_COUNT_INCREMENT}
      onNeedMoreData={handleNeedMoreData}
    >
      {children}
    </Jobs>
  );
}


// Keep these in sync with what's in ../search/JobsSearchPane.js
const searchableIndexes = ['channelName', 'message'];

const startOfDay = 'T00:00:00';
const endOfDay = 'T23:59:59';

const filterConfig = [{
  name: 'status',
  cql: 'status',
  values: [],
}, {
  name: 'records_from',
  cql: 'records_from',
  values: [],
  parse: makePFV('amountHarvested', '>='),
}, {
  name: 'records_to',
  cql: 'records_to',
  values: [],
  parse: makePFV('amountHarvested', '<='),
}, {
  name: 'started_from',
  cql: 'started_from',
  values: [],
  parse: makePFV('started', '>=', startOfDay),
}, {
  name: 'started_to',
  cql: 'started_to',
  values: [],
  parse: makePFV('started', '<=', endOfDay),
}, {
  name: 'finished_from',
  cql: 'finished_from',
  values: [],
  parse: makePFV('finished', '>=', startOfDay),
}, {
  name: 'finished_to',
  cql: 'finished_to',
  values: [],
  parse: makePFV('finished', '<=', endOfDay),
}];

JobsRoute.manifest = Object.freeze({
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  jobs: {
    type: 'okapi',
    path: 'inventory-import/import-jobs',
    records: 'importJobs',
    throwErrors: false,
    resultDensity: 'sparse',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    params: {
      query: (qp, pathComponents, rv, logger) => {
        const queryFunction = makeQueryFunction(
          'cql.allRecords=1',
          searchableIndexes.map(index => `${index}="${qp.query}"`).join(' or '),
          {},
          filterConfig,
          0,
          undefined,
          {
            rightTrunc: false,
          }
        );
        return queryFunction(qp, pathComponents, rv, logger);
      },
    },
  },
});


JobsRoute.propTypes = {
  stripes: PropTypes.shape({
    logger: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    query: PropTypes.object.isRequired,
    jobs: PropTypes.shape({
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
  children: PropTypes.object.isRequired,
};


export default stripesConnect(JobsRoute);

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';

import queryFunction from '../search/queryFunction';
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


JobsRoute.manifest = Object.freeze({
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  jobs: {
    type: 'okapi',
    path: 'inventory-import/import-jobs',
    throwErrors: false,
    records: 'importJobs',
    recordsRequired: '%{resultCount}',
    resultOffset: '%{resultOffset}',
    perRequest: RESULT_COUNT_INCREMENT,
    resultDensity: 'sparse',
    accumulate: 'true',
    params: {
      // Modify the query-function to remove unwanted asterisks after ID searches
      query: (queryParams, pathComponents, rv, logger) => {
        const res = queryFunction('name="%{query.query}" or message="%{query.query}"',
          queryParams, pathComponents, rv, logger);
        if (res === undefined) return undefined;
        const m = res.match(/^(\(?(id|harvestableId)=\"[^\"]*)\*"(.*)$/);
        return m ? `${m[1]}\"${m[3]}` : res;
      }
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

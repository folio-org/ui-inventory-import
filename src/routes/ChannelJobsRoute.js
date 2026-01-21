import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import queryFunction from '../search/queryFunction';
import Jobs from '../views/Jobs';
import packageInfo from '../../package';


const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


const HarvestableJobsRoute = ({ stripes, resources, mutator, match }) => {
  let [source, setSource] = useState(); // eslint-disable-line prefer-const
  if (!source) {
    source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'reportTitles');
    setSource(source);
  } else {
    source.update({ resources, mutator }, 'reportTitles');
  }

  const handleClose = () => {
    mutator.query.update({ _path: `${packageInfo.stripes.route}/harvestables/${match.params.recId}` });
  };

  const handleNeedMoreData = () => source.fetchMore(RESULT_COUNT_INCREMENT);

  const hasLoaded = resources.harvestable.hasLoaded && resources.jobs.hasLoaded;
  const error = resources.jobs.failed ? resources.jobs.failed.message : undefined;

  return (
    <Jobs
      data={{
        harvestable: resources.harvestable.records?.[0],
        jobs: resources.jobs.records,
      }}
      resultCount={resources.jobs.other?.totalRecords}
      query={resources.query}
      updateQuery={mutator.query.update}
      hasLoaded={hasLoaded}
      error={error}
      handlers={{ onClose: handleClose }}
      onNeedMoreData={handleNeedMoreData}
    />
  );
};


HarvestableJobsRoute.manifest = Object.freeze({
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  harvestable: {
    type: 'okapi',
    path: 'harvester-admin/harvestables/:{recId}',
  },
  jobs: {
    type: 'okapi',
    path: 'harvester-admin/previous-jobs',
    throwErrors: false,
    records: 'previousJobs',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    params: {
      // Curry the query-function to inject an extra filter specifying which harvestables's jobs we want
      query: (queryParams, pathComponents, rv, logger) => {
        const extraFilter = `harvestableId.${pathComponents.recId}`;
        const allFilters = rv.query.filters ? `${rv.query.filters},${extraFilter}` : extraFilter;
        rv.query = { sort: '-started', ...rv.query, filters: allFilters };
        const res = queryFunction('name="%{query.query}" or message="%{query.query}"',
          queryParams, pathComponents, rv, logger);
        if (res === undefined) return undefined;
        const m = res.match(/^(\(?(id|harvestableId)=\"[^\"]*)\*"(.*)$/);
        return m ? `${m[1]}\"${m[3]}` : res;
      }
    },
  },
});


HarvestableJobsRoute.propTypes = {
  stripes: PropTypes.shape({
    logger: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    query: PropTypes.object.isRequired,
    harvestable: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({}).isRequired,
      ).isRequired,
    }).isRequired,
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      recId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default stripesConnect(HarvestableJobsRoute);

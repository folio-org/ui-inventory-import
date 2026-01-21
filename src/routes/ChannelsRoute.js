import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';
import Harvestables from '../views/Harvestables';


const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


function HarvestablesRoute({ stripes, resources, mutator, children }) {
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


  const error = resources.harvestables.failed ? resources.harvestables.failed.message : undefined;
  const hasLoaded = resources.harvestables.hasLoaded;

  return (
    <Harvestables
      data={{
        harvestables: resources.harvestables.records,
      }}
      query={resources.query}
      resultCount={resources.harvestables.other?.totalRecords}
      updateQuery={mutator.query.update}
      error={error}
      hasLoaded={hasLoaded}
      pageAmount={RESULT_COUNT_INCREMENT}
      onNeedMoreData={handleNeedMoreData}
    >
      {children}
    </Harvestables>
  );
}


HarvestablesRoute.manifest = Object.freeze({
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  harvestables: {
    type: 'okapi',
    path: 'harvester-admin/harvestables',
    throwErrors: false,
    records: 'harvestables',
    recordsRequired: '%{resultCount}',
    resultOffset: '%{resultOffset}',
    perRequest: RESULT_COUNT_INCREMENT,
    resultDensity: 'sparse',
    accumulate: 'true',
    params: {
      query: (qp) => {
        const conditions = [];
        if (qp.query) conditions.push(`${qp.qindex || 'name'}=${qp.query}*`);

        /*
        // Due to back-end limitations, filters can't be handled at
        // the same time as the main query. Instead we will handle
        // filtering client-side.
        if (qp.filters) {
          const o = parseFilters(qp.filters);
          Object.keys(o).sort().forEach(key => {
            conditions.push(`${key}=${o[key][0]}`);
          });
        }
        */

        if (conditions.length === 0) return undefined;
        return conditions.join(' or '); // Not supported on back-end, but hey-ho
      },
      orderBy: (_qp) => {
        // We could use qp.sort, but there are all sorts of back-end
        // limitations: only certain fields can be sorted, only the
        // first of multiple keys can be made desceding (by prepending
        // "~"), so instead we sort client-side.
        return undefined;
      }
    },
  },
});


HarvestablesRoute.propTypes = {
  stripes: PropTypes.shape({
    logger: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    query: PropTypes.object.isRequired,
    harvestables: PropTypes.shape({
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
  children: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
};


export default stripesConnect(HarvestablesRoute);

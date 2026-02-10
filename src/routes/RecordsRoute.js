import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import Records from '../views/Records';


const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


const RecordsRoute = ({ stripes, resources, mutator, children }) => {
  let [source, setSource] = useState(); // eslint-disable-line prefer-const
  if (!source) {
    source = new StripesConnectedSource({ resources, mutator }, stripes.logger, 'reportTitles');
    setSource(source);
  } else {
    source.update({ resources, mutator }, 'reportTitles');
  }

  const handleNeedMoreData = (_askAmount, index, _firstIndex, _direction) => {
    source.fetchOffset(index);
  };

  const hasLoaded = resources.records.hasLoaded;
  const error = resources.records.failed ? resources.records.failed.message : undefined;

  return (
    <Records
      data={{
        records: resources.records.records,
      }}
      resultCount={resources.records.other?.totalRecords}
      query={resources.query}
      updateQuery={mutator.query.update}
      hasLoaded={hasLoaded}
      error={error}
      pageAmount={RESULT_COUNT_INCREMENT}
      onNeedMoreData={handleNeedMoreData}
    >
      {children}
    </Records>
  );
};


// Keep these in sync with what's in ../search/RecordsSearchPane.js
const searchableIndexes = ['xxx', 'yyy'];

const filterConfig = [{
  name: 'zzz',
  cql: 'zzz',
  values: [],
}];

RecordsRoute.manifest = Object.freeze({
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  records: {
    type: 'okapi',
    path: 'inventory-import/failed-records',
    throwErrors: false,
    records: 'failedRecords',
    recordsRequired: '%{resultCount}',
    resultOffset: '%{resultOffset}',
    perRequest: RESULT_COUNT_INCREMENT,
    resultDensity: 'sparse',
    accumulate: 'true',
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


RecordsRoute.propTypes = {
  stripes: PropTypes.shape({
    logger: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    query: PropTypes.object.isRequired,
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
  children: PropTypes.object, // XXX may need to add .isRequired later
};


export default stripesConnect(RecordsRoute);

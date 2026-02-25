import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import { makePFV } from '../search/queryFunction';
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

  // eslint-disable-next-line no-console
  console.log('RecordsRoute: resources =', resources);

  const hasLoaded = resources.failedRecords.hasLoaded;
  const error = resources.failedRecords.failed ? resources.failedRecords.failed.message : undefined;

  return (
    <Records
      data={{
        records: resources.failedRecords.records,
      }}
      resultCount={resources.failedRecords.other?.totalRecords}
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
const searchableIndexes = ['recordNumber', 'channelName']; // XXX Find a way to add transformedRecord.instance.title

const filterConfig = [{
  name: 'timeStamp_from',
  cql: 'timeStamp',
  values: [],
  parse: makePFV('timeStamp', '>='),
}, {
  name: 'timeStamp_to',
  cql: 'timeStamp',
  values: [],
  parse: makePFV('timeStamp', '<=', 'T23:59:59'),
}];

RecordsRoute.manifest = Object.freeze({
  query: {},
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  failedRecords: {
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
    failedRecords: PropTypes.shape({
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

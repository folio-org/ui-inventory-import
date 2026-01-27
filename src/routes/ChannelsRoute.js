import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import Channels from '../views/Channels';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


function ChannelsRoute({ stripes, resources, mutator, children }) {
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

  const error = resources.channels.failed ? resources.channels.failed.message : undefined;
  const hasLoaded = resources.channels.hasLoaded;

  return (
    <Channels
      data={{
        channels: resources.channels.records,
      }}
      query={resources.query}
      resultCount={resources.channels.other?.totalRecords}
      updateQuery={mutator.query.update}
      error={error}
      hasLoaded={hasLoaded}
      pageAmount={RESULT_COUNT_INCREMENT}
      onNeedMoreData={handleNeedMoreData}
    >
      {children}
    </Channels>
  );
}


// Keep these in sync with what's in ../search/ChannelsSearchPane.js
const searchableIndexes = ['name', 'id'];

const filterConfig = [{
  name: 'enabled',
  cql: 'enabled',
  values: [],
}, {
  name: 'type',
  cql: 'type',
  values: [],
}];


ChannelsRoute.manifest = Object.freeze({
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  channels: {
    type: 'okapi',
    path: 'inventory-import/channels',
    records: 'channels',
    throwErrors: false,
    resultDensity: 'sparse',
    recordsRequired: '%{resultCount}',
    perRequest: RESULT_COUNT_INCREMENT,
    params: {
      query: (qp, pathComponents, rv, logger) => {
        // Is it not a strange fate that we should suffer so much fear and doubt for so small a thing?
        const queryFunction = makeQueryFunction(
          'cql.allRecords=1',
          searchableIndexes.map(index => `${index}="${qp.query}*"`).join(' or '),
          {},
          filterConfig,
        );
        return queryFunction(qp, pathComponents, rv, logger);
      },
    },
  },
});


ChannelsRoute.propTypes = {
  stripes: PropTypes.shape({
    logger: PropTypes.object.isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    query: PropTypes.object.isRequired,
    channels: PropTypes.shape({
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


export default stripesConnect(ChannelsRoute);

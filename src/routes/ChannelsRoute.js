import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction, StripesConnectedSource } from '@folio/stripes/smart-components';
import Channels from '../views/Channels';

const INITIAL_RESULT_COUNT = 100;
const RESULT_COUNT_INCREMENT = 100;


function ChannelsRoute({ stripes, resources, mutator, children, defaultSearchPaneOpen = true }) {
  const source = useMemo(() => {
    return new StripesConnectedSource({ resources, mutator }, stripes.logger, 'channels');
  }, [resources, mutator, stripes.logger]);

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
      defaultSearchPaneOpen={defaultSearchPaneOpen}
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

        // Default sort-order when none is specified (UIINIMP-36)
        if (!rv.query || !rv.query.sort) {
          // eslint-disable-next-line no-param-reassign
          rv = { ...rv, query: { ...rv.query, sort: 'name' } };
        }

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
  children: PropTypes.object,
};


export default stripesConnect(ChannelsRoute);

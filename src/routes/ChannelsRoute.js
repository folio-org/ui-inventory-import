import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import { StripesConnectedSource, parseFilters } from '@folio/stripes/smart-components';
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


ChannelsRoute.manifest = Object.freeze({
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  resultOffset: { initialValue: 0 },
  channels: {
    type: 'okapi',
    path: 'inventory-import/channels',
    throwErrors: false,
    records: 'channels',
    recordsRequired: '%{resultCount}',
    resultOffset: '%{resultOffset}',
    perRequest: RESULT_COUNT_INCREMENT,
    resultDensity: 'sparse',
    accumulate: 'true',
    params: {
      query: (qp) => {
        const conditions = [];
        if (qp.query) conditions.push(`${qp.qindex || 'name'}=${qp.query}`);
        if (qp.filters) {
          const o = parseFilters(qp.filters);
          Object.keys(o).sort().forEach(key => {
            conditions.push(`${key}=${o[key][0]}`);
          });
        }
        if (conditions.length === 0) return undefined;
        return conditions.join(' or '); // Not supported on back-end, but hey-ho
      },
      orderBy: (qp) => {
        return qp.sort
      }
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

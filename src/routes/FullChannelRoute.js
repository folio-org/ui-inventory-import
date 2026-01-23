import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import FullChannel from '../views/FullChannel';


const FullChannelRoute = (props) => {
  const deleteRecord = () => props.mutator.channel.DELETE({ id: props.match.params.recId });

  return <FullChannel {...props} deleteRecord={deleteRecord} />;
};


FullChannelRoute.manifest = Object.freeze({
  query: {},
  channel: {
    type: 'okapi',
    path: 'inventory-import/channels/:{recId}',
    shouldRefresh: () => false,
  },
/*
  XXX update
  run: {
    type: 'okapi',
    path: 'harvester-admin/jobs/run/:{recId}',
    fetch: false,
    throwErrors: false,
    PUT: {
      headers: {
        'Accept': 'application/json'
      }
    }
  },
  stop: {
    type: 'okapi',
    path: 'harvester-admin/jobs/stop/:{recId}',
    fetch: false,
    throwErrors: false,
    PUT: {
      headers: {
        'Accept': 'application/json'
      }
    }
  },
*/
});


FullChannelRoute.propTypes = {
  defaultWidth: PropTypes.string,
  resources: PropTypes.shape({
    channel: PropTypes.shape({
      records: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    channel: PropTypes.shape({
      DELETE: PropTypes.func.isRequired,
    }).isRequired,
    run: PropTypes.shape({
      // PUT: PropTypes.func.isRequired,
    }).isRequired,
    stop: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired
};

FullChannelRoute.defaultProps = {
  defaultWidth: '60%',
};

export default stripesConnect(FullChannelRoute);

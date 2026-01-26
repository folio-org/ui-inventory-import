import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { stripesConnect } from '@folio/stripes/core';
import ChannelForm from '../forms/ChannelForm';
import packageInfo from '../../package';
import { raw2cooked, cooked2raw } from '../util/cookData';


const EditChannelRoute = ({ resources, mutator, match }) => {
  const handleClose = () => {
    mutator.query.update({ _path: `${packageInfo.stripes.route}/channels/${match.params.recId}` });
  };

  const handleSubmit = (record) => {
    mutator.channel.PUT(cooked2raw(record))
      .then(handleClose);
  };

  const isLoading = (resources.channel.isPending ||
                     resources.transformationPipelines.isPending);

  return (
    <ChannelForm
      isLoading={isLoading}
      initialValues={raw2cooked(get(resources, 'channel.records[0]', {}))}
      data={{
        transformationPipelines: resources.transformationPipelines.records,
      }}
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
    />
  );
};


EditChannelRoute.manifest = Object.freeze({
  query: {},
  channel: {
    type: 'okapi',
    path: 'inventory-import/channels/:{recId}',
  },
  transformationPipelines: {
    type: 'okapi',
    path: 'harvester-admin/transformations',
    records: 'transformations',
  },
});


EditChannelRoute.propTypes = {
  resources: PropTypes.shape({
    channel: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({}).isRequired,
      ).isRequired,
    }).isRequired,
    transformationPipelines: PropTypes.shape({
      isPending: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({}).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    channel: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};


export default stripesConnect(EditChannelRoute);

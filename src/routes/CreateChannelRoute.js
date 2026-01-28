import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import ChannelForm from '../forms/ChannelForm';
import { cooked2raw } from '../util/cookData';
import packageInfo from '../../package';


const CreateChannelRoute = ({ resources, mutator, match, location }) => {
  const handleClose = () => {
    mutator.query.update({ _path: `${packageInfo.stripes.route}/channels/${location.search}` });
  };

  const handleSubmit = (record) => {
    mutator.channels.POST(cooked2raw({ ...record }))
      .then(handleClose);
  };

  const isLoading = resources.transformationPipelines.isPending;

  return (
    <ChannelForm
      isLoading={isLoading}
      initialValues={{
        type: match.params.type.toUpperCase(),
        enabled: false,
      }}
      data={{
        transformationPipelines: resources.transformationPipelines.records,
      }}
      handlers={{ onClose: handleClose }}
      onSubmit={handleSubmit}
    />
  );
};


CreateChannelRoute.manifest = Object.freeze({
  query: {},
  channels: {
    type: 'okapi',
    path: 'inventory-import/channels',
    fetch: false,
    clientGeneratePk: false,
  },
  transformationPipelines: {
    type: 'okapi',
    path: 'inventory-import/transformations',
    records: 'transformations',
  },
});


CreateChannelRoute.propTypes = {
  resources: PropTypes.shape({
    channels: PropTypes.shape({
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
    channels: PropTypes.shape({
      POST: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};


export default stripesConnect(CreateChannelRoute);

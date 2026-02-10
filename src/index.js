import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect } from 'react-router-dom';
import { Route as NestedRoute } from '@folio/stripes/core';
import Settings from './settings';
import ChannelsRoute from './routes/ChannelsRoute';
import CreateChannelRoute from './routes/CreateChannelRoute';
import FullChannelRoute from './routes/FullChannelRoute';
import EditChannelRoute from './routes/EditChannelRoute';
import ChannelLogRoute from './routes/ChannelLogRoute';
import ChannelJobsRoute from './routes/ChannelJobsRoute';
import JobsRoute from './routes/JobsRoute';
import FullJobRoute from './routes/FullJobRoute';
import RecordsRoute from './routes/RecordsRoute';
import FullRecordRoute from './routes/FullRecordRoute';
import MikeRoute from './routes/MikeRoute';
import Tabs from './Tabs';
import css from './index.css';


const InventoryImportApp = (props) => {
  const {
    actAs,
    stripes,
    match: { path }
  } = props;

  if (actAs === 'settings') {
    return <Settings {...props} />;
  }

  // Don't redirect to a page we don't have permission to view: see Tabs.js
  const dest = stripes.hasPerm('ui-inventory-import.channels.view') ? 'channels' : 'jobs';

  return (
    <div className={css.container}>
      <div className={css.header}>
        <Tabs />
      </div>
      <div className={css.body}>
        <Switch>
          <Redirect exact from={path} to={`${path}/${dest}`} />
          <NestedRoute path={`${path}/mike`} exact component={MikeRoute} />
          <NestedRoute path={`${path}/channels/create/:type`} exact component={CreateChannelRoute} />
          <NestedRoute path={`${path}/channels/:recId/logs`} exact component={ChannelLogRoute} />
          <NestedRoute path={`${path}/channels/:recId/jobs`} exact component={ChannelJobsRoute} />
          <NestedRoute path={`${path}/channels`} component={ChannelsRoute}>
            <NestedRoute path={`${path}/channels/:recId`} exact component={FullChannelRoute} />
            <NestedRoute path={`${path}/channels/:recId/edit`} exact component={EditChannelRoute} />
          </NestedRoute>
          <NestedRoute path={`${path}/jobs`} component={JobsRoute}>
            <NestedRoute path={`${path}/jobs/:recId`} exact component={FullJobRoute} />
          </NestedRoute>
          <NestedRoute path={`${path}/records`} component={RecordsRoute}>
            <NestedRoute path={`${path}/records/:recId`} component={FullRecordRoute} />
          </NestedRoute>
        </Switch>
      </div>
    </div>
  );
};

InventoryImportApp.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  actAs: PropTypes.string.isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default InventoryImportApp;

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';
import { Settings } from '@folio/stripes/smart-components';
import PipelineSettings from './PipelineSettings';
import StepSettings from './StepSettings';
import ChannelsRoute from '../routes/ChannelsRoute';
import FullChannelRoute from '../routes/FullChannelRoute';
import CreateChannelRoute from '../routes/CreateChannelRoute';
import LogSettings from './LogSettings';


const InventoryImportSettings = (props) => {
  const pages = [
    {
      route: 'pipeline',
      label: <FormattedMessage id="ui-inventory-import.settings.pipeline" />,
      component: PipelineSettings,
      perm: 'inventory-update.import.transformations.collection.get',
    },
    {
      route: 'step',
      label: <FormattedMessage id="ui-inventory-import.settings.step" />,
      component: StepSettings,
      perm: 'inventory-update.import.steps.collection.get',
    },
    {
      route: 'channels',
      label: <FormattedMessage id="ui-inventory-import.settings.channels" />,
      component: ChannelsRoute,
      perm: 'ui-inventory-import.harvestables.view',
    },
    {
      route: 'logs',
      label: <FormattedMessage id="ui-inventory-import.settings.logs" />,
      component: LogSettings,
      perm: 'mod-settings.global.read.mod-inventory-update',
    },
  ];

  // To support pages within the Channels settings
  const additionalRoutes = [
    <Route
      path={`${props.match.path}/channels/create/:type`}
      exact
      component={CreateChannelRoute}
    />,
    <Route
      path={`${props.match.path}/channels/:recId`}
      component={FullChannelRoute}
    />,
  ];

  return (
    <Settings
      paneTitle={<FormattedMessage id="ui-inventory-import.meta.title" />}
      pages={pages}
      additionalRoutes={additionalRoutes}
      {...props}
    />
  );
};

export default InventoryImportSettings;

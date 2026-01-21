import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import PipelineSettings from './PipelineSettings';
import StepSettings from './StepSettings';
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
      route: 'logs',
      label: <FormattedMessage id="ui-inventory-import.settings.logs" />,
      component: LogSettings,
      perm: 'mod-settings.global.read.mod-inventory-update',
    },
  ];

  return (
    <Settings {...props} pages={pages} paneTitle={<FormattedMessage id="ui-inventory-import.meta.title" />} />
  );
};

export default InventoryImportSettings;

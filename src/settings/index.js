import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import StorageSettings from './StorageSettings';
import PipelineSettings from './PipelineSettings';
import StepSettings from './StepSettings';
import LogSettings from './LogSettings';

const HarvesterAdminSettings = (props) => {
  const pages = [
    {
      route: 'storage',
      label: <FormattedMessage id="ui-inventory-import.settings.storage" />,
      component: StorageSettings,
      // perm: 'XXX',
    },
    {
      route: 'pipeline',
      label: <FormattedMessage id="ui-inventory-import.settings.pipeline" />,
      component: PipelineSettings,
      // perm: 'XXX',
    },
    {
      route: 'step',
      label: <FormattedMessage id="ui-inventory-import.settings.step" />,
      component: StepSettings,
      // perm: 'XXX',
    },
    {
      route: 'logs',
      label: <FormattedMessage id="ui-inventory-import.settings.logs" />,
      component: LogSettings,
      // perm: 'XXX',
    },
  ];

  return (
    <Settings {...props} pages={pages} paneTitle={<FormattedMessage id="ui-inventory-import.meta.title" />} />
  );
};

export default HarvesterAdminSettings;

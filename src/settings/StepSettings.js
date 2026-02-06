import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { EntryManager } from '../smart-components';
import StepDetail from './StepDetail';
import StepForm from './StepForm';

const PERMS = {
  put: 'inventory-update.import.steps.item.put',
  post: 'inventory-update.import.steps.item.post',
  delete: 'inventory-update.import.steps.item.delete',
};

const StepSettings = (props) => {
  const { mutator, resources, intl } = props;

  return (
    <EntryManager
      {...props}
      resourcePath="inventory-import/steps"
      parentMutator={mutator}
      entryList={resources.entries?.records || []}
      detailComponent={StepDetail}
      paneTitle={intl.formatMessage({ id: 'ui-inventory-import.settings.step' })}
      entryLabel={intl.formatMessage({ id: 'ui-inventory-import.settings.step.heading' })}
      entryFormComponent={StepForm}
      nameKey="name"
      permissions={PERMS}
      enableDetailsActionMenu
    />
  );
};

StepSettings.propTypes = {
  resources: PropTypes.shape({
    entries: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    entries: PropTypes.shape({
      POST: PropTypes.func,
      PUT: PropTypes.func,
      DELETE: PropTypes.func,
    }),
  }).isRequired,
  intl: PropTypes.object.isRequired,
};

StepSettings.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    records: 'steps',
    path: 'inventory-import/steps',
    throwErrors: false,
    GET: {
      path: 'inventory-import/steps?limit=1000', // Will this always be enough?
    },
  },
});

export default stripesConnect(injectIntl(StepSettings));

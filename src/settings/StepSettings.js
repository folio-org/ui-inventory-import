import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { EntryManager } from '../smart-components';
import { boolValues2string, stringValues2bool } from './transformBooleans';
import StepDetail from './StepDetail';
import StepForm from './StepForm';

const PERMS = {
  put: 'harvester-admin.steps.item.put',
  post: 'harvester-admin.steps.item.post',
  delete: 'harvester-admin.steps.item.delete',
};

const StepSettings = (props) => {
  const { mutator, resources, intl } = props;

  const entriesWithVirtualName = ((resources.entries || {}).records || [])
    .map(entry => ({
      ...entry,
      virtualName: `${entry.name} (${entry.inputFormat}→${entry.outputFormat})`,
    }));

  return (
    <EntryManager
      {...props}
      resourcePath="harvester-admin/steps"
      parentMutator={mutator}
      entryList={entriesWithVirtualName}
      detailComponent={StepDetail}
      paneTitle={intl.formatMessage({ id: 'ui-inventory-import.settings.step' })}
      entryLabel={intl.formatMessage({ id: 'ui-inventory-import.settings.step.heading' })}
      entryFormComponent={StepForm}
      nameKey="virtualName"
      permissions={PERMS}
      enableDetailsActionMenu
      parseInitialValues={values => {
        if (!values) return values; // Necessary if the edit-form is reloaded, for some reason
        return boolValues2string(values, ['enabled']);
      }}
      onBeforeSave={values => {
        const v = stringValues2bool(values, ['enabled']);
        delete v.virtualName;
        return v;
      }}
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
    records: 'transformationSteps',
    path: 'harvester-admin/steps',
    clientGeneratePk: false,
    throwErrors: false,
    GET: {
      path: 'harvester-admin/steps?limit=1000', // XXX will this always be enough?
    },
    PUT: {
      headers: {
        // For some reason, this is needed for PUT and not POST
        // And also for some reason, it's needed to PUT steps, but not storages or pipelines
        'Accept': 'application/json'
      }
    }
  },
});

export default stripesConnect(injectIntl(StepSettings));

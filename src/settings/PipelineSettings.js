import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { EntryManager } from '../smart-components';
import { boolValues2string, stringValues2bool } from './transformBooleans';
import PipelineDetail from './PipelineDetail';
import PipelineForm from './PipelineForm';

const PERMS = {
  put: 'harvester-admin.transformations.item.put',
  post: 'harvester-admin.transformations.item.post',
  delete: 'harvester-admin.transformations.item.delete',
};

const PipelineSettings = (props) => {
  const { mutator, resources, intl } = props;

  return (
    <EntryManager
      {...props}
      resourcePath="harvester-admin/transformations"
      parentMutator={mutator}
      entryList={sortBy((resources.entries || {}).records || [], ['name'])}
      detailComponent={PipelineDetail}
      paneTitle={intl.formatMessage({ id: 'ui-inventory-import.settings.pipeline' })}
      entryLabel={intl.formatMessage({ id: 'ui-inventory-import.settings.pipeline.heading' })}
      entryFormComponent={(p2) => <PipelineForm {...p2} steps={resources.steps.records} />}
      nameKey="name"
      permissions={PERMS}
      enableDetailsActionMenu
      parseInitialValues={values => {
        if (!values) return values; // Necessary if the edit-form is reloaded, for some reason
        return boolValues2string(values, ['enabled', 'parallel']);
      }}
      onBeforeSave={values => {
        const newValues = stringValues2bool(values, ['enabled', 'parallel']);
        if (!newValues.type) newValues.type = 'basicTransformation';
        return newValues;
      }}
    />
  );
};

PipelineSettings.propTypes = {
  resources: PropTypes.shape({
    entries: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    steps: PropTypes.shape({
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

PipelineSettings.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    records: 'transformations',
    path: 'harvester-admin/transformations',
    clientGeneratePk: false,
    throwErrors: false,
  },
  steps: {
    type: 'okapi',
    path: 'harvester-admin/steps?limit=1000',
    records: 'transformationSteps',
  },
});

export default stripesConnect(injectIntl(PipelineSettings));

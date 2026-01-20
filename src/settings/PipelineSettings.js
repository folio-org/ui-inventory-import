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
  // XXX update these
  put: 'inventory-update.import.transformations.item.put',
  post: 'inventory-update.import.transformations.item.post',
  delete: 'inventory-update.import.transformations.item.delete',
};

const PipelineSettings = (props) => {
  const { mutator, resources, intl } = props;

  return (
    <EntryManager
      {...props}
      resourcePath="inventory-import/transformations"
      parentMutator={mutator}
      entryList={sortBy(resources.entries?.records || [], ['name'])}
      detailComponent={PipelineDetail}
      paneTitle={intl.formatMessage({ id: 'ui-inventory-import.settings.pipeline' })}
      entryLabel={intl.formatMessage({ id: 'ui-inventory-import.settings.pipeline.heading' })}
      entryFormComponent={(p2) => <PipelineForm {...p2} steps={resources.steps.records} />}
      nameKey="name"
      permissions={PERMS}
      enableDetailsActionMenu
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
    path: 'inventory-import/transformations',
    clientGeneratePk: false,
    throwErrors: false,
  },
  steps: {
    type: 'okapi',
    path: 'inventory-import/steps?limit=1000',
    records: 'steps',
  },
});

export default stripesConnect(injectIntl(PipelineSettings));

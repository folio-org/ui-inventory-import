import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { EntryManager } from '../smart-components';
import { boolValues2string, stringValues2bool } from './transformBooleans';
import StorageDetail from './StorageDetail';
import StorageForm from './StorageForm';

const PERMS = {
  put: 'harvester-admin.storages.item.put',
  post: 'harvester-admin.storages.item.post',
  delete: 'harvester-admin.storages.item.delete',
};

const StorageSettings = (props) => {
  const { mutator, resources, intl } = props;

  return (
    <EntryManager
      {...props}
      resourcePath="harvester-admin/storages"
      parentMutator={mutator}
      entryList={sortBy((resources.entries || {}).records || [], ['name'])}
      detailComponent={StorageDetail}
      paneTitle={intl.formatMessage({ id: 'ui-inventory-import.settings.storage' })}
      entryLabel={intl.formatMessage({ id: 'ui-inventory-import.settings.storage.heading' })}
      entryFormComponent={StorageForm}
      nameKey="name"
      permissions={PERMS}
      enableDetailsActionMenu
      parseInitialValues={values => {
        if (!values) return values; // Necessary if the edit-form is reloaded, for some reason
        const newValues = boolValues2string(values, ['enabled']);
        if (values.json) newValues.json = JSON.stringify(values.json, null, 2);
        return newValues;
      }}
      onBeforeSave={values => {
        const newValues = stringValues2bool(values, ['enabled']);
        if (values.json) newValues.json = JSON.parse(values.json);
        return newValues;
      }}
    />
  );
};

StorageSettings.propTypes = {
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

StorageSettings.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    records: 'storages',
    path: 'harvester-admin/storages',
    clientGeneratePk: false,
    throwErrors: false,
  },
});

export default stripesConnect(injectIntl(StorageSettings));

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { ConfigManager } from '@folio/stripes/smart-components';
import { Loading, TextField, Select } from '@folio/stripes/components';


function LogSettings(props) {
  const intl = useIntl();
  const [ConnectedConfigManager, setConnectedConfigManager] = useState();

  useEffect(() => {
    setConnectedConfigManager(props.stripes.connect(ConfigManager));
  }, [props.stripes]);

  if (!ConnectedConfigManager) return <Loading size="xlarge" />;

  const getInitialValues = (settings) => {
    const res = settings.length === 0 ? '' : settings[0].value;
    return {
      number: res.substring(0, res.indexOf(' ')),
      unit: res.substring(res.indexOf(' ') + 1),
    };
  };

  const beforeSave = (data) => {
    return (data?.number || '1') + ' ' + (data.unit || 'MONTHS');
  };

  const descLabel = <FormattedMessage id="ui-inventory-import.settings.logs.description" />;
  const numberLabel = <FormattedMessage id="ui-inventory-import.settings.logs.number" />;
  const unitLabel = <FormattedMessage id="ui-inventory-import.settings.logs.unit" />;

  const rawUnits = ['days', 'weeks', 'months'];
  const units = rawUnits.map(tag => ({
    value: tag,
    label: intl.formatMessage({ id: `ui-inventory-import.settings.logs.unit.${tag}` }),
  }));

  return (
    <ConnectedConfigManager
      formType="final-form"
      label={props.label}
      scope="mod-inventory-update"
      configName="PURGE_LOGS_AFTER"
      getInitialValues={getInitialValues}
      onBeforeSave={beforeSave}
    >
      <div>
        <p>{descLabel}</p>
        <Field name="number" label={numberLabel} component={TextField} />
        <Field name="unit" label={unitLabel} component={Select} dataOptions={units} />
      </div>
    </ConnectedConfigManager>
  );
}


LogSettings.propTypes = {
  stripes: PropTypes.shape({
    connect: PropTypes.func.isRequired,
  }).isRequired,
  label: PropTypes.node.isRequired,
};


export default LogSettings;

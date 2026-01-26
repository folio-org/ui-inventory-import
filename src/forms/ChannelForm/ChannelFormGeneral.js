import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { Accordion, Row, Col, Checkbox, TextArea, Select, TextField } from '@folio/stripes/components';
import { RCF, CF, RCLF, CLF } from '../../components/CF';

const logLevels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'].map(x => ({ value: x, label: x }));
const mailLevels = ['OK', 'WARN', 'ERROR'].map(x => ({ value: x, label: x }));
const rawFailedRecords = ['NO_STORE', 'CLEAN_DIRECTORY', 'CREATE_OVERWRITE', 'ADD_ALL'];

const ChannelFormGeneral = ({ data }) => {
  const intl = useIntl();

  const noValue = {
    value: '',
    label: intl.formatMessage({ id: 'ui-inventory-import.selectValue' }),
  };
  const failedRecords = rawFailedRecords.map(x => ({
    value: x,
    label: x + ' - ' + intl.formatMessage({ id: `ui-inventory-import.channels.field.failedRecordsLogging.${x}` }),
  }));
  const transformationPipelines = data.transformationPipelines.map(x => ({ value: x.id, label: x.name }));

  return (
    <Accordion
      id="channel-form-general"
      label={<FormattedMessage id="ui-inventory-import.channels.heading.general" />}
    >
      <RCF tag="type" />
      <Row>
        <CF tag="id" xs={4} disabled />
        <CF tag="tag" xs={2} />
        <CF tag="name" xs={6} required />
      </Row>
      <RCF tag="enabled" component={Checkbox} type="checkbox" />
      <RCF tag="commissioned" component={Checkbox} type="checkbox" disabled />
      <RCF tag="listening" component={Checkbox} type="checkbox" />
      <RCF tag="transformation.id" i18nTag="transformationPipeline" component={Select} dataOptions={[noValue].concat(transformationPipelines)} required />
      <div style={{ marginTop: '1em' }} />
    </Accordion>
  );
};

ChannelFormGeneral.propTypes = {
  data: PropTypes.shape({
    transformationPipelines: PropTypes.arrayOf(
      PropTypes.shape({
        enabled: PropTypes.string.isRequired, // "true" or "false", so boolean in intent
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default ChannelFormGeneral;

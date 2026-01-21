import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field } from 'react-final-form';
import { Accordion, Row, Col, Checkbox, TextArea, Select, TextField } from '@folio/stripes/components';
import { RCF, CF, RCLF, CLF } from '../../components/CF';

const logLevels = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'].map(x => ({ value: x, label: x }));
const mailLevels = ['OK', 'WARN', 'ERROR'].map(x => ({ value: x, label: x }));
const rawFailedRecords = ['NO_STORE', 'CLEAN_DIRECTORY', 'CREATE_OVERWRITE', 'ADD_ALL'];

const HarvestableFormGeneral = ({ data }) => {
  const intl = useIntl();

  const noValue = {
    value: '',
    label: intl.formatMessage({ id: 'ui-inventory-import.selectValue' }),
  };
  const failedRecords = rawFailedRecords.map(x => ({
    value: x,
    label: x + ' - ' + intl.formatMessage({ id: `ui-inventory-import.harvestables.field.failedRecordsLogging.${x}` }),
  }));
  const transformationPipelines = data.transformationPipelines.map(x => ({ value: x.id, label: x.name }));

  return (
    <Accordion
      id="harvestable-form-general"
      label={<FormattedMessage id="ui-inventory-import.harvestables.heading.general" />}
    >
      <Row>
        <CF tag="id" xs={2} disabled />
        <CF tag="name" xs={6} required />
        <CF tag="serviceProvider" xs={4} />
      </Row>
      <Row>
        <CLF tag="usedBy" xs={6} />
        <CLF tag="managedBy" xs={6} />
      </Row>
      <RCF tag="openAccess" component={Checkbox} type="checkbox" />
      <RCF tag="description" component={TextArea} rows="4" />
      <Row>
        <CF tag="technicalNotes" xs={6} component={TextArea} rows="4" />
        <CF tag="contactNotes" xs={6} component={TextArea} rows="4" />
      </Row>
      <Row>
        <CF tag="enabled" xs={4} component={Checkbox} type="checkbox" />
        <CF tag="scheduleString" xs={8} />
      </Row>
      <RCF tag="transformation.id" i18nTag="transformationPipeline" component={Select} dataOptions={[noValue].concat(transformationPipelines)} required />
      <RCF tag="laxParsing" component={Checkbox} type="checkbox" />
      <RCF tag="encoding" />
      <Row>
        <CF tag="cacheEnabled" xs={6} component={Checkbox} type="checkbox" />
        <CF tag="storeOriginal" xs={6} component={Checkbox} type="checkbox" />
      </Row>
      <div style={{ marginTop: '1em' }} />
      <Row>
        <CF tag="recordLimit" xs={6} />
        <CF tag="timeout" xs={6} />
      </Row>
      <RCF tag="logLevel" component={Select} dataOptions={[noValue].concat(logLevels)} />
      <RCF tag="failedRecordsLogging" component={Select} dataOptions={[noValue].concat(failedRecords)} />
      <Row>
        <CF tag="maxSavedFailedRecordsPerRun" xs={6} type="number" />
        <CF tag="maxSavedFailedRecordsTotal" xs={6} type="number" />
      </Row>
      <RCLF tag="mailAddress" i18nTag="mailAddresses" />
      <RCF tag="mailLevel" component={Select} dataOptions={[noValue].concat(mailLevels)} />
      <RCLF
        tag="constantFields"
        renderEntry={(name) => (
          <Row>
            <Col xs={3}>
              <Field name={`${name}.key`} component={TextField} />
            </Col>
            <Col xs={1}>
              =
            </Col>
            <Col xs={8}>
              <Field name={`${name}.value`} component={TextField} />
            </Col>
          </Row>
        )}
        emptyValue={{ key: '', value: '' }}
      />
      <RCF tag="json" component={TextArea} rows="6" />
    </Accordion>
  );
};

HarvestableFormGeneral.propTypes = {
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

export default HarvestableFormGeneral;

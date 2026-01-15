import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Col, Row, KeyValue, Accordion } from '@folio/stripes/components';
import { bool2display } from './transformBooleans';


const StepDetail = (props) => {
  const stripes = useStripes();
  const data = props.initialValues;

  return (
    <>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.name" />}
            value={data.name}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.description" />}
            value={data.description}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.enabled" />}
            value={bool2display(data.enabled)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.type" />}
            value={data.type}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.inputFormat" />}
            value={data.inputFormat}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.outputFormat" />}
            value={data.outputFormat}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.script" />}
            value={data.script}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.testData" />}
            value={data.testData}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.testOutput" />}
            value={data.testOutput}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.step.field.customClass" />}
            value={data.customClass}
          />
        </Col>
      </Row>

      {stripes.config.showDevInfo &&
        <Accordion
          id="step-devinfo"
          label={<FormattedMessage id="ui-inventory-import.accordion.devinfo" />}
          closedByDefault
        >
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Accordion>
      }
    </>
  );
};


StepDetail.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    // See https://github.com/indexdata/mod-harvester-admin/blob/master/src/main/resources/openapi/schemas/step.json
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    type: PropTypes.string.isRequired,
    inputFormat: PropTypes.string,
    outputFormat: PropTypes.string,
    script: PropTypes.string,
    testData: PropTypes.string,
    testOutput: PropTypes.string,
    customClass: PropTypes.string, // XXX to be supported within a discriminated union
  }).isRequired,
};


export default StepDetail;

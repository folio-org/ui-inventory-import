import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Col, Row, KeyValue, Accordion } from '@folio/stripes/components';

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
            label={<FormattedMessage id="ui-inventory-import.step.field.type" />}
            value={data.type}
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
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string.isRequired,
    script: PropTypes.string,
  }).isRequired,
};


export default StepDetail;

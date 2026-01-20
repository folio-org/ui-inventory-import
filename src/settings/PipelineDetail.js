import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Col, Row, KeyValue, MultiColumnList, Accordion } from '@folio/stripes/components';
import { bool2display } from './transformBooleans';


const PipelineDetail = (props) => {
  const stripes = useStripes();
  const data = props.initialValues;

  return (
    <>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.pipeline.field.name" />}
            value={data.name}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.pipeline.field.description" />}
            value={data.description}
          />
        </Col>
      </Row>

      <h3><FormattedMessage id="ui-inventory-import.settings.step" /></h3>
      <MultiColumnList
        visibleColumns={['position', 'name', 'in', 'out']}
        columnMapping={{
          position: <FormattedMessage id="ui-inventory-import.pipeline.steps.position" />,
          name: <FormattedMessage id="ui-inventory-import.pipeline.steps.name" />,
          in: <FormattedMessage id="ui-inventory-import.pipeline.steps.in" />,
          out: <FormattedMessage id="ui-inventory-import.pipeline.steps.out" />,
        }}
        contentData={data.steps}
        formatter={{
          name: r => r.step.name,
          in: r => r.step.inputFormat,
          out: r => r.step.outputFormat,
        }}
      />

      {stripes.config.showDevInfo &&
        <Accordion
          id="pipeline-devinfo"
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


PipelineDetail.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
      }).isRequired,
    ),
  }).isRequired,
};


export default PipelineDetail;

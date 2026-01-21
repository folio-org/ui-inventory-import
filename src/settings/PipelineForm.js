import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { LoadingPane, Pane, Row, Col, Checkbox, TextArea, Selection } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { isEqual } from 'lodash';
import setFieldData from 'final-form-set-field-data'; // XXX do we need this?
import { RCF, CF, RCLF } from '../components/CF';
import renderPaneFooter from './renderPaneFooter';


function validate(values) {
  const errors = {};
  const requiredTextMessage = <FormattedMessage id="ui-inventory-import.fillIn" />;

  if (!values.name) {
    errors.name = requiredTextMessage;
  }

  return errors;
}


const PipelineForm = (props) => {
  const { handleSubmit, onCancel, pristine, submitting, steps } = props;

  if (!steps) return <LoadingPane />;
  const stepOptions = steps.map(s => ({
    value: s.id,
    label: s.name,
  }));

  const title = props.initialValues?.name;

  return (
    <Pane
      centerContent
      defaultWidth="60%"
      footer={renderPaneFooter(handleSubmit, onCancel, pristine, submitting)}
      id="pane-pipeline-form"
      paneTitle={title}
    >
      <TitleManager record={title}>
        <form id="form-pipeline">
          <Row>
            <CF tag="id" domain="channels" xs={2} disabled />
            <CF tag="name" domain="channels" xs={8} required />
          </Row>
          <RCF tag="description" domain="pipeline" component={TextArea} rows="4" />
          <br />
          <RCLF
            tag="steps"
            domain="pipeline"
            renderEntry={(name) => (
              <Row>
                <Col xs={12}>
                  <Field name={`${name}.id`} component={Selection} dataOptions={stepOptions} />
                </Col>
              </Row>
            )}
          />
        </form>
      </TitleManager>
    </Pane>
  );
};


PipelineForm.propTypes = {
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
    }).isRequired,
  ),
};


export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  validate,
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: { setFieldData, ...arrayMutators }
})(PipelineForm);

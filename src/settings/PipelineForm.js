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
    // XXX If we do this, <Selection> gets confused about regular expressions
    // label: `${s.name} (${s.inputFormat}→${s.outputFormat})`,
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
            <CF tag="id" xs={2} disabled />
            <CF tag="name" xs={8} required />
          </Row>
          <RCF tag="description" domain="pipeline" component={TextArea} rows="4" />
          <RCF tag="enabled" domain="pipeline" component={Checkbox} type="checkbox" />
          <RCF tag="parallel" domain="pipeline" component={Checkbox} type="checkbox" />
          <br />
          <RCLF
            tag="stepAssociations"
            domain="pipeline"
            renderEntry={(name) => (
              <Row>
                <Col xs={12}>
                  <Field name={`${name}.step.id`} component={Selection} dataOptions={stepOptions} />
                </Col>
              </Row>
            )}
            emptyValue={{ key: '', value: '' }}
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

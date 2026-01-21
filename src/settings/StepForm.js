import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import arrayMutators from 'final-form-arrays';
import { Pane, Row, Select, TextArea } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { isEqual } from 'lodash';
import setFieldData from 'final-form-set-field-data'; // XXX do we need this?
import { RCF, CF } from '../components/CF';
import renderPaneFooter from './renderPaneFooter';
import { compileXSLT, BAD_XML, BAD_XSLT, GOOD_XSLT } from './compileXSLT';
import css from './StepForm.css';


function validate(values) {
  const errors = {};
  const requiredTextMessage = <FormattedMessage id="ui-inventory-import.fillIn" />;
  const requiredSelectMessage = <FormattedMessage id="ui-inventory-import.selectToContinue" />;

  if (!values.name) {
    errors.name = requiredTextMessage;
  }
  if (!values.type) {
    errors.type = requiredSelectMessage;
  }

  // Due to react-final-form oddities, validation of XSLT here does not work. See what we do instead below

  return errors;
}


const StepForm = (props) => {
  const { form, handleSubmit, onCancel, pristine, submitting } = props;
  const intl = useIntl();

  const noValue = {
    value: '',
    label: intl.formatMessage({ id: 'ui-inventory-import.selectValue' }),
  };
  const types = ['XmlTransformStep'].map(x => ({ value: x, label: x }));

  const title = props.initialValues?.name;
  const [xsltStatus, xsltValue] = compileXSLT(form.getState().values.script);

  return (
    <Pane
      centerContent
      defaultWidth="60%"
      footer={renderPaneFooter(handleSubmit, onCancel, pristine, submitting)}
      id="pane-step-form"
      paneTitle={title}
    >
      <TitleManager record={title}>
        <form id="form-step">
          <Row>
            <CF tag="id" domain="channels" xs={2} disabled />
            <CF tag="type" domain="step" xs={2} component={Select} dataOptions={[noValue].concat(types)} required />
            <CF tag="name" domain="channels" xs={8} required />
          </Row>
          <RCF tag="description" domain="step" component={TextArea} rows="4" />
          <RCF tag="script" domain="step" component={TextArea} rows="4" />
          {
            (xsltStatus === BAD_XML) ?
              <div className={css.badXML}><FormattedMessage id="ui-inventory-import.invalidXML" values={{ error: xsltValue }} /></div> :
              (xsltStatus === BAD_XSLT) ?
                <div className={css.badXSLT}><FormattedMessage id="ui-inventory-import.invalidXSLT" /></div> :
                (xsltStatus === GOOD_XSLT) ?
                  <div className={css.good}><FormattedMessage id="ui-inventory-import.validXSLT" /></div> :
                  null
          }
        </form>
      </TitleManager>
    </Pane>
  );
};


StepForm.propTypes = {
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  }).isRequired,
  initialValues: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
};


export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  validate,
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: { setFieldData, ...arrayMutators }
})(StepForm);

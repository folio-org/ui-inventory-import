import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import arrayMutators from 'final-form-arrays';
import { Pane, Row, Select, Checkbox, TextArea } from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { isEqual } from 'lodash';
import setFieldData from 'final-form-set-field-data'; // XXX do we need this?
import { RCF, CF } from '../components/CF';
import renderPaneFooter from './renderPaneFooter';


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

  if (!values.json) {
    errors.json = requiredSelectMessage;
  } else {
    try {
      if (values.json && values.json !== '') JSON.parse(values.json);
    } catch (e) {
      errors.json = <FormattedMessage id="ui-inventory-import.invalidJSON" values={{ error: e.toString() }} />;
    }
  }

  return errors;
}


const StorageForm = (props) => {
  const { handleSubmit, onCancel, pristine, submitting } = props;
  const intl = useIntl();

  const noValue = {
    value: '',
    label: intl.formatMessage({ id: 'ui-inventory-import.selectValue' }),
  };
  const types = ['inventoryStorage', 'solrStorage'].map(x => ({ value: x, label: x }));

  const title = props.initialValues?.name;

  return (
    <Pane
      centerContent
      defaultWidth="60%"
      footer={renderPaneFooter(handleSubmit, onCancel, pristine, submitting)}
      id="pane-storage-form"
      paneTitle={title}
    >
      <TitleManager record={title}>
        <form id="form-storage">
          <Row>
            <CF tag="id" xs={2} disabled />
            <CF tag="type" domain="storage" xs={2} component={Select} dataOptions={[noValue].concat(types)} required />
            <CF tag="name" xs={8} required />
          </Row>
          <RCF tag="description" domain="storage" component={TextArea} rows="4" />
          <RCF tag="enabled" domain="storage" component={Checkbox} type="checkbox" />
          <RCF tag="url" />
          <RCF tag="json" component={TextArea} rows="4" required />
        </form>
      </TitleManager>
    </Pane>
  );
};


StorageForm.propTypes = {
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
})(StorageForm);

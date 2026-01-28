import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import arrayMutators from 'final-form-arrays';
import { Row, Checkbox, Select, HasCommand, Button, LoadingPane, Pane, PaneFooter, checkScope } from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { isEqual } from 'lodash';
import setFieldData from 'final-form-set-field-data'; // XXX do we need this?
import { RCF, CF } from '../components/CF';


const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) e.preventDefault();
    if (!disabled) handler();
  };
};


function validate(values) {
  const errors = {};

  if (!values.name) {
    errors.name = <FormattedMessage id="ui-inventory-import.fillIn" />;
  }
  if (!values.transformationId) {
    errors.transformationId = <FormattedMessage id="ui-inventory-import.selectToContinue" />;
  }

  return errors;
}


const ChannelForm = (props) => {
  const {
    isLoading,
    data,
    handlers,
    handleSubmit,
    form: { mutators },
    values = {},
    pristine,
    submitting
  } = props;

  const intl = useIntl();
  const noValue = {
    value: '',
    label: intl.formatMessage({ id: 'ui-inventory-import.selectValue' }),
  };

  const transformationPipelines = data.transformationPipelines.map(x => ({ value: x.id, label: x.name }));

  function renderPaneFooter() {
    return (
      <PaneFooter
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={handlers.onClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-update-channel"
            marginBottom0
            onClick={handleSubmit}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
      />
    );
  }

  if (isLoading) return <LoadingPane />;

  const title = values.name;

  const shortcuts = [
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(handlers.onClose),
    },
  ];

  return (
    <HasCommand commands={shortcuts} isWithinScope={checkScope} scope={document.body}>
      <Pane
        appIcon={<AppIcon app="inventory-import" />}
        centerContent
        defaultWidth="60%"
        footer={renderPaneFooter()}
        id="pane-channel-form"
        paneTitle={title}
        dismissible
        onClose={handlers.onClose}
      >
        <TitleManager record={title}>
          <form id="form-course">
            <RCF tag="type" disabled />
            <Row>
              <CF tag="id" xs={4} disabled />
              <CF tag="tag" xs={2} />
              <CF tag="name" xs={6} required />
            </Row>
            <RCF tag="enabled" component={Checkbox} type="checkbox" />
            <RCF tag="commissioned" component={Checkbox} type="checkbox" disabled />
            <RCF tag="listening" component={Checkbox} type="checkbox" />
            <RCF tag="transformationId" i18nTag="transformationPipeline" component={Select} dataOptions={[noValue].concat(transformationPipelines)} required />
          </form>
        </TitleManager>
      </Pane>
    </HasCommand>
  );
};


ChannelForm.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
  }),
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  form: PropTypes.object,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  values: PropTypes.object,
};


export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  validate,
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: { setFieldData, ...arrayMutators }
})(ChannelForm);

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import arrayMutators from 'final-form-arrays';
import { HasCommand, Button, LoadingPane, Pane, PaneFooter, checkScope } from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';
import { isEqual } from 'lodash';
import setFieldData from 'final-form-set-field-data'; // XXX do we need this?
import ErrorMessage from '../../components/ErrorMessage';
import HarvestableFormGeneral from './HarvestableFormGeneral';
import HarvestableFormOaiPmh from './HarvestableFormOaiPmh';
import HarvestableFormXmlBulk from './HarvestableFormXmlBulk';
import HarvestableFormConnector from './HarvestableFormConnector';
import HarvestableFormStatus from './HarvestableFormStatus';


const specificSections = {
  oaiPmh: HarvestableFormOaiPmh,
  xmlBulk: HarvestableFormXmlBulk,
  connector: HarvestableFormConnector,
  status: HarvestableFormStatus,
};


const handleKeyCommand = (handler, { disabled } = {}) => {
  return (e) => {
    if (e) e.preventDefault();
    if (!disabled) handler();
  };
};


function validate(values) {
  const errors = {};
  const requiredTextMessage = <FormattedMessage id="ui-inventory-import.fillIn" />;
  const requiredSelectMessage = <FormattedMessage id="ui-inventory-import.selectToContinue" />;

  if (!values.name) {
    errors.name = requiredTextMessage;
  }
  if (!values.transformation?.id) {
    errors.transformation = { id: requiredSelectMessage };
  }
  if (!values.storage?.id) {
    errors.storage = { id: requiredSelectMessage };
  }

  try {
    if (values.json && values.json !== '') JSON.parse(values.json);
  } catch (e) {
    errors.json = <FormattedMessage id="ui-inventory-import.invalidJSON" values={{ error: e.toString() }} />;
  }

  // console.log('validate:', errors);
  return errors;
}


const HarvestableForm = (props) => {
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
            id="clickable-update-harvestable"
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
  const type = values.type;
  const ErrorSection = () => <ErrorMessage message={`Unknown type '${type}'`} />;
  const SpecificSection = specificSections[type] || ErrorSection;

  // XXX We probably don't need to pass most of these
  const sectionProps = { data, handlers, mutators, values };

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
        appIcon={<AppIcon app="harvester-admin" />}
        centerContent
        defaultWidth="60%"
        footer={renderPaneFooter()}
        id="pane-harvestable-form"
        paneTitle={title}
        dismissible
        onClose={handlers.onClose}
      >
        <TitleManager record={title}>
          <form id="form-course">
            {type !== 'status' && <HarvestableFormGeneral {...sectionProps} />}
            <SpecificSection {...sectionProps} />
          </form>
        </TitleManager>
      </Pane>
    </HasCommand>
  );
};


HarvestableForm.propTypes = {
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
})(HarvestableForm);

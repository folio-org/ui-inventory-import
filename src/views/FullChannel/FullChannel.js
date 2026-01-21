import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { CalloutContext, IfPermission, useStripes } from '@folio/stripes/core';
import { Loading, Pane, Accordion, Button, Icon, ConfirmationModal } from '@folio/stripes/components';
import viewLogTranslationTag from '../../util/viewLogTranslationTag';
import ErrorMessage from '../../components/ErrorMessage';
import GeneralSection from './GeneralSection';
import OaiPmhSection from './OaiPmhSection';
import XmlBulkSection from './XmlBulkSection';
import ConnectorSection from './ConnectorSection';
import StatusSection from './StatusSection';
import HeaderSection from './HeaderSection';
import packageInfo from '../../../package';


const specificSections = {
  oaiPmh: OaiPmhSection,
  xmlBulk: XmlBulkSection,
  connector: ConnectorSection,
  status: StatusSection,
};


const FullChannelContent = ({ rec }) => {
  const intl = useIntl();
  const stripes = useStripes();
  const type = rec.type;
  const ErrorSection = () => <ErrorMessage message={`Unknown type '${type}'`} />;
  const SpecificSection = specificSections[type] || ErrorSection;

  // eslint-disable-next-line react/prop-types
  rec.__jobClass = intl.formatMessage({ id: `ui-inventory-import.channels.field.jobClass.${rec.type}` });

  return (
    <>
      {type !== 'status' && <HeaderSection rec={rec} />}
      {type !== 'status' && <GeneralSection rec={rec} />}
      <SpecificSection rec={rec} />

      {stripes.config.showDevInfo &&
        <Accordion
          id="harvestable-section-devinfo"
          label={<FormattedMessage id="ui-inventory-import.accordion.devinfo" />}
          closedByDefault
        >
          <pre>
            {JSON.stringify(rec, null, 2)}
          </pre>
        </Accordion>
      }
    </>
  );
};


FullChannelContent.propTypes = {
  rec: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
};


const FullChannel = ({ defaultWidth, resources, mutator, match, deleteRecord }) => {
  const [deleting, setDeleting] = useState(false);
  const callout = useContext(CalloutContext);

  const resource = resources.harvestable;
  if (!resource.hasLoaded) return <Loading />;
  const rec = resource.records[0];

  const returnToList = () => mutator.query.update({ _path: `${packageInfo.stripes.route}/channels` });

  function maybeDeleteRecord(e) {
    e.stopPropagation();
    setDeleting(true);
  }

  function actuallyDeleteRecord() {
    deleteRecord().then(() => {
      returnToList();
      setDeleting(false);
      callout.sendCallout({
        message: (
          <FormattedMessage
            id="ui-inventory-import.op.delete.completed"
            values={{
              name: rec.name,
              b: text => <b>{text}</b>,
            }}
          />
        ),
      });
    });
  }

  function controlJob(op) {
    mutator[op].PUT({}).then(() => {
      callout.sendCallout({
        message: (
          <FormattedMessage
            id={`ui-inventory-import.op.${op}.completed`}
            values={{
              name: rec.name,
              b: text => <b>{text}</b>,
            }}
          />
        ),
      });
    }).catch((res) => {
      res.text().then((error) => {
        callout.sendCallout({
          type: 'error',
          message: (
            <FormattedMessage
              id={`ui-inventory-import.op.${op}.error`}
              values={{
                name: rec.name,
                error: error.toString(),
                b: text => <b>{text}</b>,
              }}
            />
          ),
        });
      });
    });
  }

  const actionMenu = ({ onToggle }) => {
    return (
      <>
        <IfPermission perm="harvester-admin.harvestables.item.put">
          <Button
            buttonStyle="dropdownItem"
            data-test-actions-menu-edit
            id="clickable-edit-harvestable"
            onClick={() => {
              mutator.query.update({ _path: `${packageInfo.stripes.route}/channels/${match.params.recId}/edit` });
            }}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-inventory-import.button.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="harvester-admin.harvestables.item.delete">
          <Button
            buttonStyle="dropdownItem"
            data-test-actions-menu-delete
            id="clickable-delete-harvestable"
            onClick={e => maybeDeleteRecord(e)}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-inventory-import.button.delete" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="harvester-admin.run-jobs">
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            id="clickable-start-job"
            onClick={() => { onToggle(); controlJob('run'); }}
          >
            <Icon icon="play">
              <FormattedMessage id="ui-inventory-import.button.start-job" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="harvester-admin.stop-jobs">
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            id="clickable-stop-job"
            onClick={() => { onToggle(); controlJob('stop'); }}
          >
            <Icon icon="times-circle-solid">
              <FormattedMessage id="ui-inventory-import.button.stop-job" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="harvester-admin.harvestables.log.get">
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            id="clickable-view-log"
            onClick={() => {
              mutator.query.update({ _path: `${packageInfo.stripes.route}/channels/${match.params.recId}/logs` });
            }}
          >
            <Icon icon="report">
              <FormattedMessage id={viewLogTranslationTag(rec)} />
            </Icon>
          </Button>
          <Button
            buttonStyle="dropdownItem"
            marginBottom0
            id="clickable-jobs"
            onClick={() => {
              mutator.query.update({ _path: `${packageInfo.stripes.route}/channels/${match.params.recId}/jobs` });
            }}
          >
            <Icon icon="list">
              <FormattedMessage id="ui-inventory-import.button.old-jobs" />
            </Icon>
          </Button>
        </IfPermission>
      </>
    );
  };

  return (
    <Pane
      dismissible
      onClose={returnToList}
      defaultWidth={defaultWidth}
      paneTitle={resource.records[0]?.name}
      actionMenu={actionMenu}
    >
      <FullChannelContent rec={rec} />
      {deleting &&
        <ConfirmationModal
          open
          heading={<FormattedMessage id="ui-inventory-import.op.delete.confirm" />}
          message={rec.name}
          confirmLabel={<FormattedMessage id="ui-inventory-import.button.confirm" />}
          onConfirm={() => actuallyDeleteRecord()}
          onCancel={() => setDeleting(false)}
        />
      }
    </Pane>
  );
};


FullChannel.propTypes = {
  defaultWidth: PropTypes.string,
  resources: PropTypes.shape({
    harvestable: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      records: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    query: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    run: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }).isRequired,
    stop: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
};

export default FullChannel;

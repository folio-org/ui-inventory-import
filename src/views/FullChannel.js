import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CalloutContext, IfPermission, useStripes } from '@folio/stripes/core';
import { Loading, Pane, Row, Accordion, Button, Icon, ConfirmationModal } from '@folio/stripes/components';
import { RCKV, CKV } from '../components/CKV';
import packageInfo from '../../package';


const FullChannel = ({ defaultWidth, resources, mutator, match, deleteRecord }) => {
  const [deleting, setDeleting] = useState(false);
  const stripes = useStripes();
  const callout = useContext(CalloutContext);

  const resource = resources.channel;
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

  /*
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
  */

  const actionMenu = ({ _onToggle }) => {
    return (
      <>
        <IfPermission perm="inventory-update.import.channels.item.put">
          <Button
            buttonStyle="dropdownItem"
            data-test-actions-menu-edit
            id="clickable-edit-channel"
            onClick={() => {
              mutator.query.update({ _path: `${packageInfo.stripes.route}/channels/${match.params.recId}/edit` });
            }}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-inventory-import.button.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="inventory-update.import.channels.item.delete">
          <Button
            buttonStyle="dropdownItem"
            data-test-actions-menu-delete
            id="clickable-delete-channel"
            onClick={e => maybeDeleteRecord(e)}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-inventory-import.button.delete" />
            </Icon>
          </Button>
        </IfPermission>
        {/*
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
        */}
      </>
    );
  };

  return (
    <Pane
      dismissible
      onClose={returnToList}
      defaultWidth={defaultWidth}
      paneTitle={rec.name}
      actionMenu={actionMenu}
    >
      <RCKV rec={rec} tag="type" xs={4} />
      <Row>
        <CKV rec={rec} tag="id" xs={4} />
        <CKV rec={rec} tag="tag" xs={2} />
        <CKV rec={rec} tag="name" xs={6} />
      </Row>
      <Row>
        <CKV rec={rec} tag="enabled" xs={4} />
      </Row>
      <Row>
        <CKV rec={rec} tag="commissioned" xs={4} />
      </Row>
      <Row>
        <CKV rec={rec} tag="listening" xs={4} />
      </Row>
      <RCKV rec={resources.transformationPipeline} tag="records[0].name" i18nTag="transformationPipeline" />
      {stripes.config.showDevInfo &&
        <Accordion
          id="channel-section-devinfo"
          label={<FormattedMessage id="ui-inventory-import.accordion.devinfo" />}
          closedByDefault
        >
          <pre>
            {JSON.stringify(rec, null, 2)}
          </pre>
        </Accordion>
      }
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
    channel: PropTypes.shape({
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

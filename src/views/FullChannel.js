import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { CalloutContext, IfPermission, useStripes, useOkapiKy } from '@folio/stripes/core';
import { Loading, Pane, Row, Accordion, Button, Icon, ConfirmationModal, Modal } from '@folio/stripes/components';
import { FileUploader } from '@folio/stripes-data-transfer-components';
import { RCKV, CKV } from '../components/CKV';


const onDrop = (acceptedFiles, recId, channelName, okapiKy, callout, setUploading) => {
  acceptedFiles.forEach((file) => {
    const reader = new FileReader();
    reader.onabort = (x) => console.error('file reading was aborted:', x); // eslint-disable-line no-console
    reader.onerror = (x) => console.error('file reading has failed:', x); // eslint-disable-line no-console
    reader.onload = async () => {
      const binaryString = reader.result;

      const url = `inventory-import/channels/${recId}/upload?filename=${file.name}`;
      const res = await okapiKy.post(url, {
        body: binaryString,
        throwHttpErrors: false
      });

      if (res.ok) {
        callout.sendCallout({
          message: <FormattedMessage
            id="ui-inventory-import.upload.success"
            values={{
              fileName: file.name,
              channelName,
            }}
          />
        });
      } else {
        callout.sendCallout({
          type: 'error',
          timeout: 0,
          message: <FormattedMessage
            id="ui-inventory-import.upload.failure"
            values={{
              fileName: file.name,
              channelName,
              status: res.status,
              statusText: res.statusText,
              body: await res.text(),
            }}
          />
        });
      }
    };
    reader.readAsText(file);
  });

  setUploading(false);
};


const FullChannel = ({ defaultWidth, resources, mutator, match, deleteRecord }) => {
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const stripes = useStripes();
  const callout = useContext(CalloutContext);
  const okapiKy = useOkapiKy();

  const resource = resources.channel;
  if (!resource.hasLoaded) return <Loading />;
  const rec = resource.records[0];

  const returnToList = () => {
    const currentPath = match.url;
    const newPath = currentPath.replace(/^(.*)\/.+/, '$1');
    mutator.query.update({ _path: `${newPath}` });
  };

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

  const actionMenu = ({ _onToggle }) => {
    if (!stripes.hasPerm('inventory-update.import.channels.item.put') &&
        !stripes.hasPerm('inventory-update.import.channels.item.delete') &&
        !stripes.hasPerm('inventory-update.import.upload.post')) {
      // If there are no entries in the menu, don't render an empty one
      return null;
    }

    return (
      <>
        <IfPermission perm="inventory-update.import.channels.item.put">
          <Button
            buttonStyle="dropdownItem"
            data-test-actions-menu-edit
            id="clickable-edit-channel"
            onClick={() => {
              mutator.query.update({ _path: `${match.params.recId}/edit` });
            }}
          >
            <Icon icon="edit">
              <FormattedMessage id="stripes-core.button.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="inventory-update.import.channels.item.delete">
          <Button
            data-test-delete-channel-button
            buttonStyle="dropdownItem"
            data-test-actions-menu-delete
            id="clickable-delete-channel"
            onClick={e => maybeDeleteRecord(e)}
          >
            <Icon icon="trash">
              <FormattedMessage id="stripes-core.button.delete" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="inventory-update.import.upload.post">
          <Button
            data-test-upload-button
            buttonStyle="dropdownItem"
            data-test-actions-menu-update
            id="clickable-upload"
            onClick={e => { e.stopPropagation(); setUploading(true); }}
          >
            <Icon icon="arrow-up">
              <FormattedMessage id="ui-inventory-import.button.upload" />
            </Icon>
          </Button>
        </IfPermission>
      </>
    );
  };

  const renderUploadModal = () => {
    return (
      <Modal
        open
        dismissible
        onClose={() => setUploading(false)}
        label={<FormattedMessage id="ui-inventory-import.upload.label" />}
        footer={<Button onClick={() => setUploading(false)}><FormattedMessage id="stripes-components.cancel" /></Button>}
      >
        <FileUploader
          title={<FormattedMessage id="ui-inventory-import.upload.title" />}
          uploadButtonText="XXX or pick a file"
          isDropZoneActive
          onDrop={(acceptedFiles) => onDrop(acceptedFiles, match.params.recId, rec.name, okapiKy, callout, setUploading)}
        />
      </Modal>
    );
  };

  return (
    <Pane
      data-test-full-channel-pane
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
      <Row>
        <CKV rec={rec} tag="queuedFiles" xs={4} />
        <CKV rec={rec} tag="fileInProcess" xs={8} />
      </Row>
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
          confirmLabel={<FormattedMessage id="stripes-core.button.confirm" />}
          onConfirm={() => actuallyDeleteRecord()}
          onCancel={() => setDeleting(false)}
        />
      }
      {uploading && renderUploadModal()}
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
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      recId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  deleteRecord: PropTypes.func.isRequired,
};

export default FullChannel;
export { onDrop }; // For testing

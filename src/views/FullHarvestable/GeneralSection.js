import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row, Col, KeyValue } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const GeneralSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-general"
    label={<FormattedMessage id="ui-inventory-import.harvestables.heading.general" />}
  >
    <Row>
      <CKV rec={rec} tag="id" xs={2} />
      <CKV rec={rec} tag="name" xs={6} />
      <CKV rec={rec} tag="serviceProvider" xs={4} />
    </Row>
    <Row>
      <CKV rec={rec} tag="usedBy" xs={6} />
      <CKV rec={rec} tag="managedBy" xs={6} />
    </Row>
    <RCKV rec={rec} tag="openAccess" />
    <RCKV rec={rec} tag="description" />
    <Row>
      <CKV rec={rec} tag="technicalNotes" xs={6} />
      <CKV rec={rec} tag="contactNotes" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="enabled" xs={4} />
      <CKV rec={rec} tag="scheduleString" xs={8} />
    </Row>
    <RCKV rec={rec} tag="transformation.name" i18nTag="transformationPipeline" />
    <RCKV rec={rec} tag="laxParsing" />
    <RCKV rec={rec} tag="encoding" />
    <RCKV rec={rec} tag="storage.name" />
    <RCKV rec={rec} tag="storageBatchLimit" />
    <Row>
      <CKV rec={rec} tag="cacheEnabled" xs={6} />
      <CKV rec={rec} tag="storeOriginal" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="recordLimit" xs={6} />
      <CKV rec={rec} tag="timeout" xs={6} />
    </Row>
    <RCKV rec={rec} tag="logLevel" />
    <RCKV rec={rec} tag="failedRecordsLogging" />
    <Row>
      <CKV rec={rec} tag="maxSavedFailedRecordsPerRun" xs={6} />
      <CKV rec={rec} tag="maxSavedFailedRecordsTotal" xs={6} />
    </Row>
    <RCKV rec={rec} tag="mailAddress" />
    <RCKV rec={rec} tag="mailLevel" />
    <RCKV rec={rec} tag="constantFields" />
    <Row>
      <Col xs={12}>
        <KeyValue
          label={<FormattedMessage id="ui-inventory-import.harvestables.field.json" />}
          value={<pre>{JSON.stringify(rec.json, null, 2)}</pre>}
        />
      </Col>
    </Row>
  </Accordion>
);

GeneralSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default GeneralSection;

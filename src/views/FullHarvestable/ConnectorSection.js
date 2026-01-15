import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const ConnectorSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-connector"
    label={<FormattedMessage id="ui-inventory-import.harvestables.field.type.connector" />}
  >
    <RCKV rec={rec} tag="connectorEngineUrlSetting.label" />
    <RCKV rec={rec} tag="engineParameters" />
    <RCKV rec={rec} tag="connectorRepoUrlSetting.label" />
    <RCKV rec={rec} tag="connector" />
    <RCKV rec={rec} tag="overwrite" />
    <Row>
      <CKV rec={rec} tag="username" i18nTag="connuser" xs={6} />
      <CKV rec={rec} tag="password" xs={6} />
    </Row>
    <RCKV rec={rec} tag="proxy" />
    <RCKV rec={rec} tag="initData" />
    <Row>
      <CKV rec={rec} tag="fromDate" xs={6} />
      <CKV rec={rec} tag="untilDate" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="resumptionToken" i18nTag="startToken" xs={6} />
      <CKV rec={rec} tag="sleep" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="retryCount" i18nTag="failedRetryCount" xs={6} />
      <CKV rec={rec} tag="allowErrors" xs={6} />
    </Row>
  </Accordion>
);

ConnectorSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default ConnectorSection;

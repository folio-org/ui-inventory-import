import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const OaiPmhSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-oai"
    label={<FormattedMessage id="ui-inventory-import.channels.field.type.oaiPmh" />}
  >
    <RCKV rec={rec} tag="url" />
    <Row>
      <CKV rec={rec} tag="oaiSetName" xs={6} />
      <CKV rec={rec} tag="metadataPrefix" xs={6} />
    </Row>
    <RCKV rec={rec} tag="dateFormat" />
    <Row>
      <CKV rec={rec} tag="fromDate" xs={6} />
      <CKV rec={rec} tag="untilDate" xs={6} />
    </Row>
    <RCKV rec={rec} tag="resumptionToken" />
    <RCKV rec={rec} tag="clearRtOnError" />
    <RCKV rec={rec} tag="keepPartial" />
    <Row>
      <CKV rec={rec} tag="retryCount" xs={6} />
      <CKV rec={rec} tag="retryWait" xs={6} />
    </Row>
  </Accordion>
);

OaiPmhSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default OaiPmhSection;

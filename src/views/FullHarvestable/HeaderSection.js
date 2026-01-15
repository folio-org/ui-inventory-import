import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const HeaderSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-general"
    label={<FormattedMessage id="ui-inventory-import.harvestables.heading.status" />}
  >
    <Row>
      <CKV rec={rec} tag="__jobClass" i18nTag="jobClass" xs={4} />
      <CKV rec={rec} tag="currentStatus" xs={4} />
      <CKV rec={rec} tag="lastUpdated" xs={4} />
    </Row>
    <Row>
      <CKV rec={rec} tag="initiallyHarvested" xs={4} />
      <CKV rec={rec} tag="lastHarvestStarted" xs={4} />
      <CKV rec={rec} tag="lastHarvestFinished" xs={4} />
    </Row>
    <RCKV rec={rec} tag="message" />
  </Accordion>
);

HeaderSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default HeaderSection;

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const StatusSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-status"
    label={<FormattedMessage id="ui-inventory-import.channels.field.type.status" />}
  >
    <Row>
      <CKV rec={rec} tag="id" xs={2} />
      <CKV rec={rec} tag="name" xs={4} />
      <CKV rec={rec} tag="__jobClass" i18nTag="jobClass" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="enabled" i18nTag="statusJobEnabled" xs={4} />
      <CKV rec={rec} tag="scheduleString" xs={8} />
    </Row>
    <RCKV rec={rec} tag="usedBy" i18nTag="usageTags" />
    <RCKV rec={rec} tag="managedBy" i18nTag="adminTags" />
    <RCKV rec={rec} tag="mailAddress" i18nTag="customMailAddresses" />
  </Accordion>
);

StatusSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default StatusSection;

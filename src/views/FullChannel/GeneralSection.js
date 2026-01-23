import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row, Col, KeyValue } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const GeneralSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-general"
    label={<FormattedMessage id="ui-inventory-import.channels.heading.general" />}
  >
    <Row>
      <CKV rec={rec} tag="id" xs={2} />
      <CKV rec={rec} tag="name" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="enabled" xs={4} />
    </Row>
    {/* XXX we want to look this up by name */}
    <RCKV rec={rec} tag="transformationId" i18nTag="transformationPipeline" />
  </Accordion>
);

GeneralSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default GeneralSection;

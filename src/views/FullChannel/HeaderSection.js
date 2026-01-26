import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const HeaderSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-general"
    label={<FormattedMessage id="ui-inventory-import.channels.heading.status" />}
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
    {/* XXX we want to look this up by name */}
    <RCKV rec={rec} tag="transformationId" i18nTag="transformationPipeline" />
  </Accordion>
);

HeaderSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default HeaderSection;

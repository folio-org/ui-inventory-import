import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const HeaderSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-general"
    label={<FormattedMessage id="ui-inventory-import.channels.heading.status" />}
  >
    <RCKV rec={rec} tag="type" i18nTag="jobClass" xs={4} />
  </Accordion>
);

HeaderSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default HeaderSection;

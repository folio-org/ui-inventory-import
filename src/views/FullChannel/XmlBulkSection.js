import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row } from '@folio/stripes/components';
import { RCKV, CKV } from '../../components/CKV';

const XmlBulkSection = ({ rec }) => (
  <Accordion
    id="harvestable-section-xml"
    label={<FormattedMessage id="ui-inventory-import.channels.field.type.xmlBulk" />}
  >
  </Accordion>
);

XmlBulkSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default XmlBulkSection;

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
    <RCKV rec={rec} tag="url" i18nTag="urls" />
    <RCKV rec={rec} tag="allowErrors" />
    <RCKV rec={rec} tag="overwrite" />
    <Row>
      <CKV rec={rec} tag="allowCondReq" xs={6} />
      <CKV rec={rec} tag="fromDate" i18nTag="initialFromDate" xs={6} />
    </Row>
    <Row>
      <CKV rec={rec} tag="splitAt" xs={6} />
      <CKV rec={rec} tag="splitSize" xs={6} />
    </Row>
    <RCKV rec={rec} tag="expectedSchema" />
    <RCKV rec={rec} tag="outputSchema" />
    <RCKV rec={rec} tag="recurse" />
    <Row>
      <CKV rec={rec} tag="includeFilePattern" xs={6} />
      <CKV rec={rec} tag="excludeFilePattern" xs={6} />
    </Row>
    <RCKV rec={rec} tag="passiveMode" />
    <RCKV rec={rec} tag="csvConfiguration" />
  </Accordion>
);

XmlBulkSection.propTypes = {
  rec: PropTypes.object.isRequired,
};

export default XmlBulkSection;

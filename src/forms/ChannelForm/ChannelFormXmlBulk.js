import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row, Checkbox, Datepicker, Select } from '@folio/stripes/components';
import { RCF, RCLF, CF } from '../../components/CF';

const outputSchemas = [
  { value: '', label: '[N/A]' },
  { value: 'application/marc', label: 'MARCXML standard' },
  { value: 'application/tmarc', label: 'TurboMARC' },
];

const ChannelFormXmlBulk = () => (
  <Accordion
    id="harvestable-form-xml"
    label={<FormattedMessage id="ui-inventory-import.channels.field.type.xmlBulk" />}
  >
    <RCLF tag="url" i18nTag="urls" />
    <RCF tag="allowErrors" component={Checkbox} type="checkbox" />
    <RCF tag="overwrite" component={Checkbox} type="checkbox" />
    <Row>
      <CF tag="allowCondReq" xs={6} component={Checkbox} type="checkbox" />
      <CF tag="fromDate" xs={6} i18nTag="initialFromDate" component={Datepicker} />
    </Row>
    <Row>
      <CF tag="splitAt" xs={6} type="number" />
      <CF tag="splitSize" xs={6} type="number" />
    </Row>
    <RCF tag="expectedSchema" />
    <RCF tag="outputSchema" component={Select} dataOptions={outputSchemas} />
    <RCF tag="recurse" component={Checkbox} type="checkbox" />
    <Row>
      <CF tag="includeFilePattern" xs={6} />
      <CF tag="excludeFilePattern" xs={6} />
    </Row>
    <RCF tag="passiveMode" component={Checkbox} type="checkbox" />
    <RCF tag="csvConfiguration" />
  </Accordion>
);

export default ChannelFormXmlBulk;

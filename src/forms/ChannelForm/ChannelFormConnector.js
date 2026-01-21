import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Row, Checkbox, Datepicker, TextArea } from '@folio/stripes/components';
import { RCF, CF } from '../../components/CF';

const ChannelFormConnector = () => (
  <Accordion
    id="harvestable-form-connector"
    label={<FormattedMessage id="ui-inventory-import.channels.field.type.connector" />}
  >
    <RCF tag="connectorEngineUrlSetting.label" />
    <RCF tag="engineParameters" />
    <RCF tag="connectorRepoUrlSetting.label" />
    <RCF tag="connector" />
    <RCF tag="overwrite" helpTag="overwrite-connector" component={Checkbox} type="checkbox" />
    <Row>
      <CF tag="username" xs={6} i18nTag="connuser" />
      <CF tag="password" xs={6} />
    </Row>
    <RCF tag="proxy" />
    <RCF tag="initData" component={TextArea} rows="4" />
    <Row>
      <CF tag="fromDate" component={Datepicker} xs={6} />
      <CF tag="untilDate" component={Datepicker} xs={6} />
    </Row>
    <Row>
      <CF tag="resumptionToken" xs={6} i18nTag="startToken" />
      <CF tag="sleep" xs={6} type="number" />
    </Row>
    <Row>
      <CF tag="retryCount" xs={6} i18nTag="failedRetryCount" type="number" />
      <CF tag="allowErrors" xs={6} component={Checkbox} type="checkbox" />
    </Row>
  </Accordion>
);

export default ChannelFormConnector;

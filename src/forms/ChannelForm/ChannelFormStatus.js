import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Checkbox, Row } from '@folio/stripes/components';
import { CF, RCLF } from '../../components/CF';

const HarvestableFormStatus = () => (
  <Accordion
    id="harvestable-form-status"
    label={<FormattedMessage id="ui-inventory-import.harvestables.field.type.status" />}
  >
    <Row>
      <CF tag="id" xs={2} disabled />
      <CF xs={4} tag="name" />
    </Row>
    <Row>
      <CF tag="enabled" i18nTag="statusJobEnabled" component={Checkbox} type="checkbox" xs={4} />
      <CF tag="scheduleString" xs={8} />
    </Row>
    <RCLF tag="usedBy" i18nTag="usageTags" />
    <RCLF tag="managedBy" i18nTag="adminTags" />
    <RCLF tag="mailAddress" i18nTag="customMailAddresses" />
  </Accordion>
);

export default HarvestableFormStatus;

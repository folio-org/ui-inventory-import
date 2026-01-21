import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import OaiPmh from '@indexdata/oai-pmh';
import { Accordion, Row, Checkbox, Datepicker, Select } from '@folio/stripes/components';
import { RCF, CF } from '../../components/CF';

const HarvestableFormOaiPmh = ({ values }) => {
  const [oaiPmh, setOaiPmh] = useState();
  const [sets, setSets] = useState();
  const [prefixes, setPrefixes] = useState();

  useEffect(() => {
    const newOaiPmh = new OaiPmh(values.url);
    // I think using this can never work without proxying via the FOLIO service, because of CORS
    console.log(`Made OaiPmh object ${newOaiPmh} but not using it`); // eslint-disable-line no-console
    setOaiPmh(undefined);
  }, [values.url]);

  useEffect(() => {
    if (!oaiPmh) return;

    async function fetchSets() {
      let data;
      try {
        data = await oaiPmh.listSets();
      } catch (err) {
        // It would be nice to do something cleverer here
        // eslint-disable-next-line no-console
        console.error('OAI-PMH oops!', err);
        return;
      }
      setSets(data.ListSets[0].set.map(x => ({
        value: x.setSpec[0],
        label: `${x.setName} (${x.setSpec[0]})`,
      })));
    }

    async function fetchPrefixes() {
      let data;
      try {
        data = await oaiPmh.listMetadataFormats();
      } catch (err) {
        // It would be nice to do something cleverer here
        // eslint-disable-next-line no-console
        console.error('OAI-PMH oops!', err);
        return;
      }
      setPrefixes(data.ListMetadataFormats[0].metadataFormat.map(x => ({
        value: x.metadataPrefix,
        label: x.metadataPrefix,
      })));
    }

    fetchSets();
    fetchPrefixes();
  }, [oaiPmh]);

  return (
    <Accordion
      id="harvestable-form-oai"
      label={<FormattedMessage id="ui-inventory-import.harvestables.field.type.oaiPmh" />}
    >
      <RCF tag="url" />
      <Row>
        <CF tag="oaiSetName" xs={6} component={Select} dataOptions={sets} />
        <CF tag="metadataPrefix" xs={6} component={Select} dataOptions={prefixes} />
      </Row>
      <RCF tag="dateFormat" i18nTag="useLongDateFormat" component={Checkbox} type="checkbox" />
      <Row>
        <CF tag="fromDate" xs={6} component={Datepicker} />
        <CF tag="untilDate" xs={6} component={Datepicker} />
      </Row>
      <RCF tag="resumptionToken" />
      <RCF tag="clearRtOnError" component={Checkbox} type="checkbox" />
      <RCF tag="keepPartial" component={Checkbox} type="checkbox" />
      <Row>
        <CF tag="retryCount" xs={6} />
        <CF tag="retryWait" xs={6} />
      </Row>
    </Accordion>
  );
};

HarvestableFormOaiPmh.propTypes = {
  values: PropTypes.shape({
    url: PropTypes.string,
  }).isRequired,
};

export default HarvestableFormOaiPmh;

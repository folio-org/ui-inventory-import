import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Col, Row, KeyValue, Accordion } from '@folio/stripes/components';
import { bool2display } from './transformBooleans';


function censorPasswords(val) {
  if (Array.isArray(val)) {
    return val.map(x => censorPasswords(x));
  } else if (typeof val === 'object') {
    const censored = {};
    Object.keys(val).forEach(key => {
      if (typeof val[key] === 'string' &&
          (key.match(/^(pw|pass)/i) ||
           key.match(/(pw|password)$/i))) {
        censored[key] = '***censored***';
      } else {
        censored[key] = censorPasswords(val[key]);
      }
    });
    return censored;
  }

  return val;
}


const StorageDetail = (props) => {
  const stripes = useStripes();
  const data = props.initialValues;

  let jval;
  try {
    jval = JSON.parse(data.json);
  } catch (e) {
    jval = '[unparseable JSON]';
  }
  const censoredJson = censorPasswords(jval);

  return (
    <>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.storage.field.name" />}
            value={data.name}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.storage.field.description" />}
            value={data.description}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.storage.field.enabled" />}
            value={bool2display(data.enabled)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <KeyValue
            label={<FormattedMessage id="ui-inventory-import.storage.field.url" />}
            value={data.url}
          />
        </Col>
      </Row>
      {data.type === 'inventoryStorage' &&
        <Row>
          <Col xs={12}>
            <KeyValue
              label={<FormattedMessage id="ui-inventory-import.storage.field.json" />}
              value={JSON.stringify(censoredJson, null, 2)}
            />
          </Col>
        </Row>
      }

      {stripes.config.showDevInfo &&
        <Accordion
          id="storage-devinfo"
          label={<FormattedMessage id="ui-inventory-import.accordion.devinfo" />}
          closedByDefault
        >
          <pre>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Accordion>
      }
    </>
  );
};


StorageDetail.propTypes = {
  initialValues: PropTypes.shape({
    id: PropTypes.string.isRequired,
    // See https://github.com/indexdata/mod-harvester-admin/blob/master/src/main/resources/openapi/schemas/storage.json
    // No properties seem to be mandatory
    // ESLint's dumb proptypes-checking thinks all fields are in initialValues, not resources.storage.record
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    url: PropTypes.string,
    type: PropTypes.string,
    json: PropTypes.string,
    // Not used:
    // acl: string (readonly)
    // bulksize: string (deprecated)
    // currentStatus: string
    // customClass: string
  }).isRequired,
};


export default StorageDetail;

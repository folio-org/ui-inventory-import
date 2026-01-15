import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import { Row, Col, KeyValue } from '@folio/stripes/components';

export const CKV = ({ rec, tag, i18nTag, xs }) => (
  <Col xs={xs}>
    <KeyValue label={<FormattedMessage id={`ui-inventory-import.harvestables.field.${i18nTag || tag}`} />} value={get(rec, tag)} />
  </Col>
);

CKV.propTypes = {
  rec: PropTypes.object.isRequired,
  tag: PropTypes.string.isRequired,
  i18nTag: PropTypes.string, // if defined, use this translation tag instead of `tag`
  xs: PropTypes.number.isRequired,
};

export const RCKV = (props) => (
  <Row>
    <CKV {...props} xs={12} />
  </Row>
);

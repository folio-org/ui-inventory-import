import React from 'react';
import { Accordion, FilterAccordionHeader, TextField } from '@folio/stripes/components';
import { deparseFilters } from '@folio/stripes/smart-components';


function renderSingleNumericFilter(intl, filterStruct, updateQuery, field, boundary) {
  const keyString = `${field}_${boundary}`;
  const rawValue = filterStruct[keyString]?.[0];
  const value = !rawValue ? '' : rawValue.replace(/^.*[<>]=/, '');

  return (
    <TextField
      label={intl.formatMessage({ id: `ui-inventory-import.filter.numeric.${field}.${boundary}` })}
      value={value}
      onChange={(e) => {
        const thisValue = e.target.value;
        const fs2 = { ...filterStruct };
        if (thisValue !== '') {
          fs2[keyString] = [thisValue];
        } else {
          delete fs2[keyString];
        }
        updateQuery({ filters: deparseFilters(fs2) });
      }}
    />
  );
}


function renderNumericFilterPair(intl, filterStruct, updateQuery, field, openByDefault) {
  return (
    <Accordion
      label={intl.formatMessage({ id: `ui-inventory-import.filter.numeric.${field}` })}
      header={FilterAccordionHeader}
      closedByDefault={!openByDefault}
    >
      {renderSingleNumericFilter(intl, filterStruct, updateQuery, field, 'from')}
      {renderSingleNumericFilter(intl, filterStruct, updateQuery, field, 'to')}
    </Accordion>
  );
}


export default renderNumericFilterPair;

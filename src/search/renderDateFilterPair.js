import React from 'react';
import { omit } from 'lodash';
import { Accordion, FilterAccordionHeader, Datepicker } from '@folio/stripes/components';
import { deparseFilters } from '@folio/stripes/smart-components';


// Ways in which this is currently deficient:
//      * When the search pane is narrow, I want the Datepicker to render across into the search-results pane. I had hoped that `usePortal` prop would do this, but it does not.
//
function renderSingleDateFilter(intl, filterStruct, updateQuery, field, boundary) {
  const keyString = `${field}_${boundary}`;
  const rawValue = filterStruct[keyString]?.[0];
  const value = !rawValue ? '' : rawValue.replace(/.*[<>]=/, '');

  return (
    <Datepicker
      label={intl.formatMessage({ id: `ui-inventory-import.filter.date.${field}.${boundary}` })}
      backendDateStandard="YYYY-MM-DD"
      value={value}
      onChange={(e) => {
        const isoDateTime = e.target.value;
        const fs2 = (!isoDateTime) ?
          omit(filterStruct, keyString) :
          { ...filterStruct, [keyString]: [e.target.value] };

        updateQuery({ filters: deparseFilters(fs2) });
      }}
      useInput
      usePortal
      placement="right"
    />
  );
}


function renderDateFilterPair(intl, filterStruct, updateQuery, field, openByDefault) {
  return (
    <Accordion
      label={intl.formatMessage({ id: `ui-inventory-import.filter.date.${field}` })}
      header={FilterAccordionHeader}
      closedByDefault={!openByDefault}
    >
      {renderSingleDateFilter(intl, filterStruct, updateQuery, field, 'from')}
      {renderSingleDateFilter(intl, filterStruct, updateQuery, field, 'to')}
    </Accordion>
  );
}


export default renderDateFilterPair;

import React from 'react';
import { Select } from '@folio/stripes/components';
import { MultiSelectionFilter, deparseFilters } from '@folio/stripes/smart-components';


const NO_VALUE = 'NO';


function renderFilter(intl, filterStruct, updateQuery, page, field, optionTags, isMulti) {
  // The filter's label is the same as the index name used in the
  // search-field dropdown (`PAGE.index.FIELD`), but the option values
  // re-use those displayed in the results list (`PAGE.column.FIELD.VALUE`)
  const indexTag = `${page}.index.${field}`;
  const valueTag = `${page}.column.${field}`;

  const dataOptions = optionTags.map(tag => ({
    value: tag,
    label: intl.formatMessage({ id: `ui-inventory-import.${valueTag}.${tag}` }),
  }));

  if (isMulti) {
    return (
      <MultiSelectionFilter
        id={`filter.${indexTag}`}
        name={`multifilter-${field}`}
        label={intl.formatMessage({ id: `ui-inventory-import.${indexTag}` })}
        dataOptions={dataOptions}
        selectedValues={filterStruct[field] || []}
        onChange={(group) => {
          const fs2 = { ...filterStruct, [field]: group.values };
          updateQuery({ filters: deparseFilters(fs2) });
        }}
      />
    );
  }

  return (
    <Select
      id={`filter.${indexTag}`}
      label={intl.formatMessage({ id: `ui-inventory-import.${indexTag}` })}
      dataOptions={[
        { value: NO_VALUE, label: intl.formatMessage({ id: 'ui-inventory-import.no-value' }) },
        ...dataOptions
      ]}
      value={filterStruct[field] ? filterStruct[field][0] : ''}
      onChange={(e) => {
        const val = e.target.value;
        const fs2 = { ...filterStruct };
        delete fs2[field];
        if (val !== NO_VALUE) fs2[field] = [val];
        updateQuery({ filters: deparseFilters(fs2) });
      }}
    />
  );
}


export default renderFilter;

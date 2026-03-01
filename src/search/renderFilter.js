import React from 'react';
import { Select } from '@folio/stripes/components';
import { MultiSelectionFilter, deparseFilters } from '@folio/stripes/smart-components';


const NO_VALUE = 'NO';


function renderFilter(intl, filterStruct, updateQuery, qualifiedField, optionTags, isMulti) {
  // `qualifiedField` may be simply the fieldname, provided that the
  // translations for that field are in `channels.column.FIELD`. If
  // they are elsewhere, `qualifiedField` takes the form `FIELD/TAG`
  // where TAG is the translation-tag path to the relevant field's
  // translations. See JobsSearchPane.js for examples.
  const match = qualifiedField.match(/^(.*)\/(.*)$/);
  const field = match ? match[1] : qualifiedField;
  const transTag = match ? match[2] : `channels.column.${field}`;
  // console.log(`qualifiedField='${qualifiedField}' => field '${field}', transTag '${transTag}'`);

  const dataOptions = optionTags.map(tag => ({
    value: tag,
    label: intl.formatMessage({ id: `ui-inventory-import.${transTag}.${tag}` }),
  }));

  if (isMulti) {
    return (
      <MultiSelectionFilter
        name={`multifilter-${field}`}
        label={intl.formatMessage({ id: `ui-inventory-import.${transTag}` })}
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
      label={intl.formatMessage({ id: `ui-inventory-import.${transTag}` })}
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

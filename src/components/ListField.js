import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { TextField, Label, IconButton, Button } from '@folio/stripes/components';
import css from './ListField.css';


const ListField = ({ name, label, renderEntry, component, emptyValue }) => {
  return (
    <>
      {label && <Label>{label}</Label>}
      <FieldArray name={name}>
        {({ fields }) => (
          <>
            {fields.map((subname, index) => (
              <div key={index} className={css.row}>
                <div className={css.field}>
                  {renderEntry ?
                    renderEntry(subname) :
                    <Field name={subname} component={component || TextField} />
                  }
                </div>
                <div>
                  <IconButton icon="arrow-up" disabled={index === 0} onClick={() => fields.swap(index - 1, index)} />
                  <IconButton icon="arrow-down" disabled={index === fields.length - 1} onClick={() => fields.swap(index, index + 1)} />
                  <IconButton icon="trash" onClick={() => fields.remove(index)} />
                </div>
              </div>
            ))}
            <Button onClick={() => fields.push(emptyValue || '')}>
              <FormattedMessage id="ui-inventory-import.add" />
            </Button>
          </>
        )}
      </FieldArray>
    </>
  );
};

ListField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.object,
  renderEntry: PropTypes.func,
  component: PropTypes.string, // definitely wrong
  emptyValue: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export default ListField;

import React from 'react';
import css from '../views/Styles.css';

function errors2react(errors) {
  return (
    <ul className={css.noDot}>
      {
        errors.map(error => (
          <li>
            <code>{error.code}</code>
            &nbsp;
            ({error.message})
          </li>
        ))
      }
    </ul>
  );
}

function errors2string(errors) {
  return (
    errors.map(error => {
      const message = error.error?.message;
      const errorList = message?.errors;
      const mm = message?.message;

      if (errorList) {
        return errorList.map(x => x.message).join(' / ');
      } else if (mm) {
        return mm;
      } else if (error.error?.message) {
        return error.error?.message;
      } else {
        return error.error?.label;
      }
    }).join(' // ')
  );
}

export { errors2react, errors2string };

import React from 'react';
import css from '../views/Styles.css';

function errors2react(errors = []) {
  return (
    <ul className={css.noDot}>
      {
        errors
          .map((error, i) => ({ ...error, indexHiddenFromSonar: i }))
          .map((error) => (
            <li key={`${error.code}-${error.indexHiddenFromSonar}`}>
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
  return errors.map(error => error.code + ': ' + error.message).join(' // ');
}

export { errors2react, errors2string };

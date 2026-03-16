import React from 'react';
import css from '../views/Styles.css';

function errors2react(errors = []) {
  return (
    <ul className={css.noDot}>
      {
        errors.map((error, i) => (
          <li key={`${error.code}-${i}`}>
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

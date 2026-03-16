import React from 'react';
import { IntlProvider } from 'react-intl';
// eslint-disable-next-line import/no-extraneous-dependencies
import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import localTranslations from '../../../translations/ui-inventory-import/en';

const translationSets = [
  {
    prefix: 'ui-inventory-import',
    translations: localTranslations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
];


function withIntlConfiguration(children) {
  const allTranslations = {};

  translationSets.forEach((set) => {
    const { prefix, translations } = set;
    Object.keys(translations).forEach(key => {
      allTranslations[`${prefix}.${key}`] = translations[key];
    });
  });

  return (
    <IntlProvider locale="en-US" messages={allTranslations}>
      {children}
    </IntlProvider>
  );
}


export default withIntlConfiguration;

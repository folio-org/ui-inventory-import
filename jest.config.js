// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

const config = require('@folio/jest-config-stripes');
// This can have an existing array value or be undefined
const coveragePathIgnorePatterns = config.coveragePathIgnorePatterns || [];
// We omit this code from coverage metrics, as it's not part of the application
coveragePathIgnorePatterns.push('/src/smart-components/lib/EntryManager/');

module.exports = {
  ...config,
  setupFiles: [
    ...config.setupFiles,
    path.join(__dirname, './test/jest/setupFiles.js'),
  ],
  coveragePathIgnorePatterns,
};


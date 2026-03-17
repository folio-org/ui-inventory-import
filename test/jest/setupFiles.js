import './__mock__';

// The version of Node used in CI seems to lack Intl.DurationFormat
global.Intl.DurationFormat = class {
  format() {
    return 'mocked duration';
  }
};

import './__mock__';

/*
import { TextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
*/

// jest.mock('../../src/util/downloadCSV', () => jest.fn());

// The version of Node used in CI seems to lack Intl.DurationFormat
global.Intl.DurationFormat = class {
  format() {
    return 'mocked duration';
  }
};

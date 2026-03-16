import { errors2string } from './summarizeErrors';

const singleError = `[
  {
    "code": "jakarta.validation.constraints.NotNull.message",
    "type": "1",
    "message": "must not be null",
    "parameters": [
      {
        "key": "instances[0].series[].value",
        "value": "null"
      }
    ]
  }
]`;

const multipleErrors = `[
  {
    "code": "jakarta.validation.constraints.NotNull.message",
    "type": "1",
    "message": "must not be null",
    "parameters": [
      {
        "key": "instances[0].series[].value",
        "value": "null"
      }
    ]
  },
  {
    "code": "jakarta.validation.constraints.Pattern.message",
    "type": "1",
    "message": "must match \\"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$\\"",
    "parameters": [
      {
        "key": "instances[0].notes[1].instanceNoteTypeId",
        "value": "Restrictions on Access note"
      }
    ]
  }
]`;

test('summarizes single error', () => {
  const errorsData = JSON.parse(singleError);
  expect(errors2string(errorsData)).toBe('jakarta.validation.constraints.NotNull.message: must not be null');
});

test('summarizes multiple errors', () => {
  const errorsData = JSON.parse(multipleErrors);
  expect(errors2string(errorsData)).toBe('jakarta.validation.constraints.NotNull.message: must not be null // jakarta.validation.constraints.Pattern.message: must match "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$"');
});




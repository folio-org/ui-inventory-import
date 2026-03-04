import parseSort from './parseSort';

const errorFromMessage = `[
  {
    "error": {
      "label": "Error encountered during upsert of Inventory record set",
      "message": "ERROR: Cannot update record c352fe11-51e2-4e8b-87d6-578d6dedec8b because it has been changed (optimistic locking): Stored _version is 4, _version of request is 1 (23F09)"
    }
  }
]`;

const errorFromLabel = `[
  {
    "error": {
      "label": "Error encountered during upsert of Inventory record set"
    }
  }
]`;


describe('parse various sort-specifications', () => {
  test('parse empty sort', () => {
    const parsed = parseSort();
    expect(parsed).toStrictEqual([]);
  });

  test('parse title sort', () => {
    const parsed = parseSort('title');
    expect(parsed).toStrictEqual([{ key: 'title', descending: false }]);
  });

  test('parse reverse title sort', () => {
    const parsed = parseSort('-title');
    expect(parsed).toStrictEqual([{ key: 'title', descending: true }]);
  });

  test('parse reverse author,title sort', () => {
    const parsed = parseSort('author,title');
    expect(parsed).toStrictEqual([{ key: 'author', descending: false }, { key: 'title', descending: false }]);
  });

  test('parse complex sort', () => {
    const parsed = parseSort('author,-title,date,-publisher');
    expect(parsed).toStrictEqual([
      { key: 'author', descending: false },
      { key: 'title', descending: true },
      { key: 'date', descending: false },
      { key: 'publisher', descending: true },
    ]);
  });
});

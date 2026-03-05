import parseSort from './parseSort';

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

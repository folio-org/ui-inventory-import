import compileXML from './compileXML';

describe('compileXML', () => {
  test('returns parsed XML document for valid XML', () => {
    const validXML = `<root><child>value</child></root>`;

    const [parsedDoc, error] = compileXML(validXML);

    expect(parsedDoc).toBeDefined();
    expect(error).toBeUndefined();
    expect(parsedDoc.querySelector('child').textContent).toBe('value');
  });

  test('returns error message for invalid XML', () => {
    const invalidXML = `<root><child></root>`; // malformed XML

    const [parsedDoc, error] = compileXML(invalidXML);

    expect(parsedDoc).toBeUndefined();
    expect(error).toBeDefined();
    expect(typeof error).toBe('string');
    expect(error.length).toBeGreaterThan(0);

    // Ensure the Location part is stripped out
    expect(error).not.toMatch(/Location: https?:/);
  });

  test('handles empty string input', () => {
    const [parsedDoc, error] = compileXML('');

    expect(parsedDoc).toBeUndefined();
    expect(error).toBeDefined();
  });
});

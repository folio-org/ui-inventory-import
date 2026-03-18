import { compileXSLT, NO_TEXT, BAD_XML, BAD_XSLT, GOOD_XSLT } from './compileXSLT';

describe('compileXSLT', () => {
  let mockImportStylesheet;
  let mockProcessorInstance;

  beforeEach(() => {
    mockImportStylesheet = jest.fn();
    mockProcessorInstance = {
      importStylesheet: mockImportStylesheet,
    };

    global.XSLTProcessor = jest.fn(() => mockProcessorInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns NO_TEXT when input is undefined', () => {
    expect(compileXSLT(undefined)).toEqual([NO_TEXT]);
  });

  test('returns NO_TEXT when input is empty string', () => {
    expect(compileXSLT('')).toEqual([NO_TEXT]);
  });

  test('returns BAD_XML for malformed XML', () => {
    const badXML = '<root><unclosed></root>';

    const result = compileXSLT(badXML);

    expect(result[0]).toBe(BAD_XML);
    expect(typeof result[1]).toBe('string'); // error message from compileXML
  });

  test('returns BAD_XSLT for valid XML that is not XSLT', () => {
    const validXMLNotXSLT = `<root><child/></root>`;

    mockImportStylesheet.mockImplementation(() => {
      throw new Error('Not a stylesheet');
    });

    const result = compileXSLT(validXMLNotXSLT);

    expect(result).toEqual([BAD_XSLT]);
    expect(mockImportStylesheet).toHaveBeenCalled();
  });

  test('returns GOOD_XSLT for valid XSLT stylesheet', () => {
    const validXSLT = `
      <xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:template match="/">
          <output>Hello</output>
        </xsl:template>
      </xsl:stylesheet>
    `;

    const result = compileXSLT(validXSLT);

    expect(result[0]).toBe(GOOD_XSLT);
    expect(result[1]).toBe(mockProcessorInstance);
    expect(mockImportStylesheet).toHaveBeenCalled();
  });
});

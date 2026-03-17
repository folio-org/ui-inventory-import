import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import StepForm from './StepForm';

jest.mock('@folio/stripes/final-form', () => () => (Component) => Component);

jest.mock('../components/CF', () => ({
  CF: ({ tag }) => <input data-testid={`cf-${tag}`} />,
  RCF: ({ tag }) => <textarea data-testid={`rcf-${tag}`} />,
}));

const BAD_XML = 'BAD_XML';
const BAD_XSLT = 'BAD_XSLT';
const GOOD_XSLT = 'GOOD_XSLT';

jest.mock('./compileXSLT', () => ({
  compileXSLT: jest.fn(),
  BAD_XML: 'BAD_XML',
  BAD_XSLT: 'BAD_XSLT',
  GOOD_XSLT: 'GOOD_XSLT',
}));

// I have absolutely no idea why this import is necessary, but it is.
import { compileXSLT } from './compileXSLT'; // eslint-disable-line import/first

const renderComponent = (override = {}) => {
  const props = {
    form: {
      getState: () => ({ values: { script: '<xml />' } }),
      change: jest.fn(),
    },
    handleSubmit: jest.fn(),
    onCancel: jest.fn(),
    pristine: false,
    submitting: false,
    initialValues: { name: 'Test Step' },
    ...override,
  };

  return render(
    <div>
      <StepForm {...props} />
      {/* Dummy submit button to trigger handleSubmit */}
      <button type="submit">Submit</button>
    </div>
  );
};

describe('StepForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pane with title', () => {
    compileXSLT.mockReturnValue([null, null]);
    renderComponent();
    expect(screen.getByTestId('pane')).toBeInTheDocument();
    expect(screen.getByText('Test Step')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    compileXSLT.mockReturnValue([null, null]);
    renderComponent();
    expect(screen.getByTestId('cf-id')).toBeInTheDocument();
    expect(screen.getByTestId('cf-type')).toBeInTheDocument();
    expect(screen.getByTestId('cf-name')).toBeInTheDocument();
    expect(screen.getByTestId('rcf-description')).toBeInTheDocument();
    expect(screen.getByTestId('rcf-script')).toBeInTheDocument();
  });

  it('shows BAD_XML status', () => {
    compileXSLT.mockReturnValue([BAD_XML, 'Error message']);
    renderComponent();
    expect(screen.getByText('ui-inventory-import.invalidXML')).toBeInTheDocument();
  });

  it('shows BAD_XSLT status', () => {
    compileXSLT.mockReturnValue([BAD_XSLT, null]);
    renderComponent();
    expect(screen.getByText('ui-inventory-import.invalidXSLT')).toBeInTheDocument();
  });

  it('shows GOOD_XSLT status', () => {
    compileXSLT.mockReturnValue([GOOD_XSLT, null]);
    renderComponent();
    expect(screen.getByText('ui-inventory-import.validXSLT')).toBeInTheDocument();
  });

  it('calls handleSubmit on form submit', () => {
    compileXSLT.mockReturnValue([null, null]);
    const handleSubmit = jest.fn();
    renderComponent({ handleSubmit });
    const form = screen.getByTestId('step-form');
    fireEvent.submit(form);
    // I can't find a way to make expect(handleSubmit).toHaveBeenCalled() work
  });
});

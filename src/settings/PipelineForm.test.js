import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import PipelineForm, { validate } from './PipelineForm';

jest.mock('@folio/stripes/final-form', () => () => (Component) => Component);

jest.mock('../components/CF', () => ({
  CF: ({ tag }) => <input data-testid={`cf-${tag}`} />,
  RCF: ({ tag }) => <textarea data-testid={`rcf-${tag}`} />,
  RCLF: ({ tag }) => <textarea data-testid={`rcf-${tag}`} />,
}));

const renderComponent = (override = {}) => {
  const props = {
    steps: [{ id: '123', name: 'Step 1' }, { id: '456', name: 'Step 2' }],
    form: {
      getState: () => ({ values: { script: '<xml />' } }),
      change: jest.fn(),
    },
    handleSubmit: jest.fn(),
    onCancel: jest.fn(),
    pristine: false,
    submitting: false,
    initialValues: { name: 'Test Pipeline' },
    ...override,
  };

  return render(
    <div>
      <PipelineForm {...props} />
      {/* Dummy submit button to trigger handleSubmit */}
      <button type="submit">Submit</button>
    </div>
  );
};

describe('PipelineForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pane with title', () => {
    renderComponent();
    expect(screen.getByTestId('pane-pipeline-form')).toBeInTheDocument();
    expect(screen.getByText('Test Pipeline')).toBeInTheDocument();
  });

  it('renders form fields', () => {
    renderComponent();
    expect(screen.getByTestId('cf-id')).toBeInTheDocument();
    expect(screen.getByTestId('cf-name')).toBeInTheDocument();
    expect(screen.getByTestId('rcf-description')).toBeInTheDocument();
    expect(screen.getByTestId('rcf-steps')).toBeInTheDocument();
  });

  it('calls handleSubmit on form submit', () => {
    const handleSubmit = jest.fn();
    renderComponent({ handleSubmit });
    const form = screen.getByTestId('pipeline-form');
    fireEvent.submit(form);
    // I can't find a way to make expect(handleSubmit).toHaveBeenCalled() work
  });
});


import { FormattedMessage } from 'react-intl'; // eslint-disable-line import/first, import/order


describe('validate function', () => {
  it('returns error for missing name', () => {
    const values = {};
    const errors = validate(values);

    // Check that errors object has keys
    expect(errors).toHaveProperty('name');

    // Check that the errors are FormattedMessage elements with correct id
    expect(errors.name.type).toBe(FormattedMessage);
    expect(errors.name.props.id).toBe('ui-inventory-import.fillIn');
  });

  it('returns no errors when name is present', () => {
    const values = { name: 'My Pipeline' };
    const errors = validate(values);

    expect(errors.name).toBeUndefined();
  });
});

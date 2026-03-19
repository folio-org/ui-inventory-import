import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import ListField from './ListField';

jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }) => <span>{id}</span>,
}));

jest.mock('react-final-form', () => ({
  Field: ({ name }) => <input data-testid={`field-${name}`} />,
}));

// Mock stripes components
jest.mock('@folio/stripes/components', () => ({
  TextField: () => <input data-testid="text-field" />,
  Label: ({ children }) => <span>{children}</span>,
  IconButton: ({ icon, onClick, disabled }) => (
    <button
      type="button"
      data-testid={`icon-${icon}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </button>
  ),
  Button: ({ children, onClick }) => (
    <button type="button" onClick={onClick}>{children}</button>
  ),
}));

// Mock FieldArray
const mockValues = [{ id: '123', name: 'Item 1' }, { id: '456', name: 'Item 2' }];
const mockFields = {
  value: mockValues,
  length: mockValues.length,
  map: jest.fn((callback) => mockValues.map((_, i) => callback(`items[${i}]`, i))),
  push: jest.fn(),
  remove: jest.fn(),
  swap: jest.fn(),
};

jest.mock('react-final-form-arrays', () => ({
  FieldArray: ({ children }) => {
    return children({ fields: mockFields });
  },
}));

describe('ListField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders label when provided', () => {
    render(<ListField name="items" label={<div>My Label</div>} />);
    expect(screen.getByText('My Label')).toBeInTheDocument();
  });

  it('renders fields for each item', () => {
    render(<ListField name="items" />);
    expect(screen.getByTestId('field-items[0]')).toBeInTheDocument();
    expect(screen.getByTestId('field-items[1]')).toBeInTheDocument();
  });

  it('calls push when add button is clicked', () => {
    render(<ListField name="items" emptyValue="new" />);
    fireEvent.click(screen.getByText('ui-inventory-import.add'));
    expect(mockFields.push).toHaveBeenCalledWith('new');
  });

  it('calls remove when trash icon is clicked', () => {
    render(<ListField name="items" />);
    const trashButtons = screen.getAllByTestId('icon-trash');
    fireEvent.click(trashButtons[0]);
    expect(mockFields.remove).toHaveBeenCalledWith(0);
  });

  it('calls swap when arrow buttons are clicked', () => {
    render(<ListField name="items" />);
    const upButtons = screen.getAllByTestId('icon-arrow-up');
    const downButtons = screen.getAllByTestId('icon-arrow-down');
    fireEvent.click(downButtons[0]);
    expect(mockFields.swap).toHaveBeenCalledWith(0, 1);
    fireEvent.click(upButtons[1]);
    expect(mockFields.swap).toHaveBeenCalledWith(0, 1);
  });

  it('uses renderEntry when provided', () => {
    const renderEntry = jest.fn((name) => (
      <div data-testid={`custom-${name}`} />
    ));

    render(<ListField name="items" renderEntry={renderEntry} />);
    expect(renderEntry).toHaveBeenCalledWith('items[0]');
    expect(renderEntry).toHaveBeenCalledWith('items[1]');
    expect(screen.getByTestId('custom-items[0]')).toBeInTheDocument();
  });
});

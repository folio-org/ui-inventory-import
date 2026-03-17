import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';
import StepDetail from './StepDetail';

// Mock stripes
jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
}));

const renderComponent = (props = {}, stripesConfig = {}) => {
  useStripes.mockReturnValue({
    config: {
      showDevInfo: false,
      ...stripesConfig,
    },
  });

  const defaultProps = {
    initialValues: {
      name: 'Test Step',
      description: 'Test Description',
      type: 'script',
      script: 'console.log("hello");',
    },
  };

  return render(
    <StepDetail
      {...defaultProps}
      {...props}
    />
  );
};

describe('StepDetail', () => {
  describe('basic rendering', () => {
    it('renders all key values', () => {
      renderComponent();
      expect(screen.getByText('Test Step')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('script')).toBeInTheDocument();
      expect(screen.getByText('console.log("hello");')).toBeInTheDocument();
    });

    it('renders labels via FormattedMessage', () => {
      renderComponent();
      expect(screen.getByText('ui-inventory-import.step.field.name')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory-import.step.field.description')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory-import.step.field.type')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory-import.step.field.script')).toBeInTheDocument();
    });
  });

  describe('dev info accordion', () => {
    it('does not render accordion when showDevInfo is false', () => {
      renderComponent({}, { showDevInfo: false });
      expect(
        screen.queryByText('ui-inventory-import.accordion.devinfo')
      ).not.toBeInTheDocument();
    });

    it('renders accordion when showDevInfo is true', () => {
      renderComponent({}, { showDevInfo: true });
      expect(
        screen.getByText('ui-inventory-import.accordion.devinfo')
      ).toBeInTheDocument();
    });

    it('renders JSON data inside accordion when enabled', () => {
      renderComponent({}, { showDevInfo: true });
      expect(screen.getByText(/"name": "Test Step"/)).toBeInTheDocument();
      expect(screen.getByText(/"type": "script"/)).toBeInTheDocument();
      expect(screen.getByText(/"script": "console\.log/)).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders without optional fields', () => {
      renderComponent({
        initialValues: {
          name: 'Only Name',
          type: 'minimal',
        },
      });
      expect(screen.getByText('Only Name')).toBeInTheDocument();
      expect(screen.getByText('minimal')).toBeInTheDocument();
    });
  });
});

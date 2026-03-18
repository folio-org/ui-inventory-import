import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useStripes } from '@folio/stripes/core';
import PipelineDetail from './PipelineDetail';

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
      name: 'Test Pipeline',
      description: 'Test Description',
      steps: [{ id: '123', name: 'Step 1' }, { id: '456', name: 'Step 2' }],
    },
  };

  return render(
    <BrowserRouter>
      <PipelineDetail
        {...defaultProps}
        {...props}
      />
    </BrowserRouter>
  );
};

describe('PipelineDetail', () => {
  describe('basic rendering', () => {
    it('renders all key values', () => {
      renderComponent();
      expect(screen.getByText('Test Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    it('renders labels via FormattedMessage', () => {
      renderComponent();
      expect(screen.getByText('ui-inventory-import.pipeline.field.name')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory-import.pipeline.field.description')).toBeInTheDocument();
      expect(screen.getByText('ui-inventory-import.settings.step')).toBeInTheDocument();
    });
  });

  describe('dev info accordion', () => {
    it('does not render accordion when showDevInfo is false', () => {
      renderComponent({}, { showDevInfo: false });
      expect(screen.queryByText('ui-inventory-import.accordion.devinfo')).not.toBeInTheDocument();
    });

    it('renders accordion when showDevInfo is true', () => {
      renderComponent({}, { showDevInfo: true });
      expect(screen.getByText('ui-inventory-import.accordion.devinfo')).toBeInTheDocument();
    });

    it('renders JSON data inside accordion when enabled', () => {
      renderComponent({}, { showDevInfo: true });
      expect(screen.getByText(/"name": "Test Pipeline"/)).toBeInTheDocument();
      expect(screen.getByText(/"description": "Test Description"/)).toBeInTheDocument();
      expect(screen.getByText(/"id": "123"/)).toBeInTheDocument();
      expect(screen.getByText(/"name": "Step 2"/)).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import StepSettings from './StepSettings';

jest.mock('../smart-components', () => ({
  EntryManager: jest.fn(({ paneTitle, entryList }) => (
    <div data-testid="entry-manager">
      <div data-testid="pane-title">{paneTitle}</div>
      <div data-testid="entry-list">
        {entryList?.map((item, i) => (
          <div key={i}>{item.name}</div>
        ))}
      </div>
    </div>
  )),
}));

// Mock injectIntl
const mockIntl = {
  formatMessage: ({ id }) => id,
};

const renderComponent = (overrides = {}) => {
  const props = {
    resources: {
      entries: {
        records: [{ name: 'Step 1' }, { name: 'Step 2' }],
      },
    },
    mutator: {
      entries: {
        POST: jest.fn(),
        PUT: jest.fn(),
        DELETE: jest.fn(),
      },
    },
    intl: mockIntl,
    ...overrides,
  };

  return render(<BrowserRouter><StepSettings {...props} /></BrowserRouter>);
};

describe('StepSettings', () => {
  it('renders EntryManager with correct pane title', () => {
    renderComponent();

    expect(screen.getByTestId('pane-title')).toHaveTextContent(
      'ui-inventory-import.settings.step'
    );
  });

  it('passes entry list to EntryManager', () => {
    renderComponent();

    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
  });

  it('handles empty records safely', () => {
    renderComponent({
      resources: {
        entries: {
          records: [],
        },
      },
    });

    expect(screen.getByTestId('entry-list')).toBeEmptyDOMElement();
  });

  it('handles missing records safely', () => {
    renderComponent({
      resources: {},
    });

    expect(screen.getByTestId('entry-list')).toBeEmptyDOMElement();
  });
});

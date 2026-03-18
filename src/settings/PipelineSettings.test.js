import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import PipelineSettings from './PipelineSettings';

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

const renderComponent = (overrides = {}) => {
  const props = {
    resources: {
      entries: {
        records: [{ name: 'Pipeline 1' }, { name: 'Pipeline 2' }],
      },
      steps: {
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
    intl: {
      formatMessage: ({ id }) => id,
    },
    ...overrides,
  };

  return render(<BrowserRouter><PipelineSettings {...props} /></BrowserRouter>);
};

describe('PipelineSettings', () => {
  it('renders EntryManager with correct pane title', () => {
    renderComponent();

    expect(screen.getByTestId('pane-title')).toHaveTextContent(
      'ui-inventory-import.settings.pipeline'
    );
  });

  it('passes entry list to EntryManager', () => {
    renderComponent();

    expect(screen.getByText('Pipeline 1')).toBeInTheDocument();
    expect(screen.getByText('Pipeline 2')).toBeInTheDocument();
  });

  it('handles empty records safely', () => {
    renderComponent({
      resources: {
        steps: {
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

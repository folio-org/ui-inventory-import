import React from 'react';
import { render } from '@testing-library/react';
import InventoryImportSettings from './index';

// Mock react-intl
jest.mock('react-intl', () => ({
  FormattedMessage: ({ id }) => <span>{id}</span>,
}));

// Mock route components
jest.mock('./PipelineSettings', () => () => <div>PipelineSettings</div>);
jest.mock('./StepSettings', () => () => <div>StepSettings</div>);
jest.mock('../routes/ChannelsRoute', () => () => <div>ChannelsRoute</div>);
jest.mock('../routes/FullChannelRoute', () => () => <div>FullChannelRoute</div>);
jest.mock('../routes/CreateChannelRoute', () => () => <div>CreateChannelRoute</div>);
jest.mock('../routes/EditChannelRoute', () => () => <div>EditChannelRoute</div>);
jest.mock('./LogSettings', () => () => <div>LogSettings</div>);

// Mock Settings component
const mockSettings = jest.fn(() => <div>Settings Component</div>);
jest.mock('@folio/stripes/smart-components', () => ({
  Settings: (props) => {
    mockSettings(props);
    return <div data-testid="settings">Settings Component</div>;
  },
}));

describe('InventoryImportSettings', () => {
  const defaultProps = {
    match: {
      path: '/settings/invimp',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Settings component', () => {
    const { getByTestId } = render(<InventoryImportSettings {...defaultProps} />);
    expect(getByTestId('settings')).toBeInTheDocument();
  });

  it('passes correct pages to Settings', () => {
    render(<InventoryImportSettings {...defaultProps} />);

    const props = mockSettings.mock.calls[0][0];
    expect(props.pages).toHaveLength(4);
    expect(props.pages.map(p => p.route)).toEqual([
      'pipeline',
      'step',
      'channels',
      'logs',
    ]);
  });

  it('passes correct additionalRoutes', () => {
    render(<InventoryImportSettings {...defaultProps} />);

    const props = mockSettings.mock.calls[0][0];
    expect(props.additionalRoutes).toHaveLength(3);
    const paths = props.additionalRoutes.map(route => route.props.path);
    expect(paths).toEqual([
      '/settings/invimp/channels/create/:type',
      '/settings/invimp/channels/:recId',
      '/settings/invimp/channels/:recId/edit',
    ]);
  });

  it('sets correct pane title', () => {
    render(<InventoryImportSettings {...defaultProps} />);
    const props = mockSettings.mock.calls[0][0];
    expect(props.paneTitle.props.id).toBe(
      'ui-inventory-import.meta.title'
    );
  });
});

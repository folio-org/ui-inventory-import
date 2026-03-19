import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import InventoryImportApp from './index';

// Mock child components
jest.mock('./settings', () => () => <div>Settings Page</div>);
jest.mock('./Tabs', () => () => <div>Tabs</div>);
jest.mock('./routes/ChannelsRoute', () => ({ children }) => (
  <div>
    Channels Page
    {children}
  </div>
));
jest.mock('./routes/CreateChannelRoute', () => () => <div>Create Channel</div>);
jest.mock('./routes/FullChannelRoute', () => () => <div>Full Channel</div>);
jest.mock('./routes/EditChannelRoute', () => () => <div>Edit Channel</div>);
jest.mock('./routes/JobsRoute', () => () => <div>Jobs Page</div>);
jest.mock('./routes/FullJobRoute', () => () => <div>Full Job</div>);
jest.mock('./routes/RecordsRoute', () => () => <div>Records Page</div>);
jest.mock('./routes/FullRecordRoute', () => () => <div>Full Record</div>);

const mockStripes = (hasPermValue) => ({
  hasPerm: jest.fn(() => hasPermValue),
});

const renderInventoryImportApp = (actAs, userHasPerm, args) => {
  const route = args?.route || '/import';
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Route path="/import">
        <InventoryImportApp
          actAs={actAs}
          stripes={mockStripes(userHasPerm)}
          match={{ path: '/import' }}
        />,
      </Route>
    </MemoryRouter>
  );
};

describe('InventoryImportApp', () => {
  test('renders Settings when actAs is "settings"', () => {
    renderInventoryImportApp('settings', true);
    expect(screen.getByText('Settings Page')).toBeInTheDocument();
  });

  test('redirects to channels when user has permission', async () => {
    renderInventoryImportApp('app', true);
    // After redirect, Channels route should render
    expect(await screen.findByText('Channels Page')).toBeInTheDocument();
  });

  test('redirects to jobs when user lacks permission', async () => {
    renderInventoryImportApp('app', false);
    expect(await screen.findByText('Jobs Page')).toBeInTheDocument();
  });

  test('renders Tabs and layout', () => {
    renderInventoryImportApp('app', true, { route: '/import/channels' });
    expect(screen.getByText('Tabs')).toBeInTheDocument();
  });

  test('renders nested route (full channel)', async () => {
    renderInventoryImportApp('app', true, { route: '/import/channels/123' });
    expect(await screen.findByText('Full Channel')).toBeInTheDocument();
  });
});

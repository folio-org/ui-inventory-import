import React from 'react';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import Tabs from './Tabs';

jest.mock('@folio/stripes/core', () => ({ useStripes: jest.fn() }));

jest.mock('@folio/stripes/components', () => ({
  Button: ({ children, to, buttonStyle }) => (
    <a href={to} data-style={buttonStyle}>
      {children}
    </a>
  ),
  ButtonGroup: ({ children }) => <div>{children}</div>,
}));

jest.mock('../package', () => ({ stripes: { route: '/inventory-import' } }));

describe('Tabs', () => {
  const mockUseLocation = require('react-router-dom').useLocation; // eslint-disable-line global-require
  const mockUseStripes = require('@folio/stripes/core').useStripes; // eslint-disable-line global-require

  beforeEach(() => { jest.clearAllMocks(); });

  it('renders only permitted segments', () => {
    mockUseLocation.mockReturnValue({ pathname: '/inventory-import/channels' });
    mockUseStripes.mockReturnValue({
      hasPerm: (perm) => (
        perm === 'inventory-update.import.channels.collection.get' ||
          perm === 'inventory-update.import.import-jobs.collection.get'
      )
    });
    render(<Tabs />);

    expect(screen.getByText('ui-inventory-import.nav.channels')).toBeInTheDocument();
    expect(screen.getByText('ui-inventory-import.nav.jobs')).toBeInTheDocument();
    expect(screen.queryByText('ui-inventory-import.nav.records')).not.toBeInTheDocument();
  });

  it('marks the correct tab as selected', () => {
    mockUseLocation.mockReturnValue({ pathname: '/inventory-import/jobs' });
    mockUseStripes.mockReturnValue({ hasPerm: () => true });
    render(<Tabs />);

    const jobsButton = screen.getByText('ui-inventory-import.nav.jobs').closest('a,button');
    expect(jobsButton).toHaveAttribute('data-style', 'primary');
    const channelsButton = screen.getByText('ui-inventory-import.nav.channels').closest('a,button');
    expect(channelsButton).not.toHaveClass('primary');
  });

  it('adds query params to records link', () => {
    mockUseLocation.mockReturnValue({ pathname: '/inventory-import/records' });
    mockUseStripes.mockReturnValue({ hasPerm: () => true });
    render(<Tabs />);

    const recordsButton = screen.getByText('ui-inventory-import.nav.records').closest('a');
    expect(recordsButton.getAttribute('href')).toMatch(/filters=timeStamp_from\./);
  });
});

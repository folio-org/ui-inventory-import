import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import ChannelsRoute from './ChannelsRoute';
import channelsData from '../../test/jest/data/channels';


const renderChannelsRoute = (channelsResource) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <ChannelsRoute
          stripes={{
            logger: {
            },
          }}
          resources={{
            query: {},
            channels: channelsResource,
          }}
          mutator={{
            query: {
              update: () => undefined,
            }
          }}
        >
          <div />
        </ChannelsRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Channels route', () => {
  it('should be rendered with data', async () => {
    const node = renderChannelsRoute({
      failed: false,
      hasLoaded: true,
      records: channelsData,
      other: {
        totalRecords: channelsData.length,
      },
    });
    const { container } = node;
    const content = container.querySelector('[data-test-channels-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in the MCL
    const nameCell = screen.getByText("Felix's test channel #1").closest('[role="gridcell"]');
    expect(nameCell?.nextElementSibling).toHaveTextContent('ui-inventory-import.channels.column.enabled.true');
    expect(nameCell?.nextElementSibling.nextElementSibling).toHaveTextContent('ui-inventory-import.channels.column.type.XML');
  });

  it('should be rendered with an error', async () => {
    const node = renderChannelsRoute({
      failed: { message: 'Error caused by test harness' },
      hasLoaded: true,
      records: [],
    });
    const { container } = node;
    const content = container.querySelector('[data-test-channels-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Error message rendered instead of MCL
    expect(screen.getByText('Error caused by test harness')).toBeVisible();
    expect(screen.queryByText("Felix's test channel #1")).not.toBeInTheDocument();
  });
});

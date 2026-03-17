import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import Channels from './Channels';
import channelsData from '../../test/jest/data/channels';


const renderChannels = (query) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <Channels
          hasLoaded
          data={{ channels: channelsData }}
          query={query}
          updateQuery={(newQuery) => Object.assign(query, newQuery)}
          pageAmount={100}
          onNeedMoreData={() => undefined}
        />
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Channels view', () => {
  const query = {
    qindex: 'name',
    query: 'test',
    filters: 'enabled.true',
    sort: '-name',
  };

  let node;
  beforeEach(() => {
    node = renderChannels(query);
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
    const { container } = node;
    const content = container.querySelector('[data-test-channels-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in the MCL
    const nameCell = screen.getByText("Felix's test channel #1").closest('[role="gridcell"]');
    expect(nameCell?.nextElementSibling).toHaveTextContent('ui-inventory-import.channels.column.enabled.true');
    expect(nameCell?.nextElementSibling.nextElementSibling).toHaveTextContent('ui-inventory-import.channels.column.type.XML');

    // Change selected filters
    expect(query.filters).toBe('enabled.true');
    const selectElement = document.getElementById('filter.channels.column.enabled');
    fireEvent.change(selectElement, { target: { value: 'false' } });
    expect(query.filters).toBe('enabled.false');
  });
});

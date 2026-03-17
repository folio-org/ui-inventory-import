import React from 'react';
import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import LogSettings from './LogSettings';


function renderLogSettings() {
  return render(withIntlConfiguration(
    <Paneset>
      <LogSettings
        label="Log deletion"
      />
    </Paneset>
  ));
}


describe('Log settings', () => {
  let node;
  beforeEach(() => {
    node = renderLogSettings();
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
    const { container } = node;
    const content = container.querySelector('[data-test-log-settings]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // XXX consider how we might mock the network calls to fetch data for the form
  });
});

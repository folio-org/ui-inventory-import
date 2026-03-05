import React from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { cleanup, render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { CalloutContext } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import Jobs from './Jobs';
import jobsData from '../../test/jest/data/jobs';


const renderJobs = () => {
  const callout = {
    sendCallout: (_calloutData) => {
      // console.log('*** sendCallout:', _calloutData.message.props.id);
    }
  };

  const history = createMemoryHistory();

  return render(withIntlConfiguration(
    <CalloutContext.Provider value={callout}>
      <Router history={history}>
        <div style={{ height: 1000 }}>
          <Paneset>
            <Jobs
              hasLoaded
              data={{ jobs: jobsData }}
              query={{
                sort: 'status,-finished',
                filters: 'filters=records_from.10',
                qindex: 'channelName',
              }}
              updateQuery={() => undefined}
              pageAmount={100}
              onNeedMoreData={() => undefined}
            />
          </Paneset>
        </div>
      </Router>
    </CalloutContext.Provider>
  ));
};


describe('Matching Summary page', () => {
  let node;

  beforeEach(() => {
    node = renderJobs();
    // screen.debug(undefined, 100000);
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
    const { container } = node;
    const content = container.querySelector('[data-test-jobs-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in the MCL
    const nameCell = screen.getByText("Felix's test channel #1").closest('[role="gridcell"]');
    expect(nameCell?.nextElementSibling).toHaveTextContent(/INTERRUPTED/);

    // Change selected index
    const selectElement = document.getElementById('input-jobs-search-qindex');
    fireEvent.change(selectElement, { target: { value: 'channelName' } });
    expect(selectElement.value).toBe('channelName');

    // Reset all search-form elements
    const clearElement = document.getElementById('clickable-reset-all');
    fireEvent.click(selectElement);
    // Is there a way to check the outcome?
  });
});

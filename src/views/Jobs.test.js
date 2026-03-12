import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { CalloutContext } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import Jobs from './Jobs';
import jobsData from '../../test/jest/data/jobs';


const renderJobs = (query) => {
  const callout = {
    sendCallout: (_calloutData) => {
      // console.log('*** sendCallout:', _calloutData.message.props.id);
    }
  };

  return render(withIntlConfiguration(
    <CalloutContext.Provider value={callout}>
      <BrowserRouter>
        <Paneset>
          <Jobs
            hasLoaded
            data={{ jobs: jobsData }}
            query={query}
            updateQuery={(newQuery) => Object.assign(query, newQuery)}
            pageAmount={100}
            onNeedMoreData={() => undefined}
          />
        </Paneset>
      </BrowserRouter>
    </CalloutContext.Provider>
  ));
};


describe('Jobs view', () => {
  const query = {
    sort: 'status,-finished',
    filters: 'filters=records_from.10',
    qindex: 'channelName',
  };

  let node;
  beforeEach(() => {
    node = renderJobs(query);
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
    expect(query.qindex).toBe('channelName');
    const selectElement = document.getElementById('input-jobs-search-qindex');
    fireEvent.change(selectElement, { target: { value: 'message' } });
    expect(selectElement.value).toBe('channelName');
    expect(query.qindex).toBe('message');

    // Filter by date started
    const dateStatedAccordion = screen.getByText('ui-inventory-import.filter.date.started');
    expect(dateStatedAccordion).toBeVisible();
    fireEvent.click(dateStatedAccordion);
    const dpButton = document.getElementById('datepicker-toggle-calendar-button-data-datefilter-started-from');
    expect(dpButton).toBeVisible();
    // fireEvent.click(dpButton);
    // ### Now how the heck do we change the date?
    // See Slack discussions at
    //  https://open-libr-foundation.slack.com/archives/C210UCHQ9/p1773248297808169
    //  https://open-libr-foundation.slack.com/archives/C210UCHQ9/p1773316042799349

    // Reset all search-form elements
    const clearElement = document.getElementById('clickable-reset-all');
    fireEvent.click(clearElement);
    expect(query.sort).toBeUndefined();
    expect(query.filters).toBeUndefined();
    expect(query.qindex).toBe('');
  });
});

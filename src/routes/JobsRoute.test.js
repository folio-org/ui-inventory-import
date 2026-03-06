import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import JobsRoute from './JobsRoute';
import jobsData from '../../test/jest/data/jobs';


const renderJobsRoute = () => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <JobsRoute
          hasLoaded
          data={{ jobs: jobsData }}
          query={{}}
          updateQuery={() => undefined}
          pageAmount={100}
          onNeedMoreData={() => undefined}
        />
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Jobs page', () => {
  let node;

  beforeEach(() => {
    node = renderJobsRoute();
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
    fireEvent.click(clearElement);
    // Is there a way to check the outcome?
  });
});

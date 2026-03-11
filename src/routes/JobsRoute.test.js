import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@testing-library/user-event'
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import JobsRoute, { JobsRoute as RawJobsRoute } from './JobsRoute';
import jobsData from '../../test/jest/data/jobs';


const renderJobsRoute = (jobsResource) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <JobsRoute
          stripes={{
            logger: {
            },
          }}
          resources={{
            query: {},
            jobs: jobsResource,
          }}
          mutator={{
            query: {
              update: () => undefined,
            }
          }}
          match={{
            params: {
              recId: undefined,
            }
          }}
        >
          <div />
        </JobsRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Jobs route', () => {
  it('should be rendered with data', async () => {
    const node = renderJobsRoute({
      failed: false,
      hasLoaded: true,
      records: jobsData,
      other: {
        totalRecords: jobsData.length,
      },
    });
    const { container } = node;
    const content = container.querySelector('[data-test-jobs-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in the MCL
    const nameCell = screen.getByText("Felix's test channel #1").closest('[role="gridcell"]');
    expect(nameCell?.nextElementSibling).toHaveTextContent(/INTERRUPTED/);
    expect(container.querySelector('[data-total-count="9"]')).toBeVisible();

    // Search
    const searchBox = document.getElementById('input-jobs-search');
    expect(searchBox).toBeVisible();
    await userEvent.type(searchBox, 'samples');
    expect(searchBox).toHaveValue('samples');
    const searchButton = document.getElementById('clickable-jobs-search');
    expect(searchButton).toBeVisible();
    fireEvent.click(searchButton);
    // In the absence of stripesconnect, and given the internal complexity of SASQ, there is not really anything the test here
    await waitFor(() => {
      expect(container.querySelector('[data-total-count="9"]')).toBeVisible();
    });
  });

  it('should be rendered with an error', async () => {
    const node = renderJobsRoute({
      failed: { message: 'Error provoked by test harness' },
      hasLoaded: false,
      records: [],
    });
    const { container } = node;
    const content = container.querySelector('[data-test-jobs-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Error message rendered instead of MCL
    expect(screen.getByText('Error provoked by test harness')).toBeVisible();
    expect(screen.queryByText("Felix's test channel #1")).not.toBeInTheDocument();
  });
});


describe('should resolve query parameters to query correctly', () => {
  const paramsFn = RawJobsRoute.manifest.jobs.params.query;
  expect(paramsFn).toBeDefined();

  const testCases = [
    {
      name: 'nothing included',
      queryParameters: { qindex: 'channelName' },
      pathComponents: {},
      expected: undefined,
    }, {
      name: 'query provided but recordId omitted',
      queryParameters: { qindex: 'channelName', query: 'samples' },
      pathComponents: {},
      expected: 'channelName="samples"',
    }, {
      name: 'query and recordId provided',
      queryParameters: { qindex: 'channelName', query: 'samples' },
      pathComponents: { recId: '67890' },
      expected: 'channelId==67890 and channelName="samples"',
    }, {
      name: 'filters provided',
      queryParameters: { filters: 'records_from.20,status.DONE,status.INTERRUPTED' },
      pathComponents: {},
      expected: 'amountImported>=20 and status==("DONE" or "INTERRUPTED")',
    }, {
      name: 'date-range specified',
      queryParameters: { filters: 'started_from.2026-03-01,started_to.2026-03-11' },
      pathComponents: {},
      expected: 'started>=2026-03-01T00:00:00 and started<=2026-03-11T23:59:59',
    }
  ];
  const logger = { log: () => undefined };

  for (const { name, queryParameters, pathComponents, expected } of testCases) {
    const resourceValues = { query: queryParameters };
    it(`should make query for ${name}`, () => {
      const res = paramsFn(queryParameters, pathComponents, resourceValues, logger);
      expect(res).toBe(expected);
    });
  }
});

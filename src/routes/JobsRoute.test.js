import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import JobsRoute from './JobsRoute';
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

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import RecordsRoute from './RecordsRoute';
import failedRecordsData from '../../test/jest/data/failedRecords';


const renderRecordsRoute = (failedRecordsResource) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <RecordsRoute
          stripes={{
            logger: {
            },
          }}
          resources={{
            query: {},
            failedRecords: failedRecordsResource,
          }}
          mutator={{
            query: {
              update: () => undefined,
            }
          }}
        >
          <div />
        </RecordsRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Failed records route', () => {
  it('should be rendered with data', async () => {
    const node = renderRecordsRoute({
      failed: false,
      hasLoaded: true,
      records: failedRecordsData,
      other: {
        totalRecords: failedRecordsData.length,
      },
    });
    const { container } = node;
    const content = container.querySelector('[data-test-records-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in the MCL
    const nameCell = screen.getByText('KEIN TITEL, IM CBS PRÜFEN').closest('[role="gridcell"]');
    expect(nameCell?.previousElementSibling).toHaveTextContent(/60623747X/);
  });

  it('should be rendered with an error', async () => {
    const node = renderRecordsRoute({
      failed: { message: 'Error invoked by test harness' },
      hasLoaded: true,
      records: [],
    });
    const { container } = node;
    const content = container.querySelector('[data-test-records-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Error message rendered instead of MCL
    expect(screen.getByText('Error invoked by test harness')).toBeVisible();
    expect(screen.queryByText('KEIN TITEL, IM CBS PRÜFEN')).not.toBeInTheDocument();
  });
});

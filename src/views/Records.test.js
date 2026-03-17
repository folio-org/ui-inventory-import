import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { cleanup, render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import Records from './Records';
import { errors2string } from '../util/summarizeErrors';
import failedRecordsData from '../../test/jest/data/failedRecords';


let exportedRecords;
const mockExportToCsv = jest.fn((records, _options) => {
  exportedRecords = records;
});

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  exportToCsv: (...args) => mockExportToCsv(...args),
}));


// Empirically, this has to be done at the top level, not within the test. No-one knows why
// See https://folio-project.slack.com/archives/C210UCHQ9/p1632425791183300?thread_ts=1632350696.158900&cid=C210UCHQ9
function okapiKy(_path, _options) {
  const httpResponse = {
    json: () => new Promise((resolve2, _reject) => {
      resolve2({
        failedRecords: failedRecordsData,
        totalRecords: failedRecordsData.length,
      });
    }),
  };

  return new Promise((resolve, _reject) => {
    resolve(httpResponse);
  });
}
useOkapiKy.mockReturnValue(okapiKy);


const renderRecords = (query) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <Records
          hasLoaded
          data={{ records: failedRecordsData }}
          resultCount={failedRecordsData.length}
          query={query}
          updateQuery={(newQuery) => Object.assign(query, newQuery)}
          pageAmount={100}
          onNeedMoreData={() => undefined}
        />
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Records view', () => {
  const query = {
    sort: '-timeStamp',
    filters: 'timeStamp_from.2025-02-20,timeStamp_to.2026-02-26'
  };

  let node;
  beforeEach(() => {
    node = renderRecords(query);
  });

  afterEach(cleanup);

  it('should be rendered', async () => {
    const { container } = node;
    const content = container.querySelector('[data-test-records-paneset]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in the MCL
    const nameCell = screen.getByText('KEIN TITEL, IM CBS PRÜFEN').closest('[role="gridcell"]');
    expect(nameCell?.previousElementSibling).toHaveTextContent(/60623747X/);

    // Pull down Actions menu and invoke Export CSV
    const actionsMenu = container.querySelector('[data-pane-header-actions-dropdown]');
    expect(actionsMenu).toBeVisible();
    fireEvent.click(actionsMenu);

    const exportButton = container.querySelector('[data-test-export-csv-button]');
    expect(exportButton).toBeInTheDocument();
    await fireEvent.click(exportButton);

    const transformedFailedRecordsData = failedRecordsData.map(r => ({ ...r, errors: errors2string(r.recordErrors), originalRecord: undefined }));
    await waitFor(() => {
      expect(exportedRecords).toEqual(transformedFailedRecordsData);
    });
  });
});

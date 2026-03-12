import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import FullRecordRoute, { FullRecordRoute as RawFullRecordRoute } from './FullRecordRoute';
import fullRecordData from '../../test/jest/data/failedRecord';


const renderFullRecordRoute = (recordResource) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <FullRecordRoute
          stripes={{
            logger: {
            },
          }}
          resources={{
            query: {},
            failedRecord: recordResource,
          }}
          mutator={{
            query: {
              update: () => undefined,
            },
          }}
          match={{
            params: {
              recId: '12345',
            },
          }}
        >
          <div />
        </FullRecordRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Full failed-record route', () => {
  it('should be rendered with data', async () => {
    const node = renderFullRecordRoute({
      hasLoaded: true,
      records: [fullRecordData],
    });
    // screen.debug();
    const { container } = node;
    const content = container.querySelector('[data-test-full-record-pane]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in display
    for (const [name, value] of [
      ['channelName', 'Channel 2 (Minerva5 samples)'],
      ['sourceFileName', 'Abz_40_Tit.001_20231029_013504.nrm.0001153.xml'],
      ['importJob', 'e1dfaa98-ca0d-4841-93fd-c3f0797e185a'],
      ['timeStamp', '2026-02-19T13:30:35.737+00:00'],
      ['recordNumber', '068870434'],
      ['instanceHrid', '068870434'],
      ['instanceTitle', 'Huldreich Zwinglis Sämtliche Werke / unter Mitw. des Zwingli-Vereins in Zürich hrsg. von Emil Egli, Georg Finsler ... ; Bd. 3'],
    ]) {
      const kvRoot = screen.getByText(`ui-inventory-import.records.field.${name}`).closest('.kvRoot');
      expect(kvRoot.querySelector('[data-test-kv-value]')).toHaveTextContent(value);
    }

    // XXX Check errors
    // XXX Check original record
    // XXX Check transformed record
  });
});

import React from 'react';
import { cleanup, render } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import LogSettings, { getInitialValues, beforeSave } from './LogSettings';


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


describe('getInitialValues', () => {
  it('parses existing settings', () => {
    expect(getInitialValues([{ value: '3 MONTHS' }])).toStrictEqual({ number: '3', unit: 'MONTHS' });
    expect(getInitialValues([{ value: '49 DAYS' }])).toStrictEqual({ number: '49', unit: 'DAYS' });
  });
  it('defaults when there is no setting', () => {
    expect(getInitialValues([])).toStrictEqual({ number: '', unit: '' });
  });
});


describe('beforeSave', () => {
  it('works with no parameters', () => {
    expect(beforeSave({})).toBe('1 MONTHS');
  });
  it('works with number parameter', () => {
    expect(beforeSave({ number: 3 })).toBe('3 MONTHS');
  });
  it('works with unit parameters', () => {
    expect(beforeSave({ unit: 'YEARS' })).toBe('1 YEARS');
  });
  it('works with number and unit parameters', () => {
    expect(beforeSave({ number: 3, unit: 'YEARS' })).toBe('3 YEARS');
  });
});

import React from 'react';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';
import { Button, ButtonGroup } from '@folio/stripes/components';
import packageInfo from '../package';


function SwitchRoute() {
  const location = useLocation();
  const stripes = useStripes();
  const base = packageInfo.stripes.route.replace(/^\//, '');
  const today = new Date();
  const yesterday = new Date(today - 24 * 60 * 60 * 1000);
  const isoString = yesterday.toISOString().substring(0, 10);

  const segments = [{
    name: 'channels',
    perm: 'inventory-update.import.channels.collection.get',
    params: 'sort=name'
  }, {
    name: 'jobs',
    perm: 'inventory-update.import.import-jobs.collection.get',
    params: 'sort=-started'
  }, {
    name: 'records',
    perm: 'inventory-update.import.failed-records.collection.get',
    params: `filters=timeStamp_from.${isoString}`,
  }];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5em' }}>
        <ButtonGroup data-test-navigation>
          {
            segments.filter(({ perm }) => stripes.hasPerm(perm)).map(({ name, params }) => {
              const fullBase = '/' + base + '/';
              let effectiveTab = location.pathname.replace(fullBase, '').replace(/\/.*/, '');
              if (location.pathname.endsWith('/jobs')) effectiveTab = 'jobs';
              const selected = (effectiveTab === name);
              return (
                <Button
                  key={`${name}`}
                  to={`/${base}/${name}${params ? `?${params}` : ''}`}
                  buttonStyle={selected ? 'primary' : 'default'}
                >
                  <FormattedMessage id={`ui-inventory-import.nav.${name}`} />
                </Button>
              );
            })
          }
        </ButtonGroup>
      </div>
    </>
  );
}

export default SwitchRoute;

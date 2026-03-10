import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import FullChannelRoute from './FullChannelRoute';
import fullChannelData from '../../test/jest/data/fullChannel';
import transformationData from '../../test/jest/data/transformation';


const renderFullChannelRoute = (channelResource) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <FullChannelRoute
          stripes={{
            logger: {
            },
          }}
          resources={{
            query: {},
            channel: channelResource,
            transformationPipeline: {
              records: [transformationData],
            }
          }}
          mutator={{
            query: {
              update: () => undefined,
            },
            channel: {
              DELETE: () => undefined,
            },
          }}
          match={{
            params: {
              recId: '12345',
            },
          }}
        >
          <div />
        </FullChannelRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Full channel route', () => {
  it('should be rendered with data', async () => {
    const node = renderFullChannelRoute({
      hasLoaded: true,
      records: [fullChannelData],
    });
    // screen.debug();
    const { container } = node;
    const content = container.querySelector('[data-test-fullchannel-pane]');
    expect(container).toBeVisible();
    expect(content).toBeVisible();

    // Data rendered in display
    const [checked, unchecked] = ['✅', '❌'];
    for (const [name, value] of [
      ['type', 'XML'],
      ['tag', 'minerva5'],
      ['id', 'c71b4d3a-2030-4f71-8b0a-294ec41fad22'],
      ['name', 'Minerva5 samples'],
      ['enabled', checked],
      ['commissioned', unchecked],
      ['listening', checked],
      ['transformationPipeline', 'PICA to FOLIO'],
    ]) {
      const kvRoot = screen.getByText(`ui-inventory-import.channels.field.${name}`).closest('.kvRoot');
      expect(kvRoot.querySelector('[data-test-kv-value]')).toHaveTextContent(value);
    }
  });
});

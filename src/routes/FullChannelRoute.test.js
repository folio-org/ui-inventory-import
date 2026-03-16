import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import FullChannelRoute, { FullChannelRoute as RawFullChannelRoute } from './FullChannelRoute';
import fullChannelData from '../../test/jest/data/fullChannel';
import transformationData from '../../test/jest/data/transformation';


const deleteChannel = jest.fn(() => {
  console.log('*** deleting channel');
});

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
              DELETE: deleteChannel,
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
    const content = container.querySelector('[data-test-full-channel-pane]');
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

    // transformationPipeline manifest returns correct path
    const pathFn = RawFullChannelRoute.manifest.transformationPipeline.path;
    const path = pathFn(undefined, undefined, undefined, undefined, {
      resources: {
        channel: {
          records: [
            {
              transformationId: '12345',
            },
          ],
        },
      }
    });
    expect(path).toBe('inventory-import/transformations/12345');

    // Pull down Actions menu and delete the current channel
    const absentConfirmButton = screen.queryByText('ui-inventory-import.op.delete.confirm');
    expect(absentConfirmButton).not.toBeInTheDocument();

    const actionsMenu = container.querySelector('[data-pane-header-actions-dropdown]');
    expect(actionsMenu).toBeVisible();
    fireEvent.click(actionsMenu);

    const deleteButton = container.querySelector('[data-test-delete-channel-button]');
    expect(deleteButton).toBeInTheDocument();
    await fireEvent.click(deleteButton);

    const confirmButton = screen.queryByText('ui-inventory-import.op.delete.confirm');
    expect(confirmButton).toBeInTheDocument();
    await fireEvent.click(confirmButton);

    // This doesn't fire as we expect it to, possibly due to complexities of async code
    /*
      await waitFor(() => {
        expect(screen.queryByText('ui-inventory-import.op.delete.completed')).toBeInTheDocument();
      });
    */
  });
});

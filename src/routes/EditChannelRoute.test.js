import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@testing-library/user-event';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import EditChannelRoute from './EditChannelRoute';
import fullChannel from '../../test/jest/data/fullChannel';
import transformations from '../../test/jest/data/transformations';


const renderEditChannelRoute = (query, channel) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <EditChannelRoute
          resources={{
            channel: {
              isPending: false,
              records: [channel],
            },
            transformationPipelines: {
              isPending: false,
              records: transformations,
            },
          }}
          mutator={{
            query: {
              update: (newQuery) => Object.assign(query, newQuery)
            },
            channel: {
              PUT: (newChannel) => Object.assign(channel, newChannel)
            },
          }}
          match={{
            params: {
              recId: '98765',
            },
          }}
        >
          <div />
        </EditChannelRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Edit channel route', () => {
  describe('should be rendered', () => {
    const query = {};
    const channel = {};
    beforeEach(() => {
      const node = renderEditChannelRoute(query, channel);
      const { container } = node;
      const content = container.querySelector('[data-test-channel-form-pane]');
      expect(container).toBeVisible();
      expect(content).toBeVisible();
    });

    it('should have a populated pipeline dropdown', async () => {
      expect(screen.getByText('titleOnly')).toBeVisible();
      expect(screen.getByText('PICA to FOLIO')).toBeVisible();
      expect(screen.getByText("Mike's Pipeline")).toBeVisible();
    });

    it('should be able to cancel the form', async () => {
      const cancelButton = screen.getByText('stripes-components.cancel');
      expect(cancelButton).toBeVisible();
      expect(query._path).toBeUndefined();
      fireEvent.click(cancelButton);
      await waitFor(() => {
        expect(query._path).toBe('../98765');
      });
    });
  });
});

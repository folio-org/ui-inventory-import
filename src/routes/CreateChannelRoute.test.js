import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@testing-library/user-event';
import { Paneset } from '@folio/stripes/components';
import withIntlConfiguration from '../../test/jest/util/withIntlConfiguration';
import CreateChannelRoute from './CreateChannelRoute';
import transformations from '../../test/jest/data/transformations';


const renderCreateChannelRoute = (query, channel) => {
  return render(withIntlConfiguration(
    <BrowserRouter>
      <Paneset>
        <CreateChannelRoute
          stripes={{
            logger: {
            },
          }}
          resources={{
            transformationPipelines: {
              isPending: false,
              records: transformations,
            }
          }}
          mutator={{
            query: {
              update: (newQuery) => Object.assign(query, newQuery)
            },
            channels: {
              POST: (newChannel) => Object.assign(channel, newChannel)
            },
          }}
          match={{
            params: {
              type: 'xml',
            },
          }}
        >
          <div />
        </CreateChannelRoute>
      </Paneset>
    </BrowserRouter>
  ));
};


describe('Create channel route', () => {
  describe('should be rendered', () => {
    const query = {};
    const channel = {};
    beforeEach(() => {
      const node = renderCreateChannelRoute(query, channel);
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
        expect(query._path).toBe('../../channels');
      });
    });

    it('should be able to save the form', async () => {
      const tagTextbox = document.getElementById('edit-channels-tag');
      expect(tagTextbox).toBeVisible();
      await userEvent.type(tagTextbox, 'mike42');
      expect(tagTextbox).toHaveValue('mike42');

      const saveButton = screen.getByText('stripes-components.saveAndClose');
      expect(saveButton).toBeVisible();
      fireEvent.click(saveButton);
      // For reasons I don't understand, this doesn't invoke the
      // mutator. It seems that the decorated onSubmit function
      // provided by stripes-final-form never invokes the underlying
      // onSubmit function from CreateChannelRoute. I will return to
      // this when I have time.
    });
  });
});

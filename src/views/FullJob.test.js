import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { CalloutContext } from '@folio/stripes/core';
import FullJob from './FullJob';

jest.mock('../util/formatDateTime', () => jest.fn(() => 'formatted-date'));

jest.mock('./ChannelLog/ChannelLogFailedRecords', () => () => (
  <div data-testid="failed-records" />
));

const renderComponent = (props, callout = { sendCallout: jest.fn() }) => {
  return render(
    <BrowserRouter>
      <CalloutContext.Provider value={callout}>
        <FullJob {...props} />
      </CalloutContext.Provider>
    </BrowserRouter>
  );
};

const baseProps = {
  data: {
    record: {
      channelName: 'Test Channel',
      channelId: '1',
      started: '2023-01-01T00:00:00Z',
      currentStatus: 'RUNNING',
    },
    transformationPipeline: { id: 'tp1', name: 'Pipeline 1' },
    logs: { totalRecords: 0, logLines: [] },
    failedRecords: {},
  },
  handlers: {
    onClose: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  },
  updateQuery: jest.fn(),
};

describe('FullJob', () => {
  it('renders spinner when no record', () => {
    const { container } = renderComponent({
      ...baseProps,
      data: { ...baseProps.data, record: null },
    });
    expect(container.querySelector('div.spinner')).toBeInTheDocument();
  });

  it('renders job info when record is present', () => {
    renderComponent(baseProps);
    expect(screen.getByText('Test Channel')).toBeInTheDocument();
    expect(screen.getByText(/formatted-date/)).toBeInTheDocument();
  });

  it('shows pause button when status is RUNNING', () => {
    renderComponent(baseProps);
    expect(screen.getByRole('button', { name: /ui-inventory-import.button.pause/i })).toBeInTheDocument();
  });

  it('shows resume button when status is not RUNNING', () => {
    renderComponent({
      ...baseProps,
      data: {
        ...baseProps.data,
        record: {
          ...baseProps.data.record,
          currentStatus: 'PAUSED',
        },
      },
    });
    expect(screen.getByRole('button', { name: /ui-inventory-import.button.resume/i })).toBeInTheDocument();
  });

  it('calls pause handler and shows success callout', async () => {
    const callout = { sendCallout: jest.fn() };
    baseProps.handlers.pause.mockResolvedValueOnce();
    renderComponent(baseProps, callout);
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    await waitFor(() => {
      expect(baseProps.handlers.pause).toHaveBeenCalled();
      expect(callout.sendCallout).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(Object),
        })
      );
    });
  });

  it('handles pause error and shows error callout', async () => {
    const callout = { sendCallout: jest.fn() };
    const errorResponse = {
      status: 500,
      text: jest.fn().mockResolvedValue('error-body'),
    };
    baseProps.handlers.pause.mockRejectedValueOnce(errorResponse);
    renderComponent(baseProps, callout);
    fireEvent.click(screen.getByRole('button', { name: /pause/i }));
    await waitFor(() => {
      expect(callout.sendCallout).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: expect.any(Object),
        })
      );
    });
  });

  it('calls resume handler and shows success callout', async () => {
    const callout = { sendCallout: jest.fn() };
    const props = {
      ...baseProps,
      data: {
        ...baseProps.data,
        record: {
          ...baseProps.data.record,
          currentStatus: 'PAUSED',
        },
      },
      handlers: {
        ...baseProps.handlers,
        resume: jest.fn().mockResolvedValue(),
      },
    };
    renderComponent(props, callout);
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    await waitFor(() => {
      expect(props.handlers.resume).toHaveBeenCalled();
      expect(callout.sendCallout).toHaveBeenCalled();
    });
  });

  it('handles resume error and shows error callout', async () => {
    const callout = { sendCallout: jest.fn() };
    const errorResponse = {
      status: 500,
      text: jest.fn().mockResolvedValue('resume-error-body'),
    };
    const props = {
      ...baseProps,
      data: {
        ...baseProps.data,
        record: {
          ...baseProps.data.record,
          currentStatus: 'PAUSED',
        },
      },
      handlers: {
        ...baseProps.handlers,
        resume: jest.fn().mockRejectedValue(errorResponse),
      },
    };
    renderComponent(props, callout);
    fireEvent.click(screen.getByRole('button', { name: /resume/i }));
    await waitFor(() => {
      expect(props.handlers.resume).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(callout.sendCallout).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: expect.any(Object), // FormattedMessage
        })
      );
    });

    expect(errorResponse.text).toHaveBeenCalled();
  });

  it('passes onClose handler into Pane', () => {
    renderComponent(baseProps);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(baseProps.handlers.onClose).toHaveBeenCalled();
  });
});

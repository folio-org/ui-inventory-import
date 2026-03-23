import React from 'react';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import FullChannel, { onDrop } from './FullChannel';

const updateMock = jest.fn();
const deleteRecordMock = jest.fn(() => Promise.resolve());

jest.mock('@folio/stripes/core', () => {
  const React = require('react'); // eslint-disable-line no-shadow, global-require

  return {
    useStripes: () => ({ config: {} }),
    useOkapiKy: () => ({ post: jest.fn() }),
    CalloutContext: React.createContext({ sendCallout: jest.fn() }),
    IfPermission: ({ children }) => <>{children}</>,
  };
});

jest.mock('@folio/stripes/components', () => ({
  Loading: () => <div>Loading</div>,
  Pane: ({ children, actionMenu }) => (
    <div>
      <div data-testid="action-menu">{actionMenu({})}</div>
      {children}
    </div>
  ),
  Row: ({ children }) => <div>{children}</div>,
  Accordion: ({ children }) => <div>{children}</div>,
  Button: ({ children, buttonStyle, ...props }) => {
    return <button {...props} type="button" buttonstyle={buttonStyle}>{children}</button>;
  },
  Icon: ({ children }) => <span>{children}</span>,
  ConfirmationModal: ({ open, onConfirm, onCancel }) => (
    open ? (
      <div>
        <button type="button" onClick={onConfirm}>confirm</button>
        <button type="button" onClick={onCancel}>cancel</button>
      </div>
    ) : null),
  Modal: ({ children }) => <div>{children}</div>,
}));

jest.mock('@folio/stripes-data-transfer-components', () => ({
  FileUploader: ({ onDrop }) => (
    <button type="button" onClick={() => onDrop([], [])}>mock upload</button>
  ),
}));

jest.mock('../components/CKV', () => ({
  CKV: ({ tag }) => <div>{tag}</div>,
  RCKV: ({ tag }) => <div>{tag}</div>,
}));

const renderComponent = (overrides = {}) => {
  const props = {
    defaultWidth: 'fill',
    resources: {
      channel: {
        hasLoaded: true,
        records: [{ id: '1', name: 'Test Channel' }],
      },
      transformationPipeline: {},
    },
    mutator: {
      query: { update: updateMock },
    },
    match: {
      url: '/channels/1',
      params: { recId: '1' },
    },
    deleteRecord: deleteRecordMock,
    ...overrides,
  };

  return render(<FullChannel {...props} />);
};

describe('FullChannel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading when resource not loaded', () => {
    renderComponent({
      resources: {
        channel: { hasLoaded: false, records: [] },
      },
    });
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders channel data when loaded', () => {
    renderComponent();
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('id')).toBeInTheDocument();
  });

  it('opens delete confirmation modal and confirms delete', async () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('action-menu').querySelector('[data-test-delete-channel-button]'));
    expect(screen.getByText('confirm')).toBeInTheDocument();
    fireEvent.click(screen.getByText('confirm'));
    await waitFor(() => {
      expect(deleteRecordMock).toHaveBeenCalled();
      expect(updateMock).toHaveBeenCalled();
    });
  });

  it('opens and closes upload modal', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('action-menu').querySelector('[data-test-upload-button]'));
    expect(screen.getByText('mock upload')).toBeInTheDocument();
    fireEvent.click(screen.getByText('mock upload'));
  });

  it('navigates to edit on edit click', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('action-menu').querySelector('[data-test-actions-menu-edit]'));
    expect(updateMock).toHaveBeenCalledWith({ _path: '1/edit' });
  });
});


describe('onDrop', () => {
  let originalFileReader;
  let okapiKyMock;
  let calloutMock;
  let setUploadingMock;

  beforeEach(() => {
    originalFileReader = global.FileReader;
    global.FileReader = jest.fn(() => {
      return {
        readAsText: jest.fn(function () {
          // Immediately trigger onload
          if (this.onload) {
            this.onload();
          }
        }),
        result: 'file content',
        onabort: null,
        onerror: null,
        onload: null,
      };
    });

    okapiKyMock = {
      post: jest.fn().mockResolvedValue({ ok: true, status: 200, statusText: 'OK', text: jest.fn() }),
    };
    calloutMock = { sendCallout: jest.fn() };
    setUploadingMock = jest.fn();
  });

  afterEach(() => {
    global.FileReader = originalFileReader;
    jest.resetAllMocks();
  });

  it('uploads files and sends success callout', async () => {
    const file = new File(['dummy content'], 'testfile.txt', { type: 'text/plain' });

    await onDrop([file], '123', 'myChannel', okapiKyMock, calloutMock, setUploadingMock);

    // Wait a tick for async onload to complete
    await Promise.resolve();

    expect(okapiKyMock.post).toHaveBeenCalledWith(
      'inventory-import/channels/123/upload?filename=testfile.txt',
      expect.objectContaining({
        body: 'file content',
        throwHttpErrors: false,
      })
    );
    expect(calloutMock.sendCallout).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.any(Object),
      })
    );
    expect(setUploadingMock).toHaveBeenCalledWith(false);
  });

  it('sends error callout if upload fails', async () => {
    okapiKyMock.post.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: jest.fn().mockResolvedValue('Some error'),
    });

    const file = new File(['dummy content'], 'failfile.txt', { type: 'text/plain' });
    await onDrop([file], '123', 'myChannel', okapiKyMock, calloutMock, setUploadingMock);
    await Promise.resolve();

    expect(calloutMock.sendCallout).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        message: expect.any(Object),
      })
    );
  });
});

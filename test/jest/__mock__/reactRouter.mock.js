import React from 'react';

jest.mock('react-router', () => {
  return {
    ...jest.requireActual('react-router'),
    useLocation: jest.fn().mockReturnValue({
      pathname: '/invimp/channels',
      search: '',
    }),
  };
});

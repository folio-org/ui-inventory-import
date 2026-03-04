import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Pane } from '@folio/stripes/components';
import { parseFilters } from '@folio/stripes/smart-components';
import MainSearchArea from './MainSearchArea';
import renderFilter from './renderFilter';
import searchPanePropTypes from './searchPanePropTypes';


function ChannelsSearchPane(props) {
  const {
    defaultWidth,
    searchValue,
    getSearchHandlers,
    onSubmitSearch,
    searchField,
    query,
    updateQuery,
  } = props;
  const searchHandlers = getSearchHandlers();

  const intl = useIntl();
  const filterStruct = parseFilters(query.filters);

  return (
    <Pane
      defaultWidth={defaultWidth}
      paneTitle={<FormattedMessage id="stripes-smart-components.searchAndFilter" />}
    >
      <form onSubmit={onSubmitSearch}>
        <MainSearchArea
          type="channels"
          indexes={['', 'name', 'id']}
          searchValue={searchValue}
          searchField={searchField}
          searchHandlers={searchHandlers}
          query={query}
          updateQuery={updateQuery}
        />
        {renderFilter(intl, filterStruct, updateQuery, 'enabled', ['true', 'false'])}
        {renderFilter(intl, filterStruct, updateQuery, 'type', ['XML'])}
      </form>
    </Pane>
  );
}


ChannelsSearchPane.propTypes = searchPanePropTypes;


export default ChannelsSearchPane;

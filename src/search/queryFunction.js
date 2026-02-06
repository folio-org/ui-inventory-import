import { makeQueryFunction } from '@folio/stripes/smart-components';


const sortMap = {
  // All the headings are the names of sortable fields
  // so no mapping is required.
};

function parseFilterValue(field, op, value, appendToTerm) {
  const res = `${field}${op}${value}`;
  if (appendToTerm === undefined) {
    return res;
  } else {
    return res + appendToTerm;
  }
}

function makePFV(field, op, appendToTerm) {
  return (value) => parseFilterValue(field, op, value, appendToTerm);
}

const startOfDay = 'T00:00:00';
const endOfDay = 'T23:59:59';
const filterConfig = [{
  name: 'status',
  cql: 'status',
  values: [],
}, {
  name: 'type',
  cql: 'type',
  values: [],
}, {
  name: 'started_from',
  cql: 'started_from',
  values: [],
  parse: makePFV('started', '>=', startOfDay),
}, {
  name: 'started_to',
  cql: 'started_to',
  values: [],
  parse: makePFV('started', '<=', endOfDay),
}, {
  name: 'finished_from',
  cql: 'finished_from',
  values: [],
  parse: makePFV('finished', '>=', startOfDay),
}, {
  name: 'finished_to',
  cql: 'finished_to',
  values: [],
  parse: makePFV('finished', '<=', endOfDay),
}, {
  name: 'timeStamp_from',
  cql: 'timeStamp_from',
  values: [],
  parse: makePFV('timeStamp', '>=', startOfDay),
}, {
  name: 'timeStamp_to',
  cql: 'timeStamp_to',
  values: [],
  parse: makePFV('timeStamp', '<=', endOfDay),
}, {
  name: 'records_from',
  cql: 'records_from',
  values: [],
  parse: makePFV('amountImported', '>='),
}, {
  name: 'records_to',
  cql: 'records_to',
  values: [],
  parse: makePFV('amountImported', '<='),
}, {
  // Value is injected from path-component by HarvestableJobsRoute's query function
  name: 'harvestableId',
  cql: 'harvestableId',
  values: [],
}];

function queryFunction(defaultSearch, ...params) {
  // console.log('*** queryFunction');
  // console.log(`defaultSearch='${defaultSearch}'`);
  // console.log('params=', params);

  const fn = makeQueryFunction(
    'cql.allRecords=1',
    defaultSearch,
    sortMap,
    filterConfig,
    0,
    undefined,
    {
      rightTrunc: false,
    }
  );

  return fn(...params);
}

export default queryFunction;
export { makePFV };

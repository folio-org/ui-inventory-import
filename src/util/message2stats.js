function message2stats(message) {
  const stats = {};
  if (!message || message === 'No records harvested') return stats;

  message.split(' ').forEach(row => {
    const matchData = row.match(/(.*?)_.*:_+([^_]*)_+([^_]*)_+([^_]*)_+([^_]*)/);
    if (matchData) {
      // eslint-disable-next-line no-unused-vars
      const [_matched, name, processed, loaded, deleted, failed] = matchData;
      stats[name.toLowerCase()] = { processed, loaded, deleted, failed };
    } else {
      // eslint-disable-next-line no-console, no-lonely-if
      // We won't do this, as each line now generates a stack-trace or something equally noisy
      // if (row) console.warn('message2stats: no match for row:', row);
    }
  });

  return stats;
}

/*
const message = 'Instances_processed/loaded/deletions(signals)/failed:__0___0___0(0)___0_ Holdings_records_processed/loaded/deleted/failed:__107___0___0___107_ Items_processed/loaded/deleted/failed:__107___0___0___0_ Source_records_processed/loaded/deleted/failed:__0___0___0___0_';

const stats = message2stats(message);
console.log(stats);
*/

function summarizeLine(statLine) {
  return ['processed', 'loaded', 'deleted', 'failed']
    .map(entry => statLine?.[entry] || '')
    .join('/');
}


function summarizeStats(intl, param) {
  const stats = !param ? {} : (typeof param === 'string') ? message2stats(param) : param;

  return ['instances', 'holdings', 'items']
    .map(t => intl.formatMessage({ id: `ui-inventory-import.stats.${t}` }) + ':' + summarizeLine(stats[t]))
    .join(' ');
}


export { message2stats, summarizeStats };

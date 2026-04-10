import { useIntl } from 'react-intl';

// PRIVATE
function secondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

function useDurationFormatter(style = 'long') {
  const intl = useIntl();

  return (duration) => {
    // Interpret a non-object argument as a number of seconds
    const durationObj = typeof duration === 'object' ? duration : secondsToDuration(duration);

    if (durationObj.hours === 0 && durationObj.minutes === 0 && durationObj.seconds < 1.0) {
      return intl.formatMessage({ id: 'ui-inventory-import.lessThanOneSecond' });
    }

    return new Intl.DurationFormat(intl.locale, { style }).format(durationObj);
  };
}

export default useDurationFormatter;

import { useIntl } from 'react-intl';

// PRIVATE
function secondsToDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

function useDurationFormatter(style = 'long') {
  const { locale } = useIntl();
  return (duration) => {
    // Interpret a non-object argument as a number of seconds
    const durationObj = typeof duration === 'object' ? duration : secondsToDuration(duration);

    return new Intl.DurationFormat(locale, { style }).format(durationObj);
  };
}

export default useDurationFormatter;

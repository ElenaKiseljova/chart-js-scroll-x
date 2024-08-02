type TDateFormatter = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions,
  locale: Intl.LocalesArgument
) => string;

const dateFormatter: TDateFormatter = (
  date,
  options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  locale = 'en-GB'
) => {
  if (typeof date === 'string' && /[0-9]{4}-[0-9]{2}-[0-9]{2}.*/.test(date)) {
    date = new Date(date);
  }

  if (date instanceof Date) {
    const formatter = new Intl.DateTimeFormat(locale, options);

    return formatter.format(date);
  } else {
    return date;
  }
};

export { dateFormatter as default };


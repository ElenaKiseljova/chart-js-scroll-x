type TPriceFormatter = (price: number) => string;

const priceFormatter: TPriceFormatter = (price, locale = 'en-GB') => {
  // Int to Float
  price = +price / 100;

  const settings: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  };
  const formatter = new Intl.NumberFormat(locale, settings);

  return formatter.format(isNaN(price) ? 0 : price);
};

export { priceFormatter as default };


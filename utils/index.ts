import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc'; // dependent on utc plugin
import { QueryParams, SHORTENED_TOKEN_PRECISION } from './constants';

dayjs.extend(utc);
dayjs.extend(timezone);

export const toQueryString = (queryObject: QueryParams): string => {
  return Object.keys(queryObject)
    .map(
      (key) =>
        encodeURIComponent(key) + '=' + encodeURIComponent(queryObject[key])
    )
    .join('&');
};

export const capitalize = (word: string): string => {
  if (!word) return '';
  return word[0].toUpperCase() + word.slice(1);
};

export const formatNumber = (numberString: string): string =>
  numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const asyncForEach = async (
  array: unknown[],
  callback: (element: unknown, index: number, array: unknown[]) => void
): Promise<void> => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const parseTimestamp = (timestamp: string): string => {
  if (timestamp) {
    return `${dayjs(+timestamp)
      .tz('America/Los_Angeles')
      .format('MMM DD, YYYY, h:mm A')} PST`;
  }
  return '';
};

export const addPrecisionDecimal = (
  number: string,
  precision: number,
  noCommas?: boolean
): string => {
  if (number && number.includes('.')) return formatThousands(number);
  if (number && number.length > precision) {
    const insertDecimalAtIndex = number.length - precision;
    const numberString =
      number.slice(0, insertDecimalAtIndex) +
      '.' +
      number.slice(insertDecimalAtIndex);
    if (noCommas) {
      return numberString;
    }
    return formatThousands(parseFloat(numberString).toString());
  }

  let prependZeros = '';
  for (let i = 0; i < precision - number.length; i++) {
    prependZeros += '0';
  }
  const numberString = `0.${prependZeros + number}`;
  if (noCommas) {
    return numberString;
  }
  return formatThousands(parseFloat(numberString).toString());
};

export const formatPrice = (priceString: string): string => {
  if (!priceString) return '';
  const [price, currency] = priceString.split(' ');
  const amount = formatThousands(
    parseFloat(price.replace(/[,]/g, '')).toFixed(SHORTENED_TOKEN_PRECISION)
  );
  return `${amount} ${currency}`;
};

export const formatThousands = (numberString: string): string => {
  const [integers, decimals] = numberString.split('.');
  let salePrice = parseFloat(integers.replace(/[,]/g, '')).toLocaleString();
  salePrice = decimals ? salePrice + '.' + decimals : salePrice;
  return salePrice;
};

export const fileReader = (
  callback: (string) => void,
  readData: File
): void => {
  const reader = new window.FileReader();
  reader.onload = () => {
    callback(reader.result as string);
  };
  reader.readAsDataURL(readData);
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

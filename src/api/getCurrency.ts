'use server';

const COINMARKET_API_BASE = 'https://pro-api.coinmarketcap.com';

require('dotenv').config();

export type Currency = {
  id: number;
  name: string;
  sign: string;
  symbol: string;
  fullName: string;
};

let currencies: Currency[] = [];

let lastUpdate = 0;

const fetchCurrencies = async ({
  signal = null,
}: { signal?: AbortSignal | null } = {}) => {
  if (
    typeof process.env.COINMARKETCAP_TOKEN !== 'string' ||
    !process.env.COINMARKETCAP_TOKEN
  ) {
    return null;
  }

  // update every 3 hours
  if (Date.now() - lastUpdate < 3 * 60 * 60 * 1000) {
    return currencies;
  }

  lastUpdate = Date.now();
  currencies = [];

  const fiat_res: Currency[] | null = await fetch(
    `${COINMARKET_API_BASE}/v1/fiat/map`,
    {
      headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_TOKEN },
      signal,
    }
  )
    .then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(`Bad response: ${res.status} ${res.statusText}`)
    )
    .then((json) =>
      json.status.error_code
        ? Promise.reject(
            `Bad response: ${json.status.error_code} ${json.status.error_message}`
          )
        : json.data
    )
    .catch(
      (e) => (
        console.error(`Error getting fiat currencies: ${e.toString()}`), null
      )
    );

  if (fiat_res === null) return null;

  currencies.push(...fiat_res.map((v) => ({ ...v, fullName: `${v.name}${v.sign ? ` "${v.sign}"` : ''} (${v.symbol})` })));

  const crypto_res: Currency[] | null = await fetch(
    `${COINMARKET_API_BASE}/v1/cryptocurrency/map?${new URLSearchParams({
      listing_status: 'active,untracked',
    })}`,
    {
      headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_TOKEN },
      signal,
    }
  )
    .then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(`Bad response: ${res.status} ${res.statusText}`)
    )
    .then((json) =>
      json.status.error_code
        ? Promise.reject(
            `Bad response: ${json.status.error_code} ${json.status.error_message}`
          )
        : json.data
    )
    .catch(
      (e) => (
        console.error(`Error getting crypto currencies: ${e.toString()}`), null
      )
    );

  if (crypto_res !== null) currencies.push(...crypto_res.map((v) => ({ ...v, fullName: `${v.name}${v.sign ? ` "${v.sign}"` : ''} (${v.symbol})` })));

  return currencies;
};

export const getCurrenciesList = async ({
  search = '',
  limit = 10,
  offset = 0,
  signal = null,
}: { search?: string; limit?: number; offset?: number; signal?: AbortSignal | null } = {}) => {
  const result = await fetchCurrencies({ signal });
  if (result === null) return [];
  return (search == null ? result : result.filter( v => v.fullName.toLowerCase().includes(search.toLowerCase()))).slice(offset, offset + limit);
};

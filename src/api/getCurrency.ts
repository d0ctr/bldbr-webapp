'use server';

import {
    ActionResult,
    Category,
    dumpURLSearchParams,
    ErrorMessage,
    getActionError,
    getActionSuccess,
    ResultData,
} from '@/utils/shared';

const COINMARKET_API_BASE = 'https://pro-api.coinmarketcap.com';

require('dotenv').config();

export type Currency = {
    id: number;
    name: string;
    sign?: string;
    symbol: string;
    fullName: string;
};

export interface Conversion extends ResultData {
    type: Category.Currency;
    details: {
        from: Currency;
        to: Currency;
        amount: number;
        price: number;
    };
}

type ConversionResult = {
    quote: {
        [symbol: Currency['symbol']]: {
            price: number;
            last_updated: string;
        };
    };
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
                : Promise.reject(
                      `Bad response: ${res.status} ${res.statusText}`
                  )
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
                console.error(`Error getting fiat currencies: ${e.toString()}`),
                null
            )
        );

    if (fiat_res === null) return null;

    currencies.push(
        ...fiat_res.map((v) => ({
            ...v,
            fullName: `${v.name}${v.sign ? ` "${v.sign}"` : ''} (${v.symbol})`,
        }))
    );

    const crypto_res: Currency[] | null = await fetch(
        `${COINMARKET_API_BASE}/v1/cryptocurrency/map?${dumpURLSearchParams({
            listing_status: 'active',
        })}`,
        {
            headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_TOKEN },
            signal,
        }
    )
        .then((res) =>
            res.ok
                ? res.json()
                : Promise.reject(
                      `Bad response: ${res.status} ${res.statusText}`
                  )
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
                console.error(
                    `Error getting crypto currencies: ${e.toString()}`
                ),
                null
            )
        );

    if (crypto_res !== null) {
        currencies.push(
            ...crypto_res.map((v) => ({
                ...v,
                fullName: `${v.name}${v.sign ? ` "${v.sign}"` : ''} (${
                    v.symbol
                })`,
            }))
        );
    }

    return currencies;
};

export const getCurrenciesList = async ({
    search = '',
    limit = 10,
    offset = 0,
    signal = null,
}: {
    search?: string;
    limit?: number;
    offset?: number;
    signal?: AbortSignal | null;
} = {}) => {
    const result = await fetchCurrencies({ signal });
    if (result === null) return [];
    return (
        search == null
            ? result
            : result.filter((v) =>
                  v.fullName.toLowerCase().includes(search.toLowerCase())
              )
    ).slice(offset, offset + limit);
};

export const getCurrenciesPairById = async ({
    from,
    to,
    signal,
}: {
    from: number;
    to: number;
    signal?: AbortSignal;
}) => {
    const result = await fetchCurrencies({ signal });

    return [result?.find(cur => cur.id === from), result?.find(cur => cur.id === to)];
};

export const getConversion = async (
    fromId: string,
    toId: string,
    amount: number
): Promise<ActionResult> => {
    if (typeof process.env.COINMARKETCAP_TOKEN !== 'string') {
        return getActionError(ErrorMessage.SERVICE_NOT_AVAILABLE);
    }

    const from = currencies.find(({ id }) => id === Number(fromId));
    const to = currencies.find(({ id }) => id === Number(toId));

    if (!from || !to) {
        return getActionError(
            `Несуществующая валюта: ${!from ? fromId : toId}`
        );
    }

    return await fetch(
        `${COINMARKET_API_BASE}/v2/tools/price-conversion?${dumpURLSearchParams(
            {
                amount,
                id: fromId,
                convert_id: toId,
            }
        )}`,
        {
            headers: { 'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_TOKEN },
        }
    )
        .then((r) =>
            r.ok
                ? r.json()
                : Promise.reject({
                      msg: `non-200 response`,
                      cause: r.statusText,
                  })
        )
        .then((json) =>
            json.status.error_code
                ? Promise.reject({
                      msg: `Bad response: ${json.status.error_code}`,
                      status: json.status.error_message,
                  })
                : (json.data as ConversionResult)
        )
        .then((conversion) => {
            if (!conversion.quote[to.id]?.price) {
                return Promise.reject({
                    msg: `No price for conversion from ${from.symbol}(${from.id}) to ${to.symbol}(${to.id})`,
                });
            }
            return getActionSuccess({
                slug: Date.now().toString(),
                type: Category.Currency,
                details: {
                    amount,
                    from,
                    to,
                    price: conversion.quote[to.id].price,
                },
            });
        })
        .catch((e) => {
            console.error(
                `Error getting conversion: ${JSON.stringify(e)} ${e.toString()}`
            );
            return getActionError(ErrorMessage.REQUEST_ERROR);
        });
};

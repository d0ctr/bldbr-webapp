'use server';

import { getConversion } from '@/api/getCurrency';
import { getGames } from '@/api/getGames';
import { getMovies } from '@/api/getMovies';
import { getSongs } from '@/api/getSongs';
import {
    ActionResult,
    ActionResultStatus,
    Category,
    dumpURLSearchParams,
    parseCategory,
    ResultData,
} from '@/utils/shared';
import type { Selection } from '@nextui-org/react';
import { redirect } from 'next/navigation';
import { URLSearchParams } from 'url';

export async function categoryChange(keys: Selection) {
    'use server';
    if (keys === 'all' || keys.size === 0) return;
    const category = keys.values().next().value as Category;
    redirect(`/${category}`);
}

export type SearchActionResult =
    | {
          status: 'ok';
          data: ResultData[];
          searchParams: string;
          end?: boolean;
          page: number;
      }
    | {
          status: 'error';
          error: string;
      }
    | null;

export async function handleForm(
    prev: SearchActionResult,
    formData: FormData
): Promise<SearchActionResult> {

    const category = parseCategory(formData.get('category'));
    if (!category) return null;
    const query = formData.get('query')?.toString();
    if (!query) return null;

    const from = formData.get('from')?.toString();
    const to = formData.get('to')?.toString();
    const page = formData.get('page')?.toString();

    return getCategorySearch({ category, query, from, to, prev, page });
}

export async function getCategorySearch({ category, query, ...args }: { category: Category; query: string; [x: string]: any }): Promise<SearchActionResult> {
    if (!category || !query) return null;
    let actionResult: ActionResult | null = null;

    const searchParams = [];
    const { page } = args;

    const _page = !isNaN(Number(page)) ? Number(page) : 1;

    switch (category) {
        case Category.Game:
            actionResult = await getGames(query, _page);
            searchParams.push(['query', query]);
            searchParams.push(['page', _page]);
            break;
        case Category.Song:
            actionResult = await getSongs(query, _page);
            searchParams.push(['query', query]);
            searchParams.push(['page', _page]);
            break;
        case Category.Movie:
            actionResult = await getMovies(query, _page);
            searchParams.push(['query', query]);
            searchParams.push(['page', _page]);
            break;
        case Category.Currency:
            const amount = Number(query);
            const { from, to } = args;
            if (!from || !to || isNaN(amount)) {
                break;
            }
            actionResult = await getConversion(from, to, amount);
            searchParams.push(['query', query]);
            searchParams.push(['from', from]);
            searchParams.push(['to', to]);
            break;
    }

    if (actionResult === null) return null;

    const { prev } = args; 

    if (actionResult.status === ActionResultStatus.Ok) {
        let data;
        if (Array.isArray(actionResult.data)) {
            if (prev?.status === 'ok' && page > 1) {
                data = [...prev.data, ...actionResult.data];
            }
            else {
                data = actionResult.data;
            }
        }
        else if (prev?.status === 'ok') {
            data = [actionResult.data, ...prev.data];
        }
        else {
            data = [actionResult.data];
        }
        return {
            status: 'ok',
            data,
            searchParams: dumpURLSearchParams(searchParams).toString(),
            end: data.length === 0 ? true : false,
            page: _page,
        };
    }

    return actionResult;
}

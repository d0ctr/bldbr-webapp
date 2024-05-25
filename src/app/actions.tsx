'use server';

import { getConversion } from '@/api/getCurrency';
import { getGames } from '@/api/getGames';
import { getSongs } from '@/api/getSongs';
import { Category, ResultData } from '@/utils/shared';
import type { Selection } from '@nextui-org/react';
import { redirect } from 'next/navigation';

export async function categoryChange(keys: Selection) {
    'use server';
    if (keys === 'all' || keys.size === 0) return;
    const category = keys.values().next().value as Category;
    redirect(`/${category}`);
}

export async function handleForm(
    __: ResultData[] | ResultData | null | undefined,
    formData: FormData
) {
    'use server';
    const query = formData.get('query');
    if (typeof query != 'string') return;

    let results: ResultData[] | ResultData | null = [];

    if (formData.get('category') === Category.Game) {
        results = await getGames(query);
    } else if (formData.get('category') === Category.Song) {
        results = await getSongs(query);
    } else if (formData.get('category') === Category.Currency) {
        const from = formData.get('from') as string;
        const to = formData.get('to') as string;
        const amount = Number(query);
        if (from && to && !isNaN(amount)) {
            results = await getConversion(from, to, amount);
        }
    }
    return results;
}

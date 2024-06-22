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

export async function handleForm({
    category,
    value,
    args,
}: {
    category: Category;
    value: string;
    args?: any;
}) {
    let results: ResultData[] | ResultData | null = [];

    if (category === Category.Game) {
        results = await getGames(value);
    } else if (category === Category.Song) {
        results = await getSongs(value);
    } else if (category === Category.Currency) {
        const from = args?.from as string;
        const to = args?.to as string;
        const amount = Number(value);
        if (from && to && !isNaN(amount)) {
            results = await getConversion(from, to, amount);
        }
    }
    return results;
}

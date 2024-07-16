'use server';
import {
    ActionResult,
    ActionResultStatus,
    Category,
    ErrorMessage,
    getActionError,
    getActionSuccess,
    ResultData,
} from '@/utils/shared';
import { HowLongToBeatService } from 'howlongtobeat';

const hltb = new HowLongToBeatService();

require('dotenv').config();

export interface Game extends ResultData {
    slug: string;
    image_url?: string;
    title: string;
    details: {
        released?: string;
        metacritic?: string;
        stores?: { name: string }[];
        platforms?: { name: string }[];
    };
    type: Category.Game;
}

export interface HLTBDetails {
    url: string;
    playtimes: { name: string; value: number | string }[];
}

export const getGames = async (
    query: string,
    page = 1,
    page_size = 10,
): Promise<ActionResult> => {
    if (typeof process.env.RAWG_TOKEN !== 'string' || !process.env.RAWG_TOKEN) {
        return getActionError(ErrorMessage.SERVICE_NOT_AVAILABLE);
    }

    return await fetch(
        `https://api.rawg.io/api/games?` +
            new URLSearchParams({
                key: process.env.RAWG_TOKEN,
                search: query,
                page_size: `${page_size}`,
                page: `${page}`,
            })
    )
        .then((res) =>
            !res.ok
                ? Promise.reject({
                      msg: 'non-200 response',
                      cause: res.statusText,
                  })
                : res
        )
        .then((res) => res.json())
        .then(({ results: games }) =>
            games.length == 0
                ? [] 
                : games.map(
                      (game: any) =>
                          ({
                              slug: game.slug,
                              title: game.name,
                              details: {
                                  released: game.released,
                                  metacritic: game.metacritic,
                                  platforms: game.platforms?.map(
                                      (v: any) => v.platform
                                  ),
                                  stores: game.stores?.map((v: any) => v.store),
                              },
                              image_url: game.background_image,
                              type: Category.Game,
                              url: `https://rawg.io/games/${game.slug}`,
                          } as Game)
                  )
        )
        .then(r => getActionSuccess(r))
        .catch((err) => {
            console.error(`Error getting games: ${JSON.stringify(err)} ${err.toString()}`);
            return getActionError(ErrorMessage.REQUEST_ERROR);
        });
};

export const getHLTBDDetails = async ({
    name,
    released,
}: {
    name: string;
    released: string;
}): Promise<HLTBDetails | null> => {
    if (!released) return null;

    const year = new Date(released).getFullYear();
    if (!year) return null;

    const { signal } = new AbortController();
    const hltbResult = await hltb
        .searchWithOptions(name, { year }, signal)
        .then((res) => (res.length > 0 ? res[0] : null))
        .catch(() => null);

    if (!hltbResult) return null;

    const hltbDetails = {
        url: `https://howlongtobeat.com/game/${hltbResult.id}`,
        playtimes: hltbResult.timeLabels
            .map(([key, name]) => ({
                name,
                value: Number.isSafeInteger(hltbResult[key])
                    ? hltbResult[key]
                    : `${Math.floor(hltbResult[key])}½`,
            }))
            .filter(({ value }) => value != 0),
    };
    return hltbDetails;
};

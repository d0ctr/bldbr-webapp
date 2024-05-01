'use server';
import { Category, ResultData } from '@/utils/shared';
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
    hltb?: {
      url: string;
      playtimes: { name: string; value: number | string }[];
    };
  };
  type: Category.Game;
}

export const getGames = async (
  query: string,
  page_size = 10,
  page = 1
): Promise<Game[] | null> => {
  if (typeof process.env.RAWG_TOKEN !== 'string' || !process.env.RAWG_TOKEN) {
    return null;
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
    .then((res) => (!res.ok ? Promise.reject('non-200 response') : res))
    .then((res) => res.json())
    .then((res) =>
      Promise.all(
        res.results.map(async (game: any) => {
          const { name, released } = game;
          if (!released) return game;

          const year = new Date(released).getFullYear();
          if (!year) return game;

          const hltbResult = await hltb
            .searchWithOptions(name, { year })
            .then((res) => (res.length > 0 ? res[0] : null))
            .catch(() => null);
          if (!hltbResult) return game;

          game.hltb = {
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
          return game;
        })
      )
    )
    .then((games) =>
      games.map(
        (game: any) =>
          ({
            slug: game.slug,
            title: game.name,
            details: {
              released: game.released,
              metacritic: game.metacritic,
              platforms: game.platforms?.map((v: any) => v.platform),
              stores: game.stores?.map((v: any) => v.store),
              hltb: game.hltb,
            },
            image_url: game.background_image,
            type: Category.Game,
          } as Game)
      )
    )
    .then((games) => (games.length == 0 ? null : games))
    .catch((err) => {
      console.error(`Error getting games: ${err.toString()}`);
      return null;
    });
};

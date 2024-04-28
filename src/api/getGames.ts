'use server';
require('dotenv').config();

export declare type Game = {slug: string, image_url?: string, title: string, text: string};

export const getResults = async (formData: FormData, page_size = 10, page = 1): Promise<Game[] | null> => {
    'use server';
    if (typeof process.env.RAWG_TOKEN !== 'string' || !process.env.RAWG_TOKEN) {
        return null;
    }

    const game = formData.get('query');
    if (typeof game !== 'string' || !game) {
        return null
    }

    return await fetch(
        `https://api.rawg.io/api/games?` +
            new URLSearchParams({
                key: process.env.RAWG_TOKEN,
                search: game,
                page_size: `${page_size}`,
                page: `${page}`
            })
    )
        .then((res) => res.json())
        .then((res) =>
                res.results.map((game: any) => ({
                    slug: game.slug,
                    title: game.name,
                    text: getTextFromGameDetail(game),
                    image_url: game.background_image,
                }))
        ).catch(err => {
            console.log(`Error getting games: ${err.toString()}`)
            return null;
        });
};

const getTextFromGameDetail = (game: any) => {
    return (
        (game.released
            ? `Дата релиза: ${new Date(game.released).toLocaleDateString(
                  'de-DE'
              )}\n`
            : '') +
        (game.metacritic ? `Metacritic: ${game.metacritic}\n` : '') +
        (game.platforms?.length
            ? `Платформы: ${game.platforms
                  .filter((v: any) => v.platform?.name)
                  .map((v: any) => v?.platform.name)
                  .join(', ')}\n`
            : '') +
        (game.stores?.length
            ? `Магазины: ${game.stores
                  .filter((v: any) => v?.store?.name)
                  .map((v: any) => v.store.name)
                  .join(', ')}\n`
            : '') +
        (game.hltb?.playtimes?.length
            ? `<a href='${game.hltb?.url}'>HLTB</a>:\n${game.hltb.playtimes
                  .map(({ name, value }: {name: string, value: number}) => `\t${name}: ${value}`)
                  .join('\n')}`
            : '')
    );
};

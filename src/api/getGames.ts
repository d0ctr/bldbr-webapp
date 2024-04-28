"use server";
const RAWG_TOKEN = "";

export const getResults = async (formData: FormData): Promise<{slug: string, image_url?: string, title: string, text: string}[]> => {
    "use server";

    const game = formData.get('query');

    return await fetch(
        `https://api.rawg.io/api/games?` +
            new URLSearchParams({
                key: RAWG_TOKEN,
                search: game,
                page_size: 10,
            })
    )
        .then((res) => res.json())
        .then((res) =>
                res.results.map((game) => ({
                    slug: game.slug,
                    title: game.name,
                    text: getTextFromGameDetail(game),
                    image_url: game.background_image,
                }))
        );
};

const getTextFromGameDetail = (game) => {
    return (
        (game.released
            ? `Дата релиза: ${new Date(game.released).toLocaleDateString(
                  "de-DE"
              )}\n`
            : "") +
        (game.metacritic ? `Metacritic: ${game.metacritic}\n` : "") +
        (game.platforms?.length
            ? `Платформы: ${game.platforms
                  .filter((v) => v.platform?.name)
                  .map((v) => v?.platform.name)
                  .join(", ")}\n`
            : "") +
        (game.stores?.length
            ? `Магазины: ${game.stores
                  .filter((v) => v?.store?.name)
                  .map((v) => v.store.name)
                  .join(", ")}\n`
            : "") +
        (game.hltb?.playtimes?.length
            ? `<a href="${game.hltb?.url}">HLTB</a>:\n${game.hltb.playtimes
                  .map(({ name, value }) => `${wideSpace}${name}: ${value}`)
                  .join("\n")}`
            : "")
    );
};

require('dotenv').config();

const getTextFromGameDetail = (game) => {
    return (game.released ? `Дата релиза: ${(new Date(game.released)).toLocaleDateString('de-DE')}\n` : '' )
        + (game.metacritic ? `Metacritic: ${game.metacritic}\n` : '')
        + (game.platforms?.length ? `Платформы: ${game.platforms.filter(v => v.platform?.name).map(v => v?.platform.name).join(', ')}\n` : '')
        + (game.stores?.length ? `Магазины: ${game.stores.filter(v => v?.store?.name).map(v => v.store.name).join(', ')}\n` : '')
        + (game.hltb?.playtimes?.length ? `<a href="${game.hltb?.url}">HLTB</a>:\n${game.hltb.playtimes.map(({name, value}) => `${wideSpace}${name}: ${value}`).join('\n')}` : '');
}


fetch(`https://api.rawg.io/api/games?`
    + new URLSearchParams({
        key: process.env.RAWG_TOKEN,
        search: 'alan wake',
        page_size: 10,
    }))
    .then(res => res.json())
    .then(res => console.log(JSON.stringify(res.results.map(game => ({
        slug: game.slug,
        title: game.name,
        text: getTextFromGameDetail(game),
        image_url: game.background_image
    })), null, 2)))

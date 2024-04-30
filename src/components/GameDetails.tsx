import { Game } from '@/api/getGames';

export default function GameDetails({
  details: { released, platforms, metacritic, hltb, stores },
}: {
  details: Game['details'];
}) {
  return (
    <>
      {released && (
        <>
          <b>Дата релиза</b>: {new Date(released).toLocaleDateString('de-DE')}
          <br />
        </>
      )}
      {metacritic && (
        <>
          <b>Metacritic</b>: {metacritic}
          <br />
        </>
      )}
      {platforms?.length && (
        <>
          <b>Платформы</b>: {platforms.map((p) => p.name).join(', ')}
          <br />
        </>
      )}
      {stores?.length && (
        <span>
          <b>Магазины</b>: {stores.map((p) => p.name).join(', ')}
          <br />
        </span>
      )}
      {hltb?.playtimes?.length && (
        <>
          <a href={hltb.url} target={'_blank'}>HLTB:</a>
          {hltb.playtimes.map(({ name, value }, i) => (
            <span key={i} className='indent-4'>
              {name}: {value}
              <br />
            </span>
          ))}
        </>
      )}
    </>
  );
}

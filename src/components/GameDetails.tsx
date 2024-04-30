import { Game } from '@/api/getGames';

export default function GameDetails({
  details: { released, platforms, metacritic, hltb, stores },
}: {
  details: Game['details'];
}) {
  return (
    <>
      {released && (
        <div>
          <b>Дата релиза</b>: {new Date(released).toLocaleDateString('de-DE')}
          <br />
        </div>
      )}
      {metacritic && (
        <div>
          <b>Metacritic</b>: {metacritic}
          <br />
        </div>
      )}
      {platforms?.length && (
        <div>
          <b>Платформы</b>: {platforms.map((p) => p.name).join(', ')}
          <br />
        </div>
      )}
      {stores?.length && (
        <div>
          <b>Магазины</b>: {stores.map((p) => p.name).join(', ')}
          <br />
        </div>
      )}
      {hltb?.playtimes?.length && (
        <div>
          <a className='underline text-blue-600 visited:text-blue-800' href={hltb.url} target={'_blank'}><b>HLTB</b></a>:<br />
          {hltb.playtimes.map(({ name, value }, i) => (
            <div key={i} className='indent-4'>
              {name}: {value}
              <br />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

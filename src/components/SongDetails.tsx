import { Song } from '@/api/getSongs';
import Link from './Link';

export default function SongDetails({
  details: { release_date, album, primary_artist, featured_artists, media },
}: {
  details: Song['details'];
}) {
  return (
    <>
      {album && (
        <div>
          <Link href={album.url}>{album.name}</Link>
          <br />
        </div>
      )}
      {primary_artist && (
        <div>
          <Link href={primary_artist.url}>{primary_artist.name}</Link>
          <br />
        </div>
      )}
      {!featured_artists?.length || (
        <div>
          feat.{' '}
          {featured_artists
            .map(({ name, url }, i, { length }) => (
            <>
              <Link key={i} href={url}>
                {name}
              </Link>
              { i !== length -1 && ', ' }
            </>
            ))}
          <br />
        </div>
      )}
      {release_date && (
        <div>
          <b>Дата релиза</b>:{' '}
          {new Date(release_date).toLocaleDateString('de-DE')}
          <br />
        </div>
      )}
      {!media?.length || (
        <div>
          {media.map(({ name, url }, i, { length }) => (
            <>
              <Link key={i} href={url}>
                {name}
              </Link>
              { i !== length - 1 && ' | ' }
            </>
          ))}
          <br />
        </div>
      )}
    </>
  );
}

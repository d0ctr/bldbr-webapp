'use server';
import { Category, ResultData } from '@/utils/shared';

export interface Song extends ResultData {
  slug: string;
  title: string;
  image_url?: string;
  details: {
    album?: { name: string; url: string };
    primary_artist?: { name: string; url: string };
    featured_artists?: { name: string; url: string }[];
    release_date?: string;
    media?: { url: string; name: string }[];
  };
  type: Category.Song;
}

async function searchSongs(query: string) {
  return await fetch(
    `https://api.genius.com/search?` + new URLSearchParams({ q: query }),
    {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_TOKEN}`,
      },
    }
  )
    .then((res) => (!res.ok ? Promise.reject('non-200 response') : res.json()))
    .then((res) =>
      res.meta?.status !== 200
        ? Promise.reject('bad 200 response')
        : res.response.hits
            .filter((hit: any) => hit.type === 'song')
            .map((hit: any) => hit.result)
    );
}

async function getSongDetails(id: number) {
  return await fetch(`https://api.genius.com/songs/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.GENIUS_TOKEN}`,
    },
  })
    .then((res) => (!res.ok ? Promise.reject('non-200 response') : res.json()))
    .then((res) =>
      res.meta?.status !== 200
        ? Promise.reject('bad 200 response')
        : res.response.song
    );
}

export const getSongs = async (query: string): Promise<Song[] | null> => {
  if (
    typeof process.env.GENIUS_TOKEN !== 'string' ||
    !process.env.GENIUS_TOKEN
  ) {
    return null;
  }

  return searchSongs(query)
    .then((songs) =>
      Promise.all(songs.map(({ id }: any) => getSongDetails(id)))
    )
    .then((songs) =>
      songs.map(
        (song: any) =>
          ({
            slug: song.id,
            title: song.title,
            details: {
              album: song.album && {
                name: song.album.name,
                url: song.album.url,
              },
              primary_artist: song.primary_artist && {
                name: song.primary_artist.name,
                url: song.primary_artist.url,
              },
              featured_artists: song.featured_artists?.map((a: any) => ({
                name: a.name,
                url: a.url,
              })),
              release_date: song.release_date,
              media:
                song.media?.map(({ provider, url }: any) => ({
                  name: provider,
                  url,
                })),
            },
            image_url:
              song.song_art_image_url ||
              song.header_image_url ||
              song.album?.cover_art_url,
            type: Category.Song,
            url: song.url,
          } as Song)
      )
    )
    .catch((err) => (console.error(`Error getting songs: ${err}: ${err.stack}`), null));
};

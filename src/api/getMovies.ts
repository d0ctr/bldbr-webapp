'use server';

import {
    ActionResult,
    Category,
    dumpURLSearchParams,
    ErrorMessage,
    getActionError,
    getActionSuccess,
    ResultData,
} from '@/utils/shared';

require('dotenv').config();

export interface Movie extends ResultData {
    slug: string;
    image_url?: string;
    title: string;
    details: {
        overview: string;
        released?: string;
    };
    type: Category.Movie;
}

export const getMovies = async (
    query: string,
    page = 1,
    page_size = 10
): Promise<ActionResult> => {
    if (typeof process.env.TMDB_TOKEN != 'string' || !process.env.TMDB_TOKEN) {
        return getActionError(ErrorMessage.SERVICE_NOT_AVAILABLE);
    }

    return await fetch(
        'https://api.themoviedb.org/3/search/movie?' +
            dumpURLSearchParams({
                query,
                page,
                page_size,
            }),
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
            },
        }
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
        .then(({ results: movies }) =>
            !movies.length
                ? []
                : movies.map((movie: any) => ({
                      slug: movie.id,
                      title: movie.title,
                      url: `https://themoviedb.org/movie/${movie.id}`,
                      image_url: movie.poster_path || movie.backdrop_path
                          ? `https://image.tmdb.org/t/p/w780${movie.poster_path || movie.backdrop_path}`
                          : null,
                      details: {
                          overview: movie.overview,
                          released: movie.release_date,
                      },
                  }))
        )
        .then((r) => getActionSuccess(r))
        .catch((err) => {
            console.error(
                `Error getting movies: ${JSON.stringify(err)} ${err.toString()}`
            );
            return getActionError(ErrorMessage.REQUEST_ERROR);
        });
};

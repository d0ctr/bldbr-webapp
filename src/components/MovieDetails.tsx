import { Movie } from '@/api/getMovies';

export default function MovieDetails({
    details: { released, overview },
}: {
    details: Movie['details'];
}) {
    return (
        <>
            {released && (
                <div>
                    <b>Дата релиза</b>:{' '}
                    {new Date(released).toLocaleDateString('de-DE')}
                    <br />
                </div>
            )}
            {overview && (
                <div>
                    <b>Синопсис</b>: {overview}
                    <br />
                </div>
            )}
        </>
    );
}

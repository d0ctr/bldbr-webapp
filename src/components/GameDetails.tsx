import { Game } from '@/api/getGames';
import { GameHLTBDetails } from './GameHLTBDetails';
import { Suspense } from 'react';

export default function GameDetails({
    details: { released, platforms, metacritic, stores },
    title,
}: {
    details: Game['details'];
    title: string;
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
            {metacritic && (
                <div>
                    <b>Metacritic</b>: {metacritic}
                    <br />
                </div>
            )}
            {platforms?.length ? (
                <div>
                    <b>Платформы</b>: {platforms.map((p) => p.name).join(', ')}
                    <br />
                </div>
            ) : null}
            {stores?.length ? (
                <div>
                    <b>Магазины</b>: {stores.map((p) => p.name).join(', ')}
                    <br />
                </div>
            ) : null}
            {released && (<Suspense><GameHLTBDetails name={title} released={released} /></Suspense>)}
        </>
    );
}

'use client';
import { HLTBDetails, getHLTBDDetails } from '@/api/getGames';
import Link from './Link';
import { useEffect, useState } from 'react';

export function GameHLTBDetails({ name, released }: {
    name: string;
    released: string;
}) {
    const [hltbDetails, setHltbDetails] = useState<HLTBDetails | null>(null);
    useEffect(() => {
        getHLTBDDetails({name, released}).then(r => setHltbDetails(r))
    }, [name, released]);

    return hltbDetails == null || !hltbDetails.playtimes.length ? (<></>) : (
        <div>
            <Link href={hltbDetails.url}>
                <b>HLTB</b>
            </Link>
            :<br />
            {hltbDetails.playtimes.map(({ name, value }, i) => (
                <div key={i} className='indent-4'>
                    {name}: {value}
                    <br />
                </div>
            ))}
        </div>
    );
}

'use client';
import { HLTBDetails, getHLTBDDetails } from '@/api/getGames';
import Link from './Link';
import { useEffect, useState } from 'react';
import { Skeleton } from '@nextui-org/skeleton';

export function GameHLTBDetails({
    name,
    released,
}: {
    name: string;
    released: string;
}) {
    const [hltbDetails, setHltbDetails] = useState<HLTBDetails | null>(null);
    const [isLoaded, setLoaded] = useState(false);
    useEffect(() => {
        getHLTBDDetails({ name, released }).then((r) => setHltbDetails(r)).finally(() => setLoaded(true));
    }, [name, released]);

    if (!isLoaded) {
        return (<Skeleton isLoaded={isLoaded} className='h-6 w-1/3 rounded-lg'/>);
    }

    return hltbDetails == null || !hltbDetails.playtimes.length ? (
        <></>
    ) : (
        <div>
            <details>
                <summary>
                    <Link href={hltbDetails.url}>
                        <b>HLTB</b>
                    </Link>
                </summary>
                {hltbDetails.playtimes.map(({ name, value }, i) => (
                    <div key={i} className='indent-4'>
                        {name}: {value}
                        <br />
                    </div>
                ))}
            </details>
        </div>
    );
}

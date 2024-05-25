'use client';

import Header from '@/components/Header';
import { Category, ResultData } from '@/utils/shared';
import { permanentRedirect } from 'next/navigation';
import { useFormState } from 'react-dom';
import { handleForm } from '../actions';
import { getGames } from '@/api/getGames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Results from '@/components/Results';
import { getSongs } from '@/api/getSongs';
import { getConversion } from '@/api/getCurrency';

export default function CategorySearch({
    params: { category },
    searchParams: { q, from, to },
}: {
    params: { category?: string; };
    searchParams: { q?: string; from?: string; to?: string; };
}) {
    const selectedCategory = Object.values(Category).find(
        (v) => v.toString() === category
    );
    if (!selectedCategory) permanentRedirect('/');

    const [formResults, formAction] = useFormState(handleForm, []);
    const [results, setResults] = useState<ResultData[] | null>([]);
    const [error, setError] = useState(false);

    const parseResults = useCallback((newResults: ResultData | ResultData[] | null) => {
        if (newResults === undefined) {
            setResults([]);
        }
        else if (newResults === null || Array.isArray(newResults)) {
            setResults(newResults);
        }
        else {
            setResults(prev => prev ? [newResults, ...prev] : [newResults]);
        }
    }, []);

    useEffect(() => {
        if (q) {
            let promise;
            switch(selectedCategory) {
                case Category.Game:
                    promise = getGames(q);
                    break;
                case Category.Song:
                    promise = getSongs(q);
                    break;
                case Category.Currency:
                    const amount = Number(q);
                    if (from && to && !isNaN(amount)) promise = getConversion(from, to, amount);
                    break;
            }
            promise && promise.then(parseResults);
        }
        console.log([q, from, to]);
    }, [q, from, to, selectedCategory, parseResults]);

    useEffect(() => {
        formResults !== undefined && parseResults(formResults);
    }, [formResults, parseResults]);

    useEffect(() => {
        if (results === null) setError(true);
        return () => setError(false);
    }, [results]);

    return (
        <main className='flex flex-row justify-center min-h-screen min-w-80 bg-background text-foregound'>
            <div className='flex flex-col justify-start items-center gap-4 max-w-lg py-4'>
                <Header
                    selectedCategory={selectedCategory}
                    action={formAction}
                    value={q}
                    error={error}
                />
                {results && <Results results={results} type={selectedCategory}/>}
            </div>
        </main>
    );
}

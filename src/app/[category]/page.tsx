'use client';

import Header from '@/components/Header';
import { Category, ResultData } from '@/utils/shared';
import { permanentRedirect } from 'next/navigation';
import { handleForm } from '../actions';
import { useCallback, useEffect, useState } from 'react';
import Results from '@/components/Results';

export default function CategorySearch({
    params: { category },
    searchParams: { query, from, to },
}: {
    params: { category?: string };
    searchParams: { query?: string; from?: string; to?: string };
}) {
    const selectedCategory = Object.values(Category).find(
        (v) => v.toString() === category,
    );
    if (!selectedCategory) permanentRedirect('/game');

    const [results, setResults] = useState<ResultData[] | null>([]);
    const [error, setError] = useState(false);

    const parseResults = useCallback(
        (newResults: ResultData | ResultData[] | null) => {
            if (newResults === undefined) {
                setResults([]);
            } else if (newResults === null || Array.isArray(newResults)) {
                setResults(newResults);
            } else {
                setResults((prev) =>
                    prev ? [newResults, ...prev] : [newResults],
                );
            }
        },
        [],
    );

    useEffect(() => {
        if (query) {
            handleForm({ category: selectedCategory, value: query, args: { from, to } }).then((r) => parseResults(r));
        }
        console.log([query, from, to]);
    }, [query, from, to, selectedCategory, parseResults]);

    useEffect(() => {
        if (results === null) setError(true);
        return () => setError(false);
    }, [results]);

    return (
        <main className='flex flex-row justify-center min-h-screen min-w-80 bg-background text-foregound'>
            <div className='flex flex-col justify-start items-center gap-4 max-w-lg py-4'>
                <Header
                    selectedCategory={selectedCategory}
                    onResults={(r) => parseResults(r)}
                    value={query}
                    error={error}
                />
                {results && (
                    <Results results={results} type={selectedCategory} />
                )}
            </div>
        </main>
    );
}

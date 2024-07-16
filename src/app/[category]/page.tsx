'use client';

import Header from '@/components/Header';
import { parseCategory, ResultData } from '@/utils/shared';
import { permanentRedirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchActionResult, getCategorySearch, handleForm } from '../actions';
import { useCallback, useEffect, useRef, useState } from 'react';
import Results from '@/components/Results';
import { useFormState } from 'react-dom';
import { useInView } from 'framer-motion';
import { Spinner } from '@nextui-org/spinner';

export default function CategorySearch({
    params: { category }
}: {
    params: { category?: string };
}) {
    const selectedCategory = parseCategory(category);
    if (!selectedCategory) permanentRedirect('/game');

    const searchParams = useSearchParams()
    const [results, setResults] = useState<ResultData[]>([]);
    const [error, setError] = useState(false);
    const [formResults, formAction] = useFormState(handleForm, null);

    const query = searchParams.get('query') || '';

    // const loadRef = useRef(null);
    // const isInView = useInView(loadRef);
    // const [hasMore, setHasMore] = useState(false);

    // const [loadMore, setLoadMore] = useState(false);
    // const [isUpdating, setIsUpdating] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    const parseResults = useCallback((newResults: SearchActionResult) => {
        // setIsUpdating(false);
        if (newResults === null) return;
        // console.log(`new results: ${JSON.stringify({...newResults, data: newResults.status === 'error' || newResults.data?.length})}`);

        if (newResults.status === 'ok' ) {
            if (newResults.page > 1 && Array.isArray(results)) {
                setResults([...results, ...newResults.data]);
            }
            else {
                setResults(newResults.data);
            }
            // setHasMore(!newResults.end);
            router.push(`${pathname}?${newResults.searchParams}`, { scroll: false });
        }
        else if (newResults.status === 'error') {
            setError(true);
        }
        
    }, [setResults, results, router /** , hasMore, setIsUpdating */]);

    useEffect(() => {
        if (query) {
            const args = searchParams.entries();
            // setLoadMore(false);
            // setIsUpdating(true);
            const payload = {
                category: selectedCategory,
                query,
                page: 1,
                ...Object.fromEntries(args),
            }
            // if (loadMore) payload.page = Number(payload.page) + 1;
            
            // console.log(`querying... ${JSON.stringify(payload)}`);
            getCategorySearch(payload).then((r) => parseResults(r));
        }
    }, [query /** , loadMore  */]);

    useEffect(() => {
        parseResults(formResults);
    }, [formResults]);
    
    // useEffect(() => {
    //     if (isInView && hasMore && !loadMore && !isUpdating) {
    //         console.log("Element is in view: ", isInView);
    //         setLoadMore(true);
    //     }
    // }, [hasMore, isInView, loadMore, isUpdating]);

    useEffect(() => {
        if (error) {
            setError(() => false);
        }
    }, [error]);


    return (
        <main className='flex flex-row justify-center min-h-screen min-w-80'>
            <div className='flex flex-col justify-start gap-4 py-4 max-w-lg w-full' >
                <Header
                    selectedCategory={selectedCategory}
                    value={query}
                    action={formAction}
                    error={error}
                />
                {results && (
                    <Results results={results} type={selectedCategory} />
                )}
                {/* <div ref={loadRef} className={`w-full flex flex-row justify-center ${hasMore ? '' : 'hidden'}`} ><Spinner color='default' ></Spinner></div> */}
            </div>
        </main>
    );
}

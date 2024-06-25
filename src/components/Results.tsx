import { Category, isCallback, ResultData } from '@/utils/shared';
import { ResultCard } from './ResultCard';
import { MutableRefObject } from 'react';

export default function Results({
    results = [],
    type,
    loadRef,
}: {
    results: ResultData[];
    type: Category;
    loadRef?: MutableRefObject<any>;
}) {
    if (!results.length) return;
    

    return (
        <div className='gap-4 px-2 flex flex-col'>
            {results == null || !results.length
                ? ''
                : results.map((result, i) => (
                      <ResultCard
                          key={result.slug}
                          {...result}
                          type={type}
                          callback={
                              result.slug && isCallback(type) ? `${type}:${result.slug}` : null
                          }
                          loadRef={results.length - 1 === i ? loadRef : undefined}
                      />
                  ))}
        </div>
    );
}

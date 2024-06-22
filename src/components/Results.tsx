import { Category, isCallback, ResultData } from '@/utils/shared';
import { ResultCard } from './ResultCard';

export default function Results({
    results = [],
    type,
}: {
    results: ResultData[];
    type: Category;
}) {
    if (!results.length) return;

    return (
        <div className='gap-4 px-2 flex flex-col'>
            {results == null || !results.length
                ? ''
                : results.map((result) => (
                      <ResultCard
                          key={result.slug}
                          {...result}
                          type={type}
                          callback={
                              result.slug && isCallback(type) ? `${type}:${result.slug}` : null
                          }
                      />
                  ))}
        </div>
    );
}

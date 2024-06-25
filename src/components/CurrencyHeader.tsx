'use client';

import { useState } from 'react';
import CurrencySelector from './CurrencySelector';
import { USD, TON } from '@/utils/shared';
import { Exchange } from '@/icons';
import { Button } from '@nextui-org/react';

export default function CurrencyHeader() {
    const [reverseConversion, setReverseConversion] = useState(false);
    // const searchParams = useSearchParams();
    // const [[fromCurrency, setFromCurrency], [toCurrency, setToCurrency]] = [
    //     useState(USD),
    //     useState(TON),
    // ];

    // const [from, to] = [
    //     Number(searchParams.get('from')),
    //     Number(searchParams.get('to')),
    // ];

    // const setDefault = useCallback(([from, to]: (Currency | undefined)[]) => {
    //     if (from && to) {
    //         setFromCurrency(from);
    //         setToCurrency(to);
    //     }
    // }, [setFromCurrency, setToCurrency])

    // useEffect(() => {
    //     if (isNaN(from) && isNaN(to)) return;
    //     const { signal } = new AbortController();
    //     getCurrenciesPairById({ from, to, signal }).then(r => setDefault(r));
    // }, [from, to, setDefault]);

    return (
        <div
            className={`flex flex-row min-w-full min-h-12 max-h-12 gap-x-2 max-w-full ${
                reverseConversion ? 'flex-row-reverse' : ''
            }`}
        >
            <CurrencySelector
                classNames='flex-1'
                name={reverseConversion ? 'to' : 'from'}
                defaultCurrency={USD}
            ></CurrencySelector>
            <Button
                className='flex-none h-full w-12 pr-0.5 data-[hover=true]:border-blue-500 hover:text-blue-500 bg-default hover:bg-default-100'
                variant='bordered'
                isIconOnly
                onClick={() => setReverseConversion((prev) => !prev)}
            >
                <Exchange size={32}></Exchange>
            </Button>
            <CurrencySelector
                classNames='flex-1'
                name={reverseConversion ? 'from' : 'to'}
                defaultCurrency={TON}
            ></CurrencySelector>
        </div>
    );
}

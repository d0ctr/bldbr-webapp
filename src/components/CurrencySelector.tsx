'use client';
import { Currency, getCurrenciesList } from '@/api/getCurrency';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useAsyncList } from '@react-stately/data';
import { useState } from 'react';

function useCurrencyList(...initialItems: (Currency | any)[]) {
    const limit = 10;

    const list = useAsyncList<Currency, number>({
        async load({ filterText, cursor = 0 }) {
            let res = await getCurrenciesList({
                search: filterText,
                limit,
                offset: cursor,
            });

            return {
                items: res,
                cursor: cursor + limit,
            };
        },
        initialSelectedKeys: initialItems.length
            ? initialItems.map((v) => v.id)
            : undefined,
    });
    return list;
}

export default function CurrencySelector({
    classNames = '',
    isDark = false,
    name,
    defaultCurrency,
}: {
    classNames?: string;
    isDark?: boolean;
    name: string;
    defaultCurrency?: Currency;
}) {
    const { items, filterText, setFilterText, isLoading, loadMore, ...list } =
        useCurrencyList(defaultCurrency);

    const [selectedKey, setSelectedKey] = useState<
        number | string | null
    >();

    return (
        <>
            <Autocomplete
                className={'!text-foreground ' + classNames}
                items={items}
                defaultInputValue={defaultCurrency?.symbol}
                defaultItems={defaultCurrency && [defaultCurrency]}
                defaultSelectedKey={defaultCurrency?.id}
                value={filterText}
                onValueChange={setFilterText}
                isLoading={isLoading}
                isRequired
                radius='sm'
                isClearable={false}
                onLoadMore={loadMore}
                fullWidth
                classNames={{}}
                selectorButtonProps={{
                    color: 'default',
                }}
                inputProps={{
                    classNames: {
                        inputWrapper:
                            'h-full data-[hover=true]:border-blue-500 !border-default',
                        input: 'text-large !text-foreground',
                        helperWrapper: '!hidden',
                    },
                }}
                popoverProps={{
                    className: `${isDark ? 'dark' : ''} text-foreground`,
                    classNames: { base: 'w-fit', content: 'px-1' },
                }}
                onSelectionChange={setSelectedKey}
                isInvalid={false}
                validate={() => true}
                formNoValidate
                variant='bordered'
                aria-label='From Currency'
            >
                {(cur) => (
                    <AutocompleteItem
                        key={cur.id}
                        value={cur.id}
                        textValue={cur.symbol}
                    >
                        {cur.fullName}
                    </AutocompleteItem>
                )}
            </Autocomplete>
            <input
                name={name}
                hidden
                value={selectedKey || defaultCurrency?.id}
                readOnly
            ></input>
        </>
    );
}

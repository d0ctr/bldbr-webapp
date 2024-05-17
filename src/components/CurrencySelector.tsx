'use client';
import { Currency, getCurrenciesList } from '@/api/getCurrency'
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { useEffect, useState } from 'react';

function useCurrencyList({ fetchDelay = 0 } = {}) {
  const [items, setItems] = useState<Currency[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [filterText, setFilterText] = useState('');
  const limit = 10;

  const loadCurrencies = async (currentOffset: number, currentFilterText: string) => {
    try {
      setIsLoading(true);

      if (offset > 0) {
        // Delay to simulate network latency
        await new Promise((resolve) => setTimeout(resolve, fetchDelay));
      }

      let res = await getCurrenciesList({ limit, offset: currentOffset, search: currentFilterText });

      setHasMore(!!res.length);
      // Append new results to existing ones
      if (offset === 0) {
        setItems(res);
      }
      else {
        setItems((prevItems) => [...prevItems, ...res]);
      }
    } catch (error) {
      console.error("There was an error with the fetch operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurrencies(offset, filterText);
  }, []);

  const onLoadMore = () => {
    const newOffset = offset + limit;

    setOffset(newOffset);
    loadCurrencies(newOffset, filterText);
  };

  const onFilterText = (text: string) => {
    setOffset(0);
    setFilterText(text);
    loadCurrencies(0, text);
  }

  return {
    items,
    hasMore,
    isLoading,
    onLoadMore,
    onFilterText,
  };
}

export default function CurrencySelector() {
  const { items, hasMore, isLoading, onLoadMore, onFilterText } = useCurrencyList({ fetchDelay: 1500 });
  const [isOpen, setIsOpen] = useState(false);
  const [, scrollerRef] = useInfiniteScroll({
    hasMore,
    isEnabled: isOpen,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
    onLoadMore,
  });

  return (
    <>
      <Autocomplete name='from' onInputChange={onFilterText} defaultItems={items} isLoading={isLoading} scrollRef={scrollerRef} onOpenChange={setIsOpen} aria-label='From Currency' >
        {
          (cur) => (
            <AutocompleteItem key={cur.id} value={cur.id} textValue={cur.name}>
              {cur.fullName}
            </AutocompleteItem>
          )
        }
      </Autocomplete>
    </>
  )
}


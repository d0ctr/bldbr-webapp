'use client';
import { getGames } from '@/api/getGames';
import ResultCard from '@/components/ResultCard';
import {
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  SelectedItems,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import getTelegram, { hapticError } from '@/utils/telegram';
import * as Icons from '@/icons';
import { Category, CategoryConfig, ResultData, defaultFromCurrency, defaultToCurrency } from '@/utils/shared';
import { getSongs } from '@/api/getSongs';
import CurrencySelector from '@/components/CurrencySelector';
import { getConversion } from '@/api/getCurrency';

const categories: CategoryConfig[] = [
  { value: Category.Game, label: <Icons.Game size={32} />, active: true },
  { value: Category.Song, label: <Icons.Song size={32} />, active: true },
  {
    value: Category.Currency,
    label: <Icons.Currency size={32} />,
    active: true,
  },
  // { value: 'get', label: '🔗'},
  // { value: 'llm', label: '🤖'},
];

const SubmitData = ({
  className,
  hasFailed = false,
}: {
  className?: string;
  hasFailed?: boolean;
}) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className={className}
      aria-label='Choose category'
      isIconOnly
      isLoading={pending}
      color={hasFailed ? 'danger' : 'default'}
      disabled={hasFailed}
      variant='bordered'
      type='submit'
      disableAnimation
    >
      {hasFailed ? <Icons.Cross size={32} /> : <Icons.PaperPlane size={32} />}
    </Button>
  );
};

export default function Home() {
  const [results, setResults] = useState<ResultData[] | null>([]);
  const [hasFailed, setFailed] = useState<boolean>(false);
  const [category, setCategory] = useState<Category>(Category.Game);
  const [isDark, setDark] = useState<boolean>(true);
  const [queryValue, setQueryValue] = useState('');
  const [reverseConversion, setReverseConversion] = useState(false);

  const handleForm = async (formData: FormData) => {
    const query = formData.get('query');
    if (typeof query != 'string') return;

    let results: ResultData[] | null = [];

    if (formData.get('category') === Category.Game) {
      results = await getGames(query);
      setCategory(Category.Game);
      setResults(results);
    } else if (formData.get('category') === Category.Song) {
      results = await getSongs(query);
      setCategory(Category.Song);
      setResults(results);
    } else if (formData.get('category') === Category.Currency) {
      const from = formData.get('from') as string;
      const to = formData.get('to') as string;
      const amount = Number(query);
      if (from && to && !isNaN(amount)) {
        const conversion = await getConversion(from, to, amount);
        if (conversion === null) return setFailed(true);
        setResults((prev) => (prev === null ? [conversion] : [conversion, ...prev]));
      }
    }
  };

  useEffect(() => {
    if (results == null) {
      setFailed(true);
      setResults([]);
    }
  }, [results]);

  useEffect(() => {
    if (hasFailed) {
      hapticError();
      setTimeout(() => {
        setFailed(false);
      }, 2000);
    }
  }, [hasFailed]);

  useEffect(() => {
    const tg = getTelegram();
    if (tg != null) {
      const syncDark = () => setDark(tg.WebApp.colorScheme == 'dark');
      syncDark();

      tg.WebApp.onEvent('themeChanged', syncDark);
      return () => tg.WebApp.offEvent('themeChanged', syncDark);
    }
  }, []);

  const exchangeValues = () => {
    setReverseConversion((prev) => !prev);
  };

  return (
    <main
      className={
        (isDark ? 'dark' : '') +
        ' flex flex-row justify-center min-h-screen min-w-80 bg-background text-foregound'
      }
    >
      <div className='flex flex-col justify-start items-center gap-4 max-w-lg py-4'>
        <form
          className='flex flex-col px-2 w-full gap-y-2'
          action={handleForm}
        >
          <div className='flex flex-row gap-2 min-h-12 min-w-full'>
            <Select
              items={categories.filter((c) => c.active)}
              name='category'
              className='flex-none w-12 text-foreground hover:text-blue-500'
              radius='sm'
              selectionMode='single'
              classNames={{
                base: '',
                mainWrapper: 'h-full',
                selectorIcon: 'hidden',
                trigger:
                  'h-full m-0 p-0 bg-default border-default data-[hover=true]:bg-default-100 data-[hover=true]:border-blue-500',
                innerWrapper: 'w-full h-full ',
                value: 'group-data-[has-value=true]:text-current',
              }}
              popoverProps={{
                className: `${isDark ? 'dark' : ''} text-foreground`,
                classNames: { base: 'w-fit', content: 'px-1' },
              }}
              selectorIcon={<></>}
              defaultSelectedKeys={['game']}
              variant='bordered'
              isRequired
              disallowEmptySelection
              aria-label='Category'
              onSelectionChange={(keys) => {
                if (keys === 'all' || keys.size === 0) return;
                setCategory(keys.values().next().value as Category);
                setQueryValue('');
                setResults([]);
              }}
              renderValue={(items: SelectedItems<CategoryConfig>) =>
                items.map((item) => (
                  <div key={item.key} className='flex justify-center'>
                    {item.data?.label}
                  </div>
                ))
              }
            >
              {(cat) => (
                <SelectItem
                  key={cat.value}
                  value={cat.value}
                  textValue={cat.value}
                >
                  {cat.label}
                </SelectItem>
              )}
            </Select>
            <Input
              className='flex-1 text-foreground data-[hover=true]:border-blue-500'
              radius='sm'
              classNames={{
                inputWrapper:
                  'h-full data-[hover=true]:border-blue-500 text-large',
                input: 'text-large',
              }}
              variant='bordered'
              value={queryValue}
              onValueChange={(value) => {
                if (category === Category.Currency) {
                  const amount = Number(value);
                  if (isNaN(amount)) return setQueryValue((prev) => prev);
                }
                setQueryValue(value);
              }}
              type='text'
              name='query'
              required
            />
            <SubmitData
              className='flex-none h-full w-12 pr-0.5 data-[hover=true]:border-blue-500 enabled:hover:text-blue-500 enabled:bg-default enabled:hover:bg-default-100'
              hasFailed={hasFailed}
            />
          </div>
          {category === Category.Currency && (
            <div className={`flex flex-row min-w-full min-h-12 max-h-12 gap-x-2 max-w-full ${reverseConversion ? 'flex-row-reverse' : ''}`}>
              <CurrencySelector
                classNames='flex-1'
                isDark={isDark}
                name={reverseConversion ? 'to' :'from'}
                defaultCurrency={defaultFromCurrency}
              ></CurrencySelector>
              <Button
                className='flex-none h-full w-12 pr-0.5 data-[hover=true]:border-blue-500 hover:text-blue-500 bg-default hover:bg-default-100'
                variant='bordered'
                disableAnimation
                isIconOnly
                onClick={exchangeValues}
              >
                <Icons.Exchange size={32}></Icons.Exchange>
              </Button>
              <CurrencySelector
                classNames='flex-1'
                isDark={isDark}
                name={reverseConversion ? 'from' : 'to'}
                defaultCurrency={defaultToCurrency}
              ></CurrencySelector>
            </div>
          )}
        </form>
        <Divider className='overflow-visible min-w-full w-[95vw]' />
        <div className='gap-4 px-2 flex flex-col'>
          {results == null || !results.length
            ? ''
            : results.map((result) => (
                <ResultCard
                  key={result.slug}
                  {...result}
                  type={category}
                  callback={`${category}:${result.slug}`}
                />
              ))}
        </div>
      </div>
    </main>
  );
}

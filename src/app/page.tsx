"use client"
import { getResults } from '@/api/getGames';
import ResultCard from '@/components/ResultCard';
import PaperPlane from '@/icons/PaperPlane';
import { Button, Divider } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import type { Game } from '@/api/getGames';
import { useFormStatus } from 'react-dom';
import Cross from '@/icons/Cross';
import getTelegram, { getAsyncTelegram, hapticError } from '@/utils/telegram';

const categories = [
  { value: 'game', label: '🎮'},
  // { value: 'genius', label: '🎵'},
  // { value: 'get', label: '🔗'},
  // { value: 'llm', label: '🤖'},
];

const SubmitData = ({ className, hasFailed = false }: { className?: string, hasFailed?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button className={className} aria-label='Choose category' isIconOnly isLoading={pending} color={hasFailed ? 'danger' : 'default'} disabled={hasFailed} type='submit'>
      {hasFailed ? <Cross size={32}/> : <PaperPlane size={32}/>}
    </Button>
  )
}

export default function Home() {
  const [results, setResults] = useState<Game[] | null>([]);
  const [hasFailed, setFailed] = useState<boolean>(false);
  const [category, setCategory] = useState<'game' | 'genius' | 'get' | null>();
  const [isDark, setDark] = useState<boolean>(false);

  const handleForm = async (formData: FormData) => {
    if (formData.get('category') === 'game') {
      const games = await getResults(formData);
      setResults(games);
      setCategory('game');
    }
  }

  useEffect(() => {
    if (results == null) {
      hapticError();
      setFailed(true);
      setTimeout(() => {
        setResults([]);
        setFailed(false)
      }, 2000);
    }
  }, [results]);

  useEffect(() => {
    const tg = getTelegram();
    if (tg != null) {
      tg.WebApp.onEvent('themeChanged', () => {
        setDark(tg.WebApp.colorScheme == 'dark');
      })
  
      setDark(tg.WebApp.colorScheme == 'dark');
    }
  });


  return (
    <main className={(isDark ? 'dark ' : '') + 'flex flex-row justify-center min-h-screen min-w-80 bg-background text-foregound'}>
      <div className='flex flex-col justify-start items-center gap-4 max-w-lg py-4'>
        <form className='flex flex-row gap-2 h-12 px-2 min-w-full' action={handleForm}>
          <select className='flex-none pl-2 text-3xl w-12 rounded-md outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 bg-default hover:bg-default-100' style={{appearance: 'none'}} defaultValue={category || 'game'} name='category'>
              {
                categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)
              }
          </select>
          <input className='flex-1 px-2 min-w-0 w-full h-full text-large outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 bg-default hover:bg-default-100 text-foreground' type='text' name='query' style={{appearance: 'none'}} required/>
          <SubmitData className='flex-none h-full w-12 pr-0.5 rounded-md disabled:outline-none outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 enabled:hover:text-blue-500 enabled:bg-default enabled:hover:bg-default-100' hasFailed={hasFailed}/>
        </form>
        <Divider className='w-screen overflow-visible'/>
        <div className='gap-4 mx-2 overflow-visible flex flex-col'>
          { results == null || !results.length ? '' : results.map(result => <ResultCard key={result.slug} {...result} callback={`${category}:${result.slug}`}/>)}
        </div>
      </div>
    </main>
  );
}

"use client"
import { getResults } from '@/api/getGames';
import ResultCard from '@/components/ResultCard';
import PaperPlane from '@/icons/PaperPlane';
import { Button, Divider, Spinner } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import type { Game } from '@/api/getGames';
import { useFormStatus } from 'react-dom';

const categories = [
  { value: 'game', label: '🎮'},
  // { value: 'genius', label: '🎵'},
  // { value: 'get', label: '🔗'},
  // { value: 'llm', label: '🤖'},
];

const SubmitData = ({ className, hasFailed = false }: { className?: string, hasFailed?: boolean }) => {
  const { pending } = useFormStatus();
  const [isFailed, setFailed] = useState<boolean>(hasFailed);
  
  useEffect(() => {
    if (isFailed) {
      setTimeout(() => {
        setFailed(false);
      }, 2000);
    }
  });

  return (
    <Button className={className} aria-label='Choose category' isIconOnly isLoading={pending} type='submit'>
      <PaperPlane size={32}/>
    </Button>
  )
}

export default function Home() {
  const [results, setResults] = useState<Game[]>([]);
  const [hasFailed, setFailed] = useState<boolean>(false);
  const [category, setCategory] = useState<'game' | 'genius' | 'get' | null>();
  const handleForm = async (formData: FormData) => {
    if (formData.get('category') === 'game') {
      const games = await getResults(formData);
      if (games == null) {
        setFailed(true);
      }
      else {
        setResults(games);
        setCategory('game');
      }
    }
  }

  return (
    <main className='flex flex-row justify-center min-h-screen min-w-screen bg-background text-foregound '>
      <div className='flex flex-col justify-start items-center gap-4 max-w-lg py-4'>
        <form className='flex flex-row gap-2 h-12 px-4 min-w-full' action={handleForm}>
          <select className='flex-none pl-2 text-3xl w-12 rounded-md outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 bg-default hover:bg-default-100' style={{appearance: 'none'}} defaultValue={category || 'game'} name='category'>
              {
                categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)
              }
          </select>
          <input className='flex-1 px-2 text-large outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 rounded-md bg-default hover:bg-default-100' type='text' name='query' style={{appearance: 'none'}} required/>
          <SubmitData className='flex-none h-full w-12 outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 hover:text-blue-500 bg-default rounded-md hover:bg-default-100 text-black' hasFailed/>
        </form>
        <Divider className='w-screen overflow-visible'/>
        <div className='gap-4 mx-2 overflow-visible flex flex-col'>
          {!results.length ? '' : results.map(result => <ResultCard key={result.slug} {...result} callback={`${category}:${result.slug}`}/>)}
        </div>
      </div>
    </main>
  );
}

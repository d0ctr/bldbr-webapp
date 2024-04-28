"use client"
import { getResults } from '@/api/getGames';
import ResultCard from '@/components/ResultCard';
import PaperPlane from '@/icons/PaperPlane';
import { Divider } from '@nextui-org/react';
import { useState } from 'react';
import type { Game } from '@/api/getGames';
import Share from '@/icons/Share';

const categories = [
  { value: 'game', label: '🎮'},
  { value: 'genius', label: '🎵'},
  { value: 'get', label: '🔗'},
  { value: 'llm', label: '🤖'},
];

export default function Home() {
  const [results, setResults] = useState<Game[]>([]);
  const [category, setCategory] = useState<'game' | 'genius' | 'get' | null>();
  const handleForm = async (formData: FormData) => {
    if (formData.get('category') === 'game') {
      const games = await getResults(formData);
      if (games == null) {
        //
      }
      else {
        setResults(games);
        setCategory('game');
      }
    }
  }

  return (
    <main className='dark flex min-h-screen flex-col justify-start gap-4 min-w-screen'>
      <form className='flex flex-row mx-2 gap-2 h-12 mt-5' action={handleForm}>
        <select className='flex-none px-3 rounded-md outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 bg-default hover:bg-default-100' style={{appearance: 'none'}} name='category'>
            {
              categories.map((cat) => <option key={cat.value} value={cat.value}>{cat.label}</option>)
            }
        </select>
        <input className='flex-1 px-2 outline outline-2 outline-offset-1 min-w-20 outline-transparent hover:outline-blue-500 rounded-md bg-default hover:bg-default-100' type='text' name='query' style={{appearance: 'none'}} required/>
        <button className='flex-none px-2 outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 hover:text-blue-500 bg-default text-black rounded-md hover:bg-default-100' aria-label='Choose category'><PaperPlane size={36}/></button>
      </form>
      <Divider/>
      {!results.length ? '' : results.map(result => <ResultCard key={result.slug} {...result} callback={`${category}:${result.slug}`}/>)}
    </main>
  );
}

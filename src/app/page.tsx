import { PaperAirplaneIcon } from '@primer/octicons-react';
import { useFormState } from 'react-dom';

export default function Home() {
  async function getResults(formData: FormData) {
    "use server"
    console.log(formData.get('query'))
    console.log(formData.get('category'))
  }
  return (
    <main className='flex min-h-screen flex-col items-stretch justify-between pt-5'>
      <form className='flex flex-row mx-4 gap-2 h-12' action={getResults}>
        <select className=' bg-white px-2 rounded-md outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 text-lg' style={{appearance: 'none'}} name='category'>
          <option value='game'>🎮</option>
          <option value='genius'>🎵</option>
          <option value='get'>🔗</option>
        </select>
        <input className='flex-1 px-2 outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 rounded-md text-black' type='text' name='query' style={{appearance: 'none'}}/>
        <button className='flex-none text-black bg-white px-2 pb-0.5 outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 rounded-md' type='submit'><PaperAirplaneIcon ></PaperAirplaneIcon></button>
      </form>
    </main>
  );
}

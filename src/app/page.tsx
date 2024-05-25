import Header from '@/components/Header';

export default function Home() {
    return (
        <main className='flex flex-row justify-center min-h-screen min-w-80 bg-background text-foregound'>
            <div className='flex flex-col justify-start items-center gap-4 max-w-lg py-4'>
                <Header />
            </div>
        </main>
    );
}

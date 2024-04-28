import type { Game } from '@/api/getGames';
import Share from '@/icons/Share';
import { Card, CardBody, CardFooter, CardHeader, Image } from '@nextui-org/react';

export default function ResultCard({ title, image_url, text, callback }: Game & { callback: string }) {
    async function processRedirect(formData: FormData) {
        console.log('Sharing ' + formData.get('callback'));
    }

    return (
        <Card className='flex flex-col justify-center mx-2 hover:shadow-lg'>
            {image_url
                ?
                <CardHeader className='flex-col'>
                    <Image radius='md' src={image_url} alt={title} width={500} height={500} className='z-0 select-none'/>
                    <div className='z-10 flex flex-col justify-end w-full max-w-[500px] bg-gradient-to-t from-black to-transparent text-center -mt-36 h-36 rounded-md'>
                        <div className='pb-4 px-2 font-bold'>{title}</div>
                    </div>
                </CardHeader>
                :
                <CardHeader className='flex flex-row justify-center text-center'>
                    <h1 className='w-full max-w-[500px] font-bold'>{title}</h1>
                </CardHeader>
            }
            <CardBody className='pt-0'>
                <p className='whitespace-pre-wrap'>{text}</p>
            </CardBody>
            <CardFooter className='pt-0 overflow-visible'>
                <form className='w-full ' action={processRedirect}>
                    <input hidden name='callback' value={callback} readOnly></input>
                    <button className='w-full p-2 flex flex-row justify-center outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 hover:text-blue-500 bg-default rounded-md hover:bg-default-100' type='submit'>
                        <Share size={24} className='mr-2' />
                        Отправить
                    </button>
                </form>
            </CardFooter>
        </Card>
    )
}
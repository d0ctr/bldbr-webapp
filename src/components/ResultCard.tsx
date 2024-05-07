import Share from '@/icons/Share';
import getTelegram, { switchInlineQuery } from '@/utils/telegram';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
} from '@nextui-org/react';
import GameDetails from './GameDetails';
import { Category, ResultData } from '@/utils/shared';
import SongDetails from './SongDetails';

export default function ResultCard({
  title,
  image_url,
  details,
  type,
  callback,
  url,
}: ResultData & { callback?: string }) {
  async function processRedirect(formData: FormData) {
    const callback = formData.get('callback');
    switchInlineQuery(`/c ${callback}`, [
      'users',
      'bots',
      'channels',
      'groups',
    ]);
  }

  return (
    <Card className='flex flex-col justify-center hover:shadow-lg min-w-full max-w-lg'>
      {image_url ? (
        <CardHeader className='flex-col justify-center p-0'>
          <Image
            src={image_url}
            alt={title}
            width={500}
            height={500}
            className='z-0 select-none object-cover object-center w-full max-h-72'
          />
          <div className='z-10 flex flex-col justify-end w-full bg-gradient-to-t from-black to-transparent text-center -mt-36 h-36'>
            {url ? (
              <a
                className='pb-4 px-2 font-bold text-large text-white underline hover:text-gray-300'
                href={url}
                target='_blank'
              >
                {title}
              </a>
            ) : (
              <h1 className='pb-4 px-2 font-bold text-large text-white'>
                {title}
              </h1>
            )}
          </div>
        </CardHeader>
      ) : (
        <CardHeader className='flex flex-col justify-center text-center pb-0'>
          <h1 className='w-full max-w-[500px] font-bold text-large pb-2'>
            {title}
          </h1>
          <Divider />
        </CardHeader>
      )}
      <CardBody>
        {type === Category.Game && <GameDetails details={details} />}
        {type === Category.Song && <SongDetails details={details} />}
      </CardBody>
      {getTelegram() != null && (
        <CardFooter className='pt-0 overflow-visible'>
          <form className='w-full ' action={processRedirect}>
            <input hidden name='callback' value={callback} readOnly></input>
            <button
              className='w-full p-2 flex flex-row justify-center outline outline-2 outline-offset-1 outline-transparent hover:outline-blue-500 hover:text-blue-500 bg-default rounded-md hover:bg-default-100'
              type='submit'
            >
              <Share size={24} className='mr-2' />
              Отправить
            </button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}

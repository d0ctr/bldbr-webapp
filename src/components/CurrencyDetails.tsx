import { Conversion } from '@/api/getCurrency';
import CopyButton from './CopyButton';

export default function ConversionDetails({
    details: { to, from, amount, price },
}: {
    details: Conversion['details'];
}) {
    const copyValue = `${amount.toLocaleString()} ${from.fullName} = ${price.toLocaleString()} ${to.fullName}`;
    return (
        <div className='flex flex-row items-center gap-x-2 text-large pr-6'>
            <CopyButton
                className='absolute right-1 top-1 w-10 h-10'
                copyValue={copyValue}
            ></CopyButton>
            <div className='flex-1 flex-wrap text-balance'>
                {amount.toLocaleString() + ' ' + from.fullName}
            </div>
            <div className='flex-none'>{' = '}</div>
            <div className='flex-1 flex-wrap text-balance'>
                {price.toLocaleString() + ' ' + to.fullName}
            </div>
        </div>
    );
}

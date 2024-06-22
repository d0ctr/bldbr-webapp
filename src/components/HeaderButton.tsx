'use client';
import { Cross, PaperPlane } from '@/icons';
import { Button } from '@nextui-org/button';
import { FormEvent, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

export default function HeaderButton({ error = false, onSubmit }: { error?: boolean, onSubmit?: (e: FormEvent) => void }) {
    const { pending } = useFormStatus();
    const [hasFailed, setHasFailed] = useState(false);
    useEffect(() => {
        if (error) {
            setHasFailed(true);
            setTimeout(() => {
                setHasFailed(false);
            }, 2000);
        }
    }, [error]);

    return (
        <Button
            className='flex-none h-full w-12 pr-0.5 data-[hover=true]:border-blue-500 enabled:hover:text-blue-500 enabled:bg-default enabled:hover:bg-default-100'
            aria-label='Choose category'
            isIconOnly
            isLoading={pending}
            color={hasFailed ? 'danger' : 'default'}
            disabled={hasFailed}
            variant='bordered'
            type='submit'
            onSubmit={onSubmit}
        >
            {hasFailed ? <Cross size={32} /> : <PaperPlane size={32} />}
        </Button>
    );
}

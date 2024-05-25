'use client';

import { Category } from '@/utils/shared';
import { Input } from '@nextui-org/react';
import { useCallback, useState } from 'react';

export default function HeaderInput({
    selectedCategory,
    value = '',
}: {
    selectedCategory: Category;
    value?: string;
}) {
    const [_value, setValue] = useState(value);
    const validateInput = useCallback(
        (value: string) => {
            if (selectedCategory === Category.Currency) {
                const amount = Number(value);
                if (isNaN(amount)) return setValue((prev) => prev);
            }
            setValue(value);
        },
        [selectedCategory]
    );

    return (
        <Input
            className='flex-1 text-foreground data-[hover=true]:border-blue-500'
            radius='sm'
            classNames={{
                inputWrapper:
                    'h-full data-[hover=true]:border-blue-500 text-large',
                input: 'text-large',
            }}
            value={_value}
            variant='bordered'
            onValueChange={validateInput}
            type='text'
            name='query'
            required
        />
    );
}

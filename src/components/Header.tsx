'use client';
import { categories, Category, CategoryConfig } from '@/utils/shared';

import { Select, SelectItem, SelectedItems } from '@nextui-org/select';
import HeaderButton from './HeaderButton';
import { Divider } from '@nextui-org/divider';
import { categoryChange, handleForm } from '@/app/actions';
import HeaderInput from './HeaderInput';
import CurrencyHeader from './CurrencyHeader';
import { useFormStatus } from 'react-dom';

export default function Header({
    selectedCategory = Category.Game,
    action,
    error = false,
    value = '',
}: {
    selectedCategory?: Category;
    action?: (payload: FormData) => void;
    error?: boolean;
    value?: string;
    page?: number;
}) {
    return (
        <div className='flex flex-col w-full left-0'>
            <form
                className='flex flex-col px-2 w-full gap-y-2'
                action={action}
            >
                <div className='flex flex-row gap-2 min-h-12 min-w-full'>
                    <Select
                        items={categories.filter((c) => c.active)}
                        name='category'
                        className='flex-none w-12 text-foreground hover:text-blue-500'
                        radius='sm'
                        selectionMode='single'
                        classNames={{
                            base: '',
                            mainWrapper: 'h-full',
                            selectorIcon: 'hidden',
                            trigger:
                                'h-full m-0 p-0 bg-default border-default data-[hover=true]:bg-default-100 data-[hover=true]:border-blue-500',
                            innerWrapper: 'w-full h-full ',
                            value: 'group-data-[has-value=true]:text-current',
                        }}
                        popoverProps={{
                            className: ` text-foreground`,
                            classNames: { base: 'w-fit', content: 'px-1' },
                        }}
                        selectorIcon={<></>}
                        defaultSelectedKeys={[selectedCategory]}
                        variant='bordered'
                        isRequired
                        disallowEmptySelection
                        aria-label='Category'
                        onSelectionChange={categoryChange}
                        renderValue={(items: SelectedItems<CategoryConfig>) =>
                            items.map((item) => (
                                <div
                                    key={item.key}
                                    className='flex justify-center'
                                >
                                    {item.data?.label}
                                </div>
                            ))
                        }
                    >
                        {(cat) => {
                            return (
                                <SelectItem
                                    key={cat.value}
                                    value={cat.value}
                                    textValue={cat.value}
                                >
                                    {cat.label}
                                </SelectItem>
                            );
                        }}
                    </Select>
                    <HeaderInput
                        selectedCategory={selectedCategory}
                        value={value}
                    />
                    <HeaderButton error={error} />
                </div>
                {selectedCategory === Category.Currency && <CurrencyHeader />}
            </form>
            <Divider className='mt-4 scroll-m-5' />
        </div>
    );
}

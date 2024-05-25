import { Currency, Game, Song } from '@/icons';

export enum Category {
  Game = 'game',
  Song = 'song',
  Currency = 'currency'
}

export type ResultData = {
    slug: string,
    title?: string,
    image_url?: string,
    details: object,
    type: Category,
    url?: string,
};

export type CategoryConfig = {
  value: Category;
  label: JSX.Element;
  active: boolean;
}

export const defaultFromCurrency = {
  id: 2781,
  name: 'United States Dollar',
  sign: '$',
  symbol: 'USD',
  fullName: 'United States Dollar "$" (USD)'
};

export const defaultToCurrency = {
  id: 11419,
  name: 'Toncoin',
  symbol: 'TON',
  fullName: 'Toncoin (TON)'
};

export const categories = [
  { value: Category.Game, label: (<Game size={32}/>), active: true },
  { value: Category.Song, label: (<Song size={32}/>), active: true },
  {
    value: Category.Currency,
    label: (<Currency size={32}/>),
    active: true,
  },
  // { value: 'get', label: '🔗'},
  // { value: 'llm', label: '🤖'},
];
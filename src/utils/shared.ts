import { Currency } from '@/api/getCurrency';

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
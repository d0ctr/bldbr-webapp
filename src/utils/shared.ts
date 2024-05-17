export enum Category {
  Game = 'game',
  Song = 'song',
  Currency = 'currency'
}

export type ResultData = {
    slug: string,
    title: string,
    image_url?: string,
    details: object,
    type: Category,
    url?: string,
}

export type CategoryConfig = {
  value: Category;
  label: JSX.Element;
  active: boolean;
}
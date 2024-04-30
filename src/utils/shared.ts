export enum Category {
  Game = 'game',
  Song = 'song',
}

export type ResultData = {
    slug: string,
    title: string,
    image_url?: string,
    details: object,
    type: Category,
}
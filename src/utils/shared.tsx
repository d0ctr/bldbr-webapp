import { Currency as CurrencyType } from '@/api/getCurrency';
import { Currency, Game, Song } from '@/icons';

export enum Category {
    Game = 'game',
    Song = 'song',
    Currency = 'currency',
}

export function parseCategory(value: any): Category | undefined {
    return Object.values(Category).find((v) => v.toString() === value);
}

export type ResultData = {
    slug: string;
    title?: string;
    image_url?: string;
    details: object;
    type: Category;
    url?: string;
};

export type CategoryConfig = {
    value: Category;
    label: JSX.Element;
    active: boolean;
};

export enum ActionResultStatus {
    Ok = 'ok',
    Error = 'error',
}

type ActionResultError = {
    status: ActionResultStatus.Error;
    error: string;
};

type ActionResultOk = {
    status: ActionResultStatus.Ok;
    data: ResultData[] | ResultData;
};

export type ActionResult = ActionResultError | ActionResultOk;

export const getActionError = (
    error: string | ErrorMessage
): ActionResultError => ({ status: ActionResultStatus.Error, error });
export const getActionSuccess = (
    data: ResultData | ResultData[]
): ActionResultOk => ({ status: ActionResultStatus.Ok, data });

export const USD = {
    id: 2781,
    name: 'United States Dollar',
    sign: '$',
    symbol: 'USD',
    fullName: 'United States Dollar "$" (USD)',
} as CurrencyType;

export const TON = {
    id: 11419,
    name: 'Toncoin',
    symbol: 'TON',
    fullName: 'Toncoin (TON)',
}  as CurrencyType;

export const categories = [
    { value: Category.Game, label: <Game size={32} />, active: true },
    { value: Category.Song, label: <Song size={32} />, active: true },
    {
        value: Category.Currency,
        label: <Currency size={32} />,
        active: true,
    },
    // { value: 'get', label: '🔗'},
    // { value: 'llm', label: '🤖'},
];

export const isCallback = (cat: Category) => {
    switch (cat) {
        case Category.Game:
        case Category.Song:
            return true;
        case Category.Currency:
            return false;
    }
};

export enum ErrorMessage {
    SERVICE_NOT_AVAILABLE = 'Сервис временно не доступен',
    REQUEST_ERROR = 'Ошибка на стороне сервиса, попробуйте позже',
}

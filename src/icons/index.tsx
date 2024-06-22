import { Category, CategoryConfig } from '@/utils/shared';
import Currency from './Currency';
import Game from './Game';
import Song from './Song';

export { default as Game } from './Game';
export { default as Cross } from './Cross';
export { default as PaperPlane } from './PaperPlane';
export { default as Share } from './Share';
export { default as Song } from './Song';
export { default as Currency } from './Currency';
export { default as Exchange } from './Exchange';

export function resolveCategoryIcon(
    category: Category | CategoryConfig,
): JSX.Element {
    if (typeof category !== 'string') category = category.value;
    let Icon;

    switch (category) {
        case Category.Currency:
            Icon = Currency;
        case Category.Game:
            Icon = Game;
        case Category.Song:
            Icon = Song;
    }

    return <Icon size={32} />;
}

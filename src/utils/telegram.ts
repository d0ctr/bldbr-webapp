'use client';

export default function getTelegram() {
    if (window && 'Telegram' in window) {
        const tg = window.Telegram as Telegram;
        if (!tg.WebApp.initData) {
            return null;
        }

        return tg;
    }
    return null;
}

export async function getAsyncTelegram(): Promise<Telegram> {
    const tg = getTelegram();
    if (tg != null) return tg;

    return new Promise((resolve) => {
        const interval = setInterval(() => {
            const tg = getTelegram();
            if (tg != null) {
                clearInterval(interval);
                resolve(tg);
            }
        }, 100);
    });
}

export function hapticError() {
    const tg = getTelegram();
    if (tg == null) return;

    tg.WebApp.HapticFeedback.notificationOccurred('error');
}

export function switchInlineQuery(
    ...args: Parameters<typeof Telegram.WebApp.switchInlineQuery>
) {
    const tg = getTelegram();
    if (tg == null) return;

    tg.WebApp.switchInlineQuery(...args);
}

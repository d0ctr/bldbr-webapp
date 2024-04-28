"use client"

export default function getTelegram() {
    if ('Telegram' in globalThis.window) {
        const tg = globalThis.window.Telegram as Telegram;
        if (!tg.WebApp.initData) return null;

        return tg;
    }
    return null;
}

export function hapticError() {
    const tg = getTelegram();
    if (tg == null) return;

    tg.WebApp.HapticFeedback.notificationOccurred('error');
}

export function switchInlineQuery(...args: Parameters<typeof Telegram.WebApp.switchInlineQuery>) {
    const tg = getTelegram();
    if (tg == null) return;

    tg.WebApp.switchInlineQuery(...args);
}
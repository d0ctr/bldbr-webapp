'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider disableRipple >
            <ThemeProvider enableSystem enableColorScheme attribute='class'>{children}</ThemeProvider>
        </NextUIProvider>
    );
}

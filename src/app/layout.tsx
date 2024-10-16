import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';
import { Providers } from './providers';
import { useTheme } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Bldbr WebApp',
    description: 'WebApp with functionality of t.me/BilderbergButler_bot',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='ru'>
            <head>
                <meta
                    name='theme-color'
                    media='(prefers-color-scheme: light)'
                    content='white'
                />
                <meta
                    name='theme-color'
                    media='(prefers-color-scheme: dark)'
                    content='black'
                />
                <link
                    rel='apple-touch-icon'
                    sizes='180x180'
                    href='/apple-touch-icon.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='32x32'
                    href='/favicon-32x32.png'
                />
                <link
                    rel='icon'
                    type='image/png'
                    sizes='16x16'
                    href='/favicon-16x16.png'
                />
                <link rel='manifest' href='/site.webmanifest' />
                <Script
                    src='https://telegram.org/js/telegram-web-app.js'
                    strategy='beforeInteractive'
                ></Script>
            </head>
            <body className={inter.className}>
                {<Providers>{children}</Providers>}
            </body>
        </html>
    );
}

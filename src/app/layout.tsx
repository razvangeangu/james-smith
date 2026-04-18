// eslint-disable-next-line no-restricted-imports
import './globals.css';

import Providers from '@/app/providers';
import { i18nConfig } from '@/i18n/config';
import { cn } from '@/lib/utils';

import { Metadata } from 'next';
import { Geist_Mono, Roboto } from 'next/font/google';
import {
  getLocale,
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return {
    title: {
      template: t('meta.helmet.template'),
      default: t('meta.helmet.home'),
    },
    description: t('meta.description'),
  };
}

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        roboto.variable,
      )}
    >
      <body>
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}

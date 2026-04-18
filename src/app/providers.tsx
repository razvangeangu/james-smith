'use client';

import { Locale, NextIntlClientProvider, useMessages } from 'next-intl';
import { ThemeProvider } from 'next-themes';

export interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  messages: ReturnType<typeof useMessages>;
}

export default function Providers({
  children,
  locale,
  messages,
}: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="light"
      disableTransitionOnChange
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Europe/London"
      >
        {children}
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

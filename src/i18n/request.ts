import { i18nConfig } from '@/i18n/config';
import { DEFAULT_LOCALE } from '@/i18n/constants';

import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get('NEXT_LOCALE')?.value;
  const locale =
    cookieLocale && i18nConfig.locales.includes(cookieLocale as 'en')
      ? cookieLocale
      : DEFAULT_LOCALE;

  return {
    locale,
    timeZone: 'Europe/London',
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

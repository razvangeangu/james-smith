import { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return {
    title: t('meta.helmet.template').replace('%s', t('pages.notFound.title')),
  };
}

export default async function NotFoundPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return <main>{t('pages.notFound.title')}</main>;
}

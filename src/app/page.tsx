import { Metadata } from 'next';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return { title: t('meta.helmet.home') };
}

export default async function Home() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return <main>{t('meta.helmet.home')}</main>;
}

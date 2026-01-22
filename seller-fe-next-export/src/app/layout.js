import { COUNTRY } from '@/constants/lang';
import '../styles/globals.scss';
import Providers from './providers';
import WarpPage from './warpPage';
import Head from 'next/head';

const title = 'Piboogo Seller';
const tmepTitle = `${process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? `(개발) ${title}` : title}`;

export const metadata = {
  title: title,
  description: 'Piboogo Seller Service',
  icons: {
    icon: '/images/favicon.png',
  },
};

async function fetchLanguage() {
  const res = await fetch('http://ip-api.com/json');
  const data = await res.json();
  return data.countryCode === COUNTRY.COUNTRY_INFO.KR.CODE
    ? COUNTRY.COUNTRY_INFO.KR.LANG
    : COUNTRY.COUNTRY_INFO.US.CODE;
}

export default async function RootLayout({ children }) {
  const language = await fetchLanguage();
  return (
    <html lang={language}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href={metadata.icons.icon} />
      </Head>
      <body>
        <Providers>
          <WarpPage language={language}>{children}</WarpPage>
        </Providers>
      </body>
    </html>
  );
}

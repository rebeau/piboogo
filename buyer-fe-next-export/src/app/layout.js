import { headers } from 'next/headers';
import '../styles/globals.scss';
import Providers from './providers';
import WarpPage from './warpPage';
import { COUNTRY } from '@/constants/lang';

const title = 'Piboogo | USA Aesthetic B2B Platform';
const tmepTitle = `${process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? `(개발) ${title}` : title}`;

export const metadata = {
  title: title,
  description:
    'Shop aesthetic products, beauty gear, and pro equipment from 100,000+ brands — only on PIBOOGO.',
  icons: {
    icon: '/images/favicon.png',
  },
  openGraph: {
    title: title,
    description:
      'Shop aesthetic products, beauty gear, and pro equipment from 100,000+ brands — only on PIBOOGO.',
    url: 'https://piboogo.com',
  },
};

function getClientIp() {
  const headersList = headers();
  const xForwardedFor = headersList.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return '127.0.0.1';
}

async function fetchLanguage(clientIp) {
  try {
    const res = await fetch(`http://ip-api.com/json/${clientIp}`);
    const data = await res.json();
    return data.countryCode === COUNTRY.COUNTRY_INFO.KR.CODE
      ? COUNTRY.COUNTRY_INFO.KR.LANG
      : COUNTRY.COUNTRY_INFO.US.LANG;
  } catch (error) {
    console.error('Error fetching language:', error);
    return COUNTRY.COUNTRY_INFO.US.LANG;
  }
}

const RootLayout = async ({ children }) => {
  const clientIp = getClientIp();
  const language = await fetchLanguage(clientIp);
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </head>
      <body>
        <Providers>
          <WarpPage language={language}>{children}</WarpPage>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

import '../styles/globals.scss';
import Providers from './providers';
import WarpPage from './warpPage';

const title = 'Piboogo CS';

export const metadata = {
  title: title,
  description: 'Piboogo CS Service',
  icons: {
    icon: '/images/favicon.png',
  },
};

const RootLayout = ({ children }) => {
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
          <WarpPage>{children}</WarpPage>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

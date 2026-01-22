'use client';

import { theme } from '../styles/theme/index';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

const Providers = ({ children }) => {
  return (
    <RecoilRoot>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </RecoilRoot>
  );
};

export default Providers;

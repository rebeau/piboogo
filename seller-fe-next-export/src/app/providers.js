'use client';

import { theme } from '../styles/theme/index';
import { ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

const Providers = ({ children }) => {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </RecoilRoot>
  );
};

export default Providers;

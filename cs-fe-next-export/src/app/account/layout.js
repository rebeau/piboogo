'use client';

import { Box, Center, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { usePathname, useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import { useEffect, useState } from 'react';
import MainHeader from '@/components/layout/header/MainHeader';

const AccountLayout = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [title, setTitle] = useState('');

  useEffect(() => {
    console.log(pathName);
    if (pathName === ACCOUNT.LOGIN) {
      setTitle(localeText(LANGUAGES.ACC.LOGIN.LOGIN));
    } else if (pathName === ACCOUNT.FIND) {
      setTitle(localeText(LANGUAGES.ACC.FIND.FIND_ACCOUNT));
    } else if (pathName === ACCOUNT.SIGN_UP) {
      setTitle(localeText(LANGUAGES.ACC.SU.SIGN_UP));
    } else {
      console.log('페이지 못찾음');
    }
  }, [pathName, lang]);

  return (
    <main>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainHeader />

          {/* content */}
          <Box w={'100%'} py={'7.5rem'}>
            <VStack spacing={'4rem'}>
              <Box w={'100%'}>
                <Center w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'3rem'}
                    fontStyle={'normal'}
                    fontWeight={400}
                    lineHeight={'4.5rem'}
                  >
                    {title}
                  </Text>
                </Center>
              </Box>

              {children}
            </VStack>
          </Box>
        </VStack>
      </Center>
    </main>
  );
};

export default AccountLayout;

'use client';

import Footer from '@/components/common/custom/Footer';
import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import LoginMain from '@public/svgs/login/login-main.svg';
import { Box, Center, Img, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { usePathname } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import { useEffect, useState } from 'react';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';

const AccountLayout = ({ children }) => {
  const { isMobile, clampW } = useDevice();
  const pathName = usePathname();
  const { lang, localeText } = useLocale();

  const [title, setTitle] = useState('');

  useEffect(() => {
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
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'}>
            <VStack spacing={0} justifyContent={'flex-start'}>
              {!isMobile(true) && (
                <Center w={'100%'}>
                  <Img src={LoginMain.src} />
                </Center>
              )}
              <Center
                w={'100%'}
                px={isMobile(true) ? '1rem' : '10rem'}
                pt={'2.5rem'}
                pb={isMobile(true) ? '0.62rem' : '2.5rem'}
              >
                <Text
                  color={'#485766'}
                  fontSize={clampW(2.25, 3)}
                  fontStyle={'normal'}
                  fontWeight={400}
                  lineHeight={clampW(3.2625, 4.5)}
                >
                  {title}
                </Text>
              </Center>
            </VStack>
          </Box>

          {children}

          <ContentBR h={isMobile(true) ? '5rem' : '10rem'} />
          {!isMobile(true) && <Footer />}
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default AccountLayout;

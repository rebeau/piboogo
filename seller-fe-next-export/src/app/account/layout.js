'use client';

import { Box, Center, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { usePathname, useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';
import { useEffect, useState } from 'react';
import MainHeader from '@/components/custom/header/MainHeader';
import useDevice from '@/hooks/useDevice';

const AccountLayout = ({ children }) => {
  const { isMobile, clampW } = useDevice();
  const pathName = usePathname();
  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [title, setTitle] = useState('');

useEffect(() => {
    // 1. 안전하게 텍스트를 가져오는 도우미 함수 (핵심)
    const getSafeText = (langObj) => {
      if (!langObj) return '';
      // 우선 순위: 1. 시스템 설정 언어 텍스트 -> 2. 시스템 기본 영어(EN) 텍스트 -> 3. 빈값
      return localeText(langObj) || langObj['EN'] || '';
    };

    console.log(pathName);

    // 2. 타이틀 설정 시 위에서 만든 getSafeText 함수 사용
    if (pathName === ACCOUNT.LOGIN) {
      setTitle(getSafeText(LANGUAGES.ACC.LOGIN.LOGIN));
    } else if (pathName === ACCOUNT.FIND) {
      setTitle(getSafeText(LANGUAGES.ACC.FIND.FIND_ACCOUNT));
    } else if (pathName === ACCOUNT.SIGN_UP) {
      setTitle(getSafeText(LANGUAGES.ACC.SU.SIGN_UP));
    } else {
      console.log('페이지 못찾음');
    }
    
    // 3. 만약 영문에서 글자가 안 보이는 문제가 지속된다면 
    // 브라우저의 언어 설정이 비어있는지 체크하여 강제로 'EN' 주입 (새로고침 없음)
    if (typeof window !== 'undefined' && !localStorage.getItem('piboogo_lang')) {
      localStorage.setItem('piboogo_lang', 'EN');
    }

  }, [pathName, lang, localeText]); // localeText 함수도 변화를 감지하도록 추가

  

  return isMobile(true) ? (
    <main>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainHeader />

          {/* content */}
          <Box w={'100%'} py={clampW(1.5, 3.5)}>
            <VStack spacing={clampW(1.5, 4)}>
              <Box w={'100%'}>
                <Center w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(2, 3)}
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
  ) : (
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

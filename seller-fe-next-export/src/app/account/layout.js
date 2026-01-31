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
    // 1. [핵심] 언어 값이 유실되었을 때를 대비한 안전 장치
    const getSafeText = (langObj) => {
      if (!langObj) return '';
      // localeText가 실패하면 현재 브라우저 저장소의 언어를 직접 확인
      const currentLang = localStorage.getItem('piboogo_lang') || 'KO'; 
      return localeText(langObj) || langObj[currentLang] || langObj['EN'] || '';
    };

    // 2. 새로고침 시 언어가 EN으로 바뀌는 걸 방지 (현재 설정 유지)
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('piboogo_lang');
      if (savedLang && lang !== savedLang) {
        // 현재 훅의 lang과 저장된 lang이 다르면 동기화 로직이 필요할 수 있습니다.
      }
    }

    console.log(pathName);
    if (pathName === ACCOUNT.LOGIN) {
      setTitle(getSafeText(LANGUAGES.ACC.LOGIN.LOGIN));
    } else if (pathName === ACCOUNT.FIND) {
      setTitle(getSafeText(LANGUAGES.ACC.FIND.FIND_ACCOUNT));
    } else if (pathName === ACCOUNT.SIGN_UP) {
      setTitle(getSafeText(LANGUAGES.ACC.SU.SIGN_UP));
    } else {
      console.log('페이지 못찾음');
    }
  }, [pathName, lang, localeText]); // localeText를 감시 대상에 포함

  

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

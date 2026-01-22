'use client';

import { Center, HStack, Text, useDisclosure } from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import { ACCOUNT } from '@/constants/pageURL';
import { usePathname } from 'next/navigation';
import utils from '@/utils';
import LockModal from '@/components/alert/custom/LockModal';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { modalState } from '@/stores/modalRecoil';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';

const SignUpHeader = () => {
  const { isMobile, clampW, clampH } = useDevice();
  const modal = useRecoilValue(modalState);
  const { moveSignUp } = useMove();
  const pathName = usePathname();
  const { localeText } = useLocale();
  const isLogin = utils.getIsLogin();
  const listExceptionPath = [ACCOUNT.LOGIN, ACCOUNT.SIGN_UP, ACCOUNT.FIND];
  const {
    isOpen: isOpenLock,
    onOpen: onOpenLock,
    onClose: onCloseLock,
  } = useDisclosure();

  useEffect(() => {
    let intervalID = null;
    // 페이지 초기화 후, isLogin가 false일 때만 호출되는 함수
    if (!isOpenLock && !isLogin) {
      const ret = listExceptionPath.includes(pathName);
      if (!ret && !modal.isOpen) {
        intervalID = setInterval(() => {
          // console.log('특정 값이 false일 때 호출됩니다.');
          onOpenLock();
          // 조건에 맞으면 값을 변경하여 interval을 종료할 수 있습니다.
          // setValue(true); // 예시로 값을 true로 변경 (조건에 맞게 설정)

          // setValue로 값을 변경하면 component가 리렌더링되므로 useEffect가 재실행됩니다.
        }, 10000); // 10초 간격으로 실행
      } else {
        clearInterval(intervalID);
      }

      // clean-up 함수 (컴포넌트가 언마운트되거나 value가 true로 변경되면 interval을 종료)
      return () => clearInterval(intervalID);
    } else {
      clearInterval(intervalID);
    }
  }, [pathName, isLogin, isOpenLock]); // value 값이 변경될 때마다 실행

  return (
    <Center w={'100%'} h={'100%'} maxH={56} bg={'#D9E7EC'}>
      <Center
        w={'100%'}
        h={'100%'}
        px={isMobile(true) && '1rem'}
        py={'0.5rem'}
        maxW={1920}
      >
        <HStack
          justifyContent={isMobile(true) ? 'space-between' : 'center'}
          w={'100%'}
        >
          <Text
            w={[
              '12.5rem',
              '12.5rem',
              'max-content',
              'max-content',
              'max-content',
              'max-content',
            ]}
            fontSize={'clamp(0.75rem, 2vw, 1rem)'}
            fontWeight={400}
            color={'#556A7E'}
          >
            {localeText(LANGUAGES.ACC.LOGIN.HEADER_SIGN_MSG)}
          </Text>
          <Text
            w={isMobile(true) && '4rem'}
            _hover={{ cursor: 'pointer' }}
            onClick={() => {
              moveSignUp();
            }}
            textDecoration={'underline'}
            fontSize={'clamp(0.9375rem, 3vw, 1rem)'}
            fontWeight={500}
            color={'#556A7E'}
          >
            {localeText(LANGUAGES.ACC.LOGIN.HEADER_SIGN_UP)}
          </Text>
        </HStack>
      </Center>
      {isOpenLock && <LockModal isOpen={isOpenLock} onClose={onCloseLock} />}
    </Center>
  );
};

export default SignUpHeader;

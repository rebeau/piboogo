'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, HStack, Image } from '@chakra-ui/react';
import AppleLogo from '@public/svgs/simbol/apple.svg';
import GoogleLogo from '@public/svgs/simbol/google.svg';
import KakaoLogo from '@public/svgs/simbol/kakao.svg';
import NaverLogo from '@public/svgs/simbol/naver.svg';
import {
  SNS_TYPE_KAKAO,
  SNS_TYPE_NAVER,
  SNS_TYPE_GOOGLE,
  SNS_TYPE_APPLE,
} from '@/constants/common';

const LoginButton = (props) => {
  const { type = 'ETC', onClick } = props;

  const [iconImage, setIconImage] = useState(null);
  const [text, setText] = useState('버튼');
  const [bgColor, setBgColor] = useState('#FFF');
  const [fontColor, setFontColor] = useState('#FFF');

  const handleButtonType = () => {
    if (type === SNS_TYPE_KAKAO) {
      setIconImage(KakaoLogo);
      setText('카카오 로그인');
      setBgColor('#FEC240');
      setFontColor('#000');
    } else if (type === SNS_TYPE_NAVER) {
      setIconImage(NaverLogo);
      setText('네이버 로그인');
      setBgColor('#3BAC37');
      setFontColor('#FFF');
    } else if (type === SNS_TYPE_GOOGLE) {
      setIconImage(GoogleLogo);
      setText('구글 로그인');
      setBgColor('#FFF');
      setFontColor('#181600');
    }
    if (type === SNS_TYPE_APPLE) {
      setIconImage(AppleLogo);
      setText('애플 로그인');
      setBgColor('#000');
      setFontColor('#FFF');
    }
  };

  useEffect(() => {
    handleButtonType();
  }, []);

  const handleSnsLogin = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      bg={bgColor}
      // _active={{}}
      // _focus={{}}
      // _hover={{}}
      onClick={handleSnsLogin}
      px={'5%'}
    >
      {/*
      <HStack
        w="100%"
        h="100%"
        justifyContent="space-between"
        alignItems="center"
        spacing={0}
      >
        <Box>
          <Image w="80%" h="80%" src={iconImage?.src} alt="이미지" />
        </Box>
        <Box>
          <GText fontWeight={600} fontSize={30} color={fontColor}>
            {text}
          </GText>
        </Box>
        <Box />
      </HStack>
       */}
    </Button>
  );
};

export default LoginButton;

'use client';

import ContentBR from '@/components/custom/ContentBR';
import IconRight from '@public/svgs/icon/right.svg';
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  Img,
  Select,
  Text,
  VStack,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import { useCallback, useEffect, useState } from 'react';
import TitleTextInput from '@/components/input/custom/TitleTextInput';
import { useRouter } from 'next/navigation';
import { ACCOUNT } from '@/constants/pageURL';

const SecondHandPage = () => {
  const router = useRouter();
  const { localeText } = useLocale();

  useEffect(() => {}, []);

  return <Box w={'100%'}>SecondHandPage</Box>;
};

export default SecondHandPage;

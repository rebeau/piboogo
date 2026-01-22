'use client';

import { Icon } from '@chakra-ui/react';
import icons from './index';

const CustomIcon = (props) => {
  const { w = '20px', h = '20px', color = '#fff' } = props;
  const { name = 'question' } = props;
  return name !== '' ? (
    <Icon as={icons[name]} w={w} h={h} color={color} />
  ) : null;
};

export default CustomIcon;

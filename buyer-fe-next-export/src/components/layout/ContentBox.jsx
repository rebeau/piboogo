'use client';

import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { FORM_MIN_WIDTH_PX } from '@/constants/common';

const ContentBox = (props) => {
  const { children, minW = FORM_MIN_WIDTH_PX } = props;
  return (
    <ContentStyledBox
      bg="#E5E5E5"
      h="100vh"
      // minW={minW}
      position="relative"
      overflowX="auto"
    >
      {children}
    </ContentStyledBox>
  );
};

export default ContentBox;

const ContentStyledBox = styled(Box)({
  width: 'calc(100%)',
});

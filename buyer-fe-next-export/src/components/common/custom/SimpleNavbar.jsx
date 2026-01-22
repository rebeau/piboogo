'use client';

import { Box, HStack, IconButton } from '@chakra-ui/react';
import { GText, CustomIcon } from '@/components';
import { BOX_S_64 } from '@/constants/common';
import { useRouter } from 'next/navigation';

const SimpleNavbar = (props) => {
  const { text } = props;
  const { bg = '#FFF', fontColor = '#000', onClick } = props;
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <Box bg={bg} w="100%" h={'7.4627%'}>
      <HStack
        justifyContent="space-between"
        h="100%"
        alignItems="center"
        px={'3%'}
      >
        <Box
          w={'16.38%'}
          h={'66%'}
          onClick={() => {
            handleBack();
          }}
        >
          <HStack w={'100%'} h={'100%'} alignContent={'flex-start'}>
            <IconButton
              _hover={{}}
              _active={{}}
              w={'100%'}
              h={'100%'}
              border={0}
            >
              <CustomIcon w="70%" h="70%" color={fontColor} name="back" />
            </IconButton>
          </HStack>
        </Box>
        <Box>
          <GText fontWeight={700} fontSize={38} color={fontColor}>
            {text}
          </GText>
        </Box>
        <Box w={'16.38%'} h={'66%'} />
      </HStack>
    </Box>
  );
};

export default SimpleNavbar;

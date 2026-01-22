'use client';

import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const BrandHeader = (props) => {
  const router = useRouter();
  const {
    headerTitle = 'header',
    listMenu = [],
    targetMenu,
    setTargetMenu,
  } = props;

  return (
    <Box w={'100%'} h={'100%'} maxH={720} maxW={1920}>
      <Box pt={'1.5rem'} px={'1.25rem'} w={'100%'}>
        <VStack w={'100%'} spacing={'1.25rem'}>
          <Box
            display={'flex'}
            justifyContent={'flex-start'}
            py={'0.5rem'}
            px={'1.25rem'}
            w={'100%'}
          >
            <Text fontSize={'2.75rem'} fontWeight={500} color={'#485766'}>
              {headerTitle}
            </Text>
          </Box>
          <HStack py={'1rem'} px={'1.25rem'} w={'100%'} spacing={'3.75rem'}>
            {listMenu.map((item, index) => {
              const key = `header_${index}`;
              return (
                <Box
                  key={key}
                  _hover={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setTargetMenu(item.key);
                    router.push(item.href);
                  }}
                >
                  <Text
                    fontSize={'1.25rem'}
                    fontWeight={targetMenu === item.key ? 600 : 400}
                    color={targetMenu === item.key ? '#66809C' : '#9CADBE'}
                  >
                    {item.title}
                  </Text>
                </Box>
              );
            })}
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default BrandHeader;

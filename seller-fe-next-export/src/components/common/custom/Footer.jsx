'use client';

import { Box, Center, Flex, HStack, Text, VStack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Center w={'100%'} h={'18.875rem'} bg={'#F2EEE2'}>
      <Flex
        py={'3.75rem'}
        px={'10rem'}
        w={'100%'}
        maxW={1920}
        h={'100%'}
        direction="row"
        // justify="center"
        // align="center"
        // bg="gray.100"
      >
        <Box
          w={'50rem'}
          h={'100%'}
          alignContent={'flex-start'}
          alignSelf={'flex-start'}
          justifyItems={'flex-start'}
          justifySelf={'flex-start'}
        >
          <VStack spacing={'1.25rem'}>
            <Box w={'100%'}>
              <Text fontSize={'2.5rem'} fontWeight={500} color={'#71513B'}>
                Piboogo
              </Text>
            </Box>
            <Box w={'100%'}>
              <HStack spacing={'1.75rem'}>
                <Text fontSize={'1rem'} fontWeight={500} color={'#A87C4E'}>
                  Terms of Service
                </Text>
                <Text fontSize={'1rem'} fontWeight={500} color={'#A87C4E'}>
                  Privacy Policy
                </Text>
                <Text fontSize={'1rem'} fontWeight={500} color={'#A87C4E'}>
                  IP Policy
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>
        <Box w={'50rem'}>
          <VStack spacing={'2rem'}>
            <Box w={'100%'}>
              <Text
                fontSize={{
                  '3xl': '1rem',
                  '2xl': '0.9rem',
                  xl: '0.8rem',
                  lg: '0.7rem',
                  md: '0.6rem',
                  sm: '0.5rem',
                  xs: '0.4rem',
                }}
                fontWeight={400}
                color={'#A87C4E'}
              >
                ©2024 Piboogo, Inc.
              </Text>
            </Box>
            <Box w={'100%'}>
              <Text
                fontSize={{
                  '3xl': '1rem',
                  '2xl': '0.9rem',
                  xl: '0.8rem',
                  lg: '0.7rem',
                  md: '0.6rem',
                  sm: '0.5rem',
                  xs: '0.4rem',
                }}
                fontWeight={500}
                color={'#A87C4E'}
                lineHeight={{
                  '3xl': '2.1rem',
                  '2xl': '1.8rem',
                  xl: '1.8rem',
                  lg: '1.5rem',
                  md: '0.9rem',
                  sm: '0.6rem',
                  xs: '0.4rem',
                }}
              >
                Privacy Officer: Gildong Hong | Business Registration No.:
                809-81-01574
                <br />
                Address: 24th Floor, 372, Hangang-daero, Yongsan-gu, Seoul,
                04323, Republic of Korea
                <br />
                T: +82 2 1234 4567 | F: +82 2 1234 4567 | E:
                piboogo_cs@piboogo.com
                <br />
                E-commerce Permit: 2017-Seoul-Yongsan-0451
              </Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Center>
  );
};

export default Footer;

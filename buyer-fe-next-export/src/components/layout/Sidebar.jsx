'use client';

import { Box, Center, HStack, Image, Text, VStack } from '@chakra-ui/react';

import { ADMIN } from '@/constants/pageURL';
import { NavLink } from '@/components';

const Sidebar = () => {
  return (
    <Box w={'210px'} minW={'210px'} h={'100%'} bg={'#000920'}>
      <Center w={'100%'} h={'60px'}>
        {/* <Image src={AdminSideLogo.src} /> */}
      </Center>
      <Box w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <NavLink href={ADMIN.user}>
            <Box w={'100%'} h={'60px'} px={'20px'}>
              <HStack w={'100%'} h={'100%'}>
                <Box>{/* <Image src={AdminSideUser.src} /> */}</Box>
                <Box>
                  <Text fontWeight={700} fontSize={'16px'} color={'#CCD2E3'}>
                    사용자
                  </Text>
                </Box>
              </HStack>
            </Box>
          </NavLink>
          <NavLink href={ADMIN.test}>
            <Box w={'100%'} h={'60px'} px={'20px'}>
              <HStack w={'100%'} h={'100%'}>
                <Box>{/* <Image src={AdminSideEdit.src} /> */}</Box>
                <Box>
                  <Text fontWeight={700} fontSize={'16px'} color={'#CCD2E3'}>
                    검사평가
                  </Text>
                </Box>
              </HStack>
            </Box>
          </NavLink>
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;

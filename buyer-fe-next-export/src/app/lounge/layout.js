'use client';

import Footer from '@/components/common/custom/Footer';
import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import { Box, Center, HStack, VStack } from '@chakra-ui/react';
import LoungeSideBar from '@/components/custom/lounge/LoungeSideBar';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';

const LoungeLayout = ({ children }) => {
  const { isMobile, clampW } = useDevice();
  return (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box w={'100%'} px={clampW(1, 2.5)} maxW={!isMobile(true) && 1920}>
            {isMobile(true) ? (
              <VStack spacing={0}>
                <LoungeSideBar />
                <ContentBR h={'2rem'} />
                <Box w={'100%'} h={'max-content'}>
                  {children}
                </Box>
              </VStack>
            ) : (
              <HStack
                spacing={'2.5rem'}
                justifyContent={'space-between'}
                alignItems={'flex-start'}
              >
                <LoungeSideBar />
                <Box w={'80%'} maxW={'87.5rem'}>
                  <ContentBR h={'5rem'} />
                  {children}
                </Box>
              </HStack>
            )}
          </Box>

          <ContentBR h={!isMobile(true) && '10rem'} />

          {!isMobile(true) && <Footer />}
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default LoungeLayout;

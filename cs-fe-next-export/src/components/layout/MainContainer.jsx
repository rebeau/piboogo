'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Center, HStack, VStack } from '@chakra-ui/react';
import ContentHeader from './header/ContentHeader';
import ServiceSideBar from './sidebar/ServiceSideBar';
import MainHeader from './header/MainHeader';
import ContentBR from '../common/ContentBR';
import ContentDetailHeader from './header/ContentDetailHeader';

const MainContainer = (props) => {
  const { isMobile, clampW, clampH } = useDevice();
  const { children, contentHeader, isDetailHeader = false, title, w } = props;

  return (
    <Box className="main-container" minW={isMobile(true) ? '100%' : 'auto'}>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainHeader />

          {/* content */}

          <Box w={'100%'} h={'calc(100dvh - 4.5rem)'} maxW={1920}>
            <HStack
              h={'100%'}
              spacing={'1.25rem'}
              justifyContent={'flex-start'}
              alignItems={'flex-start'}
            >
              <Box w={'14.8rem'} h={'100%'} maxW={'30%'}>
                <ServiceSideBar />
              </Box>
              <Box w={'100%'} h={'100%'} overflowY={'auto'}>
                <Box
                  w={{
                    // '2xl': 'calc(100% - 14.8rem - 1.25rem)',
                    '2xl': 'calc(100% - 2.5rem)',
                    xl: '100%',
                  }}
                  h={'100%'}
                >
                  <ContentBR h={'1.25rem'} />

                  {isDetailHeader ? (
                    <ContentDetailHeader title={title} w={w}>
                      {contentHeader}
                    </ContentDetailHeader>
                  ) : (
                    <ContentHeader w={w}>{contentHeader}</ContentHeader>
                  )}

                  <ContentBR h={'1.25rem'} />

                  {children}
                </Box>
              </Box>
            </HStack>
          </Box>
        </VStack>
      </Center>
    </Box>
  );
};

export default MainContainer;

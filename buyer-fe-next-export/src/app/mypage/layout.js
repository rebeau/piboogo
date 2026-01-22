'use client';

import Footer from '@/components/common/custom/Footer';
import ContentBR from '@/components/custom/ContentBR';
import MainTopHeader from '@/components/custom/header/MainTopHeader';
import { Box, Center, HStack, VStack } from '@chakra-ui/react';
import MyPageSideBar from '@/components/custom/mypage/MyPageSideBar';
import MainContainer from '@/components/layout/MainContainer';
import useDevice from '@/hooks/useDevice';
import { usePathname } from 'next/navigation';
import { MY_PAGE } from '@/constants/pageURL';

const MyPageLayout = ({ children }) => {
  const pathName = usePathname();
  const { isMobile, clampW } = useDevice();

  const handleFooter = () => {
    const listCheckPath = [
      MY_PAGE.INFO,
      // MY_PAGE.INFO_EDIT,
      MY_PAGE.COUPON,
      MY_PAGE.ORDER_HISTORY,
      MY_PAGE.HELP,
      MY_PAGE.REVIEWS_INQUIRIES,
    ];
    if (isMobile(true) && listCheckPath.includes(pathName)) {
      return <ContentBR h={'1.5rem'} />;
    }
    return (
      <>
        <ContentBR h={isMobile(true) ? '5rem' : '10rem'} />
        <Footer />
      </>
    );
  };

  return (
    <MainContainer>
      <Center w={'100%'}>
        <VStack w={'100%'} spacing={0}>
          <MainTopHeader />

          {/* content */}
          <Box
            // w={isMobile(true) ? '100%' : undefined}
            w="100%"
            px={clampW(1, 2.5)}
            // maxW={!isMobile(true) && 1100}
            //
          >
            {isMobile(true) ? (
              <VStack spacing={0}>
                <MyPageSideBar />
                <ContentBR h={'2rem'} />
                <Box w={'100%'} h={'max-content'}>
                  {children}
                </Box>
              </VStack>
            ) : (
              <HStack
                spacing={'2.5rem'}
                justifyContent={'center'}
                alignItems={'flex-start'}
              >
                <MyPageSideBar />
                <Box w={'80%'} maxW={'87.5rem'}>
                  {children}
                </Box>
              </HStack>
            )}
          </Box>

          {handleFooter()}
        </VStack>
      </Center>
    </MainContainer>
  );
};

export default MyPageLayout;

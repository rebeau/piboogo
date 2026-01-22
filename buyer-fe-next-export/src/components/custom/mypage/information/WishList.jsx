'use client';

import { Box, SimpleGrid, Image, Text, Button, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import WishListCard from './WishListCard';
import useDevice from '@/hooks/useDevice';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';

const WishlistPage = (props) => {
  const { isMobile } = useDevice();
  const { localeText } = useLocale();
  const {
    products,
    isDetail = false,
    isCheck = false,
    onClickFavorite,
  } = props;
  // 화면 너비에 따라 열 수를 동적으로 결정
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // 화면 너비에 따라 열 수를 설정
      if (width >= 1860) {
        setColumns(5);
      } else if (width >= 1580) {
        setColumns(4);
      } else if (width >= 1270) {
        setColumns(3);
      } else if (width >= 700) {
        setColumns(2);
      } else {
        setColumns(1);
      }
    };

    // 초기 사이즈와 리사이즈 이벤트 핸들러 등록
    handleResize();
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 핸들러 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Box>
      <SimpleGrid
        columns={columns}
        spacingX={isMobile(true) ? '0.5rem' : '1.25rem'}
        spacingY={isMobile(true) ? '1.25rem' : '5rem'}
      >
        {products.map((product, index) => (
          <WishListCard
            key={index}
            item={product}
            isDetail={isDetail}
            isCheck={isCheck}
            onClickFavorite={onClickFavorite}
          />
        ))}
      </SimpleGrid>
      {products.length === 0 && (
        <Center w={'100%'} h={'10rem'}>
          <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
            {localeText(LANGUAGES.INFO_MSG.NO_ITEM_SEARCHED)}
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default WishlistPage;

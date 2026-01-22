'use client';

import { Box, Button, Flex, HStack, Img, Text } from '@chakra-ui/react';
import RightArrow from '@public/svgs/simbol/right-arrow.svg';
import BrandBannerItem from './item/BrandBannerItem';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';

const BrandBanner = (props) => {
  const { listBrand = [], onClickAllView } = props;
  const { localeText } = useLocale();

  return (
    <Box w={'100%'} h={'100%'} maxH={720} maxW={1920}>
      <Flex py={'2.5rem'}>
        {listBrand.map((item, index) => {
          return BrandBannerItem({
            key: index,
            image: item.img,
            title: item.title,
            content: item.content,
          });
        })}
      </Flex>
      <Box px={'2.5rem'}>
        <HStack justifyContent={'flex-end'}>
          <Box>
            <Button
              onClick={() => {
                if (onClickAllView) {
                  onClickAllView();
                }
              }}
              borderRadius={'1.88rem'}
              py={'1rem'}
              px={'2rem'}
              bg={'#7895B2'}
              w={'11rem'}
              h={'3.875rem'}
            >
              <HStack spacing={'0.75rem'}>
                <Text fontSize={'1.25rem'} fontWeight={400} color={'#FFF'}>
                  {localeText(LANGUAGES.VIEW_ALL)}
                </Text>
                <Img w={'1.5rem'} h={'1.5rem'} src={RightArrow.src} />
              </HStack>
            </Button>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default BrandBanner;

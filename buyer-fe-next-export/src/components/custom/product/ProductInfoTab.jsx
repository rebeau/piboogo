'use client';

import {
  Box,
  Center,
  Image as ChakraImage,
  Text,
  VStack,
  TabPanel,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import QuillViewer from '@/components/input/Quillviewer';

const ProductInfoTab = (props) => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();
  const { productInfo, productImageList = [] } = props;

  return isMobile(true) ? (
    <TabPanel p={0}>
      <VStack spacing={'2.5rem'}>
        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={'1.25rem'}
            fontWeight={500}
            lineHeight={'2.25rem'}
          >
            {localeText(LANGUAGES.PRODUCT_INFO)}
          </Text>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          alignSelf="stretch"
          flexDirection="column"
          gap="2.5rem" // 40px
        >
          <QuillViewer html={productInfo.content} />
        </Box>
      </VStack>
    </TabPanel>
  ) : (
    <TabPanel p={0}>
      <VStack spacing={'2.5rem'}>
        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={'1.25rem'}
            fontWeight={500}
            lineHeight={'2.25rem'}
          >
            {localeText(LANGUAGES.PRODUCT_INFO)}
          </Text>
        </Box>

        <Box
          display="flex"
          alignItems="center"
          alignSelf="stretch"
          flexDirection="column"
          gap="2.5rem" // 40px
        >
          <QuillViewer html={productInfo.content} />
        </Box>
      </VStack>
    </TabPanel>
  );

  /*
  <Box w={'100%'}>
    <VStack>
      {productImageList.map((image, index) => {
        return (
          <Center w={'100%'} key={index}>
            <ChakraImage
              w={'100%'}
              h={'100%'}
              objectFit={'cover'}
              fallback={<DefaultSkeleton />}
              src={image.imageS3Url}
            />
          </Center>
        );
      })}
    </VStack>
  </Box>
  */
};

export default ProductInfoTab;

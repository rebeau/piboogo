'use client';

import { CustomIcon } from '@/components';
import {
  Box,
  VStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Image as ChakraImage,
} from '@chakra-ui/react';

import { useCallback } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
// import PreviewTop from '@public/svgs/banner/preview-top.svg';
// import PreviewMiddle from '@public/svgs/banner/preview-middle.svg';
import PreviewTop from '@public/svgs/banner/preview-top.png';
import PreviewMiddle from '@public/svgs/banner/preview-middle.png';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import useDevice from '@/hooks/useDevice';

const BannerPreviewModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();

  const { position } = props;
  const { isOpen, onClose, image = '' } = props;

  const handleFinaly = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handlePreviewImage = () => {
    let top = 0;
    if (position === 1) {
      if (isMobile(true)) {
        // top = clampW(3.15, 16.5);
        top = '3.35rem';
      } else {
        top = '7.65rem';
      }
    } else {
      if (isMobile(true)) {
        // top = clampW(5, 27);
        top = '5.4rem';
      } else {
        top = '12.5rem';
      }
    }
    return isMobile(true) ? (
      <Box position={'absolute'} top={top} zIndex={3} w={'100%'}>
        <ChakraImage
          fallback={<DefaultSkeleton />}
          w={'100%'}
          h={'100%'}
          // objectFit={'cover'}
          src={image}
        />
      </Box>
    ) : (
      <Box position={'absolute'} top={top} zIndex={3} w={'100%'} h={'20.75rem'}>
        <ChakraImage
          fallback={<DefaultSkeleton />}
          w={'100%'}
          h={'100%'}
          src={image}
        />
      </Box>
    );
  };

  return isMobile(true) ? (
    <Modal isOpen={true} onClose={handleFinaly} size={'sm'}>
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        // w={'100%'}
        // maxW={null}
      >
        <ModalBody w={'100%'} h={'100vh'} position={'relative'} p={0}>
          <Box w={'100%'} px={clampW(1, 5)}>
            <ContentBR h={'1.5rem'} />
            <HStack justifyContent={'space-between'}>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.BANNERS.BANNER_PREVIEW)}
                </Text>
              </Box>
              <Box
                w={'2rem'}
                h={'2rem'}
                cursor={'pointer'}
                onClick={() => {
                  handleFinaly();
                }}
              >
                <CustomIcon
                  w={'100%'}
                  h={'100%'}
                  name={'close'}
                  color={'#7895B2'}
                />
              </Box>
            </HStack>
            <ContentBR h={'1.5rem'} />
          </Box>

          <Box
            w={'100%'}
            // h={'calc(100vh - 5rem)'}
            overflowY={'auto'}
          >
            {isMobile(true) ? (
              <Box
                w={'100%'}
                aspectRatio={1}
                overflowY={'auto'}
                className="no-scroll"
                position={'relative'}
              >
                {position === 1 ? (
                  <Box>
                    <ChakraImage
                      w={'100%'}
                      src={PreviewTop.src}
                      objectFit={'cover'}
                      position={'relative'}
                      zIndex={2}
                    ></ChakraImage>
                    {handlePreviewImage()}
                  </Box>
                ) : (
                  <Box>
                    <ChakraImage
                      w={'100%'}
                      src={PreviewMiddle.src}
                      objectFit={'cover'}
                      position={'relative'}
                      zIndex={2}
                    ></ChakraImage>
                    {handlePreviewImage()}
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                w={'100%'}
                aspectRatio={1}
                overflowY={'auto'}
                className="no-scroll"
                position={'relative'}
              >
                {position === 1 ? (
                  <ChakraImage
                    w={'100%'}
                    src={PreviewTop.src}
                    objectFit={'cover'}
                    position={'absolute'}
                    zIndex={2}
                  />
                ) : (
                  <ChakraImage
                    w={'100%'}
                    src={PreviewMiddle.src}
                    objectFit={'cover'}
                    position={'absolute'}
                    zIndex={2}
                  />
                )}
                {handlePreviewImage()}
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={true} onClose={handleFinaly} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'52rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          // pb={'2.5rem'}
          pb={0}
          px={0}
        >
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'} px={'2.5rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.BANNERS.BANNER_PREVIEW)}
                    </Text>
                  </Box>
                  <Box
                    w={'2rem'}
                    h={'2rem'}
                    cursor={'pointer'}
                    onClick={() => {
                      handleFinaly();
                    }}
                  >
                    <CustomIcon
                      w={'100%'}
                      h={'100%'}
                      name={'close'}
                      color={'#7895B2'}
                    />
                  </Box>
                </HStack>
              </Box>

              {/* 상태 바 */}

              <Box
                w={'55rem'}
                h={'47rem'}
                overflowY={'auto'}
                className="no-scroll"
                position={'relative'}
              >
                {position === 1 ? (
                  <ChakraImage
                    src={PreviewTop.src}
                    position={'absolute'}
                    zIndex={2}
                  />
                ) : (
                  <ChakraImage
                    src={PreviewMiddle.src}
                    position={'absolute'}
                    zIndex={2}
                  />
                )}
                {handlePreviewImage()}
              </Box>
            </VStack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BannerPreviewModal;

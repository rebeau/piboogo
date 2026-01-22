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
import PreviewTop from '@public/svgs/banner/preview-top.svg';
import PreviewMiddle from '@public/svgs/banner/preview-middle.svg';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';

const BannerPreviewModal = (props) => {
  const { localeText } = useLocale();

  const { position = 2 } = props;
  const { isOpen, onClose } = props;

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handlePreviewImage = () => {
    let top = 0;
    if (position === 1) {
      top = '7.65rem';
    } else {
      top = '12.5rem';
    }
    return (
      <Box position={'absolute'} top={top} zIndex={3} w={'100%'} h={'20.75rem'}>
        <ChakraImage
          fallback={<DefaultSkeleton />}
          w={'100%'}
          h={'100%'}
          src={''}
        />
      </Box>
    );
  };

  return (
    <Modal isOpen={true} onClose={handleFinally} size="md">
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
                      handleFinally();
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

'use client';

import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Button,
  VStack,
  Input,
} from '@chakra-ui/react';

import { useCallback, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/common/ContentBR';
import CustomIcon from '@/components/icon/CustomIcon';
import utils from '@/utils';
import useModal from '@/hooks/useModal';

const CategoryAddModal = (props) => {
  const { localeText } = useLocale();
  const { openModal } = useModal();
  const [title, setTitle] = useState(null);
  const { isOpen, onClose } = props;
  const { firstCategoryTarget, secondCategoryTarget } = props;

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleCategory = useCallback(async () => {
    if (utils.isEmpty(title)) {
      openModal({ text: localeText(LANGUAGES.CATEGORY.PH_ENTER_CATEGORY) });
      return;
    }
    if (onClose) {
      onClose(true, title, firstCategoryTarget, secondCategoryTarget);
    }
  });

  const handleTitle = () => {
    if (utils.isNotEmpty(secondCategoryTarget)) {
      return localeText(LANGUAGES.CATEGORY.ADD_A_SUB_CATEGORY, {
        key: '@ADD@',
        value: secondCategoryTarget.name,
      });
    } else if (utils.isNotEmpty(firstCategoryTarget)) {
      return localeText(LANGUAGES.CATEGORY.ADD_A_SUB_CATEGORY, {
        key: '@ADD@',
        value: firstCategoryTarget.name,
      });
    }
    return localeText(LANGUAGES.CATEGORY.ADD_A_CATEGORY);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'18.25rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={'2.5rem'}
          px={'2.5rem'}
        >
          <VStack spacing={0} h={'100%'} justifyContent={'space-between'}>
            <Box w={'100%'}>
              <VStack spacing={0}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={400}
                        lineHeight={'1.96875rem'}
                      >
                        {handleTitle()}
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

                <ContentBR h={'1.5rem'} />

                <Box w={'100%'}>
                  <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                    <Box w={'12.5rem'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.CATEGORY.CATEGORY)}
                      </Text>
                    </Box>
                    <Box w={'40.5rem'} h={'3rem'}>
                      <Input
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.CATEGORY.PH_ENTER_CATEGORY,
                        )}
                        _placeholder={{
                          fontWeight: 400,
                          fontSize: '0.9375rem',
                          color: '#7895B2',
                        }}
                        color={'#485766'}
                        border={'1px solid #9CADBE'}
                        px={'1rem'}
                        py={'0.75rem'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        value={title || ''}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            handleCategory();
                          }
                        }}
                      />
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={0}>
                <ContentBR h={'3.75rem'} />

                <Box w={'100%'} h={'4rem'}>
                  <Button
                    onClick={() => {
                      handleCategory();
                    }}
                    px={'1.25rem'}
                    py={'0.63rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    h={'100%'}
                    w={'100%'}
                    _disabled={{
                      bg: '#7895B290',
                    }}
                    _hover={{
                      opacity: 0.8,
                    }}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'1.25rem'}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.COMMON.ADD)}
                    </Text>
                  </Button>
                </Box>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CategoryAddModal;

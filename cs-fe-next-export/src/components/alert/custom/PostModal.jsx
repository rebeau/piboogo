'use client';

import { CustomIcon } from '@/components';
import {
  Box,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Button,
  Textarea,
  VStack,
  Input,
  Center,
  Image as ChakraImage,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import DefaultImage from '@/components/input/file/DefaultImage';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import utils from '@/utils';
import useDevice from '@/hooks/useDevice';
import useLounge from '@/hooks/useLounge';

const PostModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();

  const { onClose, item, callBack } = props;

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(false);
  const { loungeInfo, handlePostLounge } = useLounge();

  useEffect(() => {
    if (title && content) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [title, content]);

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const handleSavePost = useCallback(() => {
    if (callBack) {
      const data = {
        title,
        link,
        files,
        content,
      };
      callBack(data);
    }
  });

  /*
  const handleSavePost = useCallback(() => {
    console.log('title', title);
    console.log('link', link);
    console.log('images', images);
    console.log('content', content);
  });
  */

  const handleImageFile = useCallback((file, srcData) => {
    if (file && srcData) {
      const tempImages = [...images];
      tempImages.push(srcData);
      setImages(tempImages);

      const tempFiles = [...files];
      tempFiles.push(file);
      setFiles(tempFiles);
    }
  });

  const handleRemoveImage = useCallback((index) => {
    let tempImages = [...images];
    tempImages.splice(index, 1);
    setImages(tempImages);

    let tempFiles = [...files];
    tempFiles.splice(index, 1);
    setFiles(tempFiles);
  });

  return isMobile(true) ? (
    <Modal isOpen={true} onClose={handleFinally} size="full">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent alignSelf={'center'} borderRadius={0}>
        <ModalBody
          w={'100%'}
          h={'100vh'}
          position={'relative'}
          pt={'1.5rem'}
          pb={0}
        >
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.WRITE_A_NEW_POST)}
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

          <Box h={'calc(100vh - 5rem)'} overflowY={'auto'}>
            <ContentBR h={'1.5rem'} />

            <Box w={'100%'}>
              <VStack justifyContent={'flex-start'} spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.TITLE)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Box
                    w={'100%'}
                    h={'3rem'}
                    border={'1px solid #9CADBE'}
                    borderRadius={'0.25rem'}
                    boxSizing={'border-box'}
                  >
                    <Input
                      w={'100%'}
                      h={'100%'}
                      placeholder={localeText(LANGUAGES.LOUNGE.PH_ENTER_TITLE)}
                      _placeholder={{
                        color: '#A7C3D2',
                        fontSize: '0.9375rem',
                        fontWeight: 400,
                        lineHeight: '1.5rem',
                      }}
                      border={0}
                      value={title || ''}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      lineHeight={'1.5rem'}
                      bg={'#FFF'}
                    />
                  </Box>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.5rem'} />

            <Box w={'100%'}>
              <VStack justifyContent={'flex-start'} spacing={'0.75rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.RELATED_LINK)}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <Box
                    w={'100%'}
                    h={'3rem'}
                    border={'1px solid #9CADBE'}
                    borderRadius={'0.25rem'}
                    boxSizing={'border-box'}
                  >
                    <Input
                      w={'100%'}
                      h={'100%'}
                      placeholder={localeText(
                        LANGUAGES.LOUNGE.PH_RELATED_LINKS,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                        fontSize: '0.9375rem',
                        fontWeight: 400,
                        lineHeight: '1.5rem',
                      }}
                      border={0}
                      value={link || ''}
                      onChange={(e) => {
                        setLink(e.target.value);
                      }}
                      color={'#485766'}
                      fontSize={'0.9375rem'}
                      lineHeight={'1.5rem'}
                      bg={'#FFF'}
                    />
                  </Box>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.5rem'} />

            <Box w={'100%'}>
              <VStack spacing={'1.25rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={500}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.WRITE_YOUR_CONTENT)}
                  </Text>
                </Box>
                <Box w={'100%'} overflowX={'auto'}>
                  <HStack spacing={'1.25rem'}>
                    {images.map((image, index) => {
                      const key = `img_${index}`;
                      return (
                        <Center
                          position={'relative'}
                          w={'6.25rem'}
                          minW={'6.25rem'}
                          h={'6.25rem'}
                          key={key}
                        >
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={image}
                          />
                          <Center
                            cursor={'pointer'}
                            onClick={() => {
                              handleRemoveImage(index);
                            }}
                            w={'1.5rem'}
                            h={'1.5rem'}
                            position={'absolute'}
                            top={'9px'}
                            right={'9px'}
                            transform="translate(30%, -30%)"
                            bg={'#FFF'}
                            border={'1px solid #7895B2'}
                            borderRadius={'50%'}
                          >
                            <CustomIcon name={'minus'} color={'#7895B2'} />
                          </Center>
                        </Center>
                      );
                    })}
                    {images.length < 5 && (
                      <Box minW={'6.25rem'}>
                        <DefaultImage
                          retFile={(file, srcData) => {
                            handleImageFile(file, srcData);
                          }}
                        />
                      </Box>
                    )}
                  </HStack>
                </Box>
                <Box w={'100%'} h={'13.5rem'}>
                  <Textarea
                    w={'100%'}
                    h={'100%'}
                    value={content || ''}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                    resize={'none'}
                    placeholder={localeText(
                      LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT,
                    )}
                  ></Textarea>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.5rem'} />

            <Box w={'100%'} h={'3rem'} mb={'1.5rem'}>
              <Button
                isDisabled={!isActive}
                onClick={() => {
                  handleSavePost();
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
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.PUBLISH)}
                </Text>
              </Button>
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={true} onClose={handleFinally} size="md">
      <ModalOverlay bg={'rgba(0, 0, 0, 0.60)'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'49rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          pb={0}
          px={'2.5rem'}
        >
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.WRITE_A_NEW_POST)}
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
            <VStack spacing={'0.5rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.TITLE)}
                    </Text>
                  </Box>
                  <Box w={'40.5rem'}>
                    <Box
                      w={'100%'}
                      h={'3rem'}
                      border={'1px solid #9CADBE'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                    >
                      <Input
                        w={'100%'}
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.LOUNGE.PH_ENTER_TITLE,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          lineHeight: '1.5rem',
                        }}
                        border={0}
                        value={title || ''}
                        onChange={(e) => {
                          setTitle(e.target.value);
                        }}
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        lineHeight={'1.5rem'}
                        bg={'#FFF'}
                      />
                    </Box>
                  </Box>
                </HStack>
              </Box>
              <Box w={'100%'}>
                <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'0.9375rem'}
                      fontWeight={400}
                      lineHeight={'1.5rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.RELATED_LINK)}
                    </Text>
                  </Box>
                  <Box w={'40.5rem'}>
                    <Box
                      w={'100%'}
                      h={'3rem'}
                      border={'1px solid #9CADBE'}
                      borderRadius={'0.25rem'}
                      boxSizing={'border-box'}
                    >
                      <Input
                        w={'100%'}
                        h={'100%'}
                        placeholder={localeText(
                          LANGUAGES.LOUNGE.PH_RELATED_LINKS,
                        )}
                        _placeholder={{
                          color: '#A7C3D2',
                          fontSize: '0.9375rem',
                          fontWeight: 400,
                          lineHeight: '1.5rem',
                        }}
                        border={0}
                        value={link || ''}
                        onChange={(e) => {
                          setLink(e.target.value);
                        }}
                        color={'#485766'}
                        fontSize={'0.9375rem'}
                        lineHeight={'1.5rem'}
                        bg={'#FFF'}
                      />
                    </Box>
                  </Box>
                </HStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'2.5rem'} />

          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.25rem'}
                  fontWeight={500}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.WRITE_YOUR_CONTENT)}
                </Text>
              </Box>
              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  {images.map((image, index) => {
                    const key = `img_${index}`;
                    return (
                      <Center
                        position={'relative'}
                        w={'6.25rem'}
                        h={'6.25rem'}
                        key={key}
                      >
                        <ChakraImage
                          fallback={<DefaultSkeleton />}
                          w={'100%'}
                          h={'100%'}
                          objectFit={'cover'}
                          src={image}
                        />
                        <Center
                          cursor={'pointer'}
                          onClick={() => {
                            handleRemoveImage(index);
                          }}
                          w={'1.5rem'}
                          h={'1.5rem'}
                          position={'absolute'}
                          top={0}
                          right={0}
                          transform="translate(30%, -30%)"
                          bg={'#FFF'}
                          border={'1px solid #7895B2'}
                          borderRadius={'50%'}
                        >
                          <CustomIcon name={'minus'} color={'#7895B2'} />
                        </Center>
                      </Center>
                    );
                  })}
                  <DefaultImage
                    retFile={(file, srcData) => {
                      handleImageFile(file, srcData);
                    }}
                  />
                </HStack>
              </Box>
              <Box w={'55rem'} h={'13.5rem'}>
                <Textarea
                  w={'100%'}
                  h={'100%'}
                  value={content || ''}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  resize={'none'}
                  placeholder={localeText(
                    LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT,
                  )}
                ></Textarea>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'3.75rem'} />
          <Box w={'100%'} h={'4rem'}>
            <Button
              isDisabled={!isActive}
              onClick={() => {
                handleSavePost();
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
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.LOUNGE.PUBLISH)}
              </Text>
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;

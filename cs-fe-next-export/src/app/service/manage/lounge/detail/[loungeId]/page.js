'use client';

import { LANGUAGES } from '@/constants/lang';
import { CATEGORY } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Breadcrumb,
  Img,
  BreadcrumbItem,
  Select,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { view } from 'framer-motion';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import utils from '@/utils';
import ContentDetailHeader from '@/components/layout/header/ContentDetailHeader';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import CustomIcon from '@/components/icon/CustomIcon';
import loungeApi from '@/services/loungeApi';
import { SUCCESS } from '@/constants/errorCode';
import MainContainer from '@/components/layout/MainContainer';
import loungeCommentApi from '@/services/loungeCommentApi';
import useModal from '@/hooks/useModal';
import QuillViewer from '@/components/input/editor/QuillViewer';

const LoungeDetailPage = () => {
  const { loungeId } = useParams();
  const { openModal } = useModal();
  const router = useRouter();
  const { lang, localeText } = useLocale();
  const [loungeInfo, setLoungeInfo] = useState(null);
  const [listLoungeImage, setListLoungeImage] = useState([]);
  const [listLoungeComment, setListLoungeComment] = useState([]);

  useEffect(() => {
    if (loungeId) {
      handleGetLounge();
      handleGetLoungeComment();
    }
  }, [loungeId]);

  const handleGetLounge = async () => {
    const param = {
      loungeId: loungeId,
    };

    const result = await loungeApi.getLounge(param);
    if (result?.errorCode === SUCCESS) {
      setLoungeInfo(result.data);
      setListLoungeImage(result.data.loungeImageList);
    }
  };

  const handleDeleteLounge = async () => {
    const param = {
      loungeIds: [loungeId],
    };

    const result = await loungeApi.deleteLounge(param);
    if (result?.errorCode === SUCCESS) {
      openModal({ text: result.message });
      router.back();
    }
  };

  const handleGetLoungeComment = async () => {
    const param = {
      loungeId: loungeId,
    };

    const result = await loungeCommentApi.getListLoungeComment(param);
    if (result?.errorCode === SUCCESS) {
      setListLoungeComment(result.datas);
    } else {
      setListLoungeComment([]);
    }
  };

  const commentCard = useCallback((item, index) => {
    const handleDetail = (item) => {
      // return router.push(SELLER.PRODUCTS.DETAIL);
    };

    const handleGetStatus = (status) => {
      if (status === 1) {
        return localeText(LANGUAGES.REVIEWS.WAITING);
      } else if (status === 2) {
        return localeText(LANGUAGES.REVIEWS.DONE);
      }
    };

    const handleOnOpenAnser = (item) => {
      console.log('handleOnOpenAnser');
      onOpenAnser();
    };

    return (
      <Box
        key={index}
        py={'1.25rem'}
        w={'100%'}
        borderBottom={'1px solid #AEBDCA'}
        boxSizing={'border-box'}
      >
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Text
                color={'#7895B2'}
                fontSize={'0.875rem'}
                fontWeight={400}
                lineHeight={'1.4rem'}
              >
                {item.author}
              </Text>
              <Text
                color={'#7895B2'}
                fontSize={'0.875rem'}
                fontWeight={400}
                lineHeight={'1.4rem'}
              >
                {item.date}
              </Text>
            </HStack>
          </Box>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
              <Text
                color={'#485766'}
                fontSize={'0.9375rem'}
                fontWeight={400}
                lineHeight={'1.5rem'}
                whiteSpace={'pre-wrap'}
              >
                {item.comment}
              </Text>

              <Box
                w={'1.5rem'}
                h={'1.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  console.log('asc');
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
        </VStack>
      </Box>
    );
  });

  return (
    <MainContainer
      isDetailHeader
      contentHeader={
        <Box minW={'7rem'} h={'3rem'}>
          <Button
            onClick={() => {
              openModal({
                type: 'confirm',
                text: localeText(LANGUAGES.INFO_MSG.DELETE_POST),
                onAgree: () => {
                  handleDeleteLounge();
                },
              });
            }}
            px={'1.25rem'}
            py={'0.63rem'}
            borderRadius={'0.25rem'}
            border={'1px solid #B20000'}
            boxSizing={'border-box'}
            bg={'transparent'}
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
              color={'#B20000'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              {localeText(LANGUAGES.COMMON.DELETE)}
            </Text>
          </Button>
        </Box>
      }
    >
      {loungeInfo && (
        <Box w={'100%'}>
          <VStack spacing={'2.5rem'}>
            <Box
              w={'100%'}
              borderTop={'1px solid #576076'}
              borderBottom={'1px solid #AEBDCA'}
              boxSizing={'border-box'}
              py={'1.25rem'}
            >
              <VStack
                w={'100%'}
                h={'100%'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                spacing={'1.25rem'}
                px={'1rem'}
              >
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={'1.5rem'}
                    fontWeight={500}
                    lineHeight={'2.475rem'}
                  >
                    {loungeInfo.title}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Box>
                      <HStack spacing={'1.25rem'} alignItems={'center'}>
                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.LOUNGE.AUTHOR_ID)}
                            </Text>
                            <Text
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {loungeInfo.id}
                            </Text>
                          </HStack>
                        </Box>

                        <Divider
                          w={0}
                          h={'1.25rem'}
                          border={'1px solid #AEBDCA'}
                        />

                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.LOUNGE.REGISTRATION_DATE)}
                            </Text>
                            <Text
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {utils.parseDateByCountryCode(
                                loungeInfo.createdAt,
                                lang,
                              )}
                            </Text>
                          </HStack>
                        </Box>

                        <Divider
                          w={0}
                          h={'1.25rem'}
                          border={'1px solid #AEBDCA'}
                        />

                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.LOUNGE.RELATED_LINK)}
                            </Text>
                            <Text
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {loungeInfo.link}
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                    <Box>
                      <Center
                        px={'1rem'}
                        py={'0.5rem'}
                        bg={'#E8DFCA'}
                        borderRadius={'1.25rem'}
                      >
                        <Text
                          color={'#A87C4E'}
                          fontSize={'0.875rem'}
                          fontWeight={500}
                          lineHeight={'1.4rem'}
                        >
                          {`${utils.parseAmount(loungeInfo.viewCnt)} ${localeText(LANGUAGES.LOUNGE.VIEWS)}`}
                        </Text>
                      </Center>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'2.5rem'} w="100%">
                {listLoungeImage.map((item, index) => {
                  return (
                    <Center w={'100%'} key={index}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        maxW={'50%'}
                        objectFit={'cover'}
                        src={item.imageS3Url}
                      />
                    </Center>
                  );
                })}
                <Box w="100%">
                  <QuillViewer html={loungeInfo?.content || ''} />
                </Box>
              </VStack>
            </Box>

            {listLoungeImage.length > 0 && (
              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  {listLoungeImage.map((image, index) => {
                    return (
                      <Center key={index} w={'5rem'} h={'5rem'}>
                        <ChakraImage
                          fallback={<DefaultSkeleton />}
                          w={'100%'}
                          h={'100%'}
                          src={image.imageS3Url}
                        />
                      </Center>
                    );
                  })}
                </HStack>
              </Box>
            )}

            <Divider borderTop={'1px solid #AEBDCA'} />

            <Box w={'100%'}>
              <VStack spacing={0}>
                {listLoungeComment.map((item, index) => {
                  return commentCard(item, index);
                })}
              </VStack>
            </Box>
          </VStack>
        </Box>
      )}
    </MainContainer>
  );
};

export default LoungeDetailPage;

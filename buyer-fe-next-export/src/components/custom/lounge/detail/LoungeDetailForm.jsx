'use client';

import IconLeft from '@public/svgs/icon/left.svg';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Img,
  Spinner,
  Text,
  VStack,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ContentBR from '@/components/custom/ContentBR';
import useLounge from '@/hooks/useLounge';
import utils from '@/utils';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import loungeCommentApi from '@/services/loungeCommentApi';
import { SUCCESS } from '@/constants/errorCode';
import { CustomIcon } from '@/components';
import useModal from '@/hooks/useModal';
import loungeApi from '@/services/loungeApi';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';
import IconEdit from '@public/svgs/icon/lounge-pen.svg';
import IconDelete from '@public/svgs/icon/lounge-delete.svg';

const LoungeDetailForm = (props) => {
  const { isMobile, clampW } = useDevice();
  const { backLounge, moveBack } = useMove();
  const router = useRouter();
  const { openModal } = useModal();
  const pathName = usePathname();
  const { lang, localeText } = useLocale();

  const isLogin = utils.getIsLogin();
  const { loungeType } = props;
  const { loungeInfo, firstImage, listImage } = useLounge();

  const [comment, setComment] = useState('');
  const [listComment, setListComment] = useState([]);

  useEffect(() => {
    if (loungeInfo?.loungeId) {
      if (isLogin) {
        handleGetListComment();
      }
    } else {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_FOUND_POST),
        onAgree: () => {
          backLounge(loungeType);
        },
      });
    }
  }, [loungeInfo]);

  const handleModifyPost = useCallback(() => {
    const parts = pathName.split('/');
    router.push(`/${parts[1]}/${parts[2]}/modify`);
  });

  const handleDeletePost = useCallback(async () => {
    const param = {
      loungeId: loungeInfo.loungeId,
    };
    const result = await loungeApi.deleteLounge(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          backLounge(loungeType);
        },
      });
    }
  });

  const handlePostComment = useCallback(async () => {
    if (!comment) {
      openModal({ text: localeText(LANGUAGES.LOUNGE.JOBS.PH_CONTENTS) });
      return;
    }
    const param = {
      loungeId: loungeInfo.loungeId,
      content: comment,
    };
    const result = await loungeCommentApi.postLoungeComment(param);
    if (result?.errorCode === SUCCESS) {
      setComment('');
      openModal({
        text: result.message,
      });
      handleGetListComment();
    }
  });

  const handleDeleteComment = useCallback(async (loungeCommentId) => {
    const param = {
      loungeCommentId: loungeCommentId,
    };
    const result = await loungeCommentApi.deleteLoungeComment(param);
    if (result?.errorCode === SUCCESS) {
      setComment('');
      openModal({
        text: result.message,
      });
      handleGetListComment();
    }
  });

  const handleGetListComment = async () => {
    const param = { loungeId: loungeInfo.loungeId };
    const result = await loungeCommentApi.getListLoungeComment(param);
    if (result?.errorCode === SUCCESS) {
      setListComment(result.datas);
    } else {
      setListComment([]);
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'}>
      <Box w={'100%'}>
        <HStack justifyContent={'space-between'}>
          <Box
            cursor={'pointer'}
            onClick={() => {
              moveBack();
            }}
          >
            <HStack spacing={'0.75rem'}>
              <Center
                w={'1.5rem'}
                h={'1.5rem'}
                onClick={() => {
                  moveBack();
                }}
              >
                <Img src={IconLeft.src} />
              </Center>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={clampW(1, 1.5)}
                  fontWeight={500}
                  lineHeight={'160%'}
                >
                  {loungeInfo.title}
                </Text>
              </Box>
            </HStack>
          </Box>
          {loungeInfo.isDelete === 2 && (
            <Box>
              <HStack spacing={'0.44rem'}>
                <Center
                  w={clampW(1.875, 2)}
                  h={clampW(1.875, 2)}
                  onClick={() => {
                    handleModifyPost();
                  }}
                >
                  <Img src={IconEdit.src} />
                </Center>
                <Center
                  w={clampW(1.875, 2)}
                  h={clampW(1.875, 2)}
                  onClick={() => {
                    openModal({
                      type: 'confirm',
                      text: localeText(LANGUAGES.INFO_MSG.DELETE_POST),
                      onAgree: () => {
                        handleDeletePost();
                      },
                    });
                  }}
                >
                  <Img src={IconDelete.src} />
                </Center>
              </HStack>
            </Box>
          )}
        </HStack>
      </Box>

      <ContentBR h={'1.5rem'} />

      <Box w={'100%'}>
        <VStack spacing={'1.5rem'}>
          {firstImage && (
            <Box w={'100%'}>
              <Center w={'100%'}>
                <Box w={'100%'} maxW={'30rem'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'cover'}
                    src={firstImage?.imageS3Url}
                  />
                </Box>
              </Center>
            </Box>
          )}
          <Box w={'100%'}>
            <Text
              color={'#485766'}
              fontSize={'1.125rem'}
              fontWeight={400}
              lineHeight={'1.96875rem'}
              whiteSpace={'pre-wrap'}
            >
              {loungeInfo.content}
            </Text>
          </Box>
          <Box w={'100%'}>
            <HStack spacing={'1.25rem'}>
              {listImage.map((image, index) => {
                const key = `img_${index}`;
                return (
                  <Center
                    position={'relative'}
                    w={'6.25rem'}
                    h={'6.25rem'}
                    key={key}
                  >
                    <ChakraImage
                      fallback={<Spinner />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      src={image?.imageS3Url}
                    />
                  </Center>
                );
              })}
            </HStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          <Box w={'100%'}>
            <VStack spacing={'0.75rem'}>
              <Box w={'100%'}>
                <Box
                  px={'1rem'}
                  py={'0.5rem'}
                  w={'6.4rem'}
                  h={'2.5rem'}
                  bg={'#E8DFCA'}
                  borderRadius={'1.25rem'}
                >
                  <Text
                    color={'#A87C4E'}
                    fontSize={'0.9375rem'}
                    fontWeight={500}
                    lineHeight={'1.5rem'}
                    textAlign={'center'}
                  >
                    {`${utils.parseAmount(loungeInfo.viewCnt)} ${localeText(LANGUAGES.LOUNGE.JOBS.VIEWS_LOW)}`}
                  </Text>
                </Box>
              </Box>

              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.9375, 1)}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {`${localeText(LANGUAGES.LOUNGE.JOBS.AUTHOR)} ID`}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(0.875, 1)}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {loungeInfo.id}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={clampW(0.9375, 1)}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.JOBS.REGISTRATION_DATE)}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={clampW(0.875, 1)}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {loungeInfo?.createdAt &&
                        utils.parseDateByCountryCode(
                          loungeInfo.createdAt,
                          lang,
                        )}
                    </Text>
                  </Box>
                </HStack>
              </Box>

              {loungeInfo?.link && (
                <Box
                  w={'100%'}
                  cursor={'pointer'}
                  onClick={() => {
                    window.open(loungeInfo.link, '_blank');
                  }}
                >
                  <HStack spacing={'1.25rem'}>
                    <Box>
                      <Text
                        color={'#7895B2'}
                        fontSize={clampW(0.9375, 1)}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.LOUNGE.JOBS.RELATED_LINKS)}
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.875, 1)}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {loungeInfo.link}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              )}
            </VStack>
          </Box>

          {isLogin && (
            <>
              <Divider borderTop={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Text
                        color={'#485766'}
                        fontWeight={500}
                        fontSize={'1.25rem'}
                        lineHeight={'2.25rem'}
                      >
                        {localeText(LANGUAGES.LOUNGE.JOBS.COMMENT)}
                      </Text>
                      <Box minW={'3.5rem'} w={'7rem'}>
                        <Button
                          onClick={() => {
                            handlePostComment();
                          }}
                          py={'0.5rem'}
                          px={'1.75rem'}
                          borderRadius={'0.25rem'}
                          bg={'transparent'}
                          border={'1px solid #73829D'}
                          h={'100%'}
                          w={'100%'}
                        >
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.825rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.LOUNGE.JOBS.WRITE_COMMENT)}
                          </Text>
                        </Button>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'} h={'8.75rem'}>
                    <Textarea
                      type={'text'}
                      placeholder={localeText(
                        LANGUAGES.LOUNGE.JOBS.PH_CONTENTS,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                        fontSize: '1rem',
                        fontWeight: 400,
                        lineHeight: '1.75rem',
                      }}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                      value={comment}
                      w={'100%'}
                      h={'100%'}
                      py={'0.875rem'}
                      px={'1.25rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      resize={'none'}
                      //
                      border={'1px solid #9CADBE'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    />
                  </Box>
                </VStack>
              </Box>
              <Divider borderTop={'1px solid #AEBDCA'} />
            </>
          )}

          <Box w={'100%'}>
            <VStack spacing={0}>
              {listComment.map((item, index) => {
                return (
                  <Box
                    w={'100%'}
                    py={'1.25rem'}
                    key={index}
                    borderTop={'1px solid #7895B2'}
                    borderBottom={
                      listComment.length - 1 === index
                        ? '1px solid #7895B2'
                        : null
                    }
                  >
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Box>
                            <Text
                              fontSize={'0.875rem'}
                              color={'#7895B2'}
                              fontWeight={400}
                            >
                              {item.id}
                            </Text>
                          </Box>
                          <Box
                            fontSize={'0.875rem'}
                            color={'#7895B2'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {utils.parseDateByCountryCode(
                              item.createdAt,
                              lang,
                              true,
                            )}
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                        >
                          <Box
                            fontSize={'0.875rem'}
                            color={'#485766'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            whiteSpace={'pre-wrap'}
                          >
                            {item.content}
                          </Box>
                          {item.isDelete === 2 && (
                            <Box
                              w={'1.25rem'}
                              h={'1.25rem'}
                              cursor={'pointer'}
                              onClick={() => {
                                openModal({
                                  type: 'confirm',
                                  text: localeText(
                                    LANGUAGES.INFO_MSG.DELETE_COMMENT,
                                  ),
                                  onAgree: () => {
                                    handleDeleteComment(item.loungeCommentId);
                                  },
                                });
                              }}
                            >
                              <CustomIcon
                                w={'100%'}
                                h={'100%'}
                                name={'close'}
                                color={'#7895B2'}
                              />
                            </Box>
                          )}
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  ) : (
    <Box w={'100%'}>
      <Box w={'100%'}>
        <HStack justifyContent={'space-between'}>
          <Box
            cursor={'pointer'}
            onClick={() => {
              moveBack();
            }}
          >
            <HStack spacing={'0.75rem'}>
              <Center w={'1.5rem'} h={'1.5rem'}>
                <Img src={IconLeft.src} />
              </Center>
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
            </HStack>
          </Box>
          {loungeInfo.isDelete === 2 && (
            <Box>
              <HStack spacing={'0.5rem'}>
                <Box minW={'7rem'} w={'11.625rem'}>
                  <Button
                    onClick={() => {
                      handleModifyPost();
                    }}
                    py={'0.625rem'}
                    px={'1.75rem'}
                    borderRadius={'0.25rem'}
                    bg={'transparent'}
                    border={'1px solid #73829D'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.JOBS.MODIFY)}
                    </Text>
                  </Button>
                </Box>
                <Box minW={'7rem'} w={'11.625rem'}>
                  <Button
                    onClick={() => {
                      openModal({
                        type: 'confirm',
                        text: localeText(LANGUAGES.INFO_MSG.DELETE_POST),
                        onAgree: () => {
                          handleDeletePost();
                        },
                      });
                    }}
                    py={'0.625rem'}
                    px={'1.75rem'}
                    borderRadius={'0.25rem'}
                    bg={'transparent'}
                    border={'1px solid #B20000'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#B20000'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.JOBS.DELETE)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>
          )}
        </HStack>
      </Box>

      <ContentBR h={'1.5rem'} />

      <Box w={'100%'}>
        <VStack spacing={'3.75rem'}>
          <Box
            w={'100%'}
            py={'1.25rem'}
            borderTop={'1px solid #AEBDCA'}
            borderBottom={'1px solid #AEBDCA'}
          >
            <HStack spacing={'1.25rem'}>
              <Box>
                <HStack>
                  <Box
                    px={'1rem'}
                    py={'0.5rem'}
                    w={'6.4rem'}
                    h={'2.5rem'}
                    bg={'#E8DFCA'}
                    borderRadius={'1.25rem'}
                  >
                    <Text
                      color={'#A87C4E'}
                      fontSize={'0.9375rem'}
                      fontWeight={500}
                      lineHeight={'1.5rem'}
                      textAlign={'center'}
                    >
                      {`${utils.parseAmount(loungeInfo.viewCnt)} ${localeText(LANGUAGES.LOUNGE.JOBS.VIEWS_LOW)}`}
                    </Text>
                  </Box>
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {`${localeText(LANGUAGES.LOUNGE.JOBS.AUTHOR)} ID`}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {loungeInfo.id}
                </Text>
              </Box>
              <Box w={'1px'} h={'1.25rem'} borderRight={'1px solid #AEBDCA'} />
              <Box>
                <Text
                  color={'#7895B2'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.JOBS.REGISTRATION_DATE)}
                </Text>
              </Box>
              <Box>
                <Text
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {loungeInfo?.createdAt &&
                    utils.parseDateByCountryCode(loungeInfo.createdAt, lang)}
                </Text>
              </Box>

              {loungeInfo?.link && (
                <Box>
                  <HStack spacing={'1.25rem'}>
                    <Box>
                      <Text
                        color={'#7895B2'}
                        fontSize={clampW(0.9375, 1)}
                        fontWeight={400}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.LOUNGE.JOBS.RELATED_LINKS)}
                      </Text>
                    </Box>
                    <Box
                      cursor={'pointer'}
                      onClick={() => {
                        window.open(loungeInfo.link, '_blank');
                      }}
                    >
                      <Text
                        color={'#485766'}
                        fontSize={clampW(0.875, 1)}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {loungeInfo.link}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              )}
            </HStack>
          </Box>
          {firstImage && (
            <Box w={'100%'}>
              <Center w={'100%'}>
                <Box w={'37.5rem'} h={'37.5rem'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    objectFit={'cover'}
                    src={firstImage?.imageS3Url}
                  />
                </Box>
              </Center>
            </Box>
          )}
          <Box w={'100%'}>
            <Text
              color={'#485766'}
              fontSize={'1.125rem'}
              fontWeight={400}
              lineHeight={'1.96875rem'}
              whiteSpace={'pre-wrap'}
            >
              {loungeInfo.content}
            </Text>
          </Box>
          <Box w={'100%'}>
            <HStack spacing={'1.25rem'}>
              {listImage.map((image, index) => {
                const key = `img_${index}`;
                return (
                  <Center
                    position={'relative'}
                    w={'6.25rem'}
                    h={'6.25rem'}
                    key={key}
                  >
                    <ChakraImage
                      fallback={<Spinner />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      src={image?.imageS3Url}
                    />
                  </Center>
                );
              })}
            </HStack>
          </Box>

          <Divider borderTop={'1px solid #AEBDCA'} />

          {isLogin && (
            <>
              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Text
                        color={'#485766'}
                        fontWeight={500}
                        fontSize={'1.25rem'}
                        lineHeight={'2.25rem'}
                      >
                        {localeText(LANGUAGES.LOUNGE.JOBS.COMMENT)}
                      </Text>
                      <Box minW={'3.5rem'} w={'7rem'}>
                        <Button
                          onClick={() => {
                            handlePostComment();
                          }}
                          py={'0.5rem'}
                          px={'1.75rem'}
                          borderRadius={'0.25rem'}
                          bg={'transparent'}
                          border={'1px solid #73829D'}
                          h={'100%'}
                          w={'100%'}
                        >
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.825rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          >
                            {localeText(LANGUAGES.LOUNGE.JOBS.WRITE_COMMENT)}
                          </Text>
                        </Button>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'} h={'8.75rem'}>
                    <Textarea
                      type={'text'}
                      placeholder={localeText(
                        LANGUAGES.LOUNGE.JOBS.PH_CONTENTS,
                      )}
                      _placeholder={{
                        color: '#A7C3D2',
                        fontSize: '1rem',
                        fontWeight: 400,
                        lineHeight: '1.75rem',
                      }}
                      onChange={(e) => {
                        setComment(e.target.value);
                      }}
                      value={comment}
                      w={'100%'}
                      h={'100%'}
                      py={'0.875rem'}
                      px={'1.25rem'}
                      bg={'#FFF'}
                      borderRadius={'0.25rem'}
                      resize={'none'}
                      //
                      border={'1px solid #9CADBE'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    />
                  </Box>
                </VStack>
              </Box>
              <Divider borderTop={'1px solid #AEBDCA'} />
            </>
          )}

          <Box w={'100%'}>
            <VStack spacing={0}>
              {listComment.map((item, index) => {
                return (
                  <Box
                    w={'100%'}
                    py={'1.25rem'}
                    key={index}
                    borderTop={'1px solid #7895B2'}
                    borderBottom={
                      listComment.length - 1 === index
                        ? '1px solid #7895B2'
                        : null
                    }
                  >
                    <VStack spacing={'0.75rem'}>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Box>
                            <Text
                              fontSize={'0.875rem'}
                              color={'#7895B2'}
                              fontWeight={400}
                            >
                              {item.id}
                            </Text>
                          </Box>
                          <Box
                            fontSize={'0.875rem'}
                            color={'#7895B2'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {utils.parseDateByCountryCode(
                              item.createdAt,
                              lang,
                              true,
                            )}
                          </Box>
                        </HStack>
                      </Box>
                      <Box w={'100%'}>
                        <HStack
                          justifyContent={'space-between'}
                          alignItems={'flex-start'}
                        >
                          <Box
                            fontSize={'0.875rem'}
                            color={'#485766'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                            whiteSpace={'pre-wrap'}
                          >
                            {item.content}
                          </Box>
                          {item.isDelete === 2 && (
                            <Box
                              w={'1.25rem'}
                              h={'1.25rem'}
                              cursor={'pointer'}
                              onClick={() => {
                                openModal({
                                  type: 'confirm',
                                  text: localeText(
                                    LANGUAGES.INFO_MSG.DELETE_COMMENT,
                                  ),
                                  onAgree: () => {
                                    handleDeleteComment(item.loungeCommentId);
                                  },
                                });
                              }}
                            >
                              <CustomIcon
                                w={'100%'}
                                h={'100%'}
                                name={'close'}
                                color={'#7895B2'}
                              />
                            </Box>
                          )}
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoungeDetailForm;

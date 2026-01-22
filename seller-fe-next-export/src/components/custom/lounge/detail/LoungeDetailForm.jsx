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
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';

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

  const commentCard = useCallback((item, index) => {
    const id = item?.id;
    const content = item?.content;
    const loungeCommentId = item?.loungeCommentId;
    const createdAt = item?.createdAt;
    const isDelete = item?.isDelete;

    return (
      <Box
        key={index}
        py={'1.25rem'}
        w={'100%'}
        borderTop={'1px solid #AEBDCA'}
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
                {id}
              </Text>
              <Text
                color={'#7895B2'}
                fontSize={'0.875rem'}
                fontWeight={400}
                lineHeight={'1.4rem'}
              >
                {utils.parseDateByCountryCode(createdAt, lang)}
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
                {content}
              </Text>

              {isDelete === 2 && (
                <Box
                  w={'1.5rem'}
                  h={'1.5rem'}
                  cursor={'pointer'}
                  onClick={() => {
                    openModal({
                      type: 'confirm',
                      text: localeText(LANGUAGES.INFO_MSG.DELETE_COMMENT),
                      onAgree: () => {
                        handleDeleteComment(loungeCommentId);
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
  });

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack spacing={0} px={clampW(1, 5)}>
        <Box w={'100%'}>
          <Text
            color={'#485766'}
            fontSize={clampW(0.8125, 1.125)}
            fontWeight={400}
            lineHeight={'160%'}
            whiteSpace={'pre-wrap'}
          >
            {loungeInfo.content}
          </Text>
        </Box>

        <ContentBR h={'1.5rem'} />

        <Box w={'100%'}>
          <HStack spacing={'1.25rem'}>
            {loungeInfo.loungeImageList?.length > 0 &&
              loungeInfo.loungeImageList?.map((item, index) => {
                return (
                  <Center w={'5rem'} h={'5rem'} key={index}>
                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      src={item.imageS3Url}
                    />
                  </Center>
                );
              })}
          </HStack>
        </Box>

        <ContentBR h={'1.5rem'} />

        <Divider borderTop={'1px solid #AEBDCA'} />

        <ContentBR h={'1.5rem'} />

        <Box w={'100%'}>
          <VStack alignItems={'flex-start'}>
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
                  {`${loungeInfo.viewCnt} ${localeText(LANGUAGES.LOUNGE.VIEWS)}`}
                </Text>
              </Center>
            </Box>

            <Box w={'max-content'}>
              <HStack spacing={'1.25rem'}>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.AUTHOR_ID)}
                </Text>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.875, 0.9375)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {loungeInfo.id}
                </Text>
              </HStack>
            </Box>

            <Box w={'max-content'}>
              <HStack spacing={'1.25rem'}>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {localeText(LANGUAGES.LOUNGE.REGISTRATION_DATE)}
                </Text>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.875, 0.9375)}
                  fontWeight={500}
                  lineHeight={'1.5rem'}
                >
                  {utils.parseDateByCountryCode(loungeInfo.createdAt, lang)}
                </Text>
              </HStack>
            </Box>

            {loungeInfo?.link && (
              <Box w={'max-content'}>
                <HStack spacing={'1.25rem'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.RELATED_LINK)}
                  </Text>
                  <Text
                    color={'#485766'}
                    fontSize={clampW(0.875, 0.9375)}
                    fontWeight={500}
                    lineHeight={'1.5rem'}
                  >
                    {loungeInfo.link}
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </Box>

        <ContentBR h={'1.5rem'} />

        <Divider borderTop={'1px solid #AEBDCA'} />

        <ContentBR h={'1.5rem'} />

        <Box w={'100%'}>
          <VStack spacing={'0.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={500}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.COMMENT)}
                  </Text>
                </Box>
                <Box minW={'3.5rem'} w={'7rem'}>
                  <Button
                    onClick={() => {
                      handlePostComment();
                    }}
                    py={'0.5rem'}
                    px={'1.75rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    border={'1px solid #7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'0.825rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.WRITE_COMMENT)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>
            <Box
              w={'100%'}
              h={'8.75rem'}
              border={'1px solid #9CADBE'}
              borderRadius={'0.25rem'}
              boxSizing={'border-box'}
            >
              <Textarea
                py={'0.88rem'}
                px={'1.25rem'}
                w={'100%'}
                h={'100%'}
                resize={'none'}
                value={comment || ''}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder={localeText(LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT)}
              ></Textarea>
            </Box>
          </VStack>
        </Box>

        <Box w={'100%'} borderBottom={'1px solid ##AEBDCA'}>
          <VStack spacing={0}>
            {listComment.map((item, index) => {
              return commentCard(item, index);
            })}
          </VStack>
        </Box>
      </VStack>
      <ContentBR h={'1.25rem'} />
    </Box>
  ) : (
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
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.LOUNGE.AUTHOR_ID)}
                        </Text>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
                          lineHeight={'160%'}
                        >
                          {loungeInfo.id}
                        </Text>
                      </HStack>
                    </Box>

                    <Divider w={0} h={'1.25rem'} border={'1px solid #AEBDCA'} />

                    <Box w={'max-content'}>
                      <HStack spacing={'1.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.LOUNGE.REGISTRATION_DATE)}
                        </Text>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
                          lineHeight={'1.5rem'}
                        >
                          {utils.parseDateByCountryCode(
                            loungeInfo.createdAt,
                            lang,
                          )}
                        </Text>
                      </HStack>
                    </Box>

                    <Divider w={0} h={'1.25rem'} border={'1px solid #AEBDCA'} />

                    <Box w={'max-content'}>
                      <HStack spacing={'1.25rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'0.9375rem'}
                          fontWeight={400}
                          lineHeight={'1.5rem'}
                        >
                          {localeText(LANGUAGES.LOUNGE.RELATED_LINK)}
                        </Text>
                        <Text
                          color={'#485766'}
                          fontSize={clampW(0.875, 0.9375)}
                          fontWeight={500}
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
                      {`${loungeInfo.viewCnt} ${localeText(LANGUAGES.LOUNGE.VIEWS)}`}
                    </Text>
                  </Center>
                </Box>
              </HStack>
            </Box>
          </VStack>
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
            {loungeInfo.loungeImageList?.length > 0 &&
              loungeInfo.loungeImageList?.map((item, index) => {
                return (
                  <Center w={'5rem'} h={'5rem'} key={index}>
                    <ChakraImage
                      fallback={<DefaultSkeleton />}
                      w={'100%'}
                      h={'100%'}
                      src={item.imageS3Url}
                    />
                  </Center>
                );
              })}
          </HStack>
        </Box>

        <Divider borderTop={'1px solid #AEBDCA'} />

        <Box w={'100%'}>
          <VStack spacing={'0.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={500}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.COMMENT)}
                  </Text>
                </Box>
                <Box minW={'3.5rem'} w={'7rem'}>
                  <Button
                    onClick={() => {
                      handlePostComment();
                    }}
                    py={'0.5rem'}
                    px={'1.75rem'}
                    borderRadius={'0.25rem'}
                    bg={'#7895B2'}
                    border={'1px solid #7895B2'}
                    h={'100%'}
                    w={'100%'}
                  >
                    <Text
                      color={'#FFF'}
                      fontSize={'0.825rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.LOUNGE.WRITE_COMMENT)}
                    </Text>
                  </Button>
                </Box>
              </HStack>
            </Box>
            <Box
              w={'100%'}
              h={'8.75rem'}
              border={'1px solid #9CADBE'}
              borderRadius={'0.25rem'}
              boxSizing={'border-box'}
            >
              <Textarea
                py={'0.88rem'}
                px={'1.25rem'}
                w={'100%'}
                h={'100%'}
                resize={'none'}
                value={comment || ''}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                placeholder={localeText(LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT)}
              ></Textarea>
            </Box>
          </VStack>
        </Box>

        <Box w={'100%'} borderBottom={'1px solid ##AEBDCA'}>
          <VStack spacing={0}>
            {listComment.map((item, index) => {
              return commentCard(item, index);
            })}
          </VStack>
        </Box>
      </VStack>
      <ContentBR h={'1.25rem'} />
    </Box>
  );
};

export default LoungeDetailForm;

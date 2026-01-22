'use client';

import { CustomIcon } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import PostTitleTextInput from '@/components/input/custom/PostTitleTextInput';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import DefaultImage from '@/components/input/file/DefaultImage';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import {
  Box,
  Center,
  HStack,
  Text,
  Textarea,
  VStack,
  Image as ChakraImage,
} from '@chakra-ui/react';
import { useParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import ContentBR from '../ContentBR';

const LoungeBody = (props) => {
  const { action } = useParams();
  const { moveBack } = useMove();
  const pathName = usePathname();
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();
  const { openModal } = useModal();

  const { tempLoungeInfo, setTempLoungeInfo } = props;

  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (tempLoungeInfo?.loungeId) {
      if (tempLoungeInfo.isDelete === 1 && action === 'modify') {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.NOT_DELETE_POST),
          onAgree: () => {
            moveBack();
          },
        });
        return;
      }

      if (tempLoungeInfo?.loungeImageList) {
        const images = tempLoungeInfo?.loungeImageList || [];
        let srcs = [];
        images.map((image) => {
          srcs.push(image.imageS3Url);
        });
        setImages(srcs);
      }
    } else {
      openModal({
        text: localeText(LANGUAGES.INFO_MSG.NOT_DELETE_POST),
        onAgree: () => {
          moveBack();
        },
      });
      return;
    }
  }, []);

  useEffect(() => {
    const temp = { ...tempLoungeInfo };
    setTempLoungeInfo({
      ...temp,
      files: files,
    });
  }, [files]);

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

    let loungeImages = [...tempLoungeInfo?.loungeImageList];
    const targetImage = loungeImages[index];
    loungeImages.splice(index, 1);

    if (targetImage?.loungeImageId) {
      if (tempLoungeInfo?.deleteLoungeImageIdList) {
        const temp = tempLoungeInfo?.deleteLoungeImageIdList;
        temp.push(targetImage.loungeImageId);
        setTempLoungeInfo({
          ...tempLoungeInfo,
          deleteLoungeImageIdList: temp,
          loungeImageList: loungeImages,
        });
      } else {
        setTempLoungeInfo({
          ...tempLoungeInfo,
          deleteLoungeImageIdList: [targetImage.loungeImageId],
          loungeImageList: loungeImages,
        });
      }
    }
  });

  return isMobile(true) ? (
    <Box
      w={'100%'}
      // h={'calc(100vh - 9.2rem)'}
      //
      px={clampW(1, 5)}
    >
      <Box w={'100%'}>
        <PostTitleTextInput
          value={tempLoungeInfo?.title || ''}
          onChange={(v) => {
            const temp = { ...tempLoungeInfo };
            setTempLoungeInfo({
              ...temp,
              title: v,
            });
          }}
          title={localeText(LANGUAGES.LOUNGE.JOBS.TITLE)}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_TITLE)}
        />
      </Box>

      <Box w={'100%'}>
        <PostTitleTextInput
          value={tempLoungeInfo?.link || ''}
          onChange={(v) => {
            const temp = { ...tempLoungeInfo };
            setTempLoungeInfo({
              ...temp,
              link: v,
            });
          }}
          title={`${localeText(LANGUAGES.LOUNGE.JOBS.RELATED_LINKS)} (${localeText(LANGUAGES.LOUNGE.JOBS.OPTIONAL)})`}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_RELATED_LINKS)}
        />
      </Box>

      <Box w={'100%'}>
        <Box h={'10rem'} w={'100%'}>
          <VStack alignItems={'flex-start'} spacing={'1.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'flex-start'} alignItems={'center'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.25rem'}
                  fontWeight={500}
                  lineHeight={'180%'}
                >
                  {`${localeText(LANGUAGES.LOUNGE.JOBS.IMAGE)} (${localeText(LANGUAGES.LOUNGE.JOBS.OPTIONAL)})`}
                </Text>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {`${localeText(LANGUAGES.LOUNGE.JOBS.PH_IMAGE)}`}
                </Text>
              </HStack>
            </Box>
            <Box w={'100%'}>
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
                        top={'8px'}
                        right={'8px'}
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
                  <Box w={'6.25rem'} minW={'6.25rem'} h={'6.25rem'}>
                    <DefaultImage
                      retFile={(file, srcData) => {
                        handleImageFile(file, srcData);
                      }}
                    />
                  </Box>
                )}
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Box>

      <ContentBR h={'1.25rem'} />

      <Box w={'100%'}>
        <Box w={'100%'}>
          <VStack alignItems={'flex-start'} spacing={'0.75rem'}>
            <Text
              color={'#485766'}
              fontSize={'1.25rem'}
              fontWeight={500}
              lineHeight={'180%'}
            >
              {localeText(LANGUAGES.LOUNGE.JOBS.CONTENTS)}
            </Text>
            <Textarea
              type={'text'}
              placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_CONTENTS)}
              _placeholder={{
                color: '#A7C3D2',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: '1.75rem',
              }}
              value={tempLoungeInfo?.content || ''}
              onChange={(e) => {
                const temp = { ...tempLoungeInfo };
                setTempLoungeInfo({
                  ...temp,
                  content: e.target.value,
                });
              }}
              resize={'none'}
              w={'100%'}
              h={'8.75rem'}
              py={'0.88rem'}
              px={'1.25rem'}
              bg={'#FFF'}
              borderRadius={'0.25rem'}
              //
              border={'1px solid #9CADBE'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            />
          </VStack>
        </Box>
      </Box>
      <ContentBR h={'1.25rem'} />
    </Box>
  ) : (
    <>
      <Box w={'100%'}>
        <PostTitleTextInput
          value={tempLoungeInfo?.title || ''}
          onChange={(v) => {
            const temp = { ...tempLoungeInfo };
            setTempLoungeInfo({
              ...temp,
              title: v,
            });
          }}
          title={localeText(LANGUAGES.LOUNGE.JOBS.TITLE)}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_TITLE)}
        />
      </Box>
      <Box w={'100%'}>
        <PostTitleTextInput
          value={tempLoungeInfo?.link || ''}
          onChange={(v) => {
            const temp = { ...tempLoungeInfo };
            setTempLoungeInfo({
              ...temp,
              link: v,
            });
          }}
          title={`${localeText(LANGUAGES.LOUNGE.JOBS.RELATED_LINKS)} (${localeText(LANGUAGES.LOUNGE.JOBS.OPTIONAL)})`}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_RELATED_LINKS)}
        />
      </Box>
      <Box w={'100%'}>
        <Box h={'10rem'} w={'100%'}>
          <VStack alignItems={'flex-start'} spacing={'1.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'flex-start'} alignItems={'center'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.25rem'}
                  fontWeight={500}
                  lineHeight={'180%'}
                >
                  {`${localeText(LANGUAGES.LOUNGE.JOBS.IMAGE)} (${localeText(LANGUAGES.LOUNGE.JOBS.OPTIONAL)})`}
                </Text>
                <Text
                  color={'#7895B2'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {`${localeText(LANGUAGES.LOUNGE.JOBS.PH_IMAGE)}`}
                </Text>
              </HStack>
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
                {images.length < 5 && (
                  <DefaultImage
                    retFile={(file, srcData) => {
                      handleImageFile(file, srcData);
                    }}
                  />
                )}
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Box>

      <Box w={'100%'}>
        <Box h={'7.5rem'} w={'100%'}>
          <VStack alignItems={'flex-start'} spacing={'1.5rem'}>
            <Text
              color={'#485766'}
              fontSize={'1.25rem'}
              fontWeight={500}
              lineHeight={'180%'}
            >
              {localeText(LANGUAGES.LOUNGE.JOBS.CONTENTS)}
            </Text>
            <Textarea
              type={'text'}
              placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_CONTENTS)}
              _placeholder={{
                color: '#A7C3D2',
                fontSize: '1rem',
                fontWeight: 400,
                lineHeight: '1.75rem',
              }}
              value={tempLoungeInfo?.content || ''}
              onChange={(e) => {
                const temp = { ...tempLoungeInfo };
                setTempLoungeInfo({
                  ...temp,
                  content: e.target.value,
                });
              }}
              resize={'none'}
              w={'100%'}
              h={'8.75rem'}
              py={'0.88rem'}
              px={'1.25rem'}
              bg={'#FFF'}
              borderRadius={'0.25rem'}
              //
              border={'1px solid #9CADBE'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            />
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default LoungeBody;

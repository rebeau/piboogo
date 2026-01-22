'use client';

import { CustomIcon } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import PostTitleTextInput from '@/components/input/custom/PostTitleTextInput';
import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import DefaultImage from '@/components/input/file/DefaultImage';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Center,
  HStack,
  Text,
  Textarea,
  VStack,
  Image as ChakraImage,
  Button,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
const LoungeEditBody = (props) => {
  const pathName = usePathname();
  const isModify = pathName.indexOf('/modify') > -1;
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();

  const {
    title,
    setTitle,
    link,
    setLink,
    images,
    content,
    setContent,
    handleImageFile,
    handleRemoveImage,
    // 모바일에서만 사용
    isDisabled = true,
    handleSavePost,
    handleModifyPost,
  } = props;

  return isMobile(true) ? (
    <>
      <Box w={'100%'}>
        <PostTitleTextInput
          value={title}
          onChange={(v) => {
            setTitle(v);
          }}
          title={localeText(LANGUAGES.LOUNGE.JOBS.TITLE)}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_TITLE)}
        />
      </Box>

      <Box w={'100%'}>
        <PostTitleTextInput
          value={link}
          onChange={(v) => {
            setLink(v);
          }}
          title={`${localeText(LANGUAGES.LOUNGE.JOBS.RELATED_LINKS)} (${localeText(LANGUAGES.LOUNGE.JOBS.OPTIONAL)})`}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_RELATED_LINKS)}
        />
      </Box>

      <Box w={'100%'}>
        <Box h={'9.25rem'} w={'100%'}>
          <VStack alignItems={'flex-start'} spacing={'1.5rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'flex-start'} alignItems={'center'}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.9375, 1.25)}
                  fontWeight={500}
                  lineHeight={'180%'}
                >
                  {`${localeText(LANGUAGES.LOUNGE.JOBS.IMAGE)} (${localeText(LANGUAGES.LOUNGE.JOBS.OPTIONAL)})`}
                </Text>
                <Text
                  color={'#7895B2'}
                  fontSize={clampW(0.875, 0.9375)}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {`${localeText(LANGUAGES.LOUNGE.JOBS.PH_IMAGE)}`}
                </Text>
              </HStack>
            </Box>

            <Box w={'100%'} overflowX={'auto'}>
              <HStack spacing={'1.25rem'} w={'100%'}>
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
                        position={'absolute'}
                        overflow={'none'}
                        cursor={'pointer'}
                        onClick={() => {
                          handleRemoveImage(index);
                        }}
                        w={'1.5rem'}
                        h={'1.5rem'}
                        top={0}
                        right={0}
                        // transform="translate(30%, -30%)"
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
          </VStack>
        </Box>
      </Box>

      <Box w={'100%'}>
        <Box w={'100%'}>
          <VStack alignItems={'flex-start'} spacing={'0.25rem'}>
            <Text
              color={'#485766'}
              fontSize={clampW(0.9375, 1.25)}
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
              onChange={(e) => {
                setContent(e.target.value);
              }}
              resize={'none'}
              value={content || ''}
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

      <Box w={'100%'} h={'3rem'} mb={'1.5rem'}>
        <Button
          h={'100%'}
          w={'100%'}
          isDisabled={isDisabled}
          onClick={() => {
            if (isModify) {
              if (handleModifyPost) {
                handleModifyPost();
              }
            } else {
              if (handleSavePost) {
                handleSavePost();
              }
            }
          }}
          _disabled={{
            bg: '#D9E7EC',
          }}
          _hover={{
            opacity: isDisabled ? 'none' : 0.8,
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
          py={'0.625rem'}
          px={'1.25rem'}
          borderRadius={'0.25rem'}
          bg={'#7895B2'}
        >
          <Text
            color={'#FFF'}
            fontSize={'1rem'}
            fontWeight={400}
            lineHeight={'1.75rem'}
          >
            {localeText(
              isModify
                ? LANGUAGES.LOUNGE.JOBS.MODIFY
                : LANGUAGES.LOUNGE.JOBS.SAVE,
            )}
          </Text>
        </Button>
      </Box>
    </>
  ) : (
    <>
      <Box w={'100%'}>
        <PostTitleTextInput
          value={title}
          onChange={(v) => {
            setTitle(v);
          }}
          title={localeText(LANGUAGES.LOUNGE.JOBS.TITLE)}
          placeholder={localeText(LANGUAGES.LOUNGE.JOBS.PH_TITLE)}
        />
      </Box>
      <Box w={'100%'}>
        <PostTitleTextInput
          value={link}
          onChange={(v) => {
            setLink(v);
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
        <Box w={'100%'}>
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
              onChange={(e) => {
                setContent(e.target.value);
              }}
              resize={'none'}
              value={content || ''}
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

export default LoungeEditBody;

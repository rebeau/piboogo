'use client';

import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react';
import LoungeEditHeader from './LoungeEditHeader';
import LoungeEditBody from './LoungeEditBody';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';

const LoungeEditTemplate = ({
  isMobile,
  isModify,
  target,
  loungeHook,
  action,
}) => {
  const {
    title,
    setTitle,
    link,
    setLink,
    images,
    setImages,
    files,
    setFiles,
    content,
    setContent,
    handleImageFile,
    handleRemoveImage,
    handleActiveAction,
    handleSavePost,
    handleModifyPost,
  } = loungeHook;
  const { localeText } = useLocale();

  return (
    <Box w="100%">
      <VStack spacing={isMobile ? '1.5rem' : '3.75rem'}>
        <LoungeEditHeader
          isDisabled={!handleActiveAction()}
          handleSavePost={() => handleSavePost(target)}
          handleModifyPost={() => handleModifyPost(target)}
        />

        <LoungeEditBody
          title={title}
          setTitle={setTitle}
          link={link}
          setLink={setLink}
          images={images}
          setImages={setImages}
          files={files}
          setFiles={setFiles}
          content={content}
          setContent={setContent}
          handleImageFile={handleImageFile}
          handleRemoveImage={handleRemoveImage}
          isDisabled={isMobile ? !handleActiveAction() : undefined}
          handleSavePost={isMobile ? () => handleSavePost(target) : undefined}
          handleModifyPost={
            isMobile ? () => handleModifyPost(target) : undefined
          }
        />

        {(isModify || action === 'write') && (
          <Box w="100%">
            <HStack w={'100%'} justifyContent="flex-end">
              <Box minW={'7rem'} w={'11.625rem'}>
                <Button
                  isDisabled={!handleActiveAction()}
                  onClick={() => {
                    if (isModify) {
                      if (handleModifyPost) {
                        handleModifyPost(target);
                      }
                    } else {
                      if (handleSavePost) {
                        handleSavePost(target);
                      }
                    }
                  }}
                  _disabled={{
                    bg: '#D9E7EC',
                  }}
                  _hover={{
                    opacity: !handleActiveAction() ? 'none' : 0.8,
                    cursor: !handleActiveAction() ? 'not-allowed' : 'pointer',
                  }}
                  py={'0.625rem'}
                  px={'1.25rem'}
                  borderRadius={'0.25rem'}
                  bg={'#7895B2'}
                  h={'100%'}
                  w={'100%'}
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
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default LoungeEditTemplate;

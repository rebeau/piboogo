'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, VStack, Center } from '@chakra-ui/react';
import useDevice from '@/hooks/useDevice';

const DragAndDrop = (props) => {
  const { isMobile, clampW } = useDevice();
  const {
    w = '25rem',
    h = '25rem',
    limitSize = '1200*1200',
    //
    files = [],
    maxFiles,
    onChange,
  } = props;

  const onDrop = useCallback(
    (acceptedFiles) => {
      const remainingSlots = maxFiles - files.length;
      const trimmedFiles = acceptedFiles.slice(0, remainingSlots);

      const newFiles = [...files, ...trimmedFiles];
      onChange(newFiles); // 부모에게 전달
    },
    [files, maxFiles, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: true,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
  });

  const removeFile = (index) => {
    const updated = files.filter((_, i) => i !== index);
    onChange(updated); // 부모에게 전달
  };

  return (
    <Center
      w={isMobile(true) ? '100%' : w}
      h={h}
      boxSizing={'border-box'}
      borderRadius={'0.25rem'}
      border={'1.5px dashed  #9CADBE'}
      cursor={'pointer'}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <VStack spacing={'1.25rem'}>
        <Box>
          <VStack spacing={'0.25rem'}>
            <Box>
              <Text
                color={'#66809C'}
                fontSize={clampW(1, 1.125)}
                fontWeight={500}
                lineHeight={'1.96875rem'}
                textAlign={'center'}
              >
                Drag & Drop or Choose file to upload
              </Text>
            </Box>
            <Box>
              <Text
                color={'#7895B2'}
                fontSize={clampW(0.75, 0.875)}
                fontWeight={400}
                lineHeight={'1.4rem'}
                textAlign={'center'}
              >
                JPG, PNG or PDF, file size no more than 10MB
                <br />
                Recommended image sizes : {limitSize}
              </Text>
            </Box>
          </VStack>
        </Box>
        <Box w={isMobile(true) ? '50vw' : '13.5rem'}>
          <Center
            px={'1.25rem'}
            py={'0.62rem'}
            borderRadius={'0.25rem'}
            border={'1px solid #73829D'}
            boxSizing={'border-box'}
            bg={'transparent'}
            h={'100%'}
            w={'100%'}
          >
            <Text
              color={'#556A7E'}
              fontSize={'1rem'}
              fontWeight={400}
              lineHeight={'1.75rem'}
            >
              Select file
            </Text>
          </Center>
        </Box>
      </VStack>
    </Center>
  );
};

export default DragAndDrop;

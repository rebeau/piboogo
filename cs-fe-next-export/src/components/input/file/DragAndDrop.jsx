'use client';

import useDevice from '@/hooks/useDevice';
import { Box, Center, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const DragAndDrop = (props) => {
  const { isMobile, clampW } = useDevice();
  const {
    w = '25rem',
    h = '25rem',
    limitSize = '1200*1200',
    //
    files,
    maxFiles,
    setFiles,
  } = props;

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop: (newAcceptedFiles) => {
      // const newTotalFiles = [...files, ...newAcceptedFiles];
      const newTotalFiles = [...newAcceptedFiles];
      if (newTotalFiles.length > maxFiles) {
        alert('최대 1개 파일만 업로드할 수 있습니다.');
        return;
      }

      // 파일 수가 maxFiles를 초과하지 않도록 제한
      if (files.length >= maxFiles) {
        // openModal;
        alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
        return;
      }

      setFiles(newTotalFiles);
    },
    maxFiles: maxFiles, // 최대 1개 파일만 업로드 가능
    accept: {
      'image/jpeg': ['.jpeg'],
      'image/png': ['.png'],
      'image/jpg': ['.jpg'],
    },
  });

  /*
  useEffect(() => {
    console.log('files', files);
    if (files.length > 0) {
      handleFilesSrc(files);
    }
  }, [files]);
  */

  const handleFilesSrc = (files) => {
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSrcs((srcs) => [...srcs, reader.result]);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    });
  };

  // 거부된 파일 처리
  if (fileRejections.length > 0) {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((e) => {
        console.log(`파일 ${file.name}이(가) 거부되었습니다: ${e.message}`);
      });
    });
  }

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

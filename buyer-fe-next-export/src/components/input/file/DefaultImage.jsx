import { CustomIcon } from '@/components';
import utils from '@/utils';
import {
  Box,
  Center,
  Image as ChakraImage,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
// import DefaultImg from '../../../assets/images/default-img.svg';
// import CustomIcon from '../../icons/CustomIcon';
// import utils from '../../../utils';
// import CustomButton from '../../buttons/CustomButton';

const DefaultImage = (props) => {
  const {
    src,
    fileName,
    retFile,
    w = '100px',
    h = '100px',
    isDisabled = false,
    borderRadius = '0px',
  } = props;

  const [exist, setExist] = useState(false);
  const [tempSrc, setTempSrc] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const imageInput = useRef(null);
  const cameraInput = useRef(null);

  const {
    isOpen: isOpenOption,
    onOpen: onOpenOption,
    onClose: onCloseOption,
  } = useDisclosure();

  useEffect(() => {
    removeImageFile();
  }, []);

  useEffect(() => {
    if (utils.isNotEmpty(src)) {
      if (src.indexOf('http') > -1) {
        setExist(true);
      }
    } else {
      removeImageFile();
    }
  }, [src]);

  const handleImageUpload = () => {
    /*
    if (utils.isMobile()) {
      onOpenOption();
    } else {
      imageInput.current.click();
    }
    */
    imageInput.current.click();
  };

  const handleSelectOption = (type) => {
    if (type === 1) {
      cameraInput.current.click();
    } else {
      imageInput.current.click();
    }
  };

  const popupImg = (imgsrc, fileName) => {
    const img = new Image();
    img.src = imgsrc;
    img.onload = () => {
      const { width } = img;
      const { height } = img;
      const tempWidth = width < 500 ? 500 : width;
      const tempHeight = height < 500 ? 500 : height;
      const imageWin = window.open(
        '',
        '',
        `width=${tempWidth}px, height=${tempHeight}px`,
      );
      imageWin.document.write(
        `<html><title>${fileName}</title><body style='margin:0'>`,
      );
      imageWin.document.write(`<img src='${imgsrc}' border=0>`);
      imageWin.document.write('</body><html>');
    };
  };

  const removeImageFile = () => {
    setExist(false);
    if (retFile) {
      retFile(null, null);
    }
    imageInput.current.value = '';
    cameraInput.current.value = '';
    // setTempSrc(DefaultImg);
    setTempFile(null);
  };

  const saveImageFile = (optionInput) => {
    onCloseOption();
    setTempSrc('');
    const file = optionInput.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (data) => {
      if (typeof data.target?.result === 'string') {
        const srcData = data.target.result;
        // setExist(true);
        // setTempSrc(srcData);
        // setTempFile(file);
        if (retFile) {
          retFile(file, srcData);
        }
      } else {
        console.log('## image upload Failed');
      }
    };
  };

  useEffect(() => {
    if (utils.isNotEmpty(src)) {
      setTempSrc(src);
    } else {
      // setTempSrc(DefaultImg);
    }
  }, [src]);

  return (
    <Center
      position="relative"
      boxSizing="border-box"
      bg={'#D9E7EC'}
      _hover={{
        cursor: !isDisabled ? 'pointer' : '',
      }}
      w={w}
      h={h}
      borderRadius={borderRadius}
      border={0}
      onClick={() => {
        if (!exist && !isDisabled) {
          handleImageUpload();
        } else if (exist) {
          popupImg(tempSrc, tempFile?.name || fileName);
        }
      }}
    >
      <CustomIcon name={'plus'} color={'#7895B2'} />
      <input
        onChange={() => {
          saveImageFile(imageInput);
        }}
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        ref={imageInput}
      />
      <input
        style={{ display: 'none' }}
        onChange={() => {
          saveImageFile(cameraInput);
        }}
        type="file"
        id="camera"
        name="camera"
        capture="camera"
        accept="image/*"
        ref={cameraInput}
      />

      {isOpenOption && (
        <Modal isOpen={isOpenOption} onClose={onCloseOption} size="xs">
          <ModalOverlay />
          <ModalContent alignSelf="center">
            <ModalHeader py={1}>
              <Box h="20px" />
            </ModalHeader>
            <ModalCloseButton w="30px" h="30px" />
            <ModalBody py="20px">
              <VStack spacing={1}>
                <Box>
                  <Text textAlign="center">업로드 방법 선택</Text>
                </Box>
              </VStack>
            </ModalBody>
            <ModalFooter py={2} borderBottomRadius="8px">
              <HStack w="100%" justifyContent="center">
                <Box w="50%">
                  {/*
                  <CustomButton
                    onClick={() => {
                      handleSelectOption(1);
                    }}
                    theme="secondary"
                    size="sm"
                    text="카메라"
                  />
                </Box>
                <Box w="50%">
                  <CustomButton
                    onClick={() => {
                      handleSelectOption(2);
                    }}
                    theme="info"
                    size="sm"
                    text="앨범"
                  />
                  */}
                </Box>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Center>
  );
};

export default DefaultImage;

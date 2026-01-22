'use client';

import React, { useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import {
  Box,
  Center,
  HStack,
  Img,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
  Button,
  Wrap,
  WrapItem,
  Select,
} from '@chakra-ui/react';
import Bold from '@public/svgs/icon/bold.svg';
import Italic from '@public/svgs/icon/italic.svg';
import TextDelete from '@public/svgs/icon/text-delete.svg';
import TextInsert from '@public/svgs/icon/text-insert.svg';
import DefaultImage from '@public/svgs/icon/default-image.svg';
import ArrowDown from '@public/svgs/icon/arrow-down.svg';
import TextAlignRight from '@public/svgs/icon/text-align-right.svg';
import TextAlignCenter from '@public/svgs/icon/text-align-center.svg';
import TextAlignLeft from '@public/svgs/icon/text-align-left.svg';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';
import 'quill/dist/quill.snow.css'; // Quill 스타일을 임포트
import useDevice from '@/hooks/useDevice';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { CustomIcon } from '..';

//Quill에 등록
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px', '24px', '32px'];
Quill.register(Size, true);
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

const CustomEditor = (props) => {
  const { isMobile } = useDevice();
  const { localeText } = useLocale();
  const { info, setInfo, isVideo = false } = props;
  // const [content, setContent] = useState('');
  const [color, setColor] = useColor('#000000');
  const [bgColor, setBgColor] = useColor('#ffffff');
  const [isTextAlignPickerVisible, setIsTextAlignPickerVisible] =
    useState(false); // 정렬 선택기 상태
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false); // 색상 선택기 상태
  const [isBgColorPickerVisible, setIsBgColorPickerVisible] = useState(false); // 색상 선택기 상태
  const quillRef = useRef(null);

  const formats = [
    'align',
    'background',
    'blockquote',
    'bold',
    'code-block',
    'color',
    'float',
    'font',
    'header',
    'height',
    'image',
    'italic',
    'link',
    'script',
    'strike',
    'size',
    'underline',
    'width',
    'image',
    'video',
  ];

  const handleSizeChange = (e) => {
    const size = e.target.value;
    if (!quillRef.current) return;
    const quill = quillRef.current?.getEditor();
    if (quill) {
      quill.format('size', size); // 선택한 폰트 크기 적용
    }
  };

  // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');
    if (!document) return;
    if (!quillRef.current) return;
    const quillInstance = quillRef.current.getEditor();
    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement('input');
    // 속성 써주기
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      console.log(file);
      // 이미지를 서버로 전송 (서버 엔드포인트 주소를 사용)
      /*
      const response = await axios.post('YOUR_SERVER_API_URL', {
        body: formData,
      });
      const imageUrl = await response;
      */
      const url =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1c9zAnn02wcDmYlMABoRgWoxn4wccXzUpUg&s';
      const range = quillInstance.getSelection(true);
      quillInstance.insertEmbed(range.index, 'image', url);
      quillInstance.setSelection(range.index + 1); // 이미지를 삽입한 후 커서를 이미지 뒤로 이동시키는 코드
    };
  };

  const modules = useMemo(() => {
    return {
      imageActions: {},
      imageFormats: {},
      toolbar: [],
      /*
      toolbar: {
        container: [
          // ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          // ['blockquote', 'image', 'code-block'],

          // [{ header: 1 }, { header: 2 }], // custom button values
          // [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          // [{ direction: 'rtl' }], // text direction

          // [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          // [{ header: [1, 2, 3, 4, 5, 6, false] }],

          // [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          // [{ font: [] }],
          // [{ align: [] }],
          // ['clean'],
          [{ color: [] }],
          [{ background: [] }],
        ],

        // 내부 이미지를 url로 받아오는 handler
        handlers: {
          image: imageHandler,
        },
      },
      */
    };
  }, []);

  const handleTextStyle = (style) => {
    const quill = quillRef.current.getEditor();
    if (!quill) return;

    const currentFormat = quill.getFormat();

    switch (style) {
      case 'bold':
        quill.format('bold', !currentFormat.bold); // bold 스타일 적용
        break;
      case 'italic':
        quill.format('italic', !currentFormat.italic); // italic 스타일 적용
        break;
      case 'underline':
        quill.format('underline', !currentFormat.underline); // underline 스타일 적용
        break;
      case 'strike':
        quill.format('strike', !currentFormat.strike); // strike 스타일 적용
        break;
      case 'align-left':
        quill.format('align', false); // 왼쪽 정렬
        break;
      case 'align-center':
        quill.format('align', 'center'); // 가운데 정렬
        break;
      case 'align-right':
        quill.format('align', 'right'); // 오른쪽 정렬
        break;
      default:
        break;
    }
  };

  // 텍스트 색상 및 배경색 적용
  const applyTextColor = (color) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.format('color', color.hex);
      }
    }
  };

  // 배경 색상 변경
  const applyBackgroundColor = (color) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range) {
        quill.format('background', color.hex);
      }
    }
  };

  // 이미지 업로드 및 삽입
  const handleImageInsert = () => {
    if (!document) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*'; // 이미지 파일만 선택 가능

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const base64Image = await toBase64(file); // 이미지를 base64로 변환
        const quill = quillRef.current.getEditor();
        const range = quill.selection.savedRange;
        quill.insertEmbed(range.index, 'image', base64Image); // 에디터에 이미지 삽입
      }
    };
    input.click();
  };
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleVideoInsert = () => {
    if (quillRef.current) {
      let videoUrl = prompt(localeText(LANGUAGES.INFO_MSG.ENTER_URL));
      if (!videoUrl) return;
      if (!renderYouTubeEmbed(videoUrl)) {
        console.log('error : 유튜브 URL이 아닙니다.');
        return;
      } else {
        videoUrl = renderYouTubeEmbed(videoUrl);
      }

      const quill = quillRef.current.getEditor();
      const selection = quill.getSelection(true);
      quill.insertEmbed(selection.index, 'video', videoUrl);
      quill.setSelection(selection.index + 1);
    }
  };
  const renderYouTubeEmbed = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/,
    );
    if (!match) return null;

    const videoId = match[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <Box
      w={'100%'}
      h={'100%'}
      minH={isMobile(true) ? '25.5rem' : '25.875rem'}
      maxH={isMobile(true) ? 'max-content' : '25.875rem'}
      border={'1px solid #AEBDCA'}
      borderRadius={'0.25rem'}
      p={'0.5rem'}
    >
      <VStack spacing={'0.5rem'} h={'100%'} alignItems={'flex-start'}>
        {isMobile(true) ? (
          <Box>
            <Wrap spacing={'0.5rem'} justifyContent={'flex-start'}>
              {/* 정렬 */}
              <WrapItem>
                <Center
                  // w={'3.125rem'}
                  h={'1.75rem'}
                  onClick={() =>
                    setIsTextAlignPickerVisible(!isTextAlignPickerVisible)
                  }
                >
                  <Popover
                    isOpen={isTextAlignPickerVisible}
                    onClose={() => setIsTextAlignPickerVisible(false)}
                  >
                    <PopoverTrigger>
                      <HStack spacing={'0.15rem'}>
                        <Box>
                          <Img src={TextAlignLeft.src} />
                        </Box>
                        <Box>
                          <Img src={ArrowDown.src} />
                        </Box>
                      </HStack>
                    </PopoverTrigger>
                    <PopoverContent w={'max-content'}>
                      <PopoverBody p={0}>
                        <HStack spacing={0}>
                          <Button onClick={() => handleTextStyle('align-left')}>
                            <Img src={TextAlignLeft.src} />
                          </Button>
                          <Button
                            onClick={() => handleTextStyle('align-center')}
                          >
                            <Img src={TextAlignCenter.src} />
                          </Button>
                          <Button
                            onClick={() => handleTextStyle('align-right')}
                          >
                            <Img src={TextAlignRight.src} />
                          </Button>
                        </HStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Center>
              </WrapItem>

              {/* 색상 */}
              <WrapItem>
                <HStack spacing={0}>
                  {/* 색상 선택 */}
                  <Center
                    w={'3.125rem'}
                    h={'1.75rem'}
                    pl={'0.5rem'}
                    pr={'0.25rem'}
                    onClick={() =>
                      setIsColorPickerVisible(!isColorPickerVisible)
                    }
                  >
                    <Popover
                      isOpen={isColorPickerVisible}
                      onClose={() => setIsColorPickerVisible(false)}
                    >
                      <PopoverTrigger>
                        <HStack spacing={'0.15rem'}>
                          <Center
                            borderBottom={`2px solid ${color?.hex || '#2A333C'}`}
                            w={'1.25rem'}
                            h={'1.25rem'}
                          >
                            <Text>A</Text>
                          </Center>
                          <Box>
                            <Img src={ArrowDown.src} />
                          </Box>
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent w={'250px'}>
                        <PopoverBody p={0}>
                          <ColorPicker
                            color={color}
                            onChange={setColor}
                            onChangeComplete={applyTextColor}
                            hideAlpha={true}
                            hideInput={['rgb', 'hsv', 'rgb']}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Center>

                  {/* 배경 색상 선택 */}
                  <Center
                    w={'3.125rem'}
                    h={'1.75rem'}
                    ml={'0.5rem'}
                    mr={'0.25rem'}
                    onClick={() =>
                      setIsBgColorPickerVisible(!isBgColorPickerVisible)
                    }
                  >
                    <Popover
                      isOpen={isBgColorPickerVisible}
                      onClose={() => setIsBgColorPickerVisible(false)}
                    >
                      <PopoverTrigger>
                        <HStack spacing={'0.15rem'}>
                          <Box
                            border={'1px solid #2A333C'}
                            w={'1.25rem'}
                            h={'1.25rem'}
                            borderRadius={'0.25rem'}
                            bg={bgColor?.hex || '#FFF'}
                          />
                          <Box>
                            <Img src={ArrowDown.src} />
                          </Box>
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent w={'250px'}>
                        <PopoverBody p={0}>
                          <ColorPicker
                            color={bgColor}
                            onChange={setBgColor}
                            onChangeComplete={applyBackgroundColor}
                            hideAlpha={true}
                            hideInput={['rgb', 'hsv', 'rgb']}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Center>
                </HStack>
              </WrapItem>

              <WrapItem>
                <HStack spacing={0}>
                  {/* 색상 선택 */}
                  <Center
                    w={'3.125rem'}
                    h={'1.75rem'}
                    pl={'0.5rem'}
                    pr={'0.25rem'}
                    onClick={() =>
                      setIsColorPickerVisible(!isColorPickerVisible)
                    }
                  >
                    <Popover
                      isOpen={isColorPickerVisible}
                      onClose={() => setIsColorPickerVisible(false)}
                    >
                      <PopoverTrigger>
                        <HStack spacing={'0.15rem'}>
                          <Center
                            borderBottom={`2px solid ${color?.hex || '#2A333C'}`}
                            w={'1.25rem'}
                            h={'1.25rem'}
                          >
                            <Text>A</Text>
                          </Center>
                          <Box>
                            <Img src={ArrowDown.src} />
                          </Box>
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent w={'250px'}>
                        <PopoverBody p={0}>
                          <ColorPicker
                            color={color}
                            onChange={setColor}
                            onChangeComplete={applyTextColor}
                            hideAlpha={true}
                            hideInput={['rgb', 'hsv', 'rgb']}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Center>

                  {/* 배경 색상 선택 */}
                  <Center
                    w={'3.125rem'}
                    h={'1.75rem'}
                    ml={'0.5rem'}
                    mr={'0.25rem'}
                    onClick={() =>
                      setIsBgColorPickerVisible(!isBgColorPickerVisible)
                    }
                  >
                    <Popover
                      isOpen={isBgColorPickerVisible}
                      onClose={() => setIsBgColorPickerVisible(false)}
                    >
                      <PopoverTrigger>
                        <HStack spacing={'0.15rem'}>
                          <Box
                            border={'1px solid #2A333C'}
                            w={'1.25rem'}
                            h={'1.25rem'}
                            borderRadius={'0.25rem'}
                            bg={bgColor?.hex || '#FFF'}
                          />
                          <Box>
                            <Img src={ArrowDown.src} />
                          </Box>
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent w={'250px'}>
                        <PopoverBody p={0}>
                          <ColorPicker
                            color={bgColor}
                            onChange={setBgColor}
                            onChangeComplete={applyBackgroundColor}
                            hideAlpha={true}
                            hideInput={['rgb', 'hsv', 'rgb']}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Center>
                </HStack>
              </WrapItem>

              {/* 폰트 크기 */}
              <WrapItem>
                <Select placeholder="Font Size" onChange={handleSizeChange}>
                  {Size.whitelist.map((item, index) => {
                    return <option key={index}>{item}</option>;
                  })}
                </Select>
              </WrapItem>

              {/* 폰트 */}
              <WrapItem>
                <HStack>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={Bold.src}
                        onClick={() => handleTextStyle('bold')}
                      />
                    </Center>
                  </Box>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={Italic.src}
                        onClick={() => handleTextStyle('italic')}
                      />
                    </Center>
                  </Box>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={TextInsert.src}
                        onClick={() => handleTextStyle('underline')}
                      />
                    </Center>
                  </Box>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={TextDelete.src}
                        onClick={() => handleTextStyle('strike')}
                      />
                    </Center>
                  </Box>
                </HStack>
              </WrapItem>
              <WrapItem>
                <Center w={'1.75rem'} h={'1.75rem'} onClick={handleImageInsert}>
                  <Img src={DefaultImage.src} />
                </Center>
              </WrapItem>
              {isVideo && (
                <WrapItem>
                  <Center
                    w={'1.75rem'}
                    h={'1.75rem'}
                    onClick={handleVideoInsert}
                  >
                    <CustomIcon name={'videoOutline'} color="#485766" />
                  </Center>
                </WrapItem>
              )}
            </Wrap>
          </Box>
        ) : (
          <Box w={'100%'} h={'1.75rem'}>
            <HStack spacing={'0.5rem'} justifyContent={'flex-start'}>
              {/* 정렬 */}
              <Box>
                <Center
                  // w={'3.125rem'}
                  h={'1.75rem'}
                  pl={'0.5rem'}
                  pr={'0.25rem'}
                  onClick={() =>
                    setIsTextAlignPickerVisible(!isTextAlignPickerVisible)
                  }
                >
                  <Popover
                    isOpen={isTextAlignPickerVisible}
                    onClose={() => setIsTextAlignPickerVisible(false)}
                  >
                    <PopoverTrigger>
                      <HStack spacing={'0.62rem'}>
                        <Center
                          px={0}
                          w={'1.5rem'}
                          h={'1.5rem'}
                          onClick={() => handleTextStyle('align-left')}
                        >
                          <Img src={TextAlignLeft.src} />
                        </Center>
                        <Center
                          px={0}
                          w={'1.5rem'}
                          h={'1.5rem'}
                          onClick={() => handleTextStyle('align-center')}
                        >
                          <Img src={TextAlignCenter.src} />
                        </Center>
                        <Center
                          px={0}
                          w={'1.5rem'}
                          h={'1.5rem'}
                          onClick={() => handleTextStyle('align-right')}
                        >
                          <Img src={TextAlignRight.src} />
                        </Center>
                      </HStack>
                    </PopoverTrigger>
                    {/*
                        <PopoverTrigger>
                          <HStack spacing={'0.15rem'}>
                            <Box>
                              <Img src={TextAlignLeft.src} />
                            </Box>
                            <Box>
                              <Img src={ArrowDown.src} />
                            </Box>
                          </HStack>
                        </PopoverTrigger>
                        <PopoverContent w={'max-content'}>
                          <PopoverBody p={0}>
                            <HStack spacing={0}>
                              <Button onClick={() => handleTextStyle('align-left')}>
                                <Img src={TextAlignLeft.src} />
                              </Button>
                              <Button onClick={() => handleTextStyle('align-center')}>
                                <Img src={TextAlignCenter.src} />
                              </Button>
                              <Button onClick={() => handleTextStyle('align-right')}>
                                <Img src={TextAlignRight.src} />
                              </Button>
                            </HStack>
                          </PopoverBody>
                        </PopoverContent>
                        */}
                  </Popover>
                </Center>
              </Box>

              {/* 색상 */}
              <Box>
                <HStack spacing={0}>
                  {/* 색상 선택 */}
                  <Center
                    w={'3.125rem'}
                    h={'1.75rem'}
                    pl={'0.5rem'}
                    pr={'0.25rem'}
                    onClick={() =>
                      setIsColorPickerVisible(!isColorPickerVisible)
                    }
                  >
                    <Popover
                      isOpen={isColorPickerVisible}
                      onClose={() => setIsColorPickerVisible(false)}
                    >
                      <PopoverTrigger>
                        <HStack spacing={'0.15rem'}>
                          <Center
                            borderBottom={`2px solid ${color?.hex || '#2A333C'}`}
                            w={'1.25rem'}
                            h={'1.25rem'}
                          >
                            <Text>A</Text>
                          </Center>
                          <Box>
                            <Img src={ArrowDown.src} />
                          </Box>
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent w={'250px'}>
                        <PopoverBody p={0}>
                          <ColorPicker
                            color={color}
                            onChange={setColor}
                            onChangeComplete={applyTextColor}
                            hideAlpha={true}
                            hideInput={['rgb', 'hsv', 'rgb']}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Center>

                  {/* 배경 색상 선택 */}
                  <Center
                    w={'3.125rem'}
                    h={'1.75rem'}
                    ml={'0.5rem'}
                    mr={'0.25rem'}
                    onClick={() =>
                      setIsBgColorPickerVisible(!isBgColorPickerVisible)
                    }
                  >
                    <Popover
                      isOpen={isBgColorPickerVisible}
                      onClose={() => setIsBgColorPickerVisible(false)}
                    >
                      <PopoverTrigger>
                        <HStack spacing={'0.15rem'}>
                          <Box
                            border={'1px solid #2A333C'}
                            w={'1.25rem'}
                            h={'1.25rem'}
                            borderRadius={'0.25rem'}
                            bg={bgColor?.hex || '#FFF'}
                          />
                          <Box>
                            <Img src={ArrowDown.src} />
                          </Box>
                        </HStack>
                      </PopoverTrigger>
                      <PopoverContent w={'250px'}>
                        <PopoverBody p={0}>
                          <ColorPicker
                            color={bgColor}
                            onChange={setBgColor}
                            onChangeComplete={applyBackgroundColor}
                            hideAlpha={true}
                            hideInput={['rgb', 'hsv', 'rgb']}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Center>
                </HStack>
              </Box>

              {/* 폰트 크기 */}
              <Box>
                <HStack>
                  <Select placeholder="Font Size" onChange={handleSizeChange}>
                    {Size.whitelist.map((item, index) => {
                      return <option key={index}>{item}</option>;
                    })}
                  </Select>
                </HStack>
              </Box>

              {/* 폰트 */}
              <Box>
                <HStack>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={Bold.src}
                        onClick={() => handleTextStyle('bold')}
                      />
                    </Center>
                  </Box>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={Italic.src}
                        onClick={() => handleTextStyle('italic')}
                      />
                    </Center>
                  </Box>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={TextInsert.src}
                        onClick={() => handleTextStyle('underline')}
                      />
                    </Center>
                  </Box>
                  <Box>
                    <Center w={'1.75rem'} h={'1.75rem'}>
                      <Img
                        src={TextDelete.src}
                        onClick={() => handleTextStyle('strike')}
                      />
                    </Center>
                  </Box>
                </HStack>
              </Box>

              <Box>
                <Center w={'1.75rem'} h={'1.75rem'} onClick={handleImageInsert}>
                  <Img src={DefaultImage.src} />
                </Center>
              </Box>

              {isVideo && (
                <Box>
                  <Center
                    w={'1.75rem'}
                    h={'1.75rem'}
                    onClick={handleVideoInsert}
                  >
                    <CustomIcon name={'videoOutline'} color="#485766" />
                  </Center>
                </Box>
              )}
            </HStack>
          </Box>
        )}

        <Box
          w={'100%'}
          h={'calc(100% - 1.75rem)'}
          overflowY={'auto'}
          onClick={() => {
            if (quillRef.current) {
              quillRef.current.focus();
            }
          }}
        >
          <ReactQuill
            style={{
              // backgroundColor: 'red',
              width: '100%',
              // height: '17.5rem',
              height: '100%',
              minHeight: '22.5rem',
              maxHeight: '22.5rem',
              border: 0,
              overflowY: 'auto',
            }}
            ref={quillRef}
            formats={formats}
            modules={modules}
            onChange={(e) => {
              if (setInfo) {
                setInfo(e);
              }
            }}
            value={info}
          />
        </Box>
        {/* 외부 버튼 예시 */}
      </VStack>
    </Box>
  );
};

export default CustomEditor;

import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Img,
  Text,
} from '@chakra-ui/react';
import IconRight from '@public/svgs/icon/right.svg';
import IconLeft from '@public/svgs/icon/left.svg';
import CSS from './DefaultPaginate.module.css';

const DefaultPaginate = (props) => {
  const {
    currentPage = 1,
    setCurrentPage,
    totalCount = 1,
    contentNum = 1,
    isSmall = false,
  } = props;

  const pageBlock = 5;

  const toFirstPage = () => {
    setCurrentPage(1);
  };
  const toPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const toNextPage = () => {
    if (currentPage < Math.ceil(totalCount / contentNum))
      setCurrentPage(currentPage + 1);
  };
  const toLastPage = () => {
    setCurrentPage(Math.ceil(totalCount / contentNum));
  };

  const renderPages = () => {
    let firstNum = 1;
    // if (currentPage > 5)
    if (currentPage > pageBlock)
      firstNum += Math.floor((currentPage - 1) / pageBlock) * pageBlock;

    return Array(pageBlock)
      .fill(0)
      .map((pagerItem, index) => {
        if (firstNum + index <= Math.ceil(totalCount / contentNum)) {
          const pageIndex = `pagination_page_${index}`;
          return isSmall ? (
            <Center
              cursor={'pointer'}
              w={'1.25rem'}
              h={'1.25rem'}
              key={pageIndex}
              onClick={() => {
                return setCurrentPage(firstNum + index);
              }}
            >
              <Text
                fontWeight={500}
                fontSize={'0.9375rem'}
                color={currentPage === firstNum + index ? '#485766' : '#A7C3D2'}
                lineHeight={'1.5rem'}
              >
                {firstNum + index}
              </Text>
            </Center>
          ) : (
            <Button
              p={0}
              className={`${CSS.paginationButton}`}
              borderColor={'transparent !important'}
              bg={'transparent !important'}
              /*
              _hover={{
                borderColor: 'transparent',
              }}
              borderColor={
                currentPage === firstNum + index
                  ? 'transparent !important'
                  : '#DDDDDD'
              }
              */
              key={pageIndex}
              onClick={() => {
                return setCurrentPage(firstNum + index);
              }}
            >
              <Text
                fontWeight={currentPage === firstNum + index ? 500 : 400}
                fontSize={'1.125rem'}
                color={currentPage === firstNum + index ? '#485766' : '#A7C3D2'}
                lineHeight={'1.96875rem'}
              >
                {firstNum + index}
              </Text>
            </Button>
          );
        }
      });
  };

  return (
    <Box>
      <HStack
        justifyContent="space-around"
        alignItems="center"
        spacing={'1.5rem'}
      >
        {isSmall ? (
          <Center
            onClick={toPrevPage}
            cursor={'pointer'}
            enter
            minW={'1.25rem'}
            minH={'1.25rem'}
            w={'1.25rem'}
            h={'1.25rem'}
          >
            <Img src={IconLeft.src} w={'100%'} h={'100%'} />
          </Center>
        ) : (
          <IconButton
            color={'#7895B2'}
            _hover={{
              // borderColor: '#50555C',
              borderColor: 'transparent !important',
            }}
            onClick={toPrevPage}
            className={`${CSS.paginationBbutton}`}
          >
            <Center w={'1.5rem'} h={'1.5rem'}>
              <Img src={IconLeft.src} h={'100%'} />
            </Center>
          </IconButton>
        )}

        {renderPages()}

        {isSmall ? (
          <Center
            onClick={toNextPage}
            cursor={'pointer'}
            enter
            minW={'1.25rem'}
            minH={'1.25rem'}
            w={'1.25rem'}
            h={'1.25rem'}
          >
            <Img src={IconRight.src} w={'100%'} h={'100%'} />
          </Center>
        ) : (
          <IconButton
            color={'#7895B2'}
            _hover={{
              // borderColor: '#50555C',
              borderColor: 'transparent !important',
            }}
            onClick={toNextPage}
            className={`${CSS.paginationBbutton}`}
          >
            <Center w={'1.5rem'} h={'1.5rem'}>
              <Img src={IconRight.src} h={'100%'} />
            </Center>
          </IconButton>
        )}
      </HStack>
    </Box>
  );
};

export default DefaultPaginate;

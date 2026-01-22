'use client';

import { Box, Center, HStack, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useRef } from 'react';
import { DefaultPaginate } from '@/components';
import useLounge from '@/hooks/useLounge';
import { LOUNGE_TYPE_JOB_POSTING } from '@/constants/common';
import LoungeListHeader from '@/components/custom/lounge/LoungeListHeader';
import LoungePostCard from '@/components/custom/lounge/LoungePostCard';
import useDevice from '@/hooks/useDevice';

const JobPostingPage = () => {
  const { isMobile, clampW } = useDevice();
  const { localeText } = useLocale();

  const {
    setCurrentLoungeType,
    //
    currentPage,
    setCurrentPage,
    contentNum,
    totalPage,
    searchBy,
    setSearchBy,
    //
    getListLounge,
    handleSearchLounge,
    //
    listLounge,
    //
    loading,
    setLoungeInfo,
  } = useLounge();

  useEffect(() => {
    setLoungeInfo({});
    setCurrentLoungeType(LOUNGE_TYPE_JOB_POSTING);
  }, []);

  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(async () => {
    console.log(1);
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (currentPage !== 1) {
          if (listLounge.length === contentNum) {
            setCurrentPage((prevPage) => prevPage + 1);
          } else {
            getListLounge();
          }
        } else {
          getListLounge();
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return isMobile(true) ? (
    <>
      <LoungeListHeader
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        handleOnClick={() => {
          handleSearchLounge();
        }}
      />
      <Box w={'100%'} mt={'1.25rem'} overflowX={'auto'}>
        {listLounge.length === 0 && (
          <Center w={'100%'} h={'10rem'}>
            <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
              {localeText(LANGUAGES.INFO_MSG.NO_POST)}
            </Text>
          </Center>
        )}
        {listLounge.length > 0 && (
          <Box w={'100%'}>
            <VStack spacing={0} w={'100%'}>
              {listLounge.map((item, index) => {
                return (
                  <LoungePostCard
                    key={index}
                    index={index}
                    item={item}
                    listLounge={listLounge}
                  />
                );
              })}
            </VStack>
          </Box>
        )}
      </Box>
    </>
  ) : (
    <Box w={'100%'}>
      <VStack spacing={'1.25rem'}>
        <LoungeListHeader
          searchBy={searchBy}
          setSearchBy={setSearchBy}
          handleOnClick={() => {
            handleSearchLounge();
          }}
        />
        <Box w={'100%'}>
          {/* Rows */}
          <VStack spacing={0}>
            {/* header */}
            <Box
              w={'100%'}
              borderTop="1px solid #73829D"
              borderBottom="1px solid #73829D"
              px={'1.25rem'}
              py={'1rem'}
            >
              <HStack spacing={'1.25rem'}>
                <Box minW={'6.25rem'} w={'6.25rem'} h={'10px'} />
                <Box w={'18.1875rem'}>
                  <Text
                    textAlign={'center'}
                    color={'#2A333C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.JOBS.TITLE)}
                  </Text>
                </Box>
                <Box w={'18.1875rem'}>
                  <Text
                    textAlign={'center'}
                    color={'#2A333C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.JOBS.AUTHOR)}
                  </Text>
                </Box>
                <Box w={'18.1875rem'}>
                  <Text
                    textAlign={'center'}
                    color={'#2A333C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.JOBS.CREATED_ON)}
                  </Text>
                </Box>
                <Box w={'18.1875rem'}>
                  <Text
                    textAlign={'center'}
                    color={'#2A333C'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.JOBS.VIEWS)}
                  </Text>
                </Box>
              </HStack>
            </Box>
            {/* body */}
            <Box w={'100%'}>
              <VStack spacing={0}>
                {listLounge.map((item, index) => {
                  return (
                    <LoungePostCard
                      key={index}
                      index={index}
                      item={item}
                      listLounge={listLounge}
                    />
                  );
                })}
                {listLounge.length === 0 && (
                  <Center w={'100%'} h={'10rem'}>
                    <Text
                      fontSize={'1.5rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.INFO_MSG.NO_POST)}
                    </Text>
                  </Center>
                )}
              </VStack>
            </Box>
          </VStack>
        </Box>
        <Box>
          <DefaultPaginate
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalCount={totalPage}
            contentNum={contentNum}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default JobPostingPage;

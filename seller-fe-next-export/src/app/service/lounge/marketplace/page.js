'use client';

import { Box, Button, Center, Text, VStack } from '@chakra-ui/react';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { useEffect } from 'react';
import { DefaultPaginate } from '@/components';
import useLounge from '@/hooks/useLounge';
import { LOUNGE_TYPE_MARKETPLACE } from '@/constants/common';
import LoungeListHeader from '@/components/custom/lounge/LoungeListHeader';
import LoungePostCard from '@/components/custom/lounge/LoungePostCard';
import useDevice from '@/hooks/useDevice';
import LoungeTableHeader from '@/components/custom/lounge/LoungeTableHeader';
import MainContainer from '@/components/layout/MainContainer';
import PostModal from '@/components/alert/custom/PostModal';
import utils from '@/utils';
import ContentBR from '@/components/custom/ContentBR';

const MarketplacePage = () => {
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
    handleGetListLoungeAgent,
    //
    isOpen,
    onOpen,
    onClose,
    handlePostLounge,
    //
    listLounge,
  } = useLounge();

  useEffect(() => {
    setCurrentLoungeType(LOUNGE_TYPE_MARKETPLACE);
  }, []);

  return isMobile(true) ? (
    <MainContainer>
      <LoungeListHeader
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        handleOnClick={() => {
          handleGetListLoungeAgent();
        }}
      />
      <Box w={'100%'} mt={'1.25rem'} px={clampW(1, 5)}>
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
          {listLounge.length === 0 && (
            <Center w={'100%'} h={'10rem'}>
              <Text fontSize={'1.5rem'} fontWeight={500} lineHeight={'1.75rem'}>
                {localeText(LANGUAGES.INFO_MSG.NO_POST)}
              </Text>
            </Center>
          )}
        </VStack>
      </Box>
      {utils.getIsLogin() && (
        <>
          <ContentBR h={'6.25rem'} />
          <Box
            minW={'100%'}
            h={'5rem'}
            bg={'#FFF'}
            position={'fixed'}
            bottom={0}
            p={'1rem'}
            borderTop={'1px solid #AEBDCA'}
          >
            <Button
              onClick={() => {
                onOpen();
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
                {localeText(LANGUAGES.LOUNGE.JOBS.WRITE_A_NEW_POST)}
              </Text>
            </Button>
          </Box>
        </>
      )}
      {isOpen && (
        <PostModal
          isOpen={isOpen}
          onClose={(ret) => {
            console.log(ret);
            if (ret) {
              handleGetListLoungeAgent();
            }
            onClose();
          }}
          callBack={(data) => {
            handlePostLounge(data);
          }}
        />
      )}
    </MainContainer>
  ) : (
    <MainContainer>
      <Box w={'100%'}>
        <VStack spacing={'1.25rem'}>
          <LoungeListHeader
            searchBy={searchBy}
            setSearchBy={setSearchBy}
            handleOnClick={() => {
              handleGetListLoungeAgent();
            }}
          />
          <Box w={'100%'}>
            {/* Rows */}
            <VStack spacing={0}>
              {/* header */}
              <LoungeTableHeader />

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
    </MainContainer>
  );
};

export default MarketplacePage;

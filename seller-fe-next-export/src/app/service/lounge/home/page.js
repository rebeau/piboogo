'use client';

import { Box, VStack } from '@chakra-ui/react';
import useLocale from '@/hooks/useLocale';
import { useCallback, useEffect, useState } from 'react';
import LoungeSwiperForm from '@/components/custom/lounge/main/LoungeSwiperForm';
import { LANGUAGES } from '@/constants/lang';
import loungeApi from '@/services/loungeApi';
import { SUCCESS } from '@/constants/errorCode';
import {
  LOUNGE_TYPE_COMMUNITY,
  LOUNGE_TYPE_JOB_HUNTING,
  LOUNGE_TYPE_JOB_POSTING,
  LOUNGE_TYPE_LEGAL_SERVICE,
  LOUNGE_TYPE_MARKETPLACE,
} from '@/constants/common';
import useMove from '@/hooks/useMove';
import useDevice from '@/hooks/useDevice';
import MainContainer from '@/components/layout/MainContainer';
import LoungeListHeader from '@/components/custom/lounge/LoungeListHeader';

const LoungeHomePage = () => {
  const { isMobile, clampW } = useDevice();
  const { moveLoungeDetail } = useMove();
  const [listJobPosting, setListJobPosting] = useState([]);
  const [listJobHunting, setListJobHunting] = useState([]);
  const [listMarketplace, setListMarketplace] = useState([]);
  const [listLegalService, setListLegalService] = useState([]);
  const [listCommunity, setListCommunity] = useState([]);

  const { localeText } = useLocale();

  useEffect(() => {
    handleGetListLoungeMain();
  }, []);

  const handleGetListLoungeMain = useCallback(async () => {
    const result = await loungeApi.getLoungeMain();
    // 1:구인, 2:구직, 3:중고거래, 4:서류, 5:커뮤니티
    if (result?.errorCode === SUCCESS) {
      const datas = result.datas;
      const listJobPosting = datas.filter((item) => {
        return item.loungeType === LOUNGE_TYPE_JOB_POSTING;
      });
      setListJobPosting(listJobPosting || []);
      const listJobHunting = datas.filter((item) => {
        return item.loungeType === LOUNGE_TYPE_JOB_HUNTING;
      });
      setListJobHunting(listJobHunting || []);
      const listMarketplace = datas.filter((item) => {
        return item.loungeType === LOUNGE_TYPE_MARKETPLACE;
      });
      setListMarketplace(listMarketplace || []);
      const listLegalService = datas.filter((item) => {
        return item.loungeType === LOUNGE_TYPE_LEGAL_SERVICE;
      });
      setListLegalService(listLegalService || []);
      const listCommunity = datas.filter((item) => {
        return item.loungeType === LOUNGE_TYPE_COMMUNITY;
      });
      setListCommunity(listCommunity || []);
    }
  });

  const handleDetail = useCallback((item) => {
    moveLoungeDetail(item.loungeType, item.loungeId);
  });

  return isMobile(true) ? (
    <MainContainer>
      <LoungeListHeader />
      <Box w={'100%'} px={clampW(1, 5)}>
        <VStack spacing={isMobile(true) ? '2rem' : '5rem'}>
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.JOB_POSTING)}
            data={listJobPosting}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.JOB_HUNTING)}
            data={listJobHunting}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.MARKETPLACE)}
            data={listMarketplace}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.LEGAL_SERVICES)}
            data={listLegalService}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.COMMUNITY)}
            data={listCommunity}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
        </VStack>
      </Box>
    </MainContainer>
  ) : (
    <MainContainer>
      <LoungeListHeader />
      <Box w={'100%'}>
        <VStack spacing={isMobile(true) ? '2rem' : '5rem'}>
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.JOB_POSTING)}
            data={listJobPosting}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.JOB_HUNTING)}
            data={listJobHunting}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.MARKETPLACE)}
            data={listMarketplace}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.LEGAL_SERVICES)}
            data={listLegalService}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
          <LoungeSwiperForm
            title={localeText(LANGUAGES.LOUNGE.COMMUNITY)}
            data={listCommunity}
            onClick={(item) => {
              handleDetail(item);
            }}
          />
        </VStack>
      </Box>
    </MainContainer>
  );
};

export default LoungeHomePage;

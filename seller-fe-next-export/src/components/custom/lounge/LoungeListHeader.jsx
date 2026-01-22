'use client';

import PostModal from '@/components/alert/custom/PostModal';
import SearchInput from '@/components/input/custom/SearchInput';
import {
  LOUNGE_TYPE_COMMUNITY,
  LOUNGE_TYPE_JOB_HUNTING,
  LOUNGE_TYPE_JOB_POSTING,
  LOUNGE_TYPE_LEGAL_SERVICE,
  LOUNGE_TYPE_MARKETPLACE,
} from '@/constants/common';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import { SERVICE } from '@/constants/pageURL';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useModal from '@/hooks/useModal';
import loungeApi from '@/services/loungeApi';
import utils from '@/utils';
import {
  Box,
  Button,
  HStack,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ContentBR from '../ContentBR';

const LoungeListHeader = (props) => {
  const router = useRouter();
  const { isMobile, clampW } = useDevice();
  const [tabIndex, setTabIndex] = useState(0);
  const pathName = usePathname();
  const { localeText } = useLocale();
  const { openModal } = useModal();

  const { searchBy, setSearchBy, handleOnClick } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const listLoungeMenu = [
    {
      title: localeText(LANGUAGES.LOUNGE.HOME),
      href: SERVICE.LOUNGE.HOME,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.JOB_POSTING),
      href: SERVICE.LOUNGE.JOB_POSTING,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.JOB_HUNTING),
      href: SERVICE.LOUNGE.JOB_HUNTING,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.MARKETPLACE),
      href: SERVICE.LOUNGE.MARKET,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.LEGAL_SERVICES),
      href: SERVICE.LOUNGE.LEGAL_SERVICE,
    },
    {
      title: localeText(LANGUAGES.LOUNGE.COMMUNITY),
      href: SERVICE.LOUNGE.COMMUNITY,
    },
  ];

  const handleGetLoungeType = () => {
    if (pathName.indexOf(SERVICE.LOUNGE.JOB_POSTING) > -1) {
      return LOUNGE_TYPE_JOB_POSTING;
    } else if (pathName.indexOf(SERVICE.LOUNGE.JOB_HUNTING) > -1) {
      return LOUNGE_TYPE_JOB_HUNTING;
    } else if (pathName.indexOf(SERVICE.LOUNGE.MARKET) > -1) {
      return LOUNGE_TYPE_MARKETPLACE;
    } else if (pathName.indexOf(SERVICE.LOUNGE.LEGAL_SERVICE) > -1) {
      return LOUNGE_TYPE_LEGAL_SERVICE;
    } else if (pathName.indexOf(SERVICE.LOUNGE.COMMUNITY) > -1) {
      return LOUNGE_TYPE_COMMUNITY;
    }
  };

  useEffect(() => {
    if (pathName.indexOf(SERVICE.LOUNGE.HOME) > -1) {
      setTabIndex(0);
    } else if (pathName.indexOf(SERVICE.LOUNGE.JOB_POSTING) > -1) {
      setTabIndex(1);
    } else if (pathName.indexOf(SERVICE.LOUNGE.JOB_HUNTING) > -1) {
      setTabIndex(2);
    } else if (pathName.indexOf(SERVICE.LOUNGE.MARKET) > -1) {
      setTabIndex(3);
    } else if (pathName.indexOf(SERVICE.LOUNGE.LEGAL_SERVICE) > -1) {
      setTabIndex(4);
    } else if (pathName.indexOf(SERVICE.LOUNGE.COMMUNITY) > -1) {
      setTabIndex(5);
    }
  }, [pathName]);

  const handlePostLounge = async (data) => {
    const title = data?.title;
    if (utils.isEmpty(title)) {
      openModal({ text: localeText(LANGUAGES.LOUNGE.PH_ENTER_TITLE) });
      return;
    }
    const content = data?.content;
    if (utils.isEmpty(data.content)) {
      openModal({
        text: localeText(LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT),
      });
      return;
    }
    const param = {
      loungeType: handleGetLoungeType(),
      title: title,
      content: content,
    };
    if (data?.link) {
      param.link = data.link;
    }
    const files = data?.files || [];

    const result = await loungeApi.postLounge(param, files);
    openModal({ text: result?.message });
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          onClose();
          setSearchBy('');
          setTimeout(() => {
            handleOnClick();
          }, 200);
        },
      });
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'} px={clampW(1, 5)}>
      <Box w={'100%'}>
        <Wrap spacingX={'2.5rem'} spacingY={0}>
          {listLoungeMenu.map((item, index) => {
            return (
              <WrapItem
                key={index}
                py={'0.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  router.push(item.href);
                }}
              >
                <Text
                  textAlign={'center'}
                  color={tabIndex === index ? '#66809C' : '#A7C3D2'}
                  fontSize={'0.9375rem'}
                  fontWeight={tabIndex === index ? 600 : 400}
                  lineHeight={'1.5rem'}
                >
                  {item.title}
                </Text>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>

      <ContentBR h={'1.25rem'} />

      {handleOnClick && (
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box w={'100%'} h={'3rem'}>
              <SearchInput
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                }}
                onClick={(e) => {
                  if (handleOnClick) {
                    handleOnClick();
                  }
                }}
                placeholder={localeText(LANGUAGES.LOUNGE.JOBS.SEARCH_FOR_POSTS)}
              />
            </Box>
            {/*
            {utils.getIsLogin() && (
              <Box minW={'7rem'} w={'11.625rem'}>
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
            )}
            */}
          </HStack>
        </Box>
      )}
    </Box>
  ) : (
    <Box w={'100%'}>
      <Box w={'100%'}>
        <HStack spacing={'2.5rem'}>
          {listLoungeMenu.map((item, index) => {
            return (
              <Box
                key={index}
                py={'0.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  router.push(item.href);
                }}
              >
                <Text
                  textAlign={'center'}
                  color={tabIndex === index ? '#66809C' : '#A7C3D2'}
                  fontSize={'0.9375rem'}
                  fontWeight={tabIndex === index ? 600 : 400}
                  lineHeight={'1.5rem'}
                >
                  {item.title}
                </Text>
              </Box>
            );
          })}
        </HStack>
      </Box>

      <ContentBR h={'1.25rem'} />

      {handleOnClick && (
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box w={'25rem'} h={'3rem'}>
              <SearchInput
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                }}
                onClick={(e) => {
                  if (handleOnClick) {
                    handleOnClick();
                  }
                }}
                placeholder={localeText(LANGUAGES.LOUNGE.JOBS.SEARCH_FOR_POSTS)}
              />
            </Box>
            {utils.getIsLogin() && (
              <Box minW={'7rem'} w={'11.625rem'}>
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
            )}
          </HStack>

          {isOpen && (
            <PostModal
              isOpen={isOpen}
              onClose={(ret) => {
                if (ret) {
                  handleOnClick();
                }
                onClose();
              }}
              callBack={(data) => {
                handlePostLounge(data);
              }}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default LoungeListHeader;

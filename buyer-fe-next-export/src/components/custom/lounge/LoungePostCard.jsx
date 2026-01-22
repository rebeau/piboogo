'use client';

import AutoImageSlider from '@/components/input/file/AutoImageSlider';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import { Box, Center, HStack, Text } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const LoungePostCard = (props) => {
  const router = useRouter();
  const pathName = usePathname();
  const { item, index, listLounge } = props;

  const { lang, localeText } = useLocale();
  const { isMobile, clampW } = useDevice();

  const [listImage, setListImage] = useState([]);

  useEffect(() => {
    if (item) {
      if (item?.loungeImageList) {
        setListImage(item.loungeImageList);
      }
    }
  }, [item]);

  const handleMoveDetail = useCallback((item) => {
    router.push(`${pathName}/detail/${item.loungeId}`);
  });

  return isMobile(true) ? (
    <div
      style={{
        alignSelf: 'stretch',
        padding: '1rem 0.75rem',
        borderTop: '0.0625rem solid var(--Semantic-border-default, #AEBDCA)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '0.75rem',
        display: 'inline-flex',
      }}
    >
      <div
        style={{
          flex: '1 1 0',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: '0.75rem',
          display: 'inline-flex',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '2.25rem',
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              width: clampW(5, 5),
              minWidth: clampW(5, 5),
              height: clampW(5, 5),
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <AutoImageSlider images={listImage} />
          </div>
          <div
            style={{
              flex: '1 1 0',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '0.75rem',
              display: 'inline-flex',
            }}
          >
            <div
              style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '1rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  flex: '1 1 0',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-default, #485766)',
                  fontSize: '0.75rem',
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {item.title}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            alignSelf: 'stretch',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '0.75rem',
            display: 'flex',
          }}
        >
          {[
            [localeText(LANGUAGES.LOUNGE.JOBS.AUTHOR), item.id],
            [
              localeText(LANGUAGES.LOUNGE.JOBS.CREATED_ON),
              utils.parseDateByCountryCode(item.createdAt, lang),
            ],
            [
              localeText(LANGUAGES.LOUNGE.JOBS.TITLE),
              utils.parseAmount(item.viewCnt),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                alignSelf: 'stretch',
                justifyContent: 'center',
                alignItems: 'flex-start',
                gap: '2.25rem',
                display: 'inline-flex',
              }}
            >
              <div
                style={{
                  width: '5rem',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-strong, #2A333C)',
                  fontSize: '0.75rem',
                  fontFamily: 'Poppins',
                  fontWeight: 500,
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {label}
              </div>
              <div
                style={{
                  flex: '1 1 0',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Semantic-text-brand-default, #485766)',
                  fontSize: '0.75rem',
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  lineHeight: '1.2rem',
                  wordWrap: 'break-word',
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ) : (
    <Box
      cursor={'pointer'}
      onClick={() => {
        handleMoveDetail(item);
      }}
      w={'100%'}
      borderBottom={
        index !== listLounge.length - 1 ? '1px solid #AEBDCA' : null
      }
      p={'1.25rem'}
    >
      <HStack spacing={'1.25rem'}>
        <Box minW={'6.25rem'} w={'6.25rem'} h={'6.25rem'}>
          <AutoImageSlider images={listImage} />
        </Box>
        <Box w={'18.1875rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {item.title}
          </Text>
        </Box>
        <Box w={'18.1875rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {item.id}
          </Text>
        </Box>
        <Box w={'18.1875rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {utils.parseDateByCountryCode(item.createdAt, lang)}
          </Text>
        </Box>
        <Box w={'18.1875rem'}>
          <Text
            textAlign={'center'}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight={'1.75rem'}
          >
            {item.viewCnt}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default LoungePostCard;

'use client';

import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import useModal from '@/hooks/useModal';
import useMove from '@/hooks/useMove';
import loungeApi from '@/services/loungeApi';
import utils from '@/utils';
import { Box, Button, Center, HStack, Img, Text } from '@chakra-ui/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import IconEdit from '@public/svgs/icon/lounge-pen.svg';
import IconDelete from '@public/svgs/icon/lounge-delete.svg';

const LoungeHeader = (props) => {
  const { action } = useParams();
  const router = useRouter();
  const { isMobile, clampW } = useDevice();
  const pathName = usePathname();
  const { localeText } = useLocale();
  const { openModal } = useModal();
  const { moveBack } = useMove();
  const { loungeInfo } = props;

  const handleModifyPost = useCallback(async () => {
    if (action === 'modify') {
      const title = loungeInfo?.title;
      const content = loungeInfo?.content;
      if (utils.isEmpty(title)) {
        openModal({ text: localeText(LANGUAGES.LOUNGE.PH_ENTER_TITLE) });
        return;
      }
      if (utils.isEmpty(content)) {
        openModal({
          text: localeText(LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT),
        });
        return;
      }
      const param = {
        loungeId: loungeInfo.loungeId,
        title: loungeInfo.title,
        content: loungeInfo.content,
      };
      if (loungeInfo?.link) {
        param.link = loungeInfo.link;
      }
      if (loungeInfo?.deleteLoungeImageIdList) {
        param.deleteLoungeImageIdList = loungeInfo.deleteLoungeImageIdList;
      }
      const files = loungeInfo?.files || [];

      const result = await loungeApi.patchLounge(param, files);
      if (result?.errorCode === SUCCESS) {
        openModal({
          text: result.message,
          onAgree: () => {
            moveBack();
          },
        });
      }
    } else {
      const parts = pathName.split('/');
      router.push(`/${parts[1]}/${parts[2]}/${parts[3]}/modify/${parts[5]}`);
    }
  });

  const handleDeletePost = useCallback(async () => {
    const param = {
      loungeId: loungeInfo.loungeId,
    };
    const result = await loungeApi.deleteLounge(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          moveBack();
        },
      });
    }
  });

  return isMobile(true) ? (
    <Box>
      {loungeInfo.isDelete === 2 && (
        <Box>
          <HStack spacing={'0.44rem'}>
            <Center
              w={clampW(1.875, 2)}
              h={clampW(1.875, 2)}
              onClick={() => {
                handleModifyPost();
              }}
            >
              <Img src={IconEdit.src} />
            </Center>
            {action === 'detail' && (
              <Center
                w={clampW(1.875, 2)}
                h={clampW(1.875, 2)}
                onClick={() => {
                  openModal({
                    type: 'confirm',
                    text: localeText(LANGUAGES.INFO_MSG.DELETE_POST),
                    onAgree: () => {
                      handleDeletePost();
                    },
                  });
                }}
              >
                <Img src={IconDelete.src} />
              </Center>
            )}
          </HStack>
        </Box>
      )}
    </Box>
  ) : (
    <Box>
      {loungeInfo.isDelete === 2 && (
        <HStack spacing={'0.75rem'}>
          <Box minW={'7rem'} h={'3rem'}>
            <Button
              onClick={() => {
                handleModifyPost();
              }}
              px={'1.25rem'}
              py={'0.63rem'}
              borderRadius={'0.25rem'}
              bg={'#7895B2'}
              h={'100%'}
              w={'100%'}
              _disabled={{
                bg: '#7895B290',
              }}
              _hover={{
                opacity: 0.8,
              }}
            >
              <Text
                color={'#FFF'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              >
                {localeText(LANGUAGES.COMMON.MODIFY)}
              </Text>
            </Button>
          </Box>
          {action === 'detail' && (
            <Box minW={'7rem'} h={'3rem'}>
              <Button
                onClick={() => {
                  openModal({
                    type: 'confirm',
                    text: localeText(LANGUAGES.INFO_MSG.DELETE_POST),
                    onAgree: () => {
                      handleDeletePost();
                    },
                  });
                }}
                px={'1.25rem'}
                py={'0.63rem'}
                borderRadius={'0.25rem'}
                border={'1px solid #B20000'}
                boxSizing={'border-box'}
                bg={'transparent'}
                h={'100%'}
                w={'100%'}
                _disabled={{
                  bg: '#7895B290',
                }}
                _hover={{
                  opacity: 0.8,
                }}
              >
                <Text
                  color={'#B20000'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.COMMON.DELETE)}
                </Text>
              </Button>
            </Box>
          )}
        </HStack>
      )}
    </Box>
  );
};

export default LoungeHeader;

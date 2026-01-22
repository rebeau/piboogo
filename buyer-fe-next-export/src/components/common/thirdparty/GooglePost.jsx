'use client';

import {
  Box,
  Center,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';

// import { useGooglePostStore } from '@stores/common/googlePost.store';
// import { logger } from '@utils/logger.utils';
// import utils from '@utils/index';
// import { useCustomToast } from '@hooks/useCustomToast';

import { CustomIcon } from '@/components';
import useLocale from '@/hooks/useLocale';
import {
  isOpenGoogleAddrState,
  selectedGoogleAddrState,
} from '@/stores/googleAddrRecoil';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { LANGUAGES } from '@/constants/lang';
import utils from '@/utils';
import SearchInput from '@/components/input/custom/SearchInput';

const GooglePost = () => {
  const { localeText } = useLocale();

  const [isOpenGoogleAddr, setIsOpenGoogleAddr] = useRecoilState(
    isOpenGoogleAddrState,
  );
  const setSelectedGoogleAddr = useSetRecoilState(selectedGoogleAddrState);

  const onCloseGoogleAddr = () => setIsOpenGoogleAddr(false);
  const completeGoogleAddr = (address) => setSelectedGoogleAddr(address);

  // const showToast = useCustomToast();

  const [input, setInput] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const fetchAutocomplete = async (query) => {
    if (!query) {
      setPredictions([]);
      setError('');
      return;
    }
    if (!apiKey) {
      setError('API 키가 설정되지 않았습니다.');
      return;
    }

    setLoading(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${apiKey}&types=address`;

      const res = await fetch(
        `/api/google/place?url=${encodeURIComponent(url)}`,
      );

      const data = await res.json();

      if (data.status === 'OK') {
        setPredictions(data.predictions);
        setError('');
      } else {
        setPredictions([]);
        setError(data.status || '자동완성 API 오류');
      }
    } catch (e) {
      setPredictions([]);
      setError('자동완성 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchAutocomplete, 200), [
    apiKey,
  ]);

  const onInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    debouncedFetch(value);
  };

  const onSelect = async (place_id) => {
    setPredictions([]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/google/place?place_id=${place_id}`);
      const data = await res.json();

      if (data.errorCode === 0) {
        const addressData = utils.extractDeliveryAddress(data.results[0]);
        /*
        if (!addressData.postalCode) {
          showToast({
            title: t('INFO.NO_POSTAL_CODE'),
            status: 'error',
          });
        }
        */
        completeGoogleAddr(addressData);
        onCloseGoogleAddr();
      } else {
        setError(data.error || '상세 주소 조회 실패');
      }
    } catch {
      setError('서버 요청 실패');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResults = () => {
    if (!input) {
      return (
        <Tr h="50px">
          <Td>
            <Text fontWeight={700} fontSize="15px" color="gray.400">
              {localeText('COMMON.PH_SEARCH_TERM')}
            </Text>
          </Td>
        </Tr>
      );
    }

    if (loading) {
      return (
        <Tr h="50px" textAlign="center">
          <Td>
            <Spinner size="sm" />
          </Td>
        </Tr>
      );
    }

    if (error) {
      return (
        <Tr h="50px">
          <Td>
            <Text fontWeight={700} fontSize="15px" color="red.400">
              {error}
            </Text>
          </Td>
        </Tr>
      );
    }

    if (predictions.length === 0) {
      return (
        <Tr h="50px">
          <Td>
            <Text fontWeight={700} fontSize="15px" color="gray.400">
              {localeText('INFO.NO_SEARCH_RESULTS')}
            </Text>
          </Td>
        </Tr>
      );
    }

    return predictions.map((data) => (
      <Tr
        key={data.place_id}
        _hover={{ cursor: 'pointer', bg: 'rgba(245, 247, 251, 0.1)' }}
        onClick={() => onSelect(data.place_id)}
      >
        <Td>
          <Text fontSize="14px">{data.description}</Text>
        </Td>
      </Tr>
    ));
  };

  return (
    <Modal
      isOpen={isOpenGoogleAddr}
      onClose={onCloseGoogleAddr}
      size={{ base: 'sm', md: 'lg' }}
    >
      <ModalOverlay />
      <ModalContent top="20%" overflow="hidden" bg="#FFF">
        <ModalHeader textAlign="center" pb={0}>
          <HStack
            w="full"
            pb="0.75rem"
            justifyContent="center"
            position="relative"
          >
            <Text fontSize="1.5rem" fontWeight={400} color="#000">
              {localeText(LANGUAGES.ADDRESS.ADDRESS_SEARCH)}
            </Text>
            <Center
              w="1.5rem"
              aspectRatio={1}
              position="absolute"
              right={0}
              cursor="pointer"
              onClick={onCloseGoogleAddr}
            >
              <CustomIcon w="90%" h="90%" name="close" />
            </Center>
          </HStack>
        </ModalHeader>
        <ModalBody p={0}>
          <VStack px={4} spacing={0}>
            <Box w="100%">
              <SearchInput
                placeholder={localeText(LANGUAGES.ADDRESS.ADDRESS_SEARCH)}
                h="3.25rem"
                borderRadius={'0.25rem'}
                value={input}
                onChange={onInputChange}
              />
            </Box>
            <Box pt={2} w="100%" pb={4}>
              <TableContainer h="100%" overflowY="auto">
                <Table>
                  <Tbody>{renderSearchResults()}</Tbody>
                </Table>
              </TableContainer>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GooglePost;

'use client';

import { CustomIcon } from '@/components';
import {
  Box,
  VStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  HStack,
  Text,
  Image as ChakraImage,
  Center,
  Divider,
} from '@chakra-ui/react';

import { useCallback } from 'react';
import useLocale from '@/hooks/useLocale';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import OrderHeader from './OrderHeader';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { useRecoilValue } from 'recoil';
import { langState } from '@/stores/environmentRecoil';
import useOrders from '@/hooks/useOrders';
import ContentBR from '@/components/custom/ContentBR';

const OrderTrackModal = (props) => {
  const lang = useRecoilValue(langState);
  const { localeText } = useLocale();

  const { selectedOrder, selectedOrders, handleInquiries } = useOrders();

  const shippingHistory = [
    {
      historyId: 3,
      date: '19 Dec 2024 11:24',
      history:
        'Origin Logistics Hub    [International Shipping Processed] The package has arrived at the origin country’s logistics hub.',
    },
    {
      historyId: 2,
      date: '19 Dec 2024 11:24',
      history:
        'Origin Logistics Hub    [Shipment Dispatched] The package has left the seller’s warehouse.',
    },
    {
      historyId: 1,
      date: '19 Dec 2024 11:24',
      history:
        'Origin Logistics Hub    [Shipment Dispatched] The package has left the seller’s warehouse.',
    },
  ];

  const { isOpen, onClose } = props;

  const handleFinally = useCallback(() => {
    if (onClose) {
      onClose();
    }
  });

  const orderCardRow = useCallback(() => {
    const firstOrder = selectedOrder;
    const itemCount = firstOrder.count || 0;
    return (
      <Box w={'100%'}>
        <HStack spacing={'0.75rem'}>
          <Box w={'6.25rem'} h={'6.25rem'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              w={'100%'}
              h={'100%'}
              src={firstOrder.image}
            />
          </Box>
          <Box>
            <VStack spacing={'0.25rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#485766'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                >
                  {firstOrder.brandName}
                </Text>
              </Box>
              <Box>
                <HStack spacing={'0.75rem'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {firstOrder.name}
                    </Text>
                  </Box>
                  {itemCount > 0 && (
                    <Box>
                      <Text
                        color={'#485766'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {lang === COUNTRY.COUNTRY_INFO.KR.LANG
                          ? `외 ${itemCount} 개`
                          : `and ${itemCount} others`}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'#00000099'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          px={0}
        >
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'} px={'2.5rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.ORDER.TRACK_SHIPMENT)}
                    </Text>
                  </Box>
                  <Box
                    w={'2rem'}
                    h={'2rem'}
                    cursor={'pointer'}
                    onClick={() => {
                      handleFinally();
                    }}
                  >
                    <CustomIcon
                      w={'100%'}
                      h={'100%'}
                      name={'close'}
                      color={'#7895B2'}
                    />
                  </Box>
                </HStack>
              </Box>

              <OrderHeader selectedOrders={selectedOrders} />

              <Box w={'100%'}>{orderCardRow()}</Box>

              <Divider borderBottom={'1px solid #AEBDCA'} />

              <Box w={'100%'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(
                            LANGUAGES.MY_PAGE.ORDER.SHIPPING_CARRIERS,
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          Fedex
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <HStack spacing={'2rem'}>
                      <Box w={'10rem'}>
                        <Text
                          color={'#7895B2'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.TRACKING_NUMBER)}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          ABCD123456789
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                </VStack>
              </Box>

              <Box w={'100%'} py={'1.5rem'} px={'1.25rem'} bg={'#8c644212'}>
                <VStack spacing={'1.5rem'}>
                  <Box w={'100%'}>
                    <HStack spacing={0}>
                      <Center
                        minW={'7rem'}
                        w={'11.25rem'}
                        h={'3rem'}
                        border={'1px solid #7895B2'}
                        borderRadius={'0.25rem'}
                        bg={'transparent'}
                      >
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.PREPARING)}
                        </Text>
                      </Center>
                      <Divider
                        w={'2.5rem'}
                        borderBottom={'1.5px solid #AEBDCA'}
                      />
                      <Center
                        minW={'7rem'}
                        w={'11.25rem'}
                        h={'3rem'}
                        borderRadius={'0.25rem'}
                        bg={'#7895B2'}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.START_SHIPPING)}
                        </Text>
                      </Center>
                      <Divider
                        w={'2.5rem'}
                        borderBottom={'1.5px solid #AEBDCA'}
                      />
                      <Center
                        minW={'7rem'}
                        w={'11.25rem'}
                        h={'3rem'}
                        border={'1px solid #AEBDCA'}
                        borderRadius={'0.25rem'}
                        bg={'transparent'}
                      >
                        <Text
                          color={'#A7C3D2'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(
                            LANGUAGES.MY_PAGE.ORDER.DOMESTIC_SHIPPING,
                          )}
                        </Text>
                      </Center>
                      <Divider
                        w={'2.5rem'}
                        borderBottom={'1.5px solid #AEBDCA'}
                      />
                      <Center
                        minW={'7rem'}
                        w={'11.25rem'}
                        h={'3rem'}
                        border={'1px solid #AEBDCA'}
                        borderRadius={'0.25rem'}
                        bg={'transparent'}
                      >
                        <Text
                          color={'#A7C3D2'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.DELIVERED)}
                        </Text>
                      </Center>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <VStack spacing={'1.25rem'}>
                      {shippingHistory.map((history, historyIndex) => {
                        return (
                          <Box w={'100%'} key={historyIndex}>
                            <HStack
                              spacing={'1.25rem'}
                              alignItems={'flex-start'}
                            >
                              <Box w={'8.75rem'}>
                                <Text
                                  color={'#7895B2'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                >
                                  {history.date}
                                </Text>
                              </Box>
                              <Box w={'42.5rem'}>
                                <Text
                                  color={
                                    historyIndex === 0 ? '#485766' : '#7895B2'
                                  }
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {history.history}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
            <ContentBR h={'2.5rem'} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderTrackModal;

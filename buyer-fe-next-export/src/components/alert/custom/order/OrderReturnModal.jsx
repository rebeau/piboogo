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
  Button,
  Img,
  Divider,
  Textarea,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

import { useCallback, useState } from 'react';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import ContentBR from '@/components/custom/ContentBR';
import OrderCard from '@/components/custom/order/OrderCard';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import OrderHeader from './OrderHeader';
import useOrders from '@/hooks/useOrders';
import utils from '@/utils';
import ordersApi from '@/services/ordersApi';
import { SUCCESS } from '@/constants/errorCode';
import useModal from '@/hooks/useModal';
import useDevice from '@/hooks/useDevice';

const OrderReturnModal = (props) => {
  const { isMobile, clampW } = useDevice();
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const {
    selectedOrder,
    selectedOrders, //
    handleActionReturn,
  } = useOrders();

  const { isOpen, onClose } = props;

  const [returnIndex, setReturnIndex] = useState(0);
  const [returnReason, setReturnReason] = useState('');

  const handleFinally = useCallback(async (isRet = false) => {
    console.log(isRet);
    if (onClose) {
      onClose(isRet);
    }
  });

  const orderCardRow = useCallback((rowIndex) => {
    const brandName = selectedOrder?.brandName;
    const ordersProducts = selectedOrders?.ordersProducts || [];

    return (
      <Box w={'100%'} key={rowIndex}>
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <VStack spacing={'1.25rem'}>
              <Box w={'100%'}>
                <HStack>
                  <Box
                    cursor={'pointer'}
                    onClick={() => {
                      // handleMoveBrand(brand.href);
                    }}
                  >
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {brandName}
                    </Text>
                  </Box>
                  <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
                </HStack>
              </Box>
              <Box w={'100%'}>
                <VStack spacing={'1.25rem'}>
                  {ordersProducts.map((product, productIndex) => {
                    return (
                      <Box key={productIndex} w={'100%'}>
                        <OrderCard w={'max-content'} item={product} isPrice />
                      </Box>
                    );
                  })}
                </VStack>
              </Box>
              {/*
              <Box w={'100%'} bg={'#8C644212'} px={'1rem'} py={'0.75rem'}>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Text fontSize={'1rem'} fontWeight={400} color={'#556A7E'}>
                      {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_PRICE)}
                    </Text>
                    <Text color={'#485766'} fontSize={'1rem'} fontWeight={500}>
                      {utils.parseDallar(selectedOrders.totalAmount)}
                    </Text>
                  </HStack>
                </Box>
              </Box>
              */}
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  });

  return isMobile(true) ? (
    <Modal
      isOpen={isOpen}
      onClose={handleFinally}
      size={'full'}
      scrollBehavior="inside"
    >
      <ModalOverlay bg={'#00000099'} />
      <ModalContent alignSelf={'center'} borderRadius={0} w={'100%'}>
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          py={0}
          pt={'1.5rem'}
          px={clampW(1, 5)}
        >
          <VStack spacing={'1.5rem'}>
            <Box w={'100%'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      lineHeight={'1.96875rem'}
                    >
                      {localeText(LANGUAGES.MY_PAGE.ORDER.RETURNING_PRODUCT)}
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

              <ContentBR h={'1rem'} />

              <OrderHeader selectedOrders={selectedOrders} />
            </Box>

            <Box w={'100%'}>{orderCardRow()}</Box>

            <Box w={'100%'}>
              <Text
                color={'#485766'}
                fontSize={'1.25rem'}
                fontWeight={500}
                lineHeight={'2.25rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.ORDER.REASONS_FOR_RETURN)}
              </Text>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'0.75rem'}>
                <Button
                  onClick={() => {
                    setReturnIndex(1);
                  }}
                  h={'3rem'}
                  w={'100%'}
                  borderRadius={'0.25rem'}
                  bg={returnIndex === 1 ? '#73829D' : null}
                  border={`1px solid ${returnIndex === 1 ? '#73829D' : '#7895B2'}`}
                >
                  <Text
                    color={returnIndex === 1 ? '#FFF' : '#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.MY_PAGE.ORDER.ORDER_MISTAKE)}
                  </Text>
                </Button>
                <Button
                  onClick={() => {
                    setReturnIndex(2);
                  }}
                  h={'3rem'}
                  w={'100%'}
                  bg={returnIndex === 2 ? '#73829D' : null}
                  border={`1px solid ${returnIndex === 2 ? '#73829D' : '#7895B2'}`}
                >
                  <Text
                    color={returnIndex === 2 ? '#FFF' : '#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.MY_PAGE.ORDER.DAMAGED_OR_DEFECTIVE)}
                  </Text>
                </Button>
                <Button
                  onClick={() => {
                    setReturnIndex(3);
                  }}
                  h={'3rem'}
                  w={'100%'}
                  bg={returnIndex === 3 ? '#73829D' : null}
                  border={`1px solid ${returnIndex === 3 ? '#73829D' : '#7895B2'}`}
                >
                  <Text
                    color={returnIndex === 3 ? '#FFF' : '#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.MY_PAGE.ORDER.WRONG_ITEM_DELIVERED)}
                  </Text>
                </Button>
                <Button
                  onClick={() => {
                    setReturnIndex(4);
                  }}
                  h={'3rem'}
                  w={'100%'}
                  bg={returnIndex === 4 ? '#73829D' : null}
                  border={`1px solid ${returnIndex === 4 ? '#73829D' : '#7895B2'}`}
                >
                  <Text
                    color={returnIndex === 4 ? '#FFF' : '#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {localeText(LANGUAGES.COMMON.OTHERS)}
                  </Text>
                </Button>
              </VStack>
            </Box>

            <Box w={'100%'} h={'8.75rem'}>
              <Textarea
                type={'text'}
                placeholder={localeText(
                  LANGUAGES.MY_PAGE.ORDER.PH_REASONS_FOR_RETURN,
                )}
                _placeholder={{
                  color: '#A7C3D2',
                  fontSize: '1rem',
                  fontWeight: 400,
                  lineHeight: '1.75rem',
                }}
                onChange={(e) => {
                  setReturnReason(e.target.value);
                }}
                value={returnReason}
                w={'100%'}
                h={'100%'}
                py={'0.875rem'}
                px={'1.25rem'}
                bg={'#FFF'}
                borderRadius={'0.25rem'}
                resize={'none'}
                //
                border={'1px solid #9CADBE'}
                fontSize={'1rem'}
                fontWeight={400}
                lineHeight={'1.75rem'}
              />
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={500}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(
                      LANGUAGES.MY_PAGE.ORDER.ESTIMATED_REFUND_AMOUNT,
                    )}
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'} spacing={'2rem'}>
                        <Box>
                          <Text
                            color={'#66809C'}
                            fontSize={'1.125rem'}
                            fontWeight={500}
                            lineHeight={'1.96875rem'}
                          >
                            {localeText(LANGUAGES.MY_PAGE.ORDER.PRODUCT_AMOUNT)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={600}
                            lineHeight={'1.96875rem'}
                          >
                            {utils.parseDallar(selectedOrders.totalAmount)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>

                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'} spacing={'2rem'}>
                        <Box>
                          <Text
                            color={'#66809C'}
                            fontSize={'1.125rem'}
                            fontWeight={500}
                            lineHeight={'1.96875rem'}
                          >
                            {localeText(
                              LANGUAGES.MY_PAGE.ORDER.DISCOUNT_AMOUNT,
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#940808'}
                            fontSize={'1.125rem'}
                            fontWeight={600}
                            lineHeight={'1.96875rem'}
                          >
                            {`-${utils.parseDallar(selectedOrders.discountAmount)}`}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Divider borderBottom={'1px solid #AEBDCA'} />
                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'} spacing={'2rem'}>
                        <Box>
                          <Text
                            color={'#66809C'}
                            fontSize={'1.125rem'}
                            fontWeight={500}
                            lineHeight={'1.96875rem'}
                          >
                            {localeText(
                              LANGUAGES.MY_PAGE.ORDER.FINAL_REFUND_ESTIMATE,
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={600}
                            lineHeight={'1.96875rem'}
                          >
                            {utils.parseDallar(selectedOrders.actualAmount)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'}>
              <Box w={'100%'}>
                <Text
                  color={'#556A7E'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING)}
                </Text>
              </Box>
              <Box w={'100%'} pl={'0.68rem'}>
                <UnorderedList>
                  <ListItem color={'#556A7E'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(
                        LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_1,
                      )}
                    </Text>
                  </ListItem>
                  <ListItem color={'#556A7E'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(
                        LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_2,
                      )}
                    </Text>
                  </ListItem>
                  <ListItem color={'#556A7E'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(
                        LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_3,
                      )}
                    </Text>
                  </ListItem>
                  <ListItem color={'#556A7E'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(
                        LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_4,
                      )}
                    </Text>
                  </ListItem>
                </UnorderedList>
              </Box>
            </Box>

            <Box w={'100%'} h={'3rem'} mb={'1.25rem'}>
              <Button
                onClick={async () => {
                  handleActionReturn(
                    selectedOrders,
                    returnIndex,
                    returnReason,
                    handleFinally,
                  );
                }}
                _disabled={{
                  bg: '#D9E7EC',
                }}
                py={'0.625rem'}
                px={'1.25rem'}
                borderRadius={'0.25rem'}
                bg={'#66809C'}
                h={'100%'}
                w={'100%'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1.25rem'}
                  fontWeight={400}
                  lineHeight={'2.25rem'}
                >
                  {localeText(LANGUAGES.MY_PAGE.ORDER.REQUEST_RETURN)}
                </Text>
              </Button>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal isOpen={isOpen} onClose={handleFinally} size="md">
      <ModalOverlay bg={'#00000099'} />
      <ModalContent
        alignSelf={'center'}
        borderRadius={0}
        w={'60rem'}
        h={'100%'}
        maxH={'max-content'}
        maxW={null}
      >
        <ModalBody
          w={'100%'}
          h={'100%'}
          position={'relative'}
          pt={'1.5rem'}
          // pb={'2.5rem'}
          pb={0}
          px={0}
        >
          <Box w={'100%'} h={'100%'}>
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
                      {localeText(LANGUAGES.MY_PAGE.ORDER.RETURNING_PRODUCT)}
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
            </VStack>

            <Box
              w={'100%'}
              h={'calc(100% - 7.75rem)'}
              overflowY={'auto'}
              className={'no-scroll'}
            >
              <VStack spacing={0} px={'2.5rem'}>
                <Box w={'100%'}>
                  <ContentBR h={'1.25rem'} />
                  <VStack spacing={'3.75rem'}>
                    {orderCardRow()}
                    <Box w={'100%'}>
                      <VStack align="stretch" h="17rem" gap="1.5rem">
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.25rem'}
                            fontWeight={500}
                            lineHeight={'2.25rem'}
                          >
                            {localeText(
                              LANGUAGES.MY_PAGE.ORDER.REASONS_FOR_RETURN,
                            )}
                          </Text>
                        </Box>
                        <HStack spacing={'0.75rem'}>
                          <Button
                            onClick={() => {
                              setReturnIndex(1);
                            }}
                            h={'3rem'}
                            w={'100%'}
                            borderRadius={'0.25rem'}
                            bg={returnIndex === 1 ? '#73829D' : null}
                            border={`1px solid ${returnIndex === 1 ? '#73829D' : '#7895B2'}`}
                          >
                            <Text
                              color={returnIndex === 1 ? '#FFF' : '#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.ORDER_MISTAKE,
                              )}
                            </Text>
                          </Button>
                          <Button
                            onClick={() => {
                              setReturnIndex(2);
                            }}
                            h={'3rem'}
                            w={'100%'}
                            bg={returnIndex === 2 ? '#73829D' : null}
                            border={`1px solid ${returnIndex === 2 ? '#73829D' : '#7895B2'}`}
                          >
                            <Text
                              color={returnIndex === 2 ? '#FFF' : '#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.DAMAGED_OR_DEFECTIVE,
                              )}
                            </Text>
                          </Button>
                          <Button
                            onClick={() => {
                              setReturnIndex(3);
                            }}
                            h={'3rem'}
                            w={'100%'}
                            bg={returnIndex === 3 ? '#73829D' : null}
                            border={`1px solid ${returnIndex === 3 ? '#73829D' : '#7895B2'}`}
                          >
                            <Text
                              color={returnIndex === 3 ? '#FFF' : '#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.WRONG_ITEM_DELIVERED,
                              )}
                            </Text>
                          </Button>
                          <Button
                            onClick={() => {
                              setReturnIndex(4);
                            }}
                            h={'3rem'}
                            w={'100%'}
                            bg={returnIndex === 4 ? '#73829D' : null}
                            border={`1px solid ${returnIndex === 4 ? '#73829D' : '#7895B2'}`}
                          >
                            <Text
                              color={returnIndex === 4 ? '#FFF' : '#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.COMMON.OTHERS)}
                            </Text>
                          </Button>
                        </HStack>
                        <Box w={'100%'} h={'8.75rem'}>
                          <Textarea
                            type={'text'}
                            placeholder={localeText(
                              LANGUAGES.MY_PAGE.ORDER.PH_REASONS_FOR_RETURN,
                            )}
                            _placeholder={{
                              color: '#A7C3D2',
                              fontSize: '1rem',
                              fontWeight: 400,
                              lineHeight: '1.75rem',
                            }}
                            onChange={(e) => {
                              setReturnReason(e.target.value);
                            }}
                            value={returnReason}
                            w={'100%'}
                            h={'100%'}
                            py={'0.875rem'}
                            px={'1.25rem'}
                            bg={'#FFF'}
                            borderRadius={'0.25rem'}
                            resize={'none'}
                            //
                            border={'1px solid #9CADBE'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.75rem'}
                          />
                        </Box>
                      </VStack>
                    </Box>
                    <Box w={'100%'}>
                      <VStack spacing={'1.5rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#485766'}
                            fontSize={'1.25rem'}
                            fontWeight={500}
                            lineHeight={'2.25rem'}
                          >
                            {localeText(
                              LANGUAGES.MY_PAGE.ORDER.ESTIMATED_REFUND_AMOUNT,
                            )}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <VStack spacing={'1.25rem'}>
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'space-between'}
                                spacing={'2rem'}
                              >
                                <Box>
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'1.125rem'}
                                    fontWeight={500}
                                    lineHeight={'1.96875rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.MY_PAGE.ORDER.PRODUCT_AMOUNT,
                                    )}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    color={'#485766'}
                                    fontSize={'1.125rem'}
                                    fontWeight={600}
                                    lineHeight={'1.96875rem'}
                                  >
                                    {utils.parseDallar(
                                      selectedOrders.totalAmount,
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>

                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'space-between'}
                                spacing={'2rem'}
                              >
                                <Box>
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'1.125rem'}
                                    fontWeight={500}
                                    lineHeight={'1.96875rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.MY_PAGE.ORDER.DISCOUNT_AMOUNT,
                                    )}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    color={'#940808'}
                                    fontSize={'1.125rem'}
                                    fontWeight={600}
                                    lineHeight={'1.96875rem'}
                                  >
                                    {`-${utils.parseDallar(selectedOrders.discountAmount)}`}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                            <Divider borderBottom={'1px solid #AEBDCA'} />
                            <Box w={'100%'}>
                              <HStack
                                justifyContent={'space-between'}
                                spacing={'2rem'}
                              >
                                <Box>
                                  <Text
                                    color={'#66809C'}
                                    fontSize={'1.125rem'}
                                    fontWeight={500}
                                    lineHeight={'1.96875rem'}
                                  >
                                    {localeText(
                                      LANGUAGES.MY_PAGE.ORDER
                                        .FINAL_REFUND_ESTIMATE,
                                    )}
                                  </Text>
                                </Box>
                                <Box>
                                  <Text
                                    color={'#485766'}
                                    fontSize={'1.125rem'}
                                    fontWeight={600}
                                    lineHeight={'1.96875rem'}
                                  >
                                    {utils.parseDallar(
                                      selectedOrders.actualAmount,
                                    )}
                                  </Text>
                                </Box>
                              </HStack>
                            </Box>
                          </VStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <Box w={'100%'}>
                        <Text
                          color={'#556A7E'}
                          fontSize={'1rem'}
                          fontWeight={400}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(
                            LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING,
                          )}
                        </Text>
                      </Box>
                      <Box w={'100%'} pl={'0.68rem'}>
                        <UnorderedList>
                          <ListItem color={'#556A7E'}>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_1,
                              )}
                            </Text>
                          </ListItem>
                          <ListItem color={'#556A7E'}>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_2,
                              )}
                            </Text>
                          </ListItem>
                          <ListItem color={'#556A7E'}>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_3,
                              )}
                            </Text>
                          </ListItem>
                          <ListItem color={'#556A7E'}>
                            <Text
                              color={'#556A7E'}
                              fontSize={'1rem'}
                              fontWeight={400}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(
                                LANGUAGES.MY_PAGE.ORDER.CHECK_THE_FOLLOWING_4,
                              )}
                            </Text>
                          </ListItem>
                        </UnorderedList>
                      </Box>
                    </Box>

                    <Box minW={'8.5rem'} w={'100%'} h={'4rem'}>
                      <Button
                        // isDisabled={!handleActiveSave()}
                        onClick={async () => {
                          handleActionReturn(
                            selectedOrders,
                            returnIndex,
                            returnReason,
                            handleFinally,
                          );
                        }}
                        _disabled={{
                          bg: '#D9E7EC',
                        }}
                        py={'0.625rem'}
                        px={'1.25rem'}
                        borderRadius={'0.25rem'}
                        bg={'#66809C'}
                        h={'100%'}
                        w={'100%'}
                      >
                        <Text
                          color={'#FFF'}
                          fontSize={'1.25rem'}
                          fontWeight={400}
                          lineHeight={'2.25rem'}
                        >
                          {localeText(LANGUAGES.MY_PAGE.ORDER.REQUEST_RETURN)}
                        </Text>
                      </Button>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
              <ContentBR h={'2.5rem'} />
            </Box>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderReturnModal;

'use client';

import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import {
  Box,
  Text,
  Flex,
  Button,
  Divider,
  Img,
  VStack,
  HStack,
} from '@chakra-ui/react';
import ContentBR from '../../ContentBR';
import CartListCard from './CartListCard';
import RightBlueArrow from '@public/svgs/icon/right-blue.svg';
import useModal from '@/hooks/useModal';
import useDevice from '@/hooks/useDevice';
import productCartApi from '@/services/productCartApi';
import { SUCCESS } from '@/constants/errorCode';

const CartListCardForm = (props) => {
  const { isMobile } = useDevice();
  const {
    cart,
    setCart,
    index,
    checkedItems,
    setCheckedItems,
    onClickDelete,
    onClickCheckOut,
  } = props;
  const { openModal } = useModal();
  const { localeText } = useLocale();

  const updateCartCount = async (newCount) => {
    if (!cart) return;

    const unitPrice = cart.unitPrice || 0;
    const validCount = Math.max(1, newCount);
    const totalPrice = unitPrice * validCount;

    const param = {
      productCartId: cart.productCartId,
      count: validCount,
    };

    const result = await productCartApi.patchProductCart(param);

    if (result?.errorCode === SUCCESS) {
      const updatedCart = {
        ...cart,
        count: validCount,
        totalPrice,
      };
      setCart(updatedCart);
    }
  };

  const increment = async (item) => {
    if (!cart) return;
    const count = item.count;
    const stockCnt = item.stockCnt || 0;
    const stockFlag = item.stockFlag;

    if (stockFlag === 2 || count < stockCnt) {
      updateCartCount(cart.count + 1);
    } else {
      setTimeout(() => {
        openModal({
          text: localeText(LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT, {
            key: '@COUNT@',
            value: utils.parseAmount(stockCnt),
          }),
        });
      }, 200);
      updateCartCount(stockCnt);
    }
  };

  const decrement = async (item) => {
    if (!cart) return;
    if (item.count > 1) {
      updateCartCount(cart.count - 1);
    }
  };

  const handlePatchProductCart = async (count, item) => {
    if (checkedItems.length > 0) {
      const updatedList = checkedItems.map((cart) =>
        cart.productCartId === item.productCartId
          ? {
              ...cart,
              count: Number(count),
              totalPrice: Number(item.unitPrice) * Number(count),
            }
          : cart,
      );

      setCheckedItems(updatedList);
    }
    await updateCartCount(count);
  };

  const handleCheckOut = () => {
    if (onClickCheckOut) {
      onClickCheckOut();
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'} key={index} borderBottom={'1px solid #AEBDCA'}>
      <Flex
        w={'100%'}
        py={'1.25rem'}
        borderTop={'1px solid #AEBDCA'}
        direction="column"
        justify={'center'}
        align="flex-start"
        gap={0}
      >
        <Flex align={'center'} gap="4px">
          <Text
            opacity="0.7"
            color={'#485766'}
            fontSize="15px"
            fontWeight="400"
            lineHeight="24px"
          >
            {cart.brandName}
          </Text>
          <Box>
            <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
          </Box>
        </Flex>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <CartListCard
            item={cart}
            increment={increment}
            decrement={decrement}
            updateCartCount={handlePatchProductCart}
            checkedItems={checkedItems}
            onChangeChecked={(checkItem) => {
              setCheckedItems((prev) => {
                if (
                  prev.length > 0 &&
                  prev[0].sellerUserId !== checkItem.sellerUserId
                ) {
                  setTimeout(() => {
                    openModal({
                      text: localeText(LANGUAGES.INFO_MSG.SELECT_SAME_BRAND),
                    });
                  }, 200);
                  return prev;
                }

                const exists = prev.some(
                  (v) => v.productCartId === checkItem.productCartId,
                );
                if (exists) {
                  return prev.filter(
                    (v) => v.productCartId !== checkItem.productCartId,
                  );
                } else {
                  return [...prev, checkItem];
                }
              });
            }}
            onClickDelete={onClickDelete}
          />
        </Box>

        <ContentBR h={'1.25rem'} />

        <Divider borderBottom={'1px solid #AEBDCA'} boxSizing={'border-box'} />

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <Box>
            <Text
              color={'#485766'}
              fontSize="18px"
              fontWeight={500}
              lineHeight="31.5px"
            >
              {localeText(LANGUAGES.ORDER.ESTIMATED_ORDER_AMOUNT)}
            </Text>
          </Box>

          <ContentBR h={'1.5rem'} />

          <VStack spacing={'1.25rem'}>
            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Text
                  color={'#7895B2'}
                  fontSize={'1rem'}
                  fontWeight={400}
                  lineHeight={'160%'}
                >
                  {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                </Text>
                <Text
                  color={'#556A7E'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'160%'}
                >
                  {utils.handleGetTotalPrice(cart)}
                </Text>
              </HStack>
            </Box>

            <Divider borderTop={'1px solid #AEBDCA'} />

            <Box w={'100%'}>
              <HStack justifyContent={'space-between'}>
                <Text
                  color={'#66809C'}
                  fontSize={'1.125rem'}
                  fontWeight={500}
                  lineHeight={'160%'}
                >
                  {localeText(LANGUAGES.ORDER.TOTAL)}
                </Text>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={600}
                  lineHeight={'160%'}
                >
                  {utils.handleGetTotalPrice(cart)}
                </Text>
              </HStack>
            </Box>
            <Box w={'100%'} h={'3.5rem'}>
              <Button
                onClick={() => {
                  handleCheckOut();
                }}
                _disabled={{
                  bg: '#D9E7EC',
                  cursor: 'not-allowed',
                }}
                _active={{}}
                _hover={{}}
                py={'0.75rem'}
                px={'1rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.ORDER.CHECK_OUT)}
                </Text>
              </Button>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  ) : (
    <Box w={'100%'} key={index}>
      <Flex
        w={'100%'}
        h={'3.75rem'}
        pl={'1.25rem'}
        pr={'1.25rem'}
        pt={'1rem'}
        pb={'1rem'}
        borderTop={'1px solid #73829D'}
        justifyContent={'flex-start'}
        alignItems={'center'}
        gap={'1.25rem'}
        display={'inline-flex'}
      >
        <Box w={'1.75rem'} h={'1.75rem'} position={'relative'}>
          {/*
          <CustomCheckbox
            isChecked={isHeaderChecked}
            onChange={toggleHeaderCheckbox}
          />
          */}
        </Box>
        <Text
          flex={'1 1 0'}
          textAlign={'center'}
          color={'#2A333C'}
          fontSize={'1rem'}
          fontWeight={'500'}
          lineHeight={'1.75rem'}
        >
          {localeText(LANGUAGES.ORDER.PRODUCT)}
        </Text>
        <Text
          w={'10rem'}
          textAlign={'center'}
          color={'#2A333C'}
          fontSize={'1rem'}
          fontWeight={'500'}
          lineHeight={'1.75rem'}
        >
          {localeText(LANGUAGES.ORDER.QUANTITY)}
        </Text>
        <Text
          w={'12.5rem'}
          textAlign={'center'}
          color={'#2A333C'}
          fontSize={'1rem'}
          fontWeight={'500'}
          lineHeight={'1.75rem'}
        >
          {localeText(LANGUAGES.ORDER.TOTAL_PRICE)}
        </Text>
        <Box w={'2rem'} h={'1.25rem'} />
      </Flex>

      <Flex
        w={'100%'}
        p={'1.25rem'}
        borderTop={'1px solid #AEBDCA'}
        direction="column"
        justify={'center'}
        align="flex-start"
        gap={0}
      >
        <Flex align={'center'} gap="4px">
          <Text
            opacity="0.7"
            color={'#485766'}
            fontSize="15px"
            fontWeight="400"
            lineHeight="24px"
          >
            {cart.brandName}
          </Text>
          <Box>
            <Img w={'1.25rem'} h={'1.25rem'} src={RightBlueArrow.src} />
          </Box>
        </Flex>

        <ContentBR h={'1.25rem'} />

        <Box w={'100%'}>
          <CartListCard
            item={cart}
            increment={increment}
            decrement={decrement}
            updateCartCount={handlePatchProductCart}
            checkedItems={checkedItems}
            onChangeChecked={(checkItem) => {
              setCheckedItems((prev) => {
                if (
                  prev.length > 0 &&
                  prev[0].sellerUserId !== checkItem.sellerUserId
                ) {
                  setTimeout(() => {
                    openModal({
                      text: localeText(LANGUAGES.INFO_MSG.SELECT_SAME_BRAND),
                    });
                  }, 200);
                  return prev;
                }

                const exists = prev.some(
                  (v) => v.productCartId === checkItem.productCartId,
                );
                if (exists) {
                  return prev.filter(
                    (v) => v.productCartId !== checkItem.productCartId,
                  );
                } else {
                  return [...prev, checkItem];
                }
              });
            }}
            onClickDelete={onClickDelete}
          />
          {/*
        <VStack spacing={'1.25rem'}>
          {listCart.map((product, index) => {
            return orderCard(product, index);
          })}
        </VStack>
        */}
        </Box>

        <ContentBR h={'1.25rem'} />

        <Flex
          w="100%"
          direction="column"
          justify="flex-start"
          align="flex-start"
          gap="24px"
        >
          <Divider
            borderBottom={'1px solid #AEBDCA'}
            boxSizing={'border-box'}
          />

          <Flex
            w="100%"
            direction="column"
            justify={'center'}
            align="flex-end"
            gap="32px"
          >
            <Flex
              w="100%"
              direction="column"
              justify="flex-start"
              align="flex-start"
              gap="24px"
            >
              <Text
                color={'#485766'}
                fontSize="18px"
                fontWeight={500}
                lineHeight="31.5px"
              >
                {localeText(LANGUAGES.ORDER.ESTIMATED_ORDER_AMOUNT)}
              </Text>
              <Flex w="100%" direction="column" gap={'0.75rem'}>
                <Flex w="100%" justify="flex-start" align={'center'} gap="32px">
                  <Text
                    w="160px"
                    color="#7895B2"
                    fontSize={'1rem'}
                    fontWeight="400"
                    lineHeight="28px"
                  >
                    {localeText(LANGUAGES.ORDER.TOTAL_PRODUCT)}
                  </Text>
                  <Text
                    flex="1 1 0"
                    textAlign="right"
                    color="#556A7E"
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight="28px"
                  >
                    {utils.handleGetTotalPrice(cart)}
                  </Text>
                </Flex>

                <Divider borderTop={'1px solid #AEBDCA'} />

                <Flex w="100%" justify="flex-start" align={'center'} gap="32px">
                  <Text
                    w="160px"
                    color="#66809C"
                    fontSize="18px"
                    fontWeight={500}
                    lineHeight="31.5px"
                  >
                    {localeText(LANGUAGES.ORDER.TOTAL)}
                  </Text>
                  <Text
                    flex="1 1 0"
                    textAlign="right"
                    color={'#485766'}
                    fontSize="18px"
                    fontWeight="600"
                    lineHeight="31.5px"
                  >
                    {utils.handleGetTotalPrice(cart)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            <Box w={'20rem'} h={'3.5rem'}>
              <Button
                isDisabled={
                  !checkedItems.some(
                    (v) => v.productCartId === cart.productCartId,
                  )
                }
                onClick={() => {
                  handleCheckOut();
                }}
                _disabled={{
                  bg: '#D9E7EC',
                  cursor: 'not-allowed',
                }}
                _active={{}}
                _hover={{}}
                py={'0.75rem'}
                px={'1rem'}
                borderRadius={'0.25rem'}
                bg={'#7895B2'}
                h={'100%'}
                w={'100%'}
              >
                <Text
                  color={'#FFF'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.96875rem'}
                >
                  {localeText(LANGUAGES.ORDER.CHECK_OUT)}
                </Text>
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CartListCardForm;

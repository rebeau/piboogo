'use client';

import { CustomIcon } from '@/components';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import utils from '@/utils';
import {
  Box,
  HStack,
  Image as ChakraImage,
  Text,
  Flex,
  Center,
  VStack,
  Input,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ContentBR from '../../ContentBR';
import useMove from '@/hooks/useMove';
import useModal from '@/hooks/useModal';

const CartListCard = (props) => {
  const { openModal } = useModal();
  const { isMobile, clampW } = useDevice();
  const {
    item,
    isDetail = false,
    index,
    increment,
    decrement,
    checkedItems,
    onChangeChecked,
    onClickDelete,
    updateCartCount,
  } = props;

  const [count, setCount] = useState(1);

  const { moveProductDetail } = useMove();
  const { localeText } = useLocale();

  const isSoldOut = item.stockCnt === 0 && item.stockFlag === 1;

  useEffect(() => {
    if (utils.isLocalTest() && isDetail) {
      setTimeout(() => {
        setAbleCheck(true);
      }, 1000);
    }
  }, []);

  const [firstImage, setFirstImage] = useState({});
  const [productCartOptions, setProductCartOptions] = useState([]);

  /*
  useEffect(() => {
    const handler = setTimeout(() => {
      updateCartCount(count);
    }, 200);
    return () => clearTimeout(handler);
  }, [count]);
  */

  useEffect(() => {
    if (item?.productImages) {
      if (item.productImages.length > 0) {
        setFirstImage(item.productImages[0]);
      }
    }
    const productCartOptions = item?.productCartOptions || [];
    if (productCartOptions.length > 0) {
      setProductCartOptions(productCartOptions);
    }
    setCount(item.count || 1);
  }, [item]);

  return isMobile(true) ? (
    <Box w="100%">
      <VStack spacing={'0.75rem'}>
        <Box w={'100%'}>
          <HStack justifyContent={'space-between'}>
            <Box>
              <HStack>
                <CustomCheckbox
                  isChecked={checkedItems.some(
                    (v) => v.productCartId === item.productCartId,
                  )}
                  onChange={() => {
                    if (isSoldOut) {
                      setTimeout(() => {
                        openModal({
                          text: localeText(
                            LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK,
                          ),
                        });
                      }, 200);
                      return;
                    }
                    onChangeChecked(item);
                  }}
                />
                <Box
                  onClick={() => {
                    moveProductDetail(item.productId);
                  }}
                >
                  <Text
                    color={'#485766'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight="28px"
                  >
                    {item.name}
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Box>
              <Box
                w={'2rem'}
                h={'2rem'}
                cursor={'pointer'}
                onClick={() => {
                  onClickDelete(item);
                }}
              >
                <CustomIcon
                  w={'100%'}
                  h={'100%'}
                  name={'close'}
                  color={'#7895B2'}
                />
              </Box>
            </Box>
          </HStack>
        </Box>

        <Flex
          w={'100%'}
          h={'6.25rem'}
          align={'center'}
          gap={'0.75rem'}
          flex={'1 1 0'}
        >
          <Center minW={'6.25rem'} w={'6.25rem'} h={'6.25rem'}>
            <ChakraImage
              fallback={<DefaultSkeleton />}
              w={'100%'}
              h={'100%'}
              src={firstImage?.imageS3Url || ''}
            />
          </Center>
          <Flex direction="column" align="flex-start" gap="4px">
            {productCartOptions.map((item, index) => {
              console.log('######### item', item);
              return (
                <Box key={index}>
                  <Text
                    color={'#66809C'}
                    fontSize={'0.9375rem'}
                    fontWeight={400}
                    lineHeight={'1.5rem'}
                    textAlign={'left'}
                  >
                    {`${localeText(LANGUAGES.COMMON.OPTION)} : ${item.name}`}
                  </Text>
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </VStack>

      <ContentBR h={'1.25rem'} />

      <Box>
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <HStack
              h="3.75rem"
              px="1rem"
              py="1rem"
              background="#FFF"
              borderRadius="0.25rem"
              border="1px solid #9CADBE"
              spacing="1.25rem"
              justifyContent="space-between"
            >
              <Box
                w="1.25rem"
                h="1.25rem"
                cursor="pointer"
                onClick={() => {
                  if (isSoldOut) {
                    setTimeout(() => {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
                      });
                    }, 200);
                    return;
                  }
                  decrement(item);
                }}
              >
                <CustomIcon name="minus" color="#7895B2" />
              </Box>

              <Input
                // value={isSoldOut ? 0 : count}
                disabled={isSoldOut}
                value={count}
                onChange={(e) => {
                  const val = e.target.value;
                  if (Number(val) < 1) {
                    setCount(1);
                  } else if (Number(val) < item?.stockCnt) {
                    if (/^\d*$/.test(val)) {
                      setCount(Number(val));
                    }
                  } else {
                    setTimeout(() => {
                      openModal({
                        text: localeText(
                          LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT,
                          {
                            key: '@COUNT@',
                            value: utils.parseAmount(item?.stockCnt),
                          },
                        ),
                      });
                    }, 200);
                    setCount(Number(item?.stockCnt));
                  }
                }}
                border={0}
                textAlign="center"
                color="#485766"
                fontSize="1rem"
                fontWeight={400}
                lineHeight="1.75rem"
                variant="unstyled"
                px={0}
              />

              <Box
                w="1.25rem"
                h="1.25rem"
                cursor="pointer"
                onClick={() => {
                  if (isSoldOut) {
                    setTimeout(() => {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
                      });
                    }, 200);
                    return;
                  }
                  increment(item);
                }}
              >
                <CustomIcon name="plus" color="#7895B2" />
              </Box>
            </HStack>
          </Box>

          <Box w={'100%'}>
            <HStack spacing={clampW(1.25, 3)}>
              <Box w={'9rem'}>
                <Text
                  color={'#485766'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {localeText(LANGUAGES.ORDER.TOTAL_ORDER_PRICE)}
                </Text>
              </Box>
              <Text
                color={'#485766'}
                fontSize={'1rem'}
                fontWeight={500}
                lineHeight={'1.75rem'}
              >
                {utils.handleGetTotalPrice(item)}
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  ) : (
    <Flex
      key={index}
      w="100%"
      justify="flex-start"
      align={'center'}
      gap={'0.75rem'}
    >
      <CustomCheckbox
        isChecked={checkedItems.some(
          (v) => v.productCartId === item.productCartId,
        )}
        onChange={() => {
          if (isSoldOut) {
            setTimeout(() => {
              openModal({
                text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
              });
            }, 200);
            return;
          }
          onChangeChecked(item);
        }}
      />

      <Flex h={'6.25rem'} align={'center'} gap={'0.75rem'} flex={'1 1 0'}>
        <Center minW={'6.25rem'} w={'6.25rem'} h={'6.25rem'}>
          <ChakraImage
            fallback={<DefaultSkeleton />}
            w={'100%'}
            h={'100%'}
            src={firstImage?.imageS3Url || ''}
          />
        </Center>
        <Flex direction="column" align="flex-start" gap="4px">
          <Text
            onClick={() => {
              moveProductDetail(item.productId);
            }}
            cursor={'pointer'}
            _hover={{ textDecoration: 'underline' }}
            color={'#485766'}
            fontSize={'1rem'}
            fontWeight={500}
            lineHeight="28px"
          >
            {item.name}
          </Text>
          {productCartOptions.map((item, index) => {
            return (
              <Box key={index}>
                <Text
                  color={'#66809C'}
                  fontSize={'0.9375rem'}
                  fontWeight={400}
                  lineHeight={'1.5rem'}
                  textAlign={'left'}
                >
                  {`${localeText(LANGUAGES.COMMON.OPTION)} : ${item.name}`}
                </Text>
              </Box>
            );
          })}
        </Flex>
      </Flex>

      <Box>
        <HStack spacing={'1.25rem'}>
          <Box w={clampW(13, 13)}>
            <HStack
              h="3.75rem"
              px="0.75rem"
              py="1rem"
              background="#FFF"
              borderRadius="0.25rem"
              border="1px solid #9CADBE"
              spacing="1.25rem"
              justifyContent="space-between"
            >
              <Box
                w="1.25rem"
                h="1.25rem"
                cursor="pointer"
                onClick={() => {
                  if (isSoldOut) {
                    setTimeout(() => {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
                      });
                    }, 200);
                    return;
                  }
                  decrement(item);
                }}
              >
                <CustomIcon name="minus" color="#7895B2" />
              </Box>

              <Input
                // value={isSoldOut ? 0 : count}
                disabled={isSoldOut}
                value={count}
                onChange={(e) => {
                  const val = e.target.value;
                  if (Number(val) < 1) {
                    setCount(1);
                  } else if (Number(val) < item?.stockCnt) {
                    if (/^\d*$/.test(val)) {
                      setCount(Number(val));
                    }
                  } else {
                    setTimeout(() => {
                      openModal({
                        text: localeText(
                          LANGUAGES.INFO_MSG.MAXIMUM_ORDER_COUNT,
                          {
                            key: '@COUNT@',
                            value: utils.parseAmount(item?.stockCnt),
                          },
                        ),
                      });
                    }, 200);
                    setCount(Number(item?.stockCnt));
                  }
                }}
                border={0}
                textAlign="center"
                color="#485766"
                fontSize="1rem"
                fontWeight={400}
                lineHeight="1.75rem"
                variant="unstyled"
                px={0}
              />

              <Box
                w="1.25rem"
                h="1.25rem"
                cursor="pointer"
                onClick={() => {
                  if (isSoldOut) {
                    setTimeout(() => {
                      openModal({
                        text: localeText(LANGUAGES.INFO_MSG.PRODUCT_OUT_STOCK),
                      });
                    }, 200);
                    return;
                  }
                  increment(item);
                }}
              >
                <CustomIcon name="plus" color="#7895B2" />
              </Box>
            </HStack>
          </Box>

          <Text
            w={'12.5rem'}
            textAlign={'center'}
            color={'#485766'}
            fontSize="18px"
            fontWeight={500}
            lineHeight="31.5px"
          >
            {utils.handleGetTotalPrice(item)}
          </Text>

          <Box w="32px" h="32px" position="relative">
            <Box
              w={'2rem'}
              h={'2rem'}
              cursor={'pointer'}
              onClick={() => {
                onClickDelete(item);
              }}
            >
              <CustomIcon
                w={'100%'}
                h={'100%'}
                name={'close'}
                color={'#7895B2'}
              />
            </Box>
          </Box>
        </HStack>
      </Box>
    </Flex>
  );
};

export default CartListCard;

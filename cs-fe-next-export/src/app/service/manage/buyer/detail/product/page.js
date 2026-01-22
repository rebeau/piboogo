'use client';

import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import { LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Img,
  Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import ContentDetailHeader from '@/components/layout/header/ContentDetailHeader';

const SellerDetailProductPage = () => {
  // const { category } = useParams();
  const router = useRouter();
  const { localeText } = useLocale();
  const [searchBy, setSearchBy] = useState(null);

  return (
    <Box
      w={'100%'}
      h={'100%'}
      py={'1.25rem'}
      overflowY={'auto'}
      className={'no-scroll'}
    >
      <VStack
        spacing={'1.25rem'}
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
      >
        <Box w={'72.75rem'}>
          <ContentDetailHeader
            title={localeText(LANGUAGES.COMMON.BACK_PREVIOUS)}
          />
        </Box>
        <Box w={'72.75rem'}>
          <HStack
            spacing={'1.25rem'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
          >
            <Box w={'43.25rem'}>
              <VStack spacing={'2.5rem'}>
                <Box w={'100%'}>
                  <VStack spacing={'1rem'}>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.STATUS)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.ON_SALE)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(
                              LANGUAGES.PRODUCTS.AFFILIATE_PROMOTIONS,
                            )}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            Best seller
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.PRODUCT_NAME)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.BRAND_NAME)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.BRAND_NAME)}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.MOCRA_FDA_APPROVED)}
                          </Text>
                        </Box>
                        <Center
                          px={'1rem'}
                          py={'0.5rem'}
                          borderRadius={'1.25rem'}
                          bg={'#D9E7EC'}
                        >
                          <Text
                            color={'#66809C'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.REGISTER)}
                          </Text>
                        </Center>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.CATEGORY)}
                          </Text>
                        </Box>
                        <Box>
                          <HStack spacing={'0.25rem'} alignItems={'center'}>
                            <Text
                              color={'#A7C3D2'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                              opacity={'0.7'}
                            >
                              Cosmetics
                            </Text>
                            <Center w={'1rem'} h={'1rem'}>
                              <Img h={'100%'} src={IconRight.src} />
                            </Center>
                            <Text
                              color={'#556A7E'}
                              fontSize={'0.9375rem'}
                              fontWeight={400}
                              lineHeight={'1.5rem'}
                            >
                              Lotion
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>

                    <Box w={'100%'}>
                      <HStack
                        alignItems={'flex-start'}
                        justifyContent={'flex-start'}
                        spacing={'2rem'}
                      >
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.OPTION)}
                          </Text>
                        </Box>
                        <Box>
                          <VStack spacing={'0.75rem'}>
                            <Box w={'100%'}>
                              <HStack spacing={'0.75rem'} alignItems={'center'}>
                                <Text
                                  color={'#66809C'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                  opacity={'0.7'}
                                >
                                  Capacity+1ml
                                </Text>

                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  +$10.00
                                </Text>
                              </HStack>
                            </Box>
                            <Box w={'100%'}>
                              <HStack spacing={'0.75rem'} alignItems={'center'}>
                                <Text
                                  color={'#66809C'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={400}
                                  lineHeight={'1.5rem'}
                                  opacity={'0.7'}
                                >
                                  Capacity+1ml
                                </Text>

                                <Text
                                  color={'#556A7E'}
                                  fontSize={'0.9375rem'}
                                  fontWeight={500}
                                  lineHeight={'1.5rem'}
                                >
                                  +$10.00
                                </Text>
                              </HStack>
                            </Box>
                          </VStack>
                        </Box>
                      </HStack>
                    </Box>
                    <Box w={'100%'}>
                      <HStack justifyContent={'flex-start'} spacing={'2rem'}>
                        <Box w={'12.5rem'}>
                          <Text
                            color={'#7895B2'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            {localeText(LANGUAGES.PRODUCTS.TYPE)}
                          </Text>
                        </Box>
                        <Box>
                          <Text
                            color={'#556A7E'}
                            fontSize={'0.9375rem'}
                            fontWeight={400}
                            lineHeight={'1.5rem'}
                          >
                            Dry
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
                <Divider borderTop={'1px solid #AEBDCA'} />
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.REPRESENTATIVE_IMAGE)}
                      </Text>
                    </Box>
                    <Box w={'100%'}>
                      <HStack spacing={'0.5rem'}>
                        <Center w={'6.25rem'} h={'6.25rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={''}
                          />
                        </Center>
                        <Center w={'6.25rem'} h={'6.25rem'}>
                          <ChakraImage
                            fallback={<DefaultSkeleton />}
                            w={'100%'}
                            h={'100%'}
                            objectFit={'cover'}
                            src={''}
                          />
                        </Center>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>
                <Box w={'100%'}>
                  <VStack spacing={'0.75rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#7895B2'}
                        fontSize={'0.9375rem'}
                        fontWeight={400}
                        lineHeight={'1.5rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.DETAILED_DESCRIPTION)}
                      </Text>
                    </Box>
                    <Box w={'100%'} h={'100%'}>
                      <Box w={'100%'} aspectRatio={1}>
                        <ChakraImage
                          fallback={<DefaultSkeleton />}
                          w={'100%'}
                          h={'100%'}
                          objectFit={'cover'}
                          src={''}
                        />
                      </Box>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
            <Box w={'28.25rem'}>
              <VStack spacing={'1.25rem'}>
                <Box
                  w={'100%'}
                  p={'1.25rem'}
                  border={'1px solid #AEBDCA'}
                  boxSizing={'border-box'}
                >
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        lineHeight={'1.96875rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.SALES_INFORMATION)}
                      </Text>
                    </Box>
                    <Divider borderTop={'1px solid #AEBDCA'} />
                    <Box w={'100%'}>
                      <VStack spacing={'0.75rem'}>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.MSRP)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                $3.00
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.SUPPLY_PRICE)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                $3.00
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(
                                  LANGUAGES.PRODUCTS.INVENTORY_QUANTITY,
                                )}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                34
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.SALES_QUANTITY)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                56
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.INTEREST)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                12
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.CART)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                43
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                <Box
                  w={'100%'}
                  p={'1.25rem'}
                  border={'1px solid #AEBDCA'}
                  boxSizing={'border-box'}
                >
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        lineHeight={'1.96875rem'}
                      >
                        {localeText(LANGUAGES.PRODUCTS.ABOUT_VENDORS)}
                      </Text>
                    </Box>
                    <Divider borderTop={'1px solid #AEBDCA'} />
                    <Box w={'100%'}>
                      <VStack spacing={'0.75rem'}>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.MERCHANT_BRANDS)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                Beauty
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.FEES)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                25%
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.SHIPPING_METHOD)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                {localeText(
                                  LANGUAGES.PRODUCTS.SYSTEM_OUTSOURING,
                                )}
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>

                <Box
                  w={'100%'}
                  p={'1.25rem'}
                  border={'1px solid #AEBDCA'}
                  boxSizing={'border-box'}
                >
                  <VStack spacing={'1.25rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        lineHeight={'1.96875rem'}
                      >
                        {localeText(
                          LANGUAGES.PRODUCTS.DISCOUNT_PER_UNIT_PURCHASE_FEATURE,
                        )}
                      </Text>
                    </Box>

                    <Divider borderTop={'1px solid #AEBDCA'} />

                    <Box w={'100%'}>
                      <VStack spacing={'0.75rem'}>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Box>
                              <Text
                                color={'#7895B2'}
                                fontSize={'0.9375rem'}
                                fontWeight={400}
                                lineHeight={'1.5rem'}
                              >
                                {localeText(LANGUAGES.PRODUCTS.CONDITIONS)}
                              </Text>
                            </Box>
                            <Box>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={400}
                                lineHeight={'1.75rem'}
                              >
                                10% off when you buy 10 or more
                              </Text>
                            </Box>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SellerDetailProductPage;

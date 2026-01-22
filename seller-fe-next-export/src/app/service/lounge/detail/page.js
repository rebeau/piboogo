'use client';

import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import ContentHeader from '@/components/custom/header/ContentHeader';
import { LANGUAGES } from '@/constants/lang';
import { CATEGORY, SELLER, SERVICE } from '@/constants/pageURL';
import useLocale from '@/hooks/useLocale';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Breadcrumb,
  Img,
  BreadcrumbItem,
  Select,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import { view } from 'framer-motion';
import { notFound, useParams, useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import IconRight from '@public/svgs/icon/right.svg';
import utils from '@/utils';
import { CustomIcon, DefaultPaginate } from '@/components';
import ContentDetailHeader from '@/components/custom/header/ContentDetailHeader';
import BannerPreview from '@/components/custom/banner/BannerPreview';

const PromotionsDetailPage = () => {
  // const { category } = useParams();
  const router = useRouter();
  const { localeText } = useLocale();
  const [searchBy, setSearchBy] = useState(null);

  const listComment = [
    { id: 1, comment: 'Good!', date: '2024823-8413', author: 'abc@gmail.com' },
    {
      id: 2,
      comment:
        'Our Marseille soap with olive\noil is made in a cauldron using the traditional “Marseillais” proc',
      date: '2024823-8413',
      author: 'abc@gmail.com',
    },
  ];

  const commentCard = useCallback((item, index) => {
    const handleDetail = (item) => {
      // return router.push(SERVICE.PRODUCTS.DETAIL);
    };

    const handleGetStatus = (status) => {
      if (status === 1) {
        return localeText(LANGUAGES.REVIEWS.WAITING);
      } else if (status === 2) {
        return localeText(LANGUAGES.REVIEWS.DONE);
      }
    };

    const handleOnOpenAnser = (item) => {
      console.log('handleOnOpenAnser');
      onOpenAnser();
    };

    return (
      <Box
        key={index}
        py={'1.25rem'}
        w={'100%'}
        borderTop={'1px solid #AEBDCA'}
        boxSizing={'border-box'}
      >
        <VStack spacing={'1.25rem'}>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'}>
              <Text
                color={'#7895B2'}
                fontSize={'0.875rem'}
                fontWeight={400}
                lineHeight={'1.4rem'}
              >
                {item.author}
              </Text>
              <Text
                color={'#7895B2'}
                fontSize={'0.875rem'}
                fontWeight={400}
                lineHeight={'1.4rem'}
              >
                {item.date}
              </Text>
            </HStack>
          </Box>
          <Box w={'100%'}>
            <HStack justifyContent={'space-between'} alignItems={'flex-start'}>
              <Text
                color={'#485766'}
                fontSize={'0.9375rem'}
                fontWeight={400}
                lineHeight={'1.5rem'}
                whiteSpace={'pre-wrap'}
              >
                {item.comment}
              </Text>

              <Box
                w={'1.5rem'}
                h={'1.5rem'}
                cursor={'pointer'}
                onClick={() => {
                  console.log('asc');
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
        </VStack>
      </Box>
    );
  });

  return (
    <Box
      w={'100%'}
      h={'100%'}
      py={'1.25rem'}
      overflowY={'auto'}
      className="no-scroll"
    >
      <VStack
        spacing={'1.25rem'}
        alignItems={'flex-start'}
        justifyContent={'flex-start'}
      >
        <Box w={'72.75rem'}>
          <ContentDetailHeader>
            <Box>
              <HStack spacing={'0.75rem'}>
                <Box minW={'7rem'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      router.replace(SERVICE.PROMOTIONS.MODIFY);
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
                <Box minW={'7rem'} h={'3rem'}>
                  <Button
                    onClick={() => {
                      // handleUploadFile('logo');
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
              </HStack>
            </Box>
          </ContentDetailHeader>
        </Box>
        <Box w={'72.75rem'}>
          <VStack spacing={'2.5rem'}>
            <Box
              w={'100%'}
              borderTop={'1px solid #576076'}
              borderBottom={'1px solid #AEBDCA'}
              boxSizing={'border-box'}
              py={'1.25rem'}
            >
              <VStack
                w={'100%'}
                h={'100%'}
                justifyContent={'center'}
                alignItems={'flex-start'}
                spacing={'1.25rem'}
                px={'1rem'}
              >
                <Box>
                  <Text
                    color={'#485766'}
                    fontSize={'1.5rem'}
                    fontWeight={500}
                    lineHeight={'2.475rem'}
                  >
                    Web/App Service Planner
                  </Text>
                </Box>
                <Box w={'100%'}>
                  <HStack justifyContent={'space-between'}>
                    <Box>
                      <HStack spacing={'1.25rem'} alignItems={'center'}>
                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.LOUNGE.AUTHOR_ID)}
                            </Text>
                            <Text
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              jjw0921@gmail.com
                            </Text>
                          </HStack>
                        </Box>

                        <Divider
                          w={0}
                          h={'1.25rem'}
                          border={'1px solid #AEBDCA'}
                        />

                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.LOUNGE.REGISTRATION_DATE)}
                            </Text>
                            <Text
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              jjw0921@2024823-8413
                            </Text>
                          </HStack>
                        </Box>

                        <Divider
                          w={0}
                          h={'1.25rem'}
                          border={'1px solid #AEBDCA'}
                        />

                        <Box w={'max-content'}>
                          <HStack spacing={'1.25rem'}>
                            <Text
                              color={'#7895B2'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              {localeText(LANGUAGES.LOUNGE.RELATED_LINK)}
                            </Text>
                            <Text
                              color={'#485766'}
                              fontSize={'0.9375rem'}
                              fontFamily={'Poppins'}
                              fontWeight={'400'}
                              lineHeight={'1.5rem'}
                            >
                              https://www.piboogo.net
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>
                    <Box>
                      <Center
                        px={'1rem'}
                        py={'0.5rem'}
                        bg={'#E8DFCA'}
                        borderRadius={'1.25rem'}
                      >
                        <Text
                          color={'#A87C4E'}
                          fontSize={'0.875rem'}
                          fontWeight={500}
                          lineHeight={'1.4rem'}
                        >
                          128 {localeText(LANGUAGES.LOUNGE.VIEWS)}
                        </Text>
                      </Center>
                    </Box>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'} minH={'5rem'} h={'8rem'}>
              <Box minW={'5rem'} minH={'5rem'} w={'8rem'} h={'8rem'}>
                <ChakraImage
                  fallback={<DefaultSkeleton />}
                  minW={'5rem'}
                  minH={'5rem'}
                  w={'100%'}
                  h={'100%'}
                  src={'https://via.placeholder.com/100x100'}
                />
              </Box>
            </Box>

            <Box w={'100%'}>
              <Text
                color={'#485766'}
                fontSize={'1.125rem'}
                fontWeight={400}
                lineHeight={'1.96875rem'}
                whiteSpace={'pre-wrap'}
              >
                {`Our Marseille soap with olive oil is made in a cauldron using the traditional “Marseillais” process.\nAfter 3 years of research, we were able to improve our manufacturing process to make it more water and energy efficient, while improving the final quality of our Marseille soap.The result ? A process patented by the INPI since 2019, authenticity preserved and the use of 4 times less water and 7 times less energy compared to the old process.And a premium hypoallergenic Marseille soap, 100% French, made in Salon-de-Provence in the south of France.`}
              </Text>
            </Box>

            <Box w={'100%'}>
              <HStack spacing={'1.25rem'}>
                <Center w={'5rem'} h={'5rem'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    src={'https://via.placeholder.com/100x100'}
                  />
                </Center>
                <Center w={'5rem'} h={'5rem'}>
                  <ChakraImage
                    fallback={<DefaultSkeleton />}
                    w={'100%'}
                    h={'100%'}
                    src={'https://via.placeholder.com/100x100'}
                  />
                </Center>
              </HStack>
            </Box>

            <Divider borderTop={'1px solid #AEBDCA'} />

            <Box w={'100%'}>
              <VStack spacing={'0.5rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#485766'}
                    fontSize={'1.25rem'}
                    fontWeight={500}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.LOUNGE.COMMNET)}
                  </Text>
                </Box>
                <Box
                  w={'100%'}
                  h={'8.75rem'}
                  border={'1px solid #9CADBE'}
                  borderRadius={'0.25rem'}
                  boxSizing={'border-box'}
                >
                  <Textarea
                    py={'0.88rem'}
                    px={'1.25rem'}
                    w={'100%'}
                    h={'100%'}
                    resize={'none'}
                    placeholder={localeText(
                      LANGUAGES.LOUNGE.PH_ENTER_YOUR_CONTENT,
                    )}
                  ></Textarea>
                </Box>
              </VStack>
            </Box>

            <Box w={'100%'} borderBottom={'1px solid ##AEBDCA'}>
              <VStack spacing={0}>
                {listComment.map((item, index) => {
                  return commentCard(item, index);
                })}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default PromotionsDetailPage;

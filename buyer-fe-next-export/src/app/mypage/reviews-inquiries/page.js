'use client';

import { DefaultPaginate } from '@/components';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import StarRating from '@/components/common/StarRating';
import ContentBR from '@/components/custom/ContentBR';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import productQuestionApi from '@/services/productQuestionApi';
import productReviewApi from '@/services/productReviewApi';
import utils from '@/utils';
import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  AccordionPanel,
  AccordionButton,
  AccordionItem,
  Accordion,
  Divider,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

const ReviewsInquiriesPage = (props) => {
  const { isMobile, clampW } = useDevice();
  const router = useRouter();
  const { lang, localeText } = useLocale();

  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [contentNumReview, setContentNumReview] = useState(5);
  const [totalCountReview, setTotalCountReview] = useState(0);

  const [currentPageInquiries, setCurrentPageInquiries] = useState(1);
  const [contentNumInquiries, setContentNumInquiries] = useState(5);
  const [totalCountInquiries, setTotalCountInquiries] = useState(0);

  const [listReview, setListReview] = useState([]);
  const [listInquiries, setListInquiries] = useState([]);

  useEffect(() => {
    handleGetListReview();
  }, [currentPageReview]);

  useEffect(() => {
    handleGetListInquiries();
  }, [currentPageInquiries]);

  const handleGetListReview = async () => {
    const param = {
      pageNum: currentPageReview,
      contentNum: contentNumReview,
    };

    const result = await productReviewApi.getListProductReviewOwn(param);

    if (result?.errorCode === SUCCESS) {
      setListReview(result.datas);
      setTotalCountReview(result.totalCount);
    } else {
      setListReview([]);
      setTotalCountReview(0);
    }
  };

  const reviewCard = useCallback((item, index) => {
    const name = item?.name;
    const content = item?.content;
    const brandName = item?.brandName;
    const brandLogoS3Url = item?.brandLogoS3Url;
    const ordersProductId = item?.ordersProductId;
    const rating = item?.rating;
    const createdAt = item?.createdAt;
    const productReviewId = item?.productReviewId;
    const answer = item?.answer || '';
    const firstImageS3Url = item?.firstImageS3Url;
    const firstImageS3FileName = item?.firstImageS3FileName;
    const secondImageS3Url = item?.secondImageS3Url;
    const secondImageS3FileName = item?.secondImageS3FileName;
    const thirdImageS3Url = item?.thirdImageS3Url;
    const thirdImageS3FileName = item?.thirdImageS3FileName;
    const buyerUserName = item?.buyerUserName;
    const productOptions = item?.productOptions || [];
    let optionName = '';
    if (productOptions.length > 0) {
      optionName = productOptions[0].name;
    }

    return isMobile(true) ? (
      <Box
        key={index}
        w={'100%'}
        py={'1.5rem'}
        borderBottom={'1px solid #AEBDCA'}
      >
        <VStack spacing={'1rem'}>
          <Box w={'100%'}>
            <VStack spacing={'0.25rem'}>
              <Box w={'100%'}>
                <HStack spacing={'0.75rem'}>
                  <Box w={'2rem'} h={'2rem'}>
                    <ChakraImage
                      fallback={<DefaultSkeleton borderRadius={'50%'} />}
                      w={'100%'}
                      h={'100%'}
                      objectFit={'cover'}
                      borderRadius={'50%'}
                      src={brandLogoS3Url}
                    />
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight="500"
                      lineHeight="1.97rem"
                    >
                      {brandName}
                    </Text>
                  </Box>
                  <Box>
                    <StarRating
                      initialRating={rating}
                      w={'1.5rem'}
                      h={'1.5rem'}
                    />
                  </Box>
                </HStack>
              </Box>
              {createdAt && (
                <Box w={'100%'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'170%'}
                  >
                    {utils.parseDateByCountryCode(createdAt, lang, true)}
                  </Text>
                </Box>
              )}
              {optionName && (
                <Box w={'100%'}>
                  <Box w={'100%'} key={index}>
                    <Text
                      color={'#7895B2'}
                      fontSize={'1rem'}
                      fontWeight={400}
                      lineHeight={'1.75rem'}
                    >
                      {`${localeText(LANGUAGES.COMMON.OPTION)} : ${optionName}`}
                    </Text>
                  </Box>
                </Box>
              )}
            </VStack>
          </Box>
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'}>
              <Box alignSelf={'flex-start'}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.875, 1.125)}
                  fontWeight={400}
                >
                  {content}
                </Text>
              </Box>
              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  {firstImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={firstImageS3Url}
                      />
                    </Center>
                  )}
                  {secondImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={secondImageS3Url}
                      />
                    </Center>
                  )}
                  {thirdImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={thirdImageS3Url}
                      />
                    </Center>
                  )}
                </HStack>
              </Box>
            </VStack>
          </Box>
          {answer && (
            <>
              <Divider borderBottom={'1px solid #AEBDCA'} />
              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  <Box w={'4.18rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.COMMON.ANSWER)}
                    </Text>
                  </Box>
                  <Text
                    color={'#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                    whiteSpace={'pre-wrap'}
                  >
                    {answer}
                  </Text>
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </Box>
    ) : (
      <Box
        key={index}
        w={'100%'}
        py={'1.5rem'}
        borderBottom={'1px solid #AEBDCA'}
      >
        <VStack spacing={'1rem'}>
          <Box w={'100%'}>
            <VStack spacing={'0.25rem'}>
              <Box w={'100%'}>
                <HStack justifyContent={'space-between'}>
                  <Box>
                    <HStack spacing={'0.75rem'}>
                      <Box w={'2rem'} h={'2rem'}>
                        <ChakraImage
                          fallback={<DefaultSkeleton borderRadius={'50%'} />}
                          w={'100%'}
                          h={'100%'}
                          borderRadius={'50%'}
                          src={brandLogoS3Url}
                        />
                      </Box>
                      <Box>
                        <HStack>
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.97rem'}
                          >
                            {brandName}
                          </Text>
                          <Text
                            color={'#485766'}
                            fontSize={'1rem'}
                            fontWeight={400}
                            lineHeight={'1.97rem'}
                          >
                            {`>`}
                          </Text>
                          <Text
                            color={'#485766'}
                            fontSize={'1.125rem'}
                            fontWeight={500}
                            lineHeight={'1.97rem'}
                          >
                            {name}
                          </Text>
                        </HStack>
                      </Box>
                      <Box>
                        <StarRating
                          initialRating={rating}
                          w={'1.5rem'}
                          h={'1.5rem'}
                        />
                      </Box>
                    </HStack>
                  </Box>
                  <Box>
                    <Text
                      color={'#7895B2'}
                      fontSize={'1.125rem'}
                      fontWeight={500}
                      lineHeight={'1.97rem'}
                    >
                      {utils.parseDateByCountryCode(createdAt, lang)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
              {optionName && (
                <Box w={'100%'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {`${localeText(LANGUAGES.COMMON.OPTION)} : ${optionName}`}
                  </Text>
                </Box>
              )}
            </VStack>
          </Box>
          <Box w={'100%'}>
            <HStack spacing={'1.5rem'} justifyContent={'space-between'}>
              <Box w={'calc(100% - 6.25rem)'} alignSelf={'flex-start'}>
                <Text
                  color={'#485766'}
                  fontSize={'1.125rem'}
                  fontWeight={400}
                  lineHeight={'1.97rem'}
                >
                  {content}
                </Text>
              </Box>
              <Box>
                <HStack spacing={'1.25rem'}>
                  {firstImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        src={firstImageS3Url}
                      />
                    </Center>
                  )}
                  {secondImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        src={secondImageS3Url}
                      />
                    </Center>
                  )}
                  {thirdImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        src={thirdImageS3Url}
                      />
                    </Center>
                  )}
                </HStack>
              </Box>
            </HStack>
          </Box>
          {answer && (
            <>
              <Divider borderBottom={'1px solid #AEBDCA'} />
              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  <Box w={'4.18rem'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                      whiteSpace={'pre-wrap'}
                    >
                      {localeText(LANGUAGES.COMMON.ANSWER)}
                    </Text>
                  </Box>
                  <Text
                    color={'#556A7E'}
                    fontSize={'1rem'}
                    fontWeight={500}
                    lineHeight={'1.75rem'}
                    whiteSpace={'pre-wrap'}
                  >
                    {answer}
                  </Text>
                </HStack>
              </Box>
            </>
          )}
        </VStack>
      </Box>
    );
  });

  const handleGetListInquiries = async () => {
    const param = {
      pageNum: currentPageInquiries,
      contentNum: contentNumInquiries,
    };

    const result = await productQuestionApi.getListProductQuestionOwn(param);

    if (result?.errorCode === SUCCESS) {
      setListInquiries(result.datas);
      setTotalCountInquiries(result.totalCount);
    } else {
      setListInquiries([]);
      setTotalCountInquiries(0);
    }
  };

  const inquiriesCard = useCallback((item, index) => {
    const status = item?.status;
    const question = item?.question;
    const createdAt = item?.createdAt;
    const productQuestionId = item?.productQuestionId;
    const answer = item?.answer;
    const sellerBrandName = item?.sellerBrandName;
    const buyerName = item?.buyerName;

    return isMobile(true) ? (
      <Box w={'100%'} key={index}>
        <Accordion defaultIndex={[index === 0 ? 0 : null]} allowMultiple>
          <AccordionItem
            borderTop={0}
            borderBottom={'1px solid #AEBDCA'}
            //
          >
            <AccordionButton p={0}>
              <Box w={'100%'} px={'1.25rem'} py={'1rem'}>
                <HStack spacing={'0.75rem'}>
                  <Box w={'12.5rem'} minW={'12.5rem'} maxW={'12.5rem'}>
                    <Text
                      textAlign={'left'}
                      fontSize={clampW(0.8125, 1.125)}
                      fontWeight={400}
                      color={'#556A7E'}
                    >
                      {status === 1
                        ? localeText(LANGUAGES.STATUS.PROCESSING_QUEUE)
                        : localeText(LANGUAGES.STATUS.ANSWER_COMPLETED)}
                    </Text>
                  </Box>
                  <Box
                    minW={clampW(12.1875, 30)}
                    w={clampW(12.1875, 41.25)}
                    maxW={clampW(12.1875, 41.25)}
                  >
                    <Text
                      w={'100%'}
                      fontSize={clampW(0.8125, 1.125)}
                      fontWeight={400}
                      color={'#485766'}
                      whiteSpace={'nowrap'}
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                    >
                      {question}
                    </Text>
                  </Box>
                  <Box minW={'16.5rem'} w={'16.5rem'} maxW={'16.5rem'}>
                    <Text
                      textAlign={'center'}
                      fontSize={clampW(0.8125, 1.125)}
                      fontWeight={400}
                      color={'#485766'}
                    >
                      {buyerName}
                    </Text>
                  </Box>
                  <Box minW={'12.5rem'} w={'12.5rem'} maxW={'12.5rem'}>
                    <Text
                      textAlign={'right'}
                      fontSize={clampW(0.8125, 1.125)}
                      fontWeight={400}
                      color={'#485766'}
                    >
                      {utils.parseDateByCountryCode(createdAt, lang)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </AccordionButton>
            <AccordionPanel p={'2rem'} bg={'#8c644212'}>
              <VStack spacing={'2rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#66809C'}
                    fontSize={clampW(0.8125, 1)}
                    fontWeight={400}
                    lineHeight={'175%'}
                  >
                    {question}
                  </Text>
                </Box>

                {answer && (
                  <>
                    <Divider borderBottom={'1px solid #AEBDCA'} />

                    <Box w={'100%'}>
                      <VStack spacing={'1.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#556A7E'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {sellerBrandName}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#556A7E'}
                            fontSize={clampW(0.8125, 1)}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {answer}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    ) : (
      <Box w={'100%'} key={index}>
        <Accordion defaultIndex={[index === 0 ? 0 : null]} allowMultiple>
          <AccordionItem
            borderTop={0}
            borderBottom={'1px solid #AEBDCA'}
            //
          >
            <AccordionButton p={0}>
              <Box w={'100%'} px={'1.25rem'} py={'1rem'}>
                <HStack spacing={'0.75rem'}>
                  <Box w={'12.5rem'}>
                    <Text
                      textAlign={'left'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#556A7E'}
                    >
                      {item.status === 1
                        ? localeText(LANGUAGES.STATUS.PROCESSING_QUEUE)
                        : localeText(LANGUAGES.STATUS.ANSWER_COMPLETED)}
                    </Text>
                  </Box>
                  <Box minW={'30rem'} w={'41.25rem'} maxW={'41.25rem'}>
                    <Text
                      w={'100%'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                      whiteSpace={'nowrap'}
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                    >
                      {question}
                    </Text>
                  </Box>
                  <Box w={'16.5rem'}>
                    <Text
                      textAlign={'center'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                    >
                      {buyerName}
                    </Text>
                  </Box>
                  <Box w={'12.5rem'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                    >
                      {utils.parseDateByCountryCode(createdAt, lang)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </AccordionButton>
            <AccordionPanel p={'2rem'} bg={'#8c644212'}>
              <VStack spacing={'2rem'}>
                <Box w={'100%'}>
                  <Text
                    color={'#66809C'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {question}
                  </Text>
                </Box>

                {answer && (
                  <>
                    <Divider borderBottom={'1px solid #AEBDCA'} />

                    <Box w={'100%'}>
                      <VStack spacing={'1.25rem'}>
                        <Box w={'100%'}>
                          <Text
                            color={'#556A7E'}
                            fontSize={'1rem'}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {sellerBrandName}
                          </Text>
                        </Box>
                        <Box w={'100%'}>
                          <Text
                            color={'#556A7E'}
                            fontSize={clampW(0.8125, 1)}
                            fontWeight={500}
                            lineHeight={'1.75rem'}
                          >
                            {answer}
                          </Text>
                        </Box>
                      </VStack>
                    </Box>
                  </>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    );
  });

  const [expandedIndices, setExpandedIndices] = useState([0]);

  const toggleRow = (index) => {
    if (expandedIndices.includes(index)) {
      // 이미 열려있으면 닫기 (배열에서 제거)
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      // 열려있지 않으면 추가
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  return isMobile(true) ? (
    <Box w={'100%'}>
      <VStack spacing={'1.5rem'}>
        <Box w={'100%'}>
          <Box w={'100%'}>
            <Text
              textAlign={'left'}
              color={'#485766'}
              fontSize={'1.5rem'}
              fontWeight={500}
            >
              {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.REVIEWS)}
            </Text>
          </Box>
          <ContentBR h={'1.5rem'} />
          <Box w={'100%'}>
            <VStack spacing={'1.5rem'}>
              <Box w={'100%'} borderTop={'1px solid #73829D'}>
                <VStack w={'100%'} spacing={0}>
                  {listReview.map((item, index) => {
                    return reviewCard(item, index);
                  })}
                  {listReview.length === 0 && (
                    <Center w={'100%'} h={'10rem'}>
                      <Text
                        fontSize={'1.5rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                      >
                        {localeText(LANGUAGES.INFO_MSG.NO_POST)}
                      </Text>
                    </Center>
                  )}
                </VStack>
              </Box>
            </VStack>
          </Box>

          <ContentBR h={'1.5rem'} />

          <Center w={'100%'}>
            <DefaultPaginate
              currentPage={currentPageReview}
              setCurrentPage={setCurrentPageReview}
              totalCount={totalCountReview}
              contentNum={contentNumReview}
            />
          </Center>
        </Box>

        <Box w={'100%'} overflowX={'auto'}>
          <Box w={'65rem'}>
            <Box w={'100%'}>
              <Text
                textAlign={'left'}
                color={'#485766'}
                fontSize={'1.5rem'}
                fontWeight={500}
                lineHeight={'2.475rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.INQUIRIES)}
              </Text>
            </Box>

            <ContentBR h={'1.5rem'} />

            <Box w={'100%'}>
              <VStack spacing={0}>
                {/* header */}
                <Box
                  borderTop={'1px solid #73829D'}
                  borderBottom={'1px solid #AEBDCA'}
                  w={'100%'}
                  px={'1.25rem'}
                  py={'1rem'}
                >
                  <HStack spacing={'0.75rem'}>
                    <Box minW={'12.5rem'} w={'12.5rem'} maxW={'12.5rem'}>
                      <Text
                        textAlign={'left'}
                        fontSize={clampW(0.8125, 1)}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.STATUS)}
                      </Text>
                    </Box>
                    <Box
                      minW={clampW(12.1875, 30)}
                      w={clampW(12.1875, 41.25)}
                      maxW={clampW(12.1875, 41.25)}
                    >
                      <Text
                        textAlign={'center'}
                        fontSize={clampW(0.8125, 1)}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(
                          LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.INQUIRIES,
                        )}
                      </Text>
                    </Box>
                    <Box minW={'16.5rem'} w={'16.5rem'} maxW={'16.5rem'}>
                      <Text
                        textAlign={'center'}
                        fontSize={clampW(0.8125, 1)}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.AUTHOR)}
                      </Text>
                    </Box>
                    <Box minW={'12.5rem'} w={'12.5rem'} maxW={'12.5rem'}>
                      <Text
                        textAlign={'right'}
                        fontSize={clampW(0.8125, 1)}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(
                          LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.REGISTRATION_DATE,
                        )}
                      </Text>
                    </Box>
                  </HStack>
                </Box>

                {/* body */}
                <Box w={'100%'}>
                  <VStack spacing={0}>
                    {listInquiries.map((inquiries, index) => {
                      return inquiriesCard(inquiries, index);
                    })}
                    {listInquiries.length === 0 && (
                      <Center w={'100%'} h={'10rem'}>
                        <Text
                          fontSize={'1.5rem'}
                          fontWeight={500}
                          lineHeight={'1.75rem'}
                        >
                          {localeText(LANGUAGES.INFO_MSG.NO_POST)}
                        </Text>
                      </Center>
                    )}
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'1.5rem'} />

            <Center w={'100%'}>
              <DefaultPaginate
                currentPage={currentPageInquiries}
                setCurrentPage={setCurrentPageInquiries}
                totalCount={totalCountInquiries}
                contentNum={contentNumInquiries}
              />
            </Center>
          </Box>
        </Box>
      </VStack>
    </Box>
  ) : (
    <Box w={'100%'}>
      <VStack spacing={0}>
        <Box w={'100%'} py={'5rem'} pb={'3.75rem'}>
          <Text
            textAlign={'left'}
            color={'#485766'}
            fontSize={'1.5rem'}
            fontWeight={500}
            lineHeight={'2.475rem'}
          >
            {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.REVIEWS)}
          </Text>
        </Box>

        <Box w={'100%'}>
          <VStack spacing={'1.5rem'}>
            <Box w={'100%'} borderTop={'1px solid #73829D'}>
              <VStack w={'100%'} spacing={0}>
                {listReview.map((item, index) => {
                  return reviewCard(item, index);
                })}
                {listReview.length === 0 && (
                  <Center w={'100%'} h={'10rem'}>
                    <Text
                      fontSize={'1.5rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {localeText(LANGUAGES.INFO_MSG.NO_POST)}
                    </Text>
                  </Center>
                )}
              </VStack>
            </Box>
          </VStack>
        </Box>

        <ContentBR h={'2.5rem'} />

        <Center w={'100%'}>
          <DefaultPaginate
            currentPage={currentPageReview}
            setCurrentPage={setCurrentPageReview}
            totalCount={totalCountReview}
            contentNum={contentNumReview}
          />
        </Center>

        <Box w={'100%'}>
          <Box w={'100%'} py={'5rem'} pb={'3.75rem'}>
            <Text
              textAlign={'left'}
              color={'#485766'}
              fontSize={'1.5rem'}
              fontWeight={500}
              lineHeight={'2.475rem'}
            >
              {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.INQUIRIES)}
            </Text>
          </Box>
          <Box w={'100%'}>
            <TableContainer overflowX={'auto'}>
              <Table>
                <Thead>
                  <Tr
                    borderTop={'1px solid #000'}
                    borderBottom={'1px solid #AEBDCA'}
                  >
                    <Th py={'1.25rem'}>
                      <Text
                        textTransform={'none'}
                        textAlign={'left'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.STATUS)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textTransform={'none'}
                        textAlign={'center'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(
                          LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.INQUIRIES,
                        )}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textTransform={'none'}
                        textAlign={'center'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.AUTHOR)}
                      </Text>
                    </Th>
                    <Th>
                      <Text
                        textTransform={'none'}
                        textAlign={'right'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(
                          LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.REGISTRATION_DATE,
                        )}
                      </Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {listInquiries.map((item, index) => {
                    const status = item?.status;
                    const question = item?.question;
                    const createdAt = item?.createdAt;
                    const productQuestionId = item?.productQuestionId;
                    const answer = item?.answer;
                    const sellerBrandName = item?.sellerBrandName;
                    const buyerName = item?.buyerName;
                    return (
                      <React.Fragment key={productQuestionId}>
                        <Tr
                          borderBottom={'1px solid #AEBDCA'}
                          onClick={() => toggleRow(index)}
                          cursor="pointer"
                          /*
                          bg={
                            expandedIndices.includes(index)
                              ? '#f0f4f8'
                              : 'transparent'
                          }
                          */
                          _hover={{ bg: '#8c644208' }}
                        >
                          <Td
                            textAlign={'left'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            color={'#556A7E'}
                          >
                            {status === 1
                              ? localeText(LANGUAGES.STATUS.PROCESSING_QUEUE)
                              : localeText(LANGUAGES.STATUS.ANSWER_COMPLETED)}
                          </Td>
                          <Td
                            w={'100%'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            color={'#485766'}
                            whiteSpace={'nowrap'}
                            overflow={'hidden'}
                            textOverflow={'ellipsis'}
                            maxW="400px"
                          >
                            {question}
                          </Td>
                          <Td
                            textAlign={'center'}
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            color={'#485766'}
                          >
                            {buyerName}
                          </Td>
                          <Td
                            textAlign="right"
                            fontSize={'1.125rem'}
                            fontWeight={400}
                            color={'#485766'}
                          >
                            {utils.parseDateByCountryCode(createdAt, lang)}
                          </Td>
                        </Tr>

                        {expandedIndices.includes(index) && (
                          <>
                            <Tr
                              borderBottom={'1px solid #AEBDCA'}
                              bg="#8c644212"
                            >
                              <Td colSpan={4}>
                                <Text
                                  color={'#66809C'}
                                  fontSize={'1rem'}
                                  fontWeight={400}
                                  lineHeight={'1.75rem'}
                                  whiteSpace={'pre-wrap'}
                                  overflow={'hidden'}
                                  textOverflow={'ellipsis'}
                                >
                                  {question}
                                </Text>
                              </Td>
                            </Tr>
                            {answer && (
                              <Tr bg="#8c644212">
                                <Td
                                  colSpan={4}
                                  color={'#556A7E'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {sellerBrandName}
                                </Td>
                              </Tr>
                            )}
                            {answer && (
                              <Tr
                                bg="#8c644212"
                                borderBottom={'1px solid #AEBDCA'}
                              >
                                <Td
                                  colSpan={4}
                                  color={'#556A7E'}
                                  fontSize={clampW(0.8125, 1)}
                                  fontWeight={500}
                                  lineHeight={'1.75rem'}
                                >
                                  {answer}
                                </Td>
                              </Tr>
                            )}
                          </>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <ContentBR h={'2.5rem'} />

          <Center w={'100%'}>
            <DefaultPaginate
              currentPage={currentPageInquiries}
              setCurrentPage={setCurrentPageInquiries}
              totalCount={totalCountInquiries}
              contentNum={contentNumInquiries}
            />
          </Center>
        </Box>
      </VStack>
    </Box>
  );
};

export default ReviewsInquiriesPage;

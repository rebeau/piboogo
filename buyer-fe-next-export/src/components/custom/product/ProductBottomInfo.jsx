'use client';

import {
  Box,
  Center,
  HStack,
  Image as ChakraImage,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Textarea,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import { useCallback, useEffect, useState } from 'react';
import { CustomIcon, DefaultPaginate } from '@/components';
import StarRating from '@/components/common/StarRating';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import DefaultSkeleton from '@/components/common/DefaultSkeleton';
import utils from '@/utils';
import { NO_DATA_ERROR, SUCCESS } from '@/constants/errorCode';
import productQuestionApi from '@/services/productQuestionApi';
import productReviewApi from '@/services/productReviewApi';
import CustomCheckbox from '@/components/common/checkbox/CustomCheckBox';
import ContentBR from '../ContentBR';
import useDevice from '@/hooks/useDevice';
import Footer from '@/components/common/custom/Footer';
import ProductInfoTab from './ProductInfoTab';
import useModal from '@/hooks/useModal';

const ProductBottomInfo = (props) => {
  const { openModal } = useModal();
  const { isMobile, clampW } = useDevice();
  const { productInfo, setProductInfo, productImageList = [] } = props;

  const {
    isOpen: isOpenInquiries,
    onOpen: onOpenInquiries,
    onClose: onCloseInquiries,
  } = useDisclosure();

  useEffect(() => {
    if (isOpenInquiries) {
      setQuestion('');
      setIsSecret(false);
    }
  }, [isOpenInquiries]);

  const [currentPageReview, setCurrentPageReview] = useState(1);
  const [contentNumReview, setContentNumReview] = useState(5);
  const [totalCountReview, setTotalCountReview] = useState(1);

  const [currentPageInquiries, setCurrentPageInquiries] = useState(1);
  const [contentNumInquiries, setContentNumInquiries] = useState(5);
  const [totalCountInquiries, setTotalCountInquiries] = useState(1);

  const { lang, localeText } = useLocale();

  const [tabIndex, setTabIndex] = useState(0);

  const [listReview, setListReview] = useState([]);
  const [listInquiries, setListInquiries] = useState([]);

  const [question, setQuestion] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  useEffect(() => {
    if (productInfo?.productId) {
      handleGetListReview();
      handleGetListInquiries();
    }
  }, [productInfo]);

  useEffect(() => {
    setProductInfo({
      ...productInfo,
      totalReviewCnt: totalCountReview || 0,
    });
  }, [totalCountReview]);

  const handleGetListReview = async () => {
    const param = {
      pageNum: currentPageReview,
      contentNum: contentNumReview,
      productId: productInfo.productId,
    };
    const result = await productReviewApi.getListProductReview(param);
    if (result?.errorCode === SUCCESS) {
      setListReview(result.datas);
      setTotalCountReview(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListReview([]);
      setTotalCountReview(0);
    }
  };

  const handleGetListInquiries = async () => {
    const param = {
      pageNum: currentPageInquiries,
      contentNum: contentNumInquiries,
      productId: productInfo.productId,
    };
    const result = await productQuestionApi.getListProductQuestion(param);
    if (result?.errorCode === SUCCESS) {
      setListInquiries(result.datas);
      setTotalCountInquiries(result.totalCount);
    } else if (result?.errorCode === NO_DATA_ERROR) {
      setListInquiries([]);
      setTotalCountInquiries(0);
    }
  };

  const handleActionInquiries = useCallback(async () => {
    const param = {
      productId: productInfo.productId,
      secretFlag: isSecret === true ? 2 : 1,
      question: question,
    };

    const result = await productQuestionApi.postProductQuestion(param);
    if (result?.errorCode === SUCCESS) {
      openModal({
        text: result.message,
        onAgree: () => {
          onCloseInquiries();
          handleGetListInquiries();
        },
      });
    } else {
      //
    }
  });

  const reviewCard = useCallback((item, index) => {
    const name = item?.name || '';
    const content = item?.content || '';
    const ordersProductId = item?.ordersProductId || '';
    const rating = item?.rating || '';
    const profileS3Url = item?.profileS3Url || '';
    const createdAt = item?.createdAt || '';
    const productReviewId = item?.productReviewId || '';
    const answer = item?.answer || '';
    const firstImageS3Url = item?.firstImageS3Url || '';
    const firstImageS3FileName = item?.firstImageS3FileName || '';
    const secondImageS3Url = item?.secondImageS3Url || '';
    const secondImageS3FileName = item?.secondImageS3FileName || '';
    const thirdImageS3Url = item?.thirdImageS3Url || '';
    const thirdImageS3FileName = item?.thirdImageS3FileName || '';
    const productOptions = item?.productOptions || [];
    let productOptionsName = '';
    if (productOptions.length > 0) {
      productOptionsName = productOptions[0].name;
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
                      src={item.profileS3Url}
                    />
                  </Box>
                  <Box>
                    <Text
                      color={'#485766'}
                      fontSize={'1.125rem'}
                      fontWeight="500"
                      lineHeight="1.97rem"
                    >
                      {item.name}
                    </Text>
                  </Box>
                  <Box>
                    <StarRating
                      initialRating={item.rating}
                      w={'1.5rem'}
                      h={'1.5rem'}
                    />
                  </Box>
                </HStack>
              </Box>
              {item?.createdAt && (
                <Box w={'100%'}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'1.125rem'}
                    fontWeight={500}
                    lineHeight={'1.97rem'}
                  >
                    {utils.parseDateByCountryCode(item.createdAt, lang, true)}
                  </Text>
                </Box>
              )}
              <Box w={'100%'}>
                <Box w={'100%'} key={index}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {`${localeText(LANGUAGES.COMMON.OPTION)} : ${item.productOptions.name}`}
                  </Text>
                </Box>
              </Box>
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
                  {item.content}
                </Text>
              </Box>
              <Box w={'100%'}>
                <HStack spacing={'1.25rem'}>
                  {item?.firstImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={item.firstImageS3Url}
                      />
                    </Center>
                  )}
                  {item?.secondImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={item.secondImageS3Url}
                      />
                    </Center>
                  )}
                  {item?.thirdImageS3Url && (
                    <Center w={'6.25rem'} h={'6.25rem'}>
                      <ChakraImage
                        fallback={<DefaultSkeleton />}
                        w={'100%'}
                        h={'100%'}
                        objectFit={'cover'}
                        src={item.thirdImageS3Url}
                      />
                    </Center>
                  )}
                </HStack>
              </Box>
              {item?.answer && (
                <Box w="100%" pt={'1rem'}>
                  <Divider borderBottom={'1px solid #AEBDCA'} />
                  <Box w={'100%'} pt={'1rem'}>
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
                        {item.answer}
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              )}
            </VStack>
          </Box>
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
                          objectFit={'cover'}
                          borderRadius={'50%'}
                          src={profileS3Url}
                        />
                      </Box>
                      <Box>
                        <Text
                          color={'#485766'}
                          fontSize={'1.125rem'}
                          fontWeight="500"
                          lineHeight="1.97rem"
                        >
                          {name}
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
                    <Box>
                      <Text
                        color={'#7895B2'}
                        fontSize={'1.125rem'}
                        fontWeight={500}
                        lineHeight={'1.97rem'}
                      >
                        {utils.parseDateByCountryCode(createdAt, lang, true)}
                      </Text>
                    </Box>
                  )}
                </HStack>
              </Box>
              <Box w={'100%'}>
                <Box w={'100%'} key={index}>
                  <Text
                    color={'#7895B2'}
                    fontSize={'1rem'}
                    fontWeight={400}
                    lineHeight={'1.75rem'}
                  >
                    {`${localeText(LANGUAGES.COMMON.OPTION)} : ${productOptionsName}`}
                  </Text>
                </Box>
              </Box>
            </VStack>
          </Box>
          <Box w={'100%'}>
            <HStack spacing={'1.5rem'} justifyContent={'space-between'}>
              <Box alignSelf={'flex-start'}>
                <Text
                  color={'#485766'}
                  fontSize={clampW(0.875, 1.125)}
                  fontWeight={400}
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
                        // maxW="200px"
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
            </HStack>
            {answer && (
              <Box w="100%" pt={'1rem'}>
                <Divider borderBottom={'1px solid #AEBDCA'} />
                <Box w={'100%'} pt={'1rem'}>
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
              </Box>
            )}
          </Box>
        </VStack>
      </Box>
    );
  });

  const inquiriesCard = useCallback((item, index) => {
    const answer = item?.answer;
    const buyerName = item?.buyerName;
    const createdAt = item?.createdAt;
    const productQuestionId = item?.productQuestionId;
    const question =
      item?.question ||
      localeText(LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.SECRET_POST);
    const secretFlag = item?.secretFlag;
    const sellerBrandName = item?.sellerBrandName;
    const status = item?.status;

    const key = `inquiries-${index}`;
    return isMobile(true) ? (
      <Box w={'100%'} key={key}>
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
                      {status === 1
                        ? localeText(LANGUAGES.STATUS.PROCESSING_QUEUE)
                        : localeText(LANGUAGES.STATUS.ANSWER_COMPLETED)}
                    </Text>
                  </Box>
                  <Box w={'53.75rem'}>
                    <Text
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                      whiteSpace={'nowrap'}
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                      textAlign={'left'}
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
                      {utils.parseDateByCountryCode(createdAt, lang, true)}
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
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                        whiteSpace={'pre-wrap'}
                      >
                        {answer}
                      </Text>
                    </Box>
                  </>
                )}
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    ) : (
      <Box w={'100%'} key={key}>
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
                      {status === 1
                        ? localeText(LANGUAGES.STATUS.PROCESSING_QUEUE)
                        : localeText(LANGUAGES.STATUS.ANSWER_COMPLETED)}
                    </Text>
                  </Box>
                  <Box w={'53.75rem'}>
                    <Text
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                      whiteSpace={'nowrap'}
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                      textAlign={'left'}
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
                      {utils.parseDateByCountryCode(createdAt, lang, true)}
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
                      <Text
                        color={'#556A7E'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        lineHeight={'1.75rem'}
                        whiteSpace={'pre-wrap'}
                      >
                        {answer}
                      </Text>
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

  return isMobile(true) ? (
    <>
      <Box w={'100%'} px={clampW(1, 10)}>
        <Tabs
          p={0}
          defaultIndex={tabIndex}
          onChange={(index) => {
            console.log(index);
            setTabIndex(index);
          }}
        >
          <VStack spacing={'2rem'}>
            <Box w={'100%'}>
              <TabList p={0}>
                <Wrap spacingX={'1.25rem'} spacingY={0}>
                  <WrapItem>
                    <Tab
                      p={0}
                      py={'0.5rem'}
                      w={'max-content'}
                      _selected={{ color: '#66809C', fontWeight: 600 }}
                      color={'#A7C3D2'}
                      fontSize={clampW(0.9375, 1.25)}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {localeText(LANGUAGES.PRODUCT_INFO)}
                    </Tab>
                  </WrapItem>
                  <WrapItem>
                    <Tab
                      p={0}
                      py={'0.5rem'}
                      w={'max-content'}
                      _selected={{ color: '#66809C', fontWeight: 600 }}
                      color={'#A7C3D2'}
                      fontSize={clampW(0.9375, 1.25)}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {`${localeText(LANGUAGES.UPPER_REVIEWS)}(${utils.parseAmount(totalCountReview)})`}
                    </Tab>
                  </WrapItem>
                  <WrapItem>
                    <Tab
                      p={0}
                      py={'0.5rem'}
                      w={'max-content'}
                      _selected={{ color: '#66809C', fontWeight: 600 }}
                      color={'#A7C3D2'}
                      fontSize={clampW(0.9375, 1.25)}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {`${localeText(LANGUAGES.PRODUCT_INQUIRY)}(${utils.parseAmount(totalCountInquiries)})`}
                    </Tab>
                  </WrapItem>
                  <WrapItem>
                    <Tab
                      p={0}
                      py={'0.5rem'}
                      w={'max-content'}
                      _selected={{ color: '#66809C', fontWeight: 600 }}
                      color={'#A7C3D2'}
                      fontSize={clampW(0.9375, 1.25)}
                      fontWeight={400}
                      lineHeight={'2.25rem'}
                    >
                      {`${localeText(LANGUAGES.SHIPPING)}/${localeText(LANGUAGES.EXCHANGES)}/${localeText(LANGUAGES.RETURNS)}`}
                    </Tab>
                  </WrapItem>
                </Wrap>
              </TabList>
            </Box>
            <Box w={'100%'}>
              <TabPanels p={0}>
                <ProductInfoTab
                  productInfo={productInfo}
                  productImageList={productImageList}
                />

                <TabPanel p={0}>
                  <VStack spacing={'2rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.25rem'}
                        fontWeight={500}
                        lineHeight={'2.25rem'}
                      >
                        {`${localeText(LANGUAGES.UPPER_REVIEWS)}(${utils.parseAmount(totalCountReview)})`}
                      </Text>
                    </Box>

                    <Box w={'100%'}>
                      <VStack spacing={'0.5rem'}>
                        <Box w={'100%'}>
                          <HStack justifyContent={'space-between'}>
                            <Text
                              color={'#485766'}
                              fontSize={'3rem'}
                              fontWeight={500}
                              lineHeight={'4.5rem'}
                            >
                              {productInfo.rating % 1 === 0
                                ? `${productInfo.rating}.0`
                                : productInfo.rating}
                            </Text>
                            <Box>
                              <StarRating
                                initialRating={productInfo.rating}
                                w={'2.5rem'}
                                h={'2.5rem'}
                              />
                            </Box>
                          </HStack>
                        </Box>
                        <Box w={'100%'}>
                          <HStack>
                            <Box
                              w={'1.5rem'}
                              h={'1.5rem'}
                              position={'relative'}
                            >
                              <CustomIcon
                                name={'star'}
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#556A7E'}
                              />
                            </Box>
                            <Text
                              color={'#485766'}
                              fontSize={'1.125rem'}
                              fontWeight={400}
                              lineHeight={'1.97rem'}
                            >
                              {localeText(LANGUAGES.BASED_REVIEWS, {
                                key: '@COUNT@',
                                value: utils.parseAmount(totalCountReview),
                              })}
                            </Text>
                          </HStack>
                        </Box>
                      </VStack>
                    </Box>

                    <Box w={'100%'} borderTop={'1px solid #AEBDCA'}>
                      <VStack w={'100%'} spacing={0}>
                        {listReview.map((item, reviewIndex) => {
                          return reviewCard(item, reviewIndex);
                        })}
                        {listReview.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NO_REVIEW)}
                            </Text>
                          </Center>
                        )}
                      </VStack>
                    </Box>
                  </VStack>
                </TabPanel>
                <TabPanel p={0}>
                  <Box w={'100%'}>
                    <VStack spacing={'2.5rem'}>
                      <Box w={'100%'}>
                        {/* Second section with vertical flex */}
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#485766'}
                              fontSize={clampW(0.9375, 1.25)}
                              fontWeight={500}
                              lineHeight={'2.25rem'}
                            >
                              {`${localeText(LANGUAGES.PRODUCT_INQUIRY)}(${listInquiries.length})`}
                            </Text>
                          </Box>
                          <Box
                            cursor={'pointer'}
                            onClick={() => {
                              onOpenInquiries();
                            }}
                          >
                            <VStack spacing={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={clampW(0.9375, 1.25)}
                                fontWeight={400}
                              >
                                {localeText(LANGUAGES.WRITE_INQUIRY)}
                              </Text>
                            </VStack>
                          </Box>
                        </HStack>

                        {isOpenInquiries && (
                          <Modal
                            isOpen={isOpenInquiries}
                            onClose={onCloseInquiries}
                            size="md"
                          >
                            <ModalOverlay bg={'#00000099'} />
                            <ModalContent
                              alignSelf={'center'}
                              borderRadius={0}
                              w={'60rem'}
                              h={'100%'}
                              maxH={'31.25rem'}
                              maxW={null}
                            >
                              <ModalBody
                                w={'100%'}
                                h={'100%'}
                                position={'relative'}
                                pt={'1.5rem'}
                                pb={0}
                                px={0}
                              >
                                <Box w={'100%'} h={'100%'}>
                                  <Box w={'100%'} px={'2.5rem'}>
                                    <HStack justifyContent={'space-between'}>
                                      <Box>
                                        <Text
                                          color={'#485766'}
                                          fontSize={'1.125rem'}
                                          fontWeight={400}
                                          lineHeight={'1.96875rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.MY_PAGE.ORDER
                                              .PRODUCT_INQUIRIES,
                                          )}
                                        </Text>
                                      </Box>
                                      <Box
                                        w={'2rem'}
                                        h={'2rem'}
                                        cursor={'pointer'}
                                        onClick={onCloseInquiries}
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

                                  <ContentBR h={'1.5rem'} />

                                  <Box
                                    w={'100%'}
                                    overflowY={'auto'}
                                    className={'no-scroll'}
                                  >
                                    <VStack
                                      spacing={0}
                                      px={'2.5rem'}
                                      h={'100%'}
                                      justifyContent={'space-between'}
                                    >
                                      <Box w={'100%'}>
                                        <Box w={'100%'}>
                                          <HStack
                                            justifyContent={'space-between'}
                                          >
                                            <Box>
                                              <Text
                                                color={'#485766'}
                                                fontSize={'1.25rem'}
                                                fontWeight={500}
                                                lineHeight={'2.25rem'}
                                              >
                                                {localeText(
                                                  LANGUAGES.MY_PAGE.ORDER
                                                    .WRITE_PRODUCT_INQUIRY,
                                                )}
                                              </Text>
                                            </Box>
                                            <Box>
                                              <HStack>
                                                <Box>
                                                  <CustomCheckbox
                                                    isChecked={isSecret}
                                                    onChange={(v) => {
                                                      setIsSecret(v);
                                                    }}
                                                  />
                                                </Box>
                                                <Box>
                                                  <Text
                                                    color={'#485766'}
                                                    fontSize={'1rem'}
                                                    fontWeight={400}
                                                    lineHeight={'1.75rem'}
                                                  >
                                                    {localeText(
                                                      LANGUAGES.MY_PAGE.ORDER
                                                        .WRITE_IN_SECRET,
                                                    )}
                                                  </Text>
                                                </Box>
                                              </HStack>
                                            </Box>
                                          </HStack>
                                        </Box>

                                        <ContentBR h={'1.5rem'} />

                                        <Box w={'100%'} h={'12.25rem'}>
                                          <Textarea
                                            type={'text'}
                                            placeholder={localeText(
                                              LANGUAGES.MY_PAGE.ORDER
                                                .PH_WRITE_PRODUCT_INQUIRY,
                                            )}
                                            _placeholder={{
                                              color: '#A7C3D2',
                                              fontSize: '1rem',
                                              fontWeight: 400,
                                              lineHeight: '1.75rem',
                                            }}
                                            onChange={(e) => {
                                              setQuestion(e.target.value);
                                            }}
                                            value={question}
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

                                        <ContentBR h={'3.75rem'} />

                                        <Box
                                          minW={'8.5rem'}
                                          w={'100%'}
                                          h={'4rem'}
                                        >
                                          <Button
                                            isDisabled={question.length < 1}
                                            onClick={handleActionInquiries}
                                            _disabled={{
                                              bg: '#D9E7EC',
                                              cursor: 'not-allowed',
                                            }}
                                            _active={{}}
                                            _hover={{}}
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
                                              {localeText(
                                                LANGUAGES.MY_PAGE.ORDER
                                                  .REGISTER_INQUIRIES,
                                              )}
                                            </Text>
                                          </Button>
                                        </Box>

                                        <ContentBR h={'2.5rem'} />
                                      </Box>
                                    </VStack>
                                  </Box>
                                </Box>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        )}
                      </Box>

                      <Box w={'100%'}>
                        {/* Table section */}
                        <VStack spacing={0}>
                          <Box
                            borderTop={'1px solid #73829D'}
                            borderBottom={'1px solid #AEBDCA'}
                            w={'100%'}
                            px={'1.25rem'}
                            py={'1rem'}
                          >
                            <HStack spacing={'0.75rem'}>
                              <Box w={'12.5rem'}>
                                <Text
                                  textAlign={'left'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.STATUS,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'53.75rem'}>
                                <Text
                                  textAlign={'center'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES
                                      .INQUIRIES,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'16.5rem'}>
                                <Text
                                  textAlign={'center'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.AUTHOR,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'12.5rem'}>
                                <Text
                                  textAlign={'right'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES
                                      .REGISTRATION_DATE,
                                  )}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>

                          {/* Content rows */}
                          <Box
                            w={'100%'}
                            borderTop="1px #AEBDCA solid"
                            borderBottom="1px #AEBDCA solid"
                          >
                            <VStack spacing={0}>
                              {listInquiries.map(
                                (inquiries, inquiriesIndex) => {
                                  return inquiriesCard(
                                    inquiries,
                                    inquiriesIndex,
                                  );
                                },
                              )}
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
                    </VStack>
                  </Box>
                </TabPanel>
                <TabPanel p={0}>
                  <Box w={'100%'} px={'1.25rem'}>
                    <Accordion defaultIndex={[0]} allowMultiple>
                      <VStack spacing={'2.5rem'}>
                        <Box w={'100%'}>
                          <AccordionItem
                            borderBottom={'1px solid #AEBDCA'}
                            borderTop={0}
                          >
                            <AccordionButton p={0} mb={'1.25rem'}>
                              <Box
                                w={'100%'}
                                as="span"
                                flex="1"
                                textAlign="left"
                              >
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.SHIPPING)}
                                </Text>
                              </Box>
                              <AccordionIcon
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#7895B2'}
                              />
                            </AccordionButton>
                            <AccordionPanel pb={'1.25rem'} pt={0} px={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={clampW(0.875, 1)}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                Shipping method: Sequential shipping
                                <br />
                                Shipping carrier: Korea Post
                                <br />
                                Shipping costs: Free shipping on orders over
                                $198.00 on shipping items, No additional charge
                                for remote islands
                                <br />
                                Delivery period:
                                <br />
                                - Delivery area: after order and payment is
                                completed, arrives in 1-2 days
                                <br />
                                - Undelivered: Arrives in 2-3 days after order
                                and payment is received
                                <br />
                                - It may take an extra day for mountainous
                                areas, etc.
                                <br />- Please understand that there may be some
                                delay in case of exceptional reasons such as
                                natural disasters, supply and demand
                                fluctuations, etc.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Box>

                        <Box w={'100%'}>
                          <AccordionItem
                            borderBottom={'1px solid #AEBDCA'}
                            borderTop={0}
                          >
                            <AccordionButton p={0} mb={'1.25rem'}>
                              <Box as="span" flex="1" textAlign="left">
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.EXCHANGES)}
                                </Text>
                              </Box>
                              <AccordionIcon
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#7895B2'}
                              />
                            </AccordionButton>
                            <AccordionPanel py={'1.25rem'} pt={0} px={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                Shipping method: Sequential shipping
                                <br />
                                Shipping carrier: Korea Post
                                <br />
                                Shipping costs: Free shipping on orders over
                                $198.00 on shipping items, No additional charge
                                for remote islands
                                <br />
                                Delivery period:
                                <br />
                                - Delivery area: after order and payment is
                                completed, arrives in 1-2 days
                                <br />
                                - Undelivered: Arrives in 2-3 days after order
                                and payment is received
                                <br />
                                - It may take an extra day for mountainous
                                areas, etc.
                                <br />- Please understand that there may be some
                                delay in case of exceptional reasons such as
                                natural disasters, supply and demand
                                fluctuations, etc.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Box>

                        <Box w={'100%'}>
                          <AccordionItem
                            borderBottom={'1px solid #AEBDCA'}
                            borderTop={0}
                          >
                            <AccordionButton p={0} mb={'1.25rem'}>
                              <Box as="span" flex="1" textAlign="left">
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  fontStyle={'normal'}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.RETURNS)}
                                </Text>
                              </Box>
                              <AccordionIcon
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#7895B2'}
                              />
                            </AccordionButton>
                            <AccordionPanel py={'1.25rem'} pt={0} px={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                Shipping method: Sequential shipping
                                <br />
                                Shipping carrier: Korea Post
                                <br />
                                Shipping costs: Free shipping on orders over
                                $198.00 on shipping items, No additional charge
                                for remote islands
                                <br />
                                Delivery period:
                                <br />
                                - Delivery area: after order and payment is
                                completed, arrives in 1-2 days
                                <br />
                                - Undelivered: Arrives in 2-3 days after order
                                and payment is received
                                <br />
                                - It may take an extra day for mountainous
                                areas, etc.
                                <br />- Please understand that there may be some
                                delay in case of exceptional reasons such as
                                natural disasters, supply and demand
                                fluctuations, etc.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Box>
                      </VStack>
                    </Accordion>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Box>
          </VStack>
        </Tabs>
      </Box>

      <ContentBR h={'2rem'} />

      {(tabIndex === 0 || tabIndex === 3) && <Footer />}
    </>
  ) : (
    <>
      <Box w={'100%'} px={'10rem'}>
        <Tabs
          p={0}
          defaultIndex={tabIndex}
          onChange={(index) => {
            setTabIndex(Number(index));
          }}
        >
          <VStack spacing={'2.5rem'}>
            <Box w={'100%'}>
              <TabList px={0} py={'0.5rem'}>
                <HStack spacing={'3.25rem'}>
                  <Tab
                    p={0}
                    w={'max-content'}
                    _selected={{ color: '#66809C', fontWeight: 600 }}
                    color={'#A7C3D2'}
                    fontSize={'1.25rem'}
                    fontWeight={400}
                    lineHeight={'2.25rem'}
                  >
                    {localeText(LANGUAGES.PRODUCT_INFO)}
                  </Tab>
                  <Tab
                    p={0}
                    w={'max-content'}
                    _selected={{ color: '#66809C', fontWeight: 600 }}
                    color={'#A7C3D2'}
                    fontSize={'1.25rem'}
                    fontWeight={400}
                    lineHeight={'2.25rem'}
                  >
                    {`${localeText(LANGUAGES.UPPER_REVIEWS)}(${utils.parseAmount(totalCountReview)})`}
                  </Tab>
                  <Tab
                    p={0}
                    w={'max-content'}
                    _selected={{ color: '#66809C', fontWeight: 600 }}
                    color={'#A7C3D2'}
                    fontSize={'1.25rem'}
                    fontWeight={400}
                    lineHeight={'2.25rem'}
                  >
                    {`${localeText(LANGUAGES.PRODUCT_INQUIRY)}(${utils.parseAmount(totalCountInquiries)})`}
                  </Tab>
                  <Tab
                    p={0}
                    w={'max-content'}
                    _selected={{ color: '#66809C', fontWeight: 600 }}
                    color={'#A7C3D2'}
                    fontSize={'1.25rem'}
                    fontWeight={400}
                    lineHeight={'2.25rem'}
                  >
                    {`${localeText(LANGUAGES.SHIPPING)}/${localeText(LANGUAGES.EXCHANGES)}/${localeText(LANGUAGES.RETURNS)}`}
                  </Tab>
                </HStack>
              </TabList>
            </Box>
            <Box w={'100%'}>
              <TabPanels p={0}>
                <ProductInfoTab
                  productInfo={productInfo}
                  productImageList={productImageList}
                />
                <TabPanel p={0}>
                  <VStack spacing={'2.5rem'}>
                    <Box w={'100%'}>
                      <Text
                        color={'#485766'}
                        fontSize={'1.25rem'}
                        fontWeight={500}
                        lineHeight={'2.25rem'}
                      >
                        {`${localeText(LANGUAGES.UPPER_REVIEWS)}(${utils.parseAmount(totalCountReview)})`}
                      </Text>
                    </Box>

                    <Box w={'100%'}>
                      <HStack justifyContent={'space-between'}>
                        <Box>
                          <HStack>
                            <Text
                              color={'#485766'}
                              fontSize={'3rem'}
                              fontWeight={500}
                              lineHeight={'4.5rem'}
                            >
                              {productInfo.rating % 1 === 0
                                ? `${productInfo.rating}.0`
                                : productInfo.rating}
                            </Text>
                            <Box>
                              <StarRating
                                initialRating={productInfo.rating}
                                w={'2.5rem'}
                                h={'2.5rem'}
                              />
                            </Box>
                          </HStack>
                        </Box>
                        <Box alignSelf={'flex-end'}>
                          <HStack>
                            <Box
                              w={'1.5rem'}
                              h={'1.5rem'}
                              position={'relative'}
                            >
                              <CustomIcon
                                name={'star'}
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#556A7E'}
                              />
                            </Box>
                            <Text
                              color={'#485766'}
                              fontSize={'1.125rem'}
                              fontWeight={400}
                              lineHeight={'1.97rem'}
                            >
                              {localeText(LANGUAGES.BASED_REVIEWS, {
                                key: '@COUNT@',
                                value: utils.parseAmount(totalCountReview),
                              })}
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Box>

                    <Box w={'100%'} borderTop={'1px solid #AEBDCA'}>
                      <VStack w={'100%'} spacing={0}>
                        {listReview.map((item, reviewIndex) => {
                          return reviewCard(item, reviewIndex);
                        })}
                        {listReview.length === 0 && (
                          <Center w={'100%'} h={'10rem'}>
                            <Text
                              fontSize={'1.5rem'}
                              fontWeight={500}
                              lineHeight={'1.75rem'}
                            >
                              {localeText(LANGUAGES.INFO_MSG.NO_REVIEW)}
                            </Text>
                          </Center>
                        )}
                      </VStack>
                    </Box>

                    <Box w={'100%'}>
                      <Center>
                        <DefaultPaginate
                          currentPage={currentPageReview}
                          setCurrentPage={setCurrentPageReview}
                          totalCount={totalCountReview}
                          contentNum={contentNumReview}
                        />
                      </Center>
                    </Box>
                  </VStack>
                </TabPanel>
                <TabPanel p={0}>
                  <Box w={'100%'}>
                    <VStack spacing={'2.5rem'}>
                      <Box w={'100%'}>
                        {/* Second section with vertical flex */}
                        <HStack justifyContent={'space-between'}>
                          <Box>
                            <Text
                              color={'#485766'}
                              fontSize={'1.25rem'}
                              fontWeight={500}
                              lineHeight={'2.25rem'}
                            >
                              {`${localeText(LANGUAGES.PRODUCT_INQUIRY)}(${utils.parseAmount(totalCountInquiries)})`}
                            </Text>
                          </Box>
                          <Box
                            cursor={'pointer'}
                            onClick={() => {
                              onOpenInquiries();
                            }}
                          >
                            <VStack
                              justifyContent="flex-start"
                              alignItems="flex-start"
                              display="inline-flex"
                            >
                              <Text
                                textAlign="center"
                                color={'#556A7E'}
                                fontSize={'1.25rem'}
                                fontWeight={400}
                                lineHeight={'2.25rem'}
                              >
                                {localeText(LANGUAGES.WRITE_INQUIRY)}
                              </Text>
                              <Box
                                alignSelf="stretch"
                                height="0"
                                border="1px #66809C solid"
                              />
                            </VStack>
                          </Box>
                        </HStack>

                        {isOpenInquiries && (
                          <Modal
                            isOpen={isOpenInquiries}
                            onClose={onCloseInquiries}
                            size="md"
                          >
                            <ModalOverlay bg={'#00000099'} />
                            <ModalContent
                              alignSelf={'center'}
                              borderRadius={0}
                              w={'60rem'}
                              h={'100%'}
                              maxH={'31.25rem'}
                              maxW={null}
                            >
                              <ModalBody
                                w={'100%'}
                                h={'100%'}
                                position={'relative'}
                                pt={'1.5rem'}
                                pb={0}
                                px={0}
                              >
                                <Box w={'100%'} h={'100%'}>
                                  <Box w={'100%'} px={'2.5rem'}>
                                    <HStack justifyContent={'space-between'}>
                                      <Box>
                                        <Text
                                          color={'#485766'}
                                          fontSize={'1.125rem'}
                                          fontWeight={400}
                                          lineHeight={'1.96875rem'}
                                        >
                                          {localeText(
                                            LANGUAGES.MY_PAGE.ORDER
                                              .PRODUCT_INQUIRIES,
                                          )}
                                        </Text>
                                      </Box>
                                      <Box
                                        w={'2rem'}
                                        h={'2rem'}
                                        cursor={'pointer'}
                                        onClick={onCloseInquiries}
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

                                  <ContentBR h={'1.5rem'} />

                                  <Box
                                    w={'100%'}
                                    overflowY={'auto'}
                                    className={'no-scroll'}
                                  >
                                    <VStack
                                      spacing={0}
                                      px={'2.5rem'}
                                      h={'100%'}
                                      justifyContent={'space-between'}
                                    >
                                      <Box w={'100%'}>
                                        <Box w={'100%'}>
                                          <HStack
                                            justifyContent={'space-between'}
                                          >
                                            <Box>
                                              <Text
                                                color={'#485766'}
                                                fontSize={'1.25rem'}
                                                fontWeight={500}
                                                lineHeight={'2.25rem'}
                                              >
                                                {localeText(
                                                  LANGUAGES.MY_PAGE.ORDER
                                                    .WRITE_PRODUCT_INQUIRY,
                                                )}
                                              </Text>
                                            </Box>
                                            <Box>
                                              <HStack>
                                                <Box>
                                                  <CustomCheckbox
                                                    isChecked={isSecret}
                                                    onChange={(v) => {
                                                      setIsSecret(v);
                                                    }}
                                                  />
                                                </Box>
                                                <Box>
                                                  <Text
                                                    color={'#485766'}
                                                    fontSize={'1rem'}
                                                    fontWeight={400}
                                                    lineHeight={'1.75rem'}
                                                  >
                                                    {localeText(
                                                      LANGUAGES.MY_PAGE.ORDER
                                                        .WRITE_IN_SECRET,
                                                    )}
                                                  </Text>
                                                </Box>
                                              </HStack>
                                            </Box>
                                          </HStack>
                                        </Box>

                                        <ContentBR h={'1.5rem'} />

                                        <Box w={'100%'} h={'12.25rem'}>
                                          <Textarea
                                            type={'text'}
                                            placeholder={localeText(
                                              LANGUAGES.MY_PAGE.ORDER
                                                .PH_WRITE_PRODUCT_INQUIRY,
                                            )}
                                            _placeholder={{
                                              color: '#A7C3D2',
                                              fontSize: '1rem',
                                              fontWeight: 400,
                                              lineHeight: '1.75rem',
                                            }}
                                            onChange={(e) => {
                                              setQuestion(e.target.value);
                                            }}
                                            value={question}
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

                                        <ContentBR h={'3.75rem'} />

                                        <Box
                                          minW={'8.5rem'}
                                          w={'100%'}
                                          h={'4rem'}
                                        >
                                          <Button
                                            isDisabled={question.length < 1}
                                            onClick={handleActionInquiries}
                                            _disabled={{
                                              bg: '#D9E7EC',
                                              cursor: 'not-allowed',
                                            }}
                                            _active={{}}
                                            _hover={{}}
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
                                              {localeText(
                                                LANGUAGES.MY_PAGE.ORDER
                                                  .REGISTER_INQUIRIES,
                                              )}
                                            </Text>
                                          </Button>
                                        </Box>

                                        <ContentBR h={'2.5rem'} />
                                      </Box>
                                    </VStack>
                                  </Box>
                                </Box>
                              </ModalBody>
                            </ModalContent>
                          </Modal>
                        )}
                      </Box>

                      <Box w={'100%'}>
                        {/* Table section */}
                        <VStack spacing={0}>
                          <Box
                            borderTop={'1px solid #73829D'}
                            borderBottom={'1px solid #AEBDCA'}
                            w={'100%'}
                            px={'1.25rem'}
                            py={'1rem'}
                          >
                            <HStack spacing={'0.75rem'}>
                              <Box w={'12.5rem'}>
                                <Text
                                  textAlign={'left'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.STATUS,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'53.75rem'}>
                                <Text
                                  textAlign={'center'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES
                                      .INQUIRIES,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'16.5rem'}>
                                <Text
                                  textAlign={'center'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.AUTHOR,
                                  )}
                                </Text>
                              </Box>
                              <Box w={'12.5rem'}>
                                <Text
                                  textAlign={'right'}
                                  fontSize={'1rem'}
                                  fontWeight={500}
                                  color={'#2A333C'}
                                >
                                  {localeText(
                                    LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES
                                      .REGISTRATION_DATE,
                                  )}
                                </Text>
                              </Box>
                            </HStack>
                          </Box>

                          {/* Content rows */}
                          <Box
                            w={'100%'}
                            borderTop="1px #AEBDCA solid"
                            borderBottom="1px #AEBDCA solid"
                          >
                            <VStack spacing={0}>
                              {listInquiries.map(
                                (inquiries, inquiriesIndex) => {
                                  return inquiriesCard(
                                    inquiries,
                                    inquiriesIndex,
                                  );
                                },
                              )}
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
                      <Box w={'100%'}>
                        <Center>
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
                </TabPanel>
                <TabPanel p={0}>
                  <Box w={'100%'} px={'1.25rem'}>
                    <Accordion defaultIndex={[0]} allowMultiple>
                      <VStack spacing={'2.5rem'}>
                        <Box w={'100%'}>
                          <AccordionItem
                            borderBottom={'1px solid #AEBDCA'}
                            borderTop={0}
                          >
                            <AccordionButton py={'1.25rem'} px={0}>
                              <Box
                                w={'100%'}
                                as="span"
                                flex="1"
                                textAlign="left"
                              >
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.SHIPPING)}
                                </Text>
                              </Box>
                              <AccordionIcon
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#7895B2'}
                              />
                            </AccordionButton>
                            <AccordionPanel pb={4} pt={0} px={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                Shipping method: Sequential shipping
                                <br />
                                Shipping carrier: Korea Post
                                <br />
                                Shipping costs: Free shipping on orders over
                                $198.00 on shipping items, No additional charge
                                for remote islands
                                <br />
                                Delivery period:
                                <br />
                                - Delivery area: after order and payment is
                                completed, arrives in 1-2 days
                                <br />
                                - Undelivered: Arrives in 2-3 days after order
                                and payment is received
                                <br />
                                - It may take an extra day for mountainous
                                areas, etc.
                                <br />- Please understand that there may be some
                                delay in case of exceptional reasons such as
                                natural disasters, supply and demand
                                fluctuations, etc.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Box>

                        <Box w={'100%'}>
                          <AccordionItem
                            borderBottom={'1px solid #AEBDCA'}
                            borderTop={0}
                          >
                            <AccordionButton py={'1.25rem'} px={0}>
                              <Box as="span" flex="1" textAlign="left">
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.EXCHANGES)}
                                </Text>
                              </Box>
                              <AccordionIcon
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#7895B2'}
                              />
                            </AccordionButton>
                            <AccordionPanel py={'1.25rem'} pt={0} px={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                Shipping method: Sequential shipping
                                <br />
                                Shipping carrier: Korea Post
                                <br />
                                Shipping costs: Free shipping on orders over
                                $198.00 on shipping items, No additional charge
                                for remote islands
                                <br />
                                Delivery period:
                                <br />
                                - Delivery area: after order and payment is
                                completed, arrives in 1-2 days
                                <br />
                                - Undelivered: Arrives in 2-3 days after order
                                and payment is received
                                <br />
                                - It may take an extra day for mountainous
                                areas, etc.
                                <br />- Please understand that there may be some
                                delay in case of exceptional reasons such as
                                natural disasters, supply and demand
                                fluctuations, etc.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Box>

                        <Box w={'100%'}>
                          <AccordionItem
                            borderBottom={'1px solid #AEBDCA'}
                            borderTop={0}
                          >
                            <AccordionButton py={'1.25rem'} px={0}>
                              <Box as="span" flex="1" textAlign="left">
                                <Text
                                  color={'#485766'}
                                  fontSize={'1.25rem'}
                                  fontWeight={500}
                                  fontStyle={'normal'}
                                  lineHeight={'2.25rem'}
                                >
                                  {localeText(LANGUAGES.RETURNS)}
                                </Text>
                              </Box>
                              <AccordionIcon
                                w={'1.5rem'}
                                h={'1.5rem'}
                                color={'#7895B2'}
                              />
                            </AccordionButton>
                            <AccordionPanel py={'1.25rem'} pt={0} px={0}>
                              <Text
                                color={'#556A7E'}
                                fontSize={'1rem'}
                                fontWeight={500}
                                lineHeight={'1.75rem'}
                              >
                                Shipping method: Sequential shipping
                                <br />
                                Shipping carrier: Korea Post
                                <br />
                                Shipping costs: Free shipping on orders over
                                $198.00 on shipping items, No additional charge
                                for remote islands
                                <br />
                                Delivery period:
                                <br />
                                - Delivery area: after order and payment is
                                completed, arrives in 1-2 days
                                <br />
                                - Undelivered: Arrives in 2-3 days after order
                                and payment is received
                                <br />
                                - It may take an extra day for mountainous
                                areas, etc.
                                <br />- Please understand that there may be some
                                delay in case of exceptional reasons such as
                                natural disasters, supply and demand
                                fluctuations, etc.
                              </Text>
                            </AccordionPanel>
                          </AccordionItem>
                        </Box>
                      </VStack>
                    </Accordion>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Box>
          </VStack>
        </Tabs>
      </Box>
    </>
  );
};

export default ProductBottomInfo;

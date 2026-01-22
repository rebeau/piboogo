'use client';

import { DefaultPaginate } from '@/components';
import ContentBR from '@/components/custom/ContentBR';
import SearchInput from '@/components/input/custom/SearchInput';
import QuillViewer from '@/components/input/Quillviewer';
import { SUCCESS } from '@/constants/errorCode';
import { LANGUAGES } from '@/constants/lang';
import useDevice from '@/hooks/useDevice';
import useLocale from '@/hooks/useLocale';
import fnqApi from '@/services/fnqApi';
import noticeApi from '@/services/noticeApi';
import utils from '@/utils';
import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  AccordionPanel,
  AccordionButton,
  AccordionItem,
  Accordion,
  AccordionIcon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';

const HelpPage = (props) => {
  const { isMobile, clampW } = useDevice();
  const { lang, localeText } = useLocale();

  const [currentPageFandQ, setCurrentPageFandQ] = useState(1);
  const [contentNumFandQ, setContentNumFandQ] = useState(5);
  const [totalCountFandQ, setTotalCountFandQ] = useState(0);

  const [currentPageNotice, setCurrentPageNotice] = useState(1);
  const [contentNumNotice, setContentNumNotice] = useState(5);
  const [totalCountNotice, setTotalCountNotice] = useState(0);

  const [tabIndex, setTabIndex] = useState(0);

  const [listFandQ, setListFandQ] = useState([]);
  const [listNotice, setListNotice] = useState([]);

  const [searchBy, setSearchBy] = useState('');

  useEffect(() => {
    setLoading(false);
  }, [tabIndex]);

  useEffect(() => {
    handleGetListFandQ();
  }, [currentPageFandQ]);

  useEffect(() => {
    handleGetListNotice();
  }, [currentPageNotice]);

  const [loading, setLoading] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(async () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollY > lastScrollTop.current) {
      if (scrollY + windowHeight >= documentHeight && !loading) {
        if (tabIndex === 0) {
          if (currentPageFandQ !== 1) {
            if (listFandQ.length === contentNumFandQ) {
              setCurrentPageFandQ((prevPage) => prevPage + 1);
            } else {
              handleGetListFandQ();
            }
          } else {
            handleGetListFandQ();
          }
        } else if (tabIndex === 1) {
          if (currentPageNotice !== 1) {
            if (listNotice.length === currentPageNotice) {
              setCurrentPageNotice((prevPage) => prevPage + 1);
            } else {
              handleGetListNotice();
            }
          } else {
            handleGetListNotice();
          }
        }
      }
    }
    lastScrollTop.current = scrollY;
  }, [loading, tabIndex]);

  useEffect(() => {
    if (isMobile(true)) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  const handleGetListFandQ = async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPageFandQ,
      contentNum: contentNumFandQ,
    };

    try {
      const result = await fnqApi.getListFandQ(param);
      if (result?.errorCode === SUCCESS) {
        setListFandQ(result.datas);
        setTotalCountFandQ(result.totalCount);
      } else {
        setListFandQ([]);
        setTotalCountFandQ(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const questionCard = useCallback((item, index) => {
    return isMobile(true) ? (
      <Box w={'100%'} key={index}>
        <Accordion defaultIndex={[index === 0 ? 0 : null]} allowMultiple>
          <AccordionItem
            borderTop={0}
            borderBottom={'1px solid #AEBDCA'}
            //
          >
            <AccordionButton p={0}>
              <Box w={'100%'} py={'1rem'}>
                <HStack spacing={'0.75rem'} alignItems={'flex-start'}>
                  <Text
                    fontSize={clampW(0.875, 1.25)}
                    fontWeight={500}
                    color={'#485766'}
                  >
                    {item.question}
                  </Text>
                </HStack>
              </Box>
              <AccordionIcon w={'1.5rem'} h={'1.5rem'} color={'#7895B2'} />
            </AccordionButton>
            <AccordionPanel p={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#556A7E'}
                  fontSize={clampW(0.875, 1)}
                  fontWeight={500}
                  lineHeight={'160%'}
                  whiteSpace={'pre-wrap'}
                >
                  {item.answer}
                </Text>
              </Box>
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
              <Box w={'100%'} py={'1rem'}>
                <HStack spacing={'0.75rem'} alignItems={'flex-start'}>
                  <Text fontSize={'1.25rem'} fontWeight={500} color={'#485766'}>
                    {item.question}
                  </Text>
                </HStack>
              </Box>
              <AccordionIcon w={'1.5rem'} h={'1.5rem'} color={'#7895B2'} />
            </AccordionButton>
            <AccordionPanel p={'0.75rem'}>
              <Box w={'100%'}>
                <Text
                  color={'#556A7E'}
                  fontSize={'1rem'}
                  fontWeight={500}
                  lineHeight={'1.75rem'}
                >
                  {item.answer}
                </Text>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    );
  });

  const handleGetListNotice = async () => {
    if (loading) return;
    setLoading(true);

    const param = {
      pageNum: currentPageNotice,
      contentNum: contentNumNotice,
    };
    if (searchBy) {
      param.searchBy = searchBy;
    }
    try {
      const result = await noticeApi.getListNotice(param);
      if (result?.errorCode === SUCCESS) {
        setListNotice(result.datas);
        setTotalCountNotice(result.totalCount);
      } else {
        setListNotice([]);
        setTotalCountNotice(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const noticeCard = useCallback((item, index) => {
    return isMobile(true) ? (
      <Box w={'100%'} key={index}>
        <Accordion defaultIndex={[index === 0 ? 0 : null]} allowMultiple>
          <AccordionItem
            borderTop={'1px solid #AEBDCA'}
            // borderBottom={'1px solid #AEBDCA'}
          >
            <AccordionButton p={0}>
              <Box w={'100%'} py={'1.25rem'} px={'1rem'} bg={'#FAF7F2'}>
                <VStack spacing={'0.75rem'}>
                  <Box w={'100%'}>
                    <HStack justifyContent={'space-between'}>
                      <Box>
                        <Text
                          textAlign={'center'}
                          fontSize={clampW(0.9375, 1.125)}
                          fontWeight={400}
                          color={'#556A7E'}
                        >
                          {utils.getPageContentNum(
                            index,
                            currentPageNotice,
                            totalCountNotice,
                            contentNumNotice,
                          )}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontSize={clampW(1, 1.125)}
                          fontWeight={400}
                          color={'#485766'}
                        >
                          {utils.parseDateByCountryCode(item.createdAt, lang)}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box w={'100%'}>
                    <Text
                      fontSize={clampW(0.9375, 1.125)}
                      fontWeight={400}
                      color={'#485766'}
                      textAlign={'left'}
                      // whiteSpace={'nowrap'}
                      // overflow={'hidden'}
                      // textOverflow={'ellipsis'}
                    >
                      {item.title}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </AccordionButton>
            <AccordionPanel p={'1rem'} bg={'#8c644212'}>
              <Box w={'100%'}>
                <QuillViewer html={item.content} />
              </Box>
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
              <Box w={'100%'} px="20px" py={'1rem'}>
                <HStack spacing={'0.75rem'}>
                  <Box w={'5rem'}>
                    <Text
                      textAlign={'center'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#556A7E'}
                    >
                      {utils.getPageContentNum(
                        index,
                        currentPageNotice,
                        totalCountNotice,
                        contentNumNotice,
                      )}
                    </Text>
                  </Box>
                  <Box w={'66rem'}>
                    <Text
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                      whiteSpace={'nowrap'}
                      textAlign={'left'}
                      overflow={'hidden'}
                      textOverflow={'ellipsis'}
                    >
                      {item.title}
                    </Text>
                  </Box>
                  <Box w={'12.5rem'}>
                    <Text
                      textAlign={'right'}
                      fontSize={'1.125rem'}
                      fontWeight={400}
                      color={'#485766'}
                    >
                      {utils.parseDateByCountryCode(item.createdAt, lang)}
                    </Text>
                  </Box>
                </HStack>
              </Box>
            </AccordionButton>
            <AccordionPanel p={'2rem'} bg={'#8c644212'}>
              <Box w={'100%'}>
                <VStack spacing={'1.25rem'}>
                  <Box w={'100%'}>
                    <Text
                      color={'#556A7E'}
                      fontSize={'1rem'}
                      fontWeight={500}
                      lineHeight={'1.75rem'}
                    >
                      {item.seller}
                    </Text>
                  </Box>
                  <Box w={'100%'}>
                    <QuillViewer html={item.content} />
                  </Box>
                </VStack>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    );
  });

  return isMobile(true) ? (
    <Box w={'100%'}>
      <Tabs
        onChange={(index) => {
          setTabIndex(index);
        }}
      >
        <TabList p={0}>
          <HStack spacing={'1rem'}>
            <Tab
              p={0}
              _selected={{ color: '#66809C', fontWeight: 600 }}
              color={'#A7C3D2'}
              fontSize={clampW(1.125, 1.25)}
              fontWeight={400}
              lineHeight={'175%'}
            >
              {localeText(LANGUAGES.MY_PAGE.HELP.FAQ)}
            </Tab>
            <Tab
              p={0}
              _selected={{ color: '#66809C', fontWeight: 600 }}
              color={'#A7C3D2'}
              fontSize={clampW(1.125, 1.25)}
              fontWeight={400}
              lineHeight={'175%'}
            >
              {localeText(LANGUAGES.MY_PAGE.HELP.NOTICE)}
            </Tab>
          </HStack>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Box w={'100%'}>
              <VStack w={'100%'} spacing={0}>
                {listFandQ.map((item, index) => {
                  return questionCard(item, index);
                })}
                {listFandQ.length === 0 && (
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
          </TabPanel>
          <TabPanel p={0}>
            <ContentBR h={'1.25rem'} />

            <Box w={'100%'} h={'3.5rem'}>
              <SearchInput
                value={searchBy}
                onChange={(e) => {
                  setSearchBy(e.target.value);
                }}
                onClick={() => {
                  handleGetListNotice();
                }}
                borderRadius={'0.25rem'}
                placeholder={localeText(LANGUAGES.MY_PAGE.HELP.PH_NOTICE)}
                placeholderFontColor={'#A7C3D2'}
              />
            </Box>

            <ContentBR h={'1rem'} />

            <Box w={'100%'}>
              <VStack w={'100%'} spacing={0}>
                {listNotice.map((item, index) => {
                  return noticeCard(item, index);
                })}
                {listNotice.length === 0 && (
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  ) : (
    <Box w={'100%'}>
      <VStack spacing={0}>
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
                {localeText(LANGUAGES.MY_PAGE.HELP.FAQ)}
              </Text>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={'1.5rem'}>
                <Box w={'100%'}>
                  <VStack w={'100%'} spacing={0}>
                    {listFandQ.map((item, index) => {
                      return questionCard(item, index);
                    })}
                  </VStack>
                </Box>
              </VStack>
            </Box>

            <ContentBR h={'2.5rem'} />

            <Center w={'100%'}>
              <DefaultPaginate
                currentPage={currentPageFandQ}
                setCurrentPage={setCurrentPageFandQ}
                totalCount={totalCountFandQ}
                contentNum={contentNumFandQ}
              />
            </Center>
          </VStack>
        </Box>
        <Box w={'100%'}>
          <VStack spacing={0}>
            <Box w={'100%'} pt={'5rem'}>
              <Text
                textAlign={'left'}
                color={'#485766'}
                fontSize={'1.5rem'}
                fontWeight={500}
                lineHeight={'2.475rem'}
              >
                {localeText(LANGUAGES.MY_PAGE.HELP.NOTICE)}
              </Text>
            </Box>

            <Box w={'100%'} pb={'1.25rem'}>
              <HStack w={'100%'} justifyContent={'flex-end'}>
                <Box w={'25rem'}>
                  <SearchInput
                    value={searchBy}
                    onChange={(e) => {
                      setSearchBy(e.target.value);
                    }}
                    onClick={() => {
                      handleGetListNotice();
                    }}
                    borderRadius={'0.25rem'}
                    placeholder={localeText(LANGUAGES.MY_PAGE.HELP.PH_NOTICE)}
                    placeholderFontColor={'#A7C3D2'}
                  />
                </Box>
              </HStack>
            </Box>

            <Box w={'100%'}>
              <VStack spacing={0}>
                <Box
                  borderTop={'1px solid #73829D'}
                  borderBottom={'1px solid #AEBDCA'}
                  w={'100%'}
                  px={'1.25rem'}
                  py={'1rem'}
                >
                  <HStack spacing={'0.75rem'}>
                    <Box w={'5rem'}>
                      <Text
                        textAlign={'left'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.HELP.NUMBER)}
                      </Text>
                    </Box>
                    <Box w={'66rem'}>
                      <Text
                        textAlign={'center'}
                        fontSize={'1rem'}
                        fontWeight={500}
                        color={'#2A333C'}
                      >
                        {localeText(LANGUAGES.MY_PAGE.HELP.TITLE)}
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
                          LANGUAGES.MY_PAGE.REVIEWS_INQUIRIES.REGISTRATION_DATE,
                        )}
                      </Text>
                    </Box>
                  </HStack>
                </Box>
                <Box w={'100%'}>
                  <VStack w={'100%'} spacing={0}>
                    {listNotice.map((item, index) => {
                      return noticeCard(item, index);
                    })}
                    {listNotice.length === 0 && (
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
                currentPage={currentPageNotice}
                setCurrentPage={setCurrentPageNotice}
                totalCount={totalCountNotice}
                contentNum={contentNumNotice}
              />
            </Center>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default HelpPage;

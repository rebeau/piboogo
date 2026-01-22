import React, { useCallback, useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import range from 'lodash/range';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  forwardRef,
  HStack,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { getYear } from 'date-fns';
import { ko, enUS } from 'date-fns/locale';
import utils from '@/utils';
// import { format } from 'date-fns';
// import CustomIcon from '../icons/CustomIcon';
import IconCalendar from '@public/svgs/icon/calendar.svg';
import IconLeft from '@public/svgs/icon/left.svg';
import IconRight from '@public/svgs/icon/right.svg';
import { COUNTRY, LANGUAGES } from '@/constants/lang';
import useLocale from '@/hooks/useLocale';
import { TIME_ZONE } from '@/constants/common';
import * as dateFnsTz from 'date-fns-tz';

const RangeDatePicker = (props) => {
  const datePickerRef = useRef(null);
  const { isOpen, onOpen, onClose } = props;
  const { dateStr, start, end, isAfter = false } = props;
  const { onInitDate, handleOnChangeDate } = props;
  const [accordionBtn, setAccordionBtn] = useState([]);
  const years = range(2000, getYear(new Date()) + 1, 1);
  const { lang, localeText } = useLocale();

  const now = dateFnsTz.toZonedTime(new Date(), TIME_ZONE);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    if (start instanceof Date) {
      setStartDate(dateFnsTz.toZonedTime(start, TIME_ZONE));
    }
    if (end instanceof Date) {
      setEndDate(dateFnsTz.toZonedTime(end, TIME_ZONE));
    }
  }, [start, end]);

  const handleOnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (handleOnChangeDate) {
      handleOnChangeDate({
        startDate: start,
        endDate: end,
      });
    }
  };

  const handleInitDate = () => {
    if (onInitDate) {
      onInitDate();
    }
  };

  const getYyyyMmDdMmSsToString = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1; // January is 0!

    let yyyy = date.getFullYear();
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }

    yyyy = yyyy.toString();
    mm = mm.toString();
    if (lang === COUNTRY.COUNTRY_INFO.KR.LANG) {
      return `${yyyy}. ${mm}.`;
    } else {
      return `${mm}. ${yyyy}.`;
    }
  };

  const handleOnClick = useCallback(() => {
    setAccordionBtn([]);
    // onClick();
    onOpen();
  });

  const CustomDetePicker = forwardRef(({ value, onClick }, ref) => {
    return (
      <InputGroup>
        <Input
          readOnly
          onClick={handleOnClick}
          px={'1rem'}
          py={'0.75rem'}
          w={'100%'}
          h={'100%'}
          _placeholder={{
            fontWeight: 400,
            fontSize: '0.9375rem',
            lineHeight: '1.5rem',
            color: '#A7C3D2',
          }}
          boxSizing={'border-box'}
          border={'1px solid #9CADBE'}
          fontSize={'0.9375rem'}
          lineHeight={'1.5rem'}
          fontWeight={400}
          color={'#485766'}
          value={dateStr || 'YYYY. MM. DD - YYYY. MM. DD'}
        />
        <InputRightElement
          w={'3.5rem'}
          h={'100%'}
          onClick={handleOnClick}
          _hover={{
            cursor: 'pointer',
          }}
        >
          <Center w={'1.5rem'} h={'1.5rem'}>
            <Img w={'100%'} h={'100%'} src={IconCalendar.src} />
          </Center>
        </InputRightElement>
      </InputGroup>
    );
  });

  return (
    <Box className="custom-range-date" w={'100%'} ref={datePickerRef}>
      <DatePicker
        onClickOutside={() => onClose()}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => {
          return (
            <HStack justifyContent="space-between" pl="15px" pr="2px">
              <Flex alignItems="center">
                <Text>{getYyyyMmDdMmSsToString(date)}</Text>
                <Accordion index={accordionBtn} defaultIndex={[]} allowMultiple>
                  <AccordionItem bg="#ffffff" border="#FFF">
                    <AccordionButton
                      px="5px"
                      h="25px"
                      onClick={() => {
                        if (accordionBtn.length === 1) {
                          setAccordionBtn([]);
                        } else {
                          setAccordionBtn([0]);
                        }
                      }}
                      _hover={{ bg: '#fff' }}
                    >
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      bg="#FFF"
                      left="-1px"
                      w="262px"
                      h="265.8px"
                      position="absolute"
                      overflowY="scroll"
                      overflowX="clip"
                      boxSizing="border-box"
                      borderLeft="1px solid #aeaeae"
                      borderRight="1px solid #aeaeae"
                      borderBottom="1px solid #aeaeae"
                      borderBottomRadius="8px"
                    >
                      <Wrap w="260px" px="10px">
                        {years.map((option) => {
                          return (
                            <WrapItem key={option}>
                              <Center>
                                <Button
                                  onClick={({ target: { value } }) => {
                                    setAccordionBtn([]);
                                    return changeYear(value);
                                  }}
                                  value={option}
                                >
                                  {option}
                                </Button>
                              </Center>
                            </WrapItem>
                          );
                        })}
                      </Wrap>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Flex>
              <HStack alignItems={'center'}>
                <Box>
                  <HStack justifyContent="center" alignItems="center" h="100%">
                    <Button
                      py={3}
                      onClick={handleInitDate}
                      _hover={{ opacity: 0.7 }}
                      _active={{}}
                      _focus={{}}
                      size="xs"
                      bg={'transparent'}
                      borderRadius={'0.25rem'}
                      border={'1px solid #7895B2'}
                      boxSizing={'border-box'}
                    >
                      <Center h={'100%'}>
                        <Text
                          fontWeight={400}
                          fontSize={'0.8rem'}
                          color={'#7895B2'}
                          lineHeight={'1rem'}
                        >
                          {localeText(LANGUAGES.PRODUCTS.RESET)}
                        </Text>
                      </Center>
                    </Button>
                  </HStack>
                </Box>
                <Center
                  w={'1.5rem'}
                  h={'1.5rem'}
                  onClick={() => {
                    if (prevMonthButtonDisabled || accordionBtn.length === 1)
                      return;
                    decreaseMonth();
                  }}
                >
                  <Img h={'100%'} src={IconLeft.src} />
                </Center>
                <Center
                  w={'1.5rem'}
                  h={'1.5rem'}
                  onClick={() => {
                    if (nextMonthButtonDisabled || accordionBtn.length === 1)
                      return;
                    increaseMonth();
                  }}
                >
                  <Img h={'100%'} src={IconRight.src} />
                </Center>
              </HStack>
            </HStack>
          );
        }}
        customInput={<CustomDetePicker />}
        dayClassName={(d) => {
          if (typeof d === 'object') {
            const tempDate = utils.parseDateToStr(d);
            const tempStartDate = utils.parseDateToStr(start);
            const tempEndDate = utils.parseDateToStr(end);
            if (tempStartDate === tempDate) {
              return 'custom-start-day';
            }
            if (tempEndDate === tempDate) {
              return 'custom-end-day';
            }
            if (start < d && end > d) {
              return 'custom-day';
            }
          }
        }}
        open={isOpen}
        locale={enUS}
        dateFormat={'yyyy. MM. dd'}
        selected={startDate}
        onChange={handleOnChange}
        minDate={isAfter ? now : undefined}
        maxDate={isAfter ? undefined : now}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        showDisabledMonthNavigation
      />
    </Box>
  );
};

export default RangeDatePicker;

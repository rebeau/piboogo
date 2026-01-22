'use client';

import React, { useEffect, useState, useRef, forwardRef } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Input,
  InputGroup,
  Text,
  Wrap,
  WrapItem,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Image,
  InputRightElement,
} from '@chakra-ui/react';
import { getYear } from 'date-fns';
import { range } from 'lodash';
import { ko, enUS } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import utils from '@/utils';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';
import IconCalendar from '@public/svgs/icon/calendar.svg';
import IconLeft from '@public/svgs/icon/left.svg';
import IconRight from '@public/svgs/icon/right.svg';
import { TIME_ZONE } from '@/constants/common';
import { toZonedTime } from 'date-fns-tz';

const years = range(2010, getYear(new Date()) + 1, 1);

// Custom Input (Input + Calendar Icon)
const DatePickerIcon = forwardRef(
  (
    { value, onClick, date, showTimeSelect, w, h = '3.25rem', bg, type },
    ref,
  ) => {
    const formatted = date
      ? utils.parseDateToStr(date, '.', showTimeSelect)
      : `YYYY. MM. DD ${showTimeSelect ? 'HH:MM:SS' : ''}`;
    return (
      <InputGroup onClick={onClick} w="max-content">
        <Input
          w={'10.3rem'}
          h={'100%'}
          bg={bg ? `${bg} !important` : undefined}
          px={'1rem'}
          py={'0.75rem'}
          _placeholder={{
            fontWeight: 400,
            fontSize: '0.9375rem',
            lineHeight: '1.5rem',
            color: '#A7C3D2',
          }}
          boxSizing={'border-box'}
          // border={'1px solid #9CADBE'}
          border={0}
          fontSize={'0.9375rem'}
          lineHeight={'1.5rem'}
          fontWeight={400}
          color={'#485766'}
          readOnly
          ref={ref}
          value={formatted}
        />
        <InputRightElement
          w={'3.5rem'}
          h={'100%'}
          _hover={{
            cursor: 'pointer',
          }}
        >
          <Center w={'1.5rem'} h={'1.5rem'}>
            <Image src={IconCalendar.src} alt="calendar" />
          </Center>
        </InputRightElement>
      </InputGroup>
    );
  },
);
DatePickerIcon.displayName = 'DatePickerIcon';

// Custom Header (Year selector + Month Navigation)
const CustomHeader = ({
  date,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  handleInitDate,
  accordionBtn,
  setAccordionBtn,
}) => {
  const now = toZonedTime(new Date(), TIME_ZONE);
  const { localeText } = useLocale();
  const getFormattedMonth = (date) =>
    `${date.getFullYear()}년 ${(date.getMonth() + 1).toString().padStart(2, '0')}월`;

  return (
    <HStack justifyContent="space-between" px="12px" pt="6px">
      <Flex alignItems="center">
        <Text className="month-label">{getFormattedMonth(date)}</Text>
        <Accordion index={accordionBtn} allowMultiple background="transparent">
          <AccordionItem border="none" background="transparent">
            <AccordionButton
              px="5px"
              h="25px"
              background="transparent"
              onClick={() =>
                setAccordionBtn((prev) => (prev.length ? [] : [0]))
              }
              _hover={{ bg: 'transparent' }}
            >
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              bg="#FFF"
              left="-1px"
              bottom={'-177px'}
              w="248px"
              h="200px"
              position="absolute"
              overflowY="scroll"
              overflowX="clip"
              boxSizing="border-box"
              borderLeft="1px solid #aeaeae"
              borderRight="1px solid #aeaeae"
              borderBottom="1px solid #aeaeae"
              borderBottomRadius="8px"
            >
              <Wrap w="248px">
                {years.map((year) => (
                  <WrapItem key={year}>
                    <Center>
                      <Button
                        px={'1rem'}
                        onClick={() => {
                          changeYear(year);
                          setAccordionBtn([]);
                        }}
                        value={year}
                      >
                        {year}
                      </Button>
                    </Center>
                  </WrapItem>
                ))}
              </Wrap>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>

      <HStack spacing="2">
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
        <Center
          w={'1.5rem'}
          h={'1.5rem'}
          onClick={() => {
            if (prevMonthButtonDisabled || accordionBtn.length === 1) return;
            decreaseMonth();
          }}
        >
          <Image alt="prev" h={'100%'} src={IconLeft.src} />
        </Center>
        <Center
          w={'1.5rem'}
          h={'1.5rem'}
          onClick={() => {
            if (nextMonthButtonDisabled || accordionBtn.length === 1) return;
            increaseMonth();
          }}
        >
          <Image alt="next" h={'100%'} src={IconRight.src} />
        </Center>
      </HStack>
    </HStack>
  );
};

// 최종 RangeDateSplitPicker 컴포넌트
const RangeDateSplitPicker = ({
  startDate: startProp,
  endDate: endProp,
  onChange,
  onInit,
  isDisabled = false,
  showTimeSelect = false,
  isAfter = false,
  bg,
}) => {
  const now = toZonedTime(new Date(), TIME_ZONE);
  const startDatePickerRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [accordionBtn, setAccordionBtn] = useState([]);

  useEffect(() => {
    setAccordionBtn([]);
    setStartDate(startProp || null);
    setEndDate(endProp || null);
  }, [startProp, endProp]);

  const handleInitDate = () => {
    setStartDate(null);
    setEndDate(null);
    onChange?.([null, null]);
    startDatePickerRef.current?.setOpen(false);
    endDatePickerRef.current?.setOpen(false);
    if (onInit) {
      onInit();
    }
  };

  const commonProps = {
    locale: enUS,
    autoComplete: 'off',
    showTimeSelect,
    timeCaption: '시간',
    shouldCloseOnSelect: true,
    filterTime: (time) => now.getTime() < time.getTime(),
    dateFormat: 'YYYY. MM. DD',
    popperPlacement: 'bottom-start',
  };

  return (
    <Box className="custom-range-date">
      <HStack
        spacing={0}
        border={'1px solid #9CADBE'}
        borderRadius={'0.25rem'}
        bg="#FFF"
        h="100%"
      >
        <DatePicker
          {...commonProps}
          ref={startDatePickerRef}
          selected={startDate}
          maxDate={endDate ?? now}
          onChange={(date) => {
            setStartDate(date);
            onChange?.([date, endDate]);
          }}
          customInput={
            <DatePickerIcon
              type={1}
              h={'3.5rem'}
              bg={bg}
              date={startDate}
              showTimeSelect={showTimeSelect}
            />
          }
          // withPortal
          dayClassName={(d) => {
            if (typeof d === 'object') {
              const tempDate = utils.parseDateToStr(d);
              const tempStartDate = utils.parseDateToStr(startDate);
              const tempEndDate = utils.parseDateToStr(endDate);
              if (tempStartDate === tempDate) {
                return 'custom-start-day';
              }
              /*
              if (tempEndDate === tempDate) {
                return 'custom-end-day';
              }
              */
              /*
              if (startDate < d && endDate > d) {
                return 'custom-day';
              }
              */
            }
          }}
          renderCustomHeader={(props) => (
            <CustomHeader
              {...props}
              handleInitDate={handleInitDate}
              accordionBtn={accordionBtn}
              setAccordionBtn={setAccordionBtn}
            />
          )}
        />
        <Text px={2} color="#000" fontWeight="bold">
          -
        </Text>
        <DatePicker
          {...commonProps}
          ref={endDatePickerRef}
          selected={endDate}
          minDate={startDate ?? undefined}
          maxDate={isAfter ? undefined : now}
          onChange={(date) => {
            setEndDate(date);
            onChange?.([startDate, date]);
          }}
          customInput={
            <DatePickerIcon
              type={2}
              h={'3.5rem'}
              bg={bg}
              date={endDate}
              showTimeSelect={showTimeSelect}
            />
          }
          dayClassName={(d) => {
            if (typeof d === 'object') {
              const tempDate = utils.parseDateToStr(d);
              const tempStartDate = utils.parseDateToStr(startDate);
              const tempEndDate = utils.parseDateToStr(endDate);
              /*
              if (tempStartDate === tempDate) {
                return 'custom-start-day';
              }
                */
              if (tempEndDate === tempDate) {
                return 'custom-end-day';
              }
              /*
              if (startDate < d && endDate > d) {
                return 'custom-day';
              }
              */
            }
          }}
          renderCustomHeader={(props) => (
            <CustomHeader
              {...props}
              handleInitDate={handleInitDate}
              accordionBtn={accordionBtn}
              setAccordionBtn={setAccordionBtn}
            />
          )}
        />
      </HStack>
    </Box>
  );
};

export default RangeDateSplitPicker;

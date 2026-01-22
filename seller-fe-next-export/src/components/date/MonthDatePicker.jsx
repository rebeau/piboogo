import React, { useCallback, useEffect, useState } from 'react';
import { Center, HStack, Img, Text } from '@chakra-ui/react';
import IconLeft from '@public/svgs/icon/left.svg';
import IconRight from '@public/svgs/icon/right.svg';
import useLocale from '@/hooks/useLocale';

const MonthDatePicker = (props) => {
  const { handleOnChangeDate } = props;
  const { lang, localeText } = useLocale();

  const handleOnChange = (date) => {
    if (handleOnChangeDate) {
      handleOnChangeDate(date);
    }
  };

  // 현재 날짜에서 연도와 월만 사용
  const [currentDate, setCurrentDate] = useState(new Date());

  // 월을 감소시키는 함수
  const handelDecreaseMonth = useCallback(() => {
    // 현재 날짜의 연도와 월만 수정
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1); // 월을 1 감소
    newDate.setDate(1);
    setCurrentDate(newDate);
    handleOnChange(newDate);
    // console.log('Decreased Month:', newDate);
  }, [currentDate]);

  // 월을 증가시키는 함수
  const handelIncreaseMonth = useCallback(() => {
    // 현재 날짜의 연도와 월만 수정
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1); // 월을 1 증가
    newDate.setDate(1);
    setCurrentDate(newDate);
    handleOnChange(newDate);
    // console.log('Increased Month:', newDate);
  }, [currentDate]);

  const formattedMonth = (currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0');

  return (
    <Center
      w={'100%'}
      h={'100%'}
      px={'1.5rem'}
      py={'1rem'}
      boxSizing={'border-box'}
      border={'1px solid #9CADBE'}
      borderRadius={'0.25rem'}
    >
      <HStack spacing={'1.25rem'} justifyContent={'space-between'}>
        <Center
          w={'1.25rem'}
          h={'1.25rem'}
          cursor={'pointer'}
          onClick={() => {
            handelDecreaseMonth();
          }}
        >
          <Img w={'100%'} h={'100%'} src={IconLeft.src} />
        </Center>
        <Text
          w={'4rem'}
          color={'#485766'}
          fontSize={'1rem'}
          fontWeight={400}
          lineHeight={'1.75rem'}
        >
          {`${currentDate.getFullYear()}.${formattedMonth}`}
        </Text>
        <Center
          w={'1.25rem'}
          h={'1.25rem'}
          cursor={'pointer'}
          onClick={() => {
            handelIncreaseMonth();
          }}
        >
          <Img w={'100%'} h={'100%'} src={IconRight.src} />
        </Center>
      </HStack>
    </Center>
  );
};

export default MonthDatePicker;

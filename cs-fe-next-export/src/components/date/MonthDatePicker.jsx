import React, { useCallback, useState } from 'react';
import { Center, HStack, Img, Text, VStack, Box, Grid } from '@chakra-ui/react';
import IconLeft from '@public/svgs/icon/left.svg';
import IconRight from '@public/svgs/icon/right.svg';
import useLocale from '@/hooks/useLocale';

const MonthDatePicker = (props) => {
  const { handleOnChangeDate } = props;
  const { localeText } = useLocale();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMonthSelectOpen, setIsMonthSelectOpen] = useState(false);
  const [yearForSelect, setYearForSelect] = useState(currentDate.getFullYear());

  const handleOnChange = (date) => {
    if (handleOnChangeDate) {
      const lastDayOfMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
      );
      handleOnChangeDate({ startDate: date, endDate: lastDayOfMonth });
    }
  };

  const handelDecreaseMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    newDate.setDate(1);
    setCurrentDate(newDate);
    handleOnChange(newDate);
  }, [currentDate]);

  const handelIncreaseMonth = useCallback(() => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    newDate.setDate(1);
    setCurrentDate(newDate);
    handleOnChange(newDate);
  }, [currentDate]);

  const handleSelectMonth = (month) => {
    const newDate = new Date(yearForSelect, month - 1, 1);
    setCurrentDate(newDate);
    handleOnChange(newDate);
    setIsMonthSelectOpen(false);
  };

  const formattedMonth = (currentDate.getMonth() + 1)
    .toString()
    .padStart(2, '0');

  const handleDecreaseYear = () => {
    setYearForSelect((prev) => prev - 1);
  };

  const handleIncreaseYear = () => {
    setYearForSelect((prev) => prev + 1);
  };

  return (
    <Center
      w={'100%'}
      h={'100%'}
      px={'1.5rem'}
      py={'1rem'}
      boxSizing={'border-box'}
      border={'1px solid #9CADBE'}
      borderRadius={'0.25rem'}
      position={'relative'}
    >
      {isMonthSelectOpen && (
        <VStack
          py={'0.5rem'}
          px={'0.5rem'}
          spacing={2}
          position={'absolute'}
          bottom={'-12rem'}
          bg="#90aec4"
          borderRadius={'1rem'}
          zIndex={1}
        >
          <HStack justifyContent={'space-between'} w="100%">
            <Center
              w={'1.5rem'}
              h={'1.5rem'}
              cursor={'pointer'}
              onClick={handleDecreaseYear}
            >
              <Img w={'100%'} h={'100%'} src={IconLeft.src} />
            </Center>
            <Text
              fontSize={'1rem'}
              fontWeight={500}
              lineHeight={'2.25rem'}
              color={'#485766'}
            >
              {yearForSelect}
            </Text>
            <Center
              w={'1.5rem'}
              h={'1.5rem'}
              cursor={'pointer'}
              onClick={handleIncreaseYear}
            >
              <Img w={'100%'} h={'100%'} src={IconRight.src} />
            </Center>
          </HStack>

          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            {Array.from({ length: 12 }, (_, i) => (
              <Box
                key={i + 1}
                w="3rem"
                h="2rem"
                textAlign="center"
                borderRadius="md"
                border="1px solid #ccc"
                cursor="pointer"
                bg={
                  currentDate.getFullYear() === yearForSelect &&
                  currentDate.getMonth() === i
                    ? '#7895B2'
                    : 'white'
                }
                color={
                  currentDate.getFullYear() === yearForSelect &&
                  currentDate.getMonth() === i
                    ? 'white'
                    : 'black'
                }
                lineHeight="2rem"
                onClick={() => handleSelectMonth(i + 1)}
              >
                {i + 1}
              </Box>
            ))}
          </Grid>
        </VStack>
      )}

      <HStack spacing={'1.25rem'} justifyContent={'space-between'}>
        <Center
          w={'1.25rem'}
          h={'1.25rem'}
          cursor={'pointer'}
          onClick={handelDecreaseMonth}
        >
          <Img w={'100%'} h={'100%'} src={IconLeft.src} />
        </Center>
        <Text
          w={'5rem'}
          color={'#485766'}
          fontSize={'1rem'}
          fontWeight={400}
          lineHeight={'1.75rem'}
          cursor="pointer"
          onClick={() => {
            setYearForSelect(currentDate.getFullYear());
            setIsMonthSelectOpen(true);
          }}
        >
          {`${currentDate.getFullYear()}.${formattedMonth}`}
        </Text>
        <Center
          w={'1.25rem'}
          h={'1.25rem'}
          cursor={'pointer'}
          onClick={handelIncreaseMonth}
        >
          <Img w={'100%'} h={'100%'} src={IconRight.src} />
        </Center>
      </HStack>
    </Center>
  );
};

export default MonthDatePicker;

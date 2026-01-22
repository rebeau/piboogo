'use client';

// components/StarRating.js
import { Box, Icon, HStack, Tooltip } from '@chakra-ui/react';
import { RiStarSFill } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import useDevice from '@/hooks/useDevice';

const StarRating = ({
  initialRating = 0,
  rating,
  onChange,
  w = '1.5rem',
  h = '1.5rem',
}) => {
  const { isMobile, clampW } = useDevice();
  const [viewRating, setViewRating] = useState(initialRating);

  useEffect(() => {
    if (!rating && initialRating) {
      setViewRating(initialRating);
    } else {
      setViewRating(rating);
    }
  }, [rating, initialRating]);

  const handleMouseEnter = (index) => {
    setViewRating(index);
  };

  const handleMouseLeave = () => {
    setViewRating(initialRating);
  };

  const handleClick = (index) => {
    setViewRating(index);
    if (onChange) onChange(index); // 부모 컴포넌트에 값 전달
  };

  return (
    <HStack spacing={clampW(0, 1)}>
      {Array(5)
        .fill('')
        .map((_, index) => {
          const isFilled = index < viewRating;
          /*
          return (
            <Tooltip key={index} label={`Rate ${index + 1} stars`}>
              <Box
                w={'1.5rem'}
                h={'1.5rem'}
                as="span"
                onMouseEnter={() => handleMouseEnter(index + 1)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(index + 1)}
                cursor="pointer"
              >
                <Icon
                  as={FaStar}
                  color={isFilled ? '#FFBF00' : '#D9E7EC'}
                  boxSize={6}
                />
              </Box>
            </Tooltip>
          );
          */
          return (
            <Box
              key={index}
              w={w}
              h={h}
              as="span"
              // onMouseEnter={() => handleMouseEnter(index + 1)}
              // onMouseLeave={handleMouseLeave}
              onClick={() => {
                if (onChange) {
                  handleClick(index + 1);
                }
              }}
              cursor={onChange ? 'pointer' : null}
            >
              <Icon
                as={RiStarSFill}
                color={isFilled ? '#FFBF00' : '#D9E7EC'}
                w={'100%'}
                h={'100%'}
                // boxSize={6}
              />
            </Box>
          );
        })}
    </HStack>
  );
};

export default StarRating;

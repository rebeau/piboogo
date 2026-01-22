import { useEffect, useState } from 'react';
import utils from '@/utils';
import { Box, Text } from '@chakra-ui/react';
import { RADIUS_S_40 } from '@/constants/common';

const TypingText = (props) => {
  const {
    textArr = [],
    isRemove = false,
    fontSize = 38,
    isStart = false,
    isEnded = false,
  } = props;
  const { onStart, onEnded } = props;

  const [ended, setEnded] = useState(false);

  const speed = 100;
  const [tempText, setTempText] = useState('');
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isStart && onStart) {
      onStart();
    }
  }, []);

  useEffect(() => {
    let isMounted = !isEnded;

    const wait = (ms) => new Promise((res) => setTimeout(res, ms));

    const typing = async () => {
      const currentText = textArr[index];
      const fullText = currentText.split('');

      if (isDeleting) {
        while (fullText.length) {
          if (!isMounted) return;
          await wait(speed);
          fullText.pop();
          setTempText(fullText.join(''));
        }
        setIsDeleting(false);
        setIndex((prevIndex) => (textArr[prevIndex + 1] ? prevIndex + 1 : 0));
      } else {
        while (fullText.length) {
          if (!isMounted) return;
          setTempText((prevText) => prevText + fullText.shift());
          await wait(speed);
        }
        await wait(800);
        if (isRemove) {
          setIsDeleting(true);
        } else {
          setIndex((prevIndex) => (textArr[prevIndex + 1] ? prevIndex + 1 : 0));
        }
        setEnded(true);
      }
    };

    const initialTimeout = setTimeout(typing, 1500);

    return () => {
      isMounted = false;
      clearTimeout(initialTimeout);
    };
  }, [index, isDeleting, isRemove, textArr]);

  useEffect(() => {
    if (ended) {
      if (onEnded) {
        onEnded();
      }
    }
  }, [ended]);

  const [tempFontSize, setTempFontSize] = useState('');

  useEffect(() => {
    if (fontSize) {
      setTempFontSize(utils.getFontSize(fontSize));
    }
  }, [fontSize]);

  return (
    <Box
      bg="#FFF"
      borderRadius={RADIUS_S_40}
      w={'100%'}
      h={'11.94%'}
      minH={'11.94%'}
      py={'4%'}
      px={'5.5%'}
    >
      <Text fontWeight={700} fontSize={tempFontSize} lineHeight={'110%'}>
        {tempText.split('').map((splitText, index) => {
          const key = `${splitText}${index}`;
          return (
            <span
              key={key}
              style={{
                padding: '1px',
                color:
                  splitText === '반' || splitText === '복' ? 'red' : 'black',
              }}
            >
              {splitText}
            </span>
          );
        })}
      </Text>
    </Box>
  );
};

export default TypingText;

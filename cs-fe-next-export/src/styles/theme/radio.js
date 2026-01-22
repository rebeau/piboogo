import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { radioAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyle = definePartsStyle({
  control: {
    width: '1.5rem',
    height: '1.5rem',
    border: '1px solid',
    borderColor: '#000920',
    borderRadius: '0.25rem',
    bg: '#FFF',
    _hover: {
      border: '1px solid',
      borderColor: '#556A7E !important',
      color: '#556A7E',
      background: '#FFF !important',
    },
    _checked: {
      position: 'relative',
      padding: '0.06rem',
      borderColor: '#556A7E !important',
      color: '#556A7E',
      background: '#FFF !important',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '60%',
        height: '60%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#556A7E', // 체크된 부분은 흰색으로 채우기
        borderRadius: '0.2rem', // 내부도 네모 모양
      },
    },
    _disabled: {
      borderColor: '#000920 !important',
      color: '#000920',
      background: '#FFF !important',
    },
  },
});

export const radioTheme = defineMultiStyleConfig({ baseStyle });

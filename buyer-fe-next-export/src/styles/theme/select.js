import { selectAnatomy } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  defineStyle,
  defineStyleConfig,
} from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const baseStyle = definePartsStyle({
  control: {
    border: '1px solid',
    borderColor: '#000920',
  },
  field: {
    w: '100%',
    minW: '100px',
    h: '100%',
    minH: '30px',
    color: '#000',
    border: '1px solid',
    borderColor: '#E3E8F1',
    background: '#FFF',
    // borderColor: 'red !important',
    // color: 'red',
  },
  icon: {
    // color: 'blue.400',
    // fontSize: '13px',
  },
  _disabled: {
    opacity: 1,
    bg: 'rgba(245, 247, 251, 1)',
    borderColor: 'rgba(245, 247, 251, 1)',
  },
});

const outline = defineStyle({
  field: {
    background: '#FFF',
    borderColor: '#E3E8F1 !important',
    color: 'dark.default',
    fontSize: '16px',
    fontWeight: 500,
    _disabled: {
      // color: 'rgba(0, 9, 32, 0.5)',
      // border: 'none',
      opacity: 1,
      bg: 'rgba(245, 247, 251, 1)',
      borderColor: 'rgba(245, 247, 251, 1)',
    },
    _hover: {
      opacity: '0.8',
    },
    _active: {
      // opacity: '0.8',
    },
  },
});

const outlineDark = defineStyle({
  field: {
    background: 'dark.default',
    borderColor: '#E3E8F1 !important',
    color: '#FFF',
    fontSize: '16px',
    fontWeight: 500,
    _disabled: {
      // color: 'rgba(0, 9, 32, 0.5)',
      // border: 'none',
      opacity: 1,
      bg: 'rgba(245, 247, 251, 1)',
      borderColor: 'rgba(245, 247, 251, 1)',
    },
    _hover: {
      opacity: '0.8',
    },
    _active: {
      // opacity: '0.8',
      bg: 'black',
    },
  },
  icon: {
    color: '#FFF',
  },
});

// export const selectTheme = defineMultiStyleConfig({ baseStyle });

export const selectTheme = defineStyleConfig({
  baseStyle,
  defaultProps: {
    variant: null, // null here
  },
  variants: { outline, outlineDark },
});

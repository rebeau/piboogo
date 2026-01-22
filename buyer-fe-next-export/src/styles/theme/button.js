import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const baseStyle = defineStyle({
  boxSizing: 'border-box',
  w: '100%',
  minW: '100px',
  // h: '100%',
  minH: '30px',
  h: '10',
  _hover: {
    // color: 'rgba(0, 9, 32, 1)',
    opacity: '0.8',
  },
  _disabled: {
    opacity: 1,
    bg: '#E5E6E9',
    color: 'rgba(0, 9, 32, 0.5)',
    border: 'none',
  },
  _active: {
    opacity: '0.8',
  },
  /*
  field: {
    color: '#000',
    border: '1px solid',
    borderColor: '#E3E8F1',
    background: '#FFF',
    _placeholder: {
      color: '#C7C8CE',
    },
    _disabled: {
      opacity: 1,
      bg: 'rgba(245, 247, 251, 1)',
      borderColor: 'rgba(245, 247, 251, 1)',
    },
  },
  addon: {
    border: '1px solid',
    borderColor: 'red',
    background: 'gray.200',
    borderRadius: 'full',
    color: 'gray.500',
  },
  */
});

const outline = defineStyle({
  boxSizing: 'border-box',
  borderRadius: '4px',
  _hover: {
    // color: 'rgba(0, 9, 32, 1)',
    opacity: '0.8',
  },
  _disabled: {
    opacity: 1,
    bg: '#E5E6E9',
    color: 'rgba(0, 9, 32, 0.5)',
    border: 'none',
  },
  _active: {
    // opacity: '0.8',
  },
});

const chip = defineStyle({
  boxSizing: 'border-box',
  borderRadius: '4px',
  bg: '#FFF',
  border: '1px solid',
  borderColor: '#50555C',
  color: '#000920',
  h: '32px',
  _hover: {
    // color: 'rgba(0, 9, 32, 1)',
    opacity: '0.8',
  },
  _disabled: {
    opacity: 1,
    bg: '#E5E6E9',
    color: 'rgba(0, 9, 32, 0.5)',
    border: 'none',
  },
  _active: {
    bg: '#FFFFFF',
    opacity: '0.8',
    border: '1px solid',
    borderColor: '#02CD80',
    color: '#02CD80',
  },
});

export const buttonTheme = defineStyleConfig({
  baseStyle,
  defaultProps: {
    variant: null, // null here
  },
  variants: { outline, chip },
});

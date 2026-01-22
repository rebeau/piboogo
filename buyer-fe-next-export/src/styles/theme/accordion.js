import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    // color: '#CCD2E3',
    // width: '100%',
    // bg: '#FFF',
    // height: '56px',
  },
  button: {
    // height: '56px',
    // paddingTop: '1.25rem',
    // paddingBottom: '1.25rem',
  },
  panel: {
    // paddingTop: '0rem',
    // paddingBottom: '1.25rem',
    // paddingLeft: '0px',
    // paddingRight: '0px',
    // height: '56px',
    // h: '56px',
  },
});

export const accordionTheme = defineMultiStyleConfig({ baseStyle });

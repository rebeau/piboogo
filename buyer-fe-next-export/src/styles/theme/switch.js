import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

/*
const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    // ...
    // width: '100px',
    // height: '60px',
    // size: 'lg',
    // width: { md: '100px', md: '90px', sm: '80px', xs: '70px' },
    width: '100px',
    height: '60px',
  },
  thumb: {
    bg: '#FFF',
    mt: '7px',
    ml: '3px',
    w: '44px',
    h: '44px',
    _checked: {
      bg: '#FFF',
      transform: 'translateX(50px)',
    },
  },
  track: {
    width: '100px',
    height: '60px',
    bg: '#466E05',
    // bg: 'red',
    _checked: {
      bg: '#75B125',
    },
  },
});
export const switchTheme = defineMultiStyleConfig({ baseStyle });

const baseStyle = definePartsStyle((props) => ({
  // define the part you're going to style
  container: {
    // ...
  },
  thumb: {
    bg: '#FFF',
    _checked: {
      bg: '#FFF',
      transform: 'translateX(50px)',
    },
  },
  track: {
    //...
    bg: '#466E05',
    // bg: 'red',
    _checked: {
      bg: '#75B125',
    },
  },
  track: baseStyleTrack(props),
}));

const baseStyle = {
  container: {},
  thumb: {
    bg: '#FFF',
    _checked: {
      bg: '#FFF',
      transform: 'translateX(50px)',
    },
  },
  track: {
    bg: '#466E05',
    _checked: {
      bg: '#75B125',
    },
  },
  track: {},
};

const baseStyleTrack = defineStyle((props) => {
  const { colorScheme: c } = props;

  return {
    bg: `${c}.200`,
    _checked: {
      bg: `${c}.200`,
    },
    _dark: {
      bg: `${c}.900`,
      _checked: {
        bg: `${c}.900`,
      },
    },
  };
});


const boxy = definePartsStyle({
  track: {
    borderRadius: 'sm',
    p: 1,
  },
});
*/

const xs = defineStyle({
  container: {
    width: '60px',
    height: '30px',
    //
  },
  thumb: {
    width: '25px',
    height: '25px',
    mt: '2px',
    ml: '3px',
    _checked: {
      bg: '#FFF',
      //
      transform: 'translateX(29px)',
    },
  },
  track: {
    width: '60px',
    height: '30px',
    //
    bg: '#466E05',
    _checked: {
      bg: '#75B125',
    },
  },
});

const sm = defineStyle({
  container: {
    width: '70px',
    height: '35px',
    //
  },
  thumb: {
    width: '30px',
    height: '30px',
    mt: '3px',
    ml: '3px',
    _checked: {
      bg: '#FFF',
      //
      transform: 'translateX(33px)',
    },
  },
  track: {
    width: '70px',
    height: '35px',
    //
    bg: '#466E05',
    _checked: {
      bg: '#75B125',
    },
  },
});

const md = defineStyle({
  container: {
    width: '80px',
    height: '40px',
    //
  },
  thumb: {
    width: '36px',
    height: '36px',
    mt: '2px',
    ml: '3px',
    _checked: {
      bg: '#FFF',
      //
      transform: 'translateX(38px)',
    },
  },
  track: {
    width: '80px',
    height: '40px',
    //
    bg: '#466E05',
    _checked: {
      bg: '#75B125',
    },
  },
});

const lg = defineStyle({
  container: {
    width: '90px',
    height: '50px',
    //
  },
  thumb: {
    width: '40px',
    height: '40px',
    mt: '5px',
    ml: '3px',
    _checked: {
      bg: '#FFF',
      //
      transform: 'translateX(44px)',
    },
  },
  track: {
    width: '90px',
    height: '50px',
    //
    bg: '#466E05',
    _checked: {
      bg: '#75B125',
    },
  },
});

const xl = defineStyle({
  container: {
    width: '100px',
    height: '60px',
    //
  },
  thumb: {
    width: '44px',
    height: '44px',
    mt: '7px',
    ml: '3px',
    _checked: {
      bg: '#FFF',
      //
      transform: 'translateX(50px)',
    },
  },
  track: {
    width: '100px',
    height: '60px',
    //
    bg: '#466E05',
    _checked: {
      bg: '#75B125',
    },
  },
});

const customSizes = {
  xs: definePartsStyle(xs),
  sm: definePartsStyle(sm),
  md: definePartsStyle(md),
  lg: definePartsStyle(lg),
  xl: definePartsStyle(xl),
};

export const switchTheme = defineMultiStyleConfig({
  // baseStyle,
  sizes: customSizes,
  /*
  sizes: {
    xs: {
      track: { width: '24px', height: '14px' },
      thumb: { width: '12px', height: '12px' },
    },
    sm: {
      track: { width: '32px', height: '20px' },
      thumb: { width: '16px', height: '16px' },
    },
    md: {
      track: { width: '40px', height: '24px' },
      thumb: { width: '20px', height: '20px' },
    },
    lg: {
      track: { width: '48px', height: '28px' },
      thumb: { width: '24px', height: '24px' },
    },
    xl: {
      container: { width: '100px', height: '60px' },
      track: { width: '100px', height: '60px' },
      thumb: { width: '44px', height: '44px', mt: '7px', ml: '3px' },
    },
  },
  */
  // variants: { boxy },
});

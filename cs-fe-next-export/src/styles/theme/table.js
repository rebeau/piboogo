import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle((props) => {
  const { colorScheme: c, colorMode } = props;

  return {
    th: {
      // fontWeight: 'semibold',
      textTransform: 'none',
      letterSpacing: 'normal',
      px: '0.5rem',
      py: '0.75rem',
      '&[data-is-numeric=true]': {
        textAlign: 'end',
      },
    },
    td: {
      px: '0.5rem',
      py: '0.75rem',
      '&[data-is-numeric=true]': {
        textAlign: 'end',
      },
    },
    caption: {
      mt: 4,
      // fontWeight: 'medium',
      fontSize: 'sm',
      textAlign: 'center',
      color: colorMode === 'light' ? `${c}.600` : `${c}.100`,
    },
    tfoot: {
      tr: {
        '&:last-of-type': {
          th: { borderBottomWidth: 0 },
        },
      },
    },
  };
});

const variantCustom = definePartsStyle((props) => ({
  ...baseStyle(props),
}));

const sizes = {
  md: {
    td: {
      px: '0.5rem',
      py: '0.75rem',
    },
    th: {
      px: '0.5rem',
      py: '0.75rem',
    },
  },
};

export const tableTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: {
    custom: variantCustom,
  },
  defaultProps: {
    size: 'md',
    colorScheme: 'gray',
    variant: 'custom',
  },
});

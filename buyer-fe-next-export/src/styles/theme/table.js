import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tableAnatomy.keys);

const baseStyle = definePartsStyle({
  table: {
    fontVariantNumeric: 'lining-nums tabular-nums',
    borderCollapse: 'collapse',
    width: 'full',
  },
  th: {
    fontFamily: 'heading',
    fontWeight: 'bold',
    // textTransform: 'uppercase',
    letterSpacing: 'wider',
    textAlign: 'start',
  },
  td: {
    // textAlign: 'start',
  },
  caption: {
    /*
    mt: 4,
    fontFamily: 'heading',
    textAlign: 'center',
    fontWeight: 'medium',
    */
  },
});

const variantRounded = definePartsStyle((props) => {
  const { colorScheme, colorMode } = props;

  return {
    tr: {
      'td:first-child': {
        bg: 'red',
        borderTopLeftRadius: 'full',
        borderBottomLeftRadius: 'full',
      },
      'td:last-child': {
        borderTopRightRadius: 'full',
        borderBottomRightRadius: 'full',
      },
    },
    th: {
      '&[data-is-numeric=true]': {
        textAlign: 'end',
      },
    },
    td: {
      '&[data-is-numeric=true]': {
        textAlign: 'end',
      },
    },
    caption: {
      color: colorMode === 'light' ? `${c}.600` : `${c}.100`,
    },
    tbody: {
      tr: {
        '&:nth-of-type(odd)': {
          'th, td': {
            borderBottomWidth: '1px',
            borderColor: colorMode === 'light' ? `${c}.100` : `${c}.700`,
          },
          td: {
            background: colorMode === 'light' ? `${c}.100` : `${c}.700`,
          },
        },
        '&:nth-of-type(even)': {
          'th, td': {
            borderBottomWidth: '1px',
            borderColor: colorMode === 'light' ? `${c}.300` : `${c}.600`,
          },
          td: {
            background: colorMode === 'light' ? `${c}.300` : `${c}.600`,
          },
        },
      },
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

const variants = {
  // simple: variantSimple,
  // striped: variantStriped,
  // rounded: variantRounded,
};

export const tableTheme = defineMultiStyleConfig({
  baseStyle,
  variants,
});

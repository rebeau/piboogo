// components/ToggleBox.tsx
import { Box, Text, Img, Center } from '@chakra-ui/react';
import IconChecked from '@public/svgs/icon/checked.svg';

const SideSearchToggle = ({ checked, onToggle, children }) => {
  return (
    <Box
      w="100%"
      display="flex"
      alignItems="center"
      position="relative"
      cursor="pointer"
      borderRadius="0.25rem"
      onClick={onToggle}
    >
      <Box
        w="1.5rem"
        h="1.5rem"
        border="1px solid #000"
        borderRadius="0.25rem"
        position="relative"
        mr="0.75rem"
        bg="#FFF"
      >
        {checked && (
          <Center
            w="100%"
            h="100%"
            alt="checked"
            position="absolute"
            top="0"
            left="0"
          >
            <Box
              w="65%"
              aspectRatio={1}
              borderRadius={'0.25rem'}
              bg="#556A7E"
            />
          </Center>
        )}
      </Box>
      <Text
        color="#485766"
        fontSize="1rem"
        fontWeight={400}
        lineHeight="1.75rem"
      >
        {children}
      </Text>
    </Box>
  );
};

export default SideSearchToggle;

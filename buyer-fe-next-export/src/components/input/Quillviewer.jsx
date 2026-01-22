import { Box } from '@chakra-ui/react';

const QuillViewer = ({ html }) => {
  return (
    <Box
      w="100%"
      sx={{
        '.ql-align-center': { textAlign: 'center' },
        '.ql-align-right': { textAlign: 'right' },
        '.ql-align-left': { textAlign: 'left' },
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default QuillViewer;

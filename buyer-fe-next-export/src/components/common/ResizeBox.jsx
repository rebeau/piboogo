'use client';

import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import utils from '@/utils';

const ResizeBox = (props) => {
  const { children } = props;
  const { h, px, py, bg, my } = props;

  const [tempH, setTempH] = useState(0);
  const [tempMY, setTempMY] = useState(0);
  const [tempHeight, setTempHeight] = useState(0);

  useEffect(() => {
    if (h) {
      setTempH(utils.getHeight(h));
    }
  }, [h]);

  useEffect(() => {
    if (my) {
      setTempMY(utils.getHeight(my));
    }
  }, [my]);

  return (
    <Box
      bg={bg}
      h={tempH}
      my={tempMY}
      px={px}
      //
    >
      {children}
    </Box>
  );
};

export default ResizeBox;

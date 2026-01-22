'use client';

import { Center, Skeleton, Spinner } from '@chakra-ui/react';

const DefaultSkeleton = (props) => {
  const { borderRadius = 0 } = props;
  return (
    <Center
      borderRadius={borderRadius}
      w={'100%'}
      h={'100%'}
      position={'relative'}
    >
      {/* <Spinner position={'absolute'} /> */}
      <Skeleton borderRadius={borderRadius} speed={2} w={'100%'} h={'100%'} />
    </Center>
  );
};

export default DefaultSkeleton;

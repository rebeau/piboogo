import { Center } from '@chakra-ui/react';
import { GText } from '@/components';

const StepInfoText = (props) => {
  const { text = 'TEXT' } = props;

  return (
    <Center w={'100%'} h={`calc(100vh * 0.1)`}>
      <GText fontWeight={700} color={'#000000'} fontSize={36}>
        {text}
      </GText>
    </Center>
  );
};

export default StepInfoText;

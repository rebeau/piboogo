'use client';

import { Input } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import useModal from '@/hooks/useModal';
import settlementApi from '@/services/settlementApi';
import { SUCCESS } from '@/constants/errorCode';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';

const ReturnInput = (props) => {
  const { localeText } = useLocale();
  const { item, onChange } = props;
  const [value, setValue] = useState('');
  const { openModal } = useModal();
  const timer = useRef(null);
  const lastCalledValue = useRef('');

  /*
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (value && value !== lastCalledValue.current) {
        openModal({
          type: 'confirm',
          text: '정산금액을 수정하시겠습니까?',
          onAgree: () => {
            handlePatchSettlementReturn(value);
          },
          onCancel: () => {
            clearTimeout(timer.current);
            lastCalledValue.current = 0;
          },
        });
      }
    }, 1500);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value]);
  */

  const handleBlur = () => {
    if (value && value !== lastCalledValue.current) {
      if (Number(value) === 0) return;
      openModal({
        type: 'confirm',
        text: localeText(LANGUAGES.INFO_MSG.WOULD_MODIFY_SETTLEMENT),
        onAgree: () => {
          handlePatchSettlementReturn(value);
        },
        onCancel: () => {
          clearTimeout(timer.current);
          setValue('');
          lastCalledValue.current = '';
        },
      });
    }
  };

  const handlePatchSettlementReturn = async (amount) => {
    const param = {
      ordersId: item.ordersId,
      returnAmount: amount,
    };
    try {
      const result = await settlementApi.patchSettlementReturn(param);
      onChange(value);
      if (result?.errorCode === SUCCESS) {
        lastCalledValue.current = value;
        openModal({ text: result.message });
      } else {
        openModal({ text: result.message });
      }
    } finally {
      clearTimeout(timer.current);
      lastCalledValue.current = '';
      setValue('');
    }
  };

  return (
    <Input
      ref={lastCalledValue}
      placeholder={localeText(LANGUAGES.SETTLEMENT.RETURN_AMOUNT)}
      value={value}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value > item.settlementAmount) {
          setValue(item.settlementAmount);
        } else if (value < 0) {
          setValue(0);
        } else {
          setValue(e.target.value);
        }
      }}
      bg={'#FFF'}
      onBlur={handleBlur}
      _placeholder={{ color: '#A7C3D2' }}
      border="1px solid #9CADBE"
      color="#485766"
      px="1rem"
      py="0.75rem"
      fontSize="0.9375rem"
      fontWeight={400}
      lineHeight="1.5rem"
      // bg="transparent"
    />
  );
};

export default ReturnInput;

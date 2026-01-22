'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useLounge from '@/hooks/useLounge';
import LoungeDetailForm from '@/components/custom/lounge/detail/LoungeDetailForm';
import { LOUNGE_TYPE_LEGAL_SERVICE } from '@/constants/common';
import LoungeHeader from '@/components/custom/lounge/LoungeHeader';
import MainContainer from '@/components/layout/MainContainer';
import LoungeBody from '@/components/custom/lounge/LoungeBody';
import useMove from '@/hooks/useMove';

const LegalServiceDetailPage = () => {
  const TYPE = LOUNGE_TYPE_LEGAL_SERVICE;
  const { action, loungeId } = useParams();
  const { moveBack } = useMove();

  useEffect(() => {
    if (loungeId && (action === 'modify' || action === 'detail')) {
      getLounge(loungeId);
    } else {
      moveBack();
    }
  }, [loungeId, action]);

  const { loungeInfo, getLounge } = useLounge();
  const [tempLoungeInfo, setTempLoungeInfo] = useState(loungeInfo);

  const handleBody = () => {
    if (action === 'detail') {
      return <LoungeDetailForm loungeInfo={loungeInfo} loungeType={TYPE} />;
    } else if (action === 'modify') {
      return (
        <LoungeBody
          tempLoungeInfo={tempLoungeInfo}
          setTempLoungeInfo={setTempLoungeInfo}
          loungeType={TYPE}
        />
      );
    }
  };

  return (
    <MainContainer
      isDetailHeader
      contentHeader={<LoungeHeader loungeInfo={tempLoungeInfo} />}
    >
      {loungeInfo?.loungeId && handleBody()}
    </MainContainer>
  );
};

export default LegalServiceDetailPage;

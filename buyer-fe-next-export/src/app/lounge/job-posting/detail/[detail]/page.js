'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import useLounge from '@/hooks/useLounge';
import LoungeDetailForm from '@/components/custom/lounge/detail/LoungeDetailForm';
import { LOUNGE_TYPE_JOB_POSTING } from '@/constants/common';

const JobPostingDetailPage = () => {
  const { detail } = useParams();
  const { loungeInfo, getLounge } = useLounge();

  useEffect(() => {
    if (detail) {
      handleGetLounge();
    }
  }, [detail]);

  const handleGetLounge = async () => {
    await getLounge(detail);
  };

  return (
    Object.keys(loungeInfo).length > 0 && (
      <LoungeDetailForm loungeType={LOUNGE_TYPE_JOB_POSTING} />
    )
  );
};

export default JobPostingDetailPage;

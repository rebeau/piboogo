'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import useLounge from '@/hooks/useLounge';
import useDevice from '@/hooks/useDevice';
import { LOUNGE_TYPE_JOB_HUNTING } from '@/constants/common';
import LoungeEditTemplate from '@/components/custom/lounge/edit/LoungeEditTemplate';
import utils from '@/utils';

const JobHuntingEditPage = () => {
  const { isMobile } = useDevice();
  const { action } = useParams();
  const loungeHook = useLounge();
  const {
    setTitle,
    setLink,
    setContent,
    setImages,
    setFiles,
    loungeInfo,
    setCurrentLoungeType,
  } = loungeHook;

  useEffect(() => {
    if (action === 'modify') {
      (async () => {
        setTitle(loungeInfo.title);
        setLink(loungeInfo.link);
        setContent(loungeInfo.content);

        if (loungeInfo?.loungeImageList) {
          const tempImages = [];
          const listFiles = await Promise.all(
            loungeInfo.loungeImageList.map((item) => {
              const image = item.imageS3Url;
              tempImages.push(image);
              return utils.parseUrlToFile(image);
            }),
          );
          setImages(tempImages);
          setFiles(listFiles);
        }
      })();
    } else {
      setCurrentLoungeType(LOUNGE_TYPE_JOB_HUNTING);
    }
  }, [action]);

  return (
    <LoungeEditTemplate
      isMobile={isMobile(true)}
      isModify={action === 'modify'}
      target={LOUNGE_TYPE_JOB_HUNTING}
      loungeHook={loungeHook}
      action={action}
    />
  );
};

export default JobHuntingEditPage;

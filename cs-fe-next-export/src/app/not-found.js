'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useModal from '@/hooks/useModal';
import useLocale from '@/hooks/useLocale';
import { LANGUAGES } from '@/constants/lang';

const Custom404 = () => {
  const router = useRouter();
  const { openModal } = useModal();
  const { localeText } = useLocale();
  //
  useEffect(() => {
    openModal({
      text: localeText(LANGUAGES.PAGE_NOT_FOUND),
      onAgree: () => {
        router.back();
      },
    });
  }, []);

  /*
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ fontSize: '3rem', color: '#ff6347' }}>
        404 - Page Not Found
      </h1>
      <p>The page you're looking for does not exist.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
  */
};

export default Custom404;

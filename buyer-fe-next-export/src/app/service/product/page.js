'use client';

import { PRODUCT, SERVICE } from '@/constants/pageURL';
import { notFound, useParams, useRouter } from 'next/navigation';

const ProductHomePage = () => {
  const { product } = useParams();
  const router = useRouter();
  if (product !== '') {
    // return notFound();
    router.replace(SERVICE.PRODUCT.ROOT);
  }
};

export default ProductHomePage;

'use client';

import { CategoryPage } from '@/components/pages/CategoryPage';
import { useParams } from 'next/navigation';

const CategoryPageWrapper = () => {
  const params = useParams();
  const categoryId = (params?.categoryId as string) || '';
  return <CategoryPage categoryId={categoryId} />;
};

export default CategoryPageWrapper;
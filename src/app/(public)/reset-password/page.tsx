'use client';

import ResetPassword from '@/components/organisms/ResetPassword/ResetPassword';
import React, { Suspense } from 'react';
const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPassword />
    </Suspense>
  );
};

export default Page;

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const DynamicCanvas = dynamic(() => import('@/components/konva'), {
  ssr: false,
});

// https://github.com/konvajs/react-konva/issues/588
export default function KonvaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicCanvas />
    </Suspense>
  );
}

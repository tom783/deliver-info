import { ResultContainer } from '@/containers/user/ResultContainer';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContainer />
    </Suspense>
  );
}

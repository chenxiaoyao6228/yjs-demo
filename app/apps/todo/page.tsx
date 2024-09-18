import dynamic from 'next/dynamic';

// https://github.com/konvajs/react-konva/issues/588
const Todo = dynamic(() => import('@/components/todo'), {
  ssr: false,
});

export default function TodoPage() {
  return <Todo />;
}

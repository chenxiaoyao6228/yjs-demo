import dynamic from 'next/dynamic'

const Todo = dynamic(() => import('../components/todo'), {
  ssr: false,
})


export default function Home() {
  return (
      <Todo />
  );
}
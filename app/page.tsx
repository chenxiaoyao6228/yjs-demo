import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Collaborative App</h1>
      <nav className="space-x-4">
        <Link href="/todo" className="text-blue-500 hover:underline">Todo List</Link>
        <Link href="/fabric" className="text-blue-500 hover:underline">Fabric Canvas</Link>
      </nav>
    </div>
  );
}
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Yjs Collaborative Apps</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Todo List</h2>
          <p className="mb-4 text-gray-700">A collaborative todo list app where you can manage tasks in real-time with your team.</p>
          <Link href="/apps/todo" className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Go to Todo List
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Fabric Canvas</h2>
          <p className="mb-4 text-gray-700">A shared canvas where you can collaboratively create and edit designs in real-time.</p>
          <Link href="/apps/fabric" className="inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">
            Go to Fabric Canvas
          </Link>
        </div>
        {/* Placeholder for future Text Editor app */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">Text Editor</h2>
          <p className="mb-4 text-gray-700">A collaborative text editor for real-time document editing and sharing.</p>
          <Link href="/text-editor" className="inline-block bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition duration-300">
            Go to Text Editor
          </Link>
        </div> */}
      </div>
    </div>
  );
}
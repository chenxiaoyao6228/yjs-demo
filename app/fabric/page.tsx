'use client'

import Fabric from '@/components/fabric';

export default function FabricPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Collaborative Fabric Canvas</h1>
      <Fabric />
    </div>
  );
}
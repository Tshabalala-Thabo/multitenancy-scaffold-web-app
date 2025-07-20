import React from 'react';
import { Button } from '@/components/ui/Button';
import { IconExample } from '@/components/ui/IconExample';
import { AnimationExample } from '@/components/ui/AnimationExample';

export const metadata = {
  title: 'UI Components Demo',
};

export default function UiDemoPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-6">UI Components Demo</h1>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Buttons (class-variance-authority)</h2>
              <div className="flex flex-wrap gap-4">
                <Button>Default Button</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default Size</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔍</Button>
              </div>
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Icons (lucide-react)</h2>
              <IconExample className="p-4 border rounded-md" />
            </section>
            
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Animations (tw-animate-css)</h2>
              <AnimationExample />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
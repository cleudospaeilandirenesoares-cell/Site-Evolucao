import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Toaster } from '@/components/ui/sonner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Main content */}
      <div className="md:ml-64">
        <main className="min-h-screen p-4 md:p-6">
          {children}
        </main>
      </div>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'bg-background border shadow-lg',
        }}
      />
    </div>
  );
}
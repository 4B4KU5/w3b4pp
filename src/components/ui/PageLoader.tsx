// src/components/ui/PageLoader.tsx
import { LoadingSpinner } from './LoadingSpinner';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="relative">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 blur-3xl bg-purple-500/20 rounded-full" />
        
        <LoadingSpinner size="lg" />
      </div>
      
      <p className="mt-4 text-gray-400 animate-pulse">{message}</p>
    </div>
  );
}

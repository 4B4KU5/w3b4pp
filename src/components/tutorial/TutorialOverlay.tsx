// src/components/tutorial/TutorialOverlay.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TutorialStep {
  target: string; // CSS selector
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tutorialSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="dashboard"]',
    title: 'Your Dashboard',
    content: 'This is your home base. Track your progress and access your rituals.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="ritual-card"]',
    title: 'Your Rituals',
    content: 'Each card represents a ritual. Tap to start your practice.',
    position: 'top',
  },
  {
    target: '[data-tutorial="streak"]',
    title: 'Stay Consistent',
    content: 'Build your streak by completing rituals daily. Don\'t break the chain!',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="profile"]',
    title: 'Your Profile',
    content: 'Customize your experience and track your journey here.',
    position: 'left',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
}

export function TutorialOverlay({ onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const step = tutorialSteps[currentStep];
    const element = document.querySelector(step.target);
    
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = tutorialSteps[currentStep];

  const getTooltipPosition = () => {
    if (!targetRect) return {};
    
    const padding = 16;
    
    switch (step.position) {
      case 'top':
        return {
          bottom: window.innerHeight - targetRect.top + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: 'translateX(-50%)',
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2,
          right: window.innerWidth - targetRect.left + padding,
          transform: 'translateY(-50%)',
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.right + padding,
          transform: 'translateY(-50%)',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Overlay with spotlight */}
      <div className="absolute inset-0 bg-black/80">
        {targetRect && (
          <div
            className="absolute bg-transparent shadow-[0_0_0_9999px_rgba(0,0,0,0.8)] rounded-lg"
            style={{
              top: targetRect.top - 8,
              left: targetRect.left - 8,
              width: targetRect.width + 16,
              height: targetRect.height + 16,
            }}
          />
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
      >
        <X size={24} />
      </button>

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-10 w-72 p-4 bg-gray-900 rounded-xl border border-gray-800 shadow-xl"
          style={getTooltipPosition()}
        >
          {/* Arrow */}
          <div
            className={`absolute w-3 h-3 bg-gray-900 border-gray-800 transform rotate-45 ${
              step.position === 'top' ? 'bottom-[-6px] left-1/2 -translate-x-1/2 border-r border-b' :
              step.position === 'bottom' ? 'top-[-6px] left-1/2 -translate-x-1/2 border-l border-t' :
              step.position === 'left' ? 'right-[-6px] top-1/2 -translate-y-1/2 border-t border-r' :
              'left-[-6px] top-1/2 -translate-y-1/2 border-b border-l'
            }`}
          />
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.content}</p>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1 mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${
                  index === currentStep ? 'bg-purple-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            
            <span className="text-sm text-gray-500">
              {currentStep + 1} / {tutorialSteps.length}
            </span>
            
            <Button size="sm" onClick={handleNext}>
              {currentStep === tutorialSteps.length - 1 ? 'Done' : 'Next'}
              {currentStep < tutorialSteps.length - 1 && <ChevronRight size={16} className="ml-1" />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

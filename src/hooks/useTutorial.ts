// src/hooks/useTutorial.ts
import { useState, useEffect } from 'react';

const TUTORIAL_STORAGE_KEY = '4b4ku5_tutorial_complete';

export function useTutorial() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialComplete, setTutorialComplete] = useState(false);

  useEffect(() => {
    const isComplete = localStorage.getItem(TUTORIAL_STORAGE_KEY) === 'true';
    setTutorialComplete(isComplete);
    
    // Show tutorial for new users after a slight delay
    if (!isComplete) {
      const timer = setTimeout(() => setShowTutorial(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
    setTutorialComplete(true);
    setShowTutorial(false);
  };

  const resetTutorial = () => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    setTutorialComplete(false);
    setShowTutorial(true);
  };

  return {
    showTutorial,
    tutorialComplete,
    completeTutorial,
    resetTutorial,
  };
}

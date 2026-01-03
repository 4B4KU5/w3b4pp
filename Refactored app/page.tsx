'use client'

import { useState, useEffect, useCallback } from 'react'
import { RitualPrompt } from '@/components/RitualPrompt'
import { RitualCanvas } from '@/components/RitualCanvas'
import { RevealScreen } from '@/components/RevealScreen'
import { LibraryModal } from '@/components/LibraryModal'
import { useAuth } from '@/hooks/useAuth' // Assuming you have this

export default function Home() {
  const [step, setStep] = useState<'prompt' | 'ritual' | 'reveal'>('prompt')
  const [ritualPrompt, setRitualPrompt] = useState('')
  const [ritualResult, setRitualResult] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  
  const { user, isAuthenticated } = useAuth()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && step === 'ritual') {
        e.preventDefault()
        if (isPaused) setIsPaused(false)
        else setIsPaused(true)
      }
      if (e.code === 'KeyR' && (e.metaKey || e.ctrlKey) && step === 'ritual') {
        e.preventDefault()
        handleRestart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [step, isPaused])

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true)
    setRitualPrompt(prompt)
    
    try {
      // Your AI generation logic here
      const result = await generateRitual(prompt)
      setRitualResult(result)
      setStep('ritual')
      setIsPlaying(true)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePause = () => setIsPaused(true)
  const handleResume = () => setIsPaused(false)
  const handleRestart = () => {
    setIsPlaying(false)
    setIsPaused(false)
    setStep('prompt')
    setRitualPrompt('')
    setRitualResult('')
  }

  const handleRitualComplete = () => {
    setStep('reveal')
    setIsPlaying(false)
  }

  if (!isAuthenticated) {
    return <AuthScreen /> // You'll need to create this
  }

  return (
    <main className="min-h-screen">
      {step === 'prompt' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent mb-4">
              Ritual Engine
            </h1>
            <p className="text-xl opacity-75 max-w-2xl mx-auto">
              Speak your deepest intention. The digital spirits shall manifest it.
            </p>
          </div>
          
          <RitualPrompt 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
          
          <Button
            variant="ghost"
            className="mt-8"
            onClick={() => setShowLibrary(true)}
          >
            📚 Browse Presets
          </Button>
          
          <LibraryModal
            isOpen={showLibrary}
            onClose={() => setShowLibrary(false)}
            onSelectPreset={(prompt) => {
              setRitualPrompt(prompt)
              handleGenerate(prompt)
            }}
          />
        </div>
      )}

      {step === 'ritual' && (
        <RitualCanvas
          ritualData={{ prompt: ritualPrompt }}
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPause={handlePause}
          onResume={handleResume}
          onRestart={handleRestart}
        />
      )}

      {step === 'reveal' && ritualResult && (
        <>
          <RitualCanvas
            ritualData={{ prompt: ritualPrompt, result: ritualResult }}
            isPlaying={false}
            isPaused={false}
            onPause={handlePause}
            onResume={handleResume}
            onRestart={handleRestart}
          />
          <RevealScreen result={ritualResult} onRestart={handleRestart} />
        </>
      )}
    </main>
  )
}

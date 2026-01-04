'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { RitualCanvas } from '@/components/RitualCanvas'
import { RevealScreen } from '@/components/RevealScreen'
import { LibraryModal } from '@/components/LibraryModal'
import { Button } from '@/components/ui/button'

export default function Home() {
  const searchParams = useSearchParams()

  const [step, setStep] = useState<'upload' | 'decoding' | 'ritual' | 'reveal'>('upload')
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null)
  const [audioResult, setAudioResult] = useState<Blob | null>(null)
  const [imageResult, setImageResult] = useState<string>('')
  const [flatMode, setFlatMode] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const userData = {
    name: searchParams.get('name') || 'F0UND3R',
    tribe: searchParams.get('tribe') || 'The Two Tribes',
    title: searchParams.get('title') || 'Architect',
  }

  const handleRestart = useCallback(() => {
    setStep('upload')
    setAudioBuffer(null)
    setAudioResult(null)
    setImageResult('')
    setIsPaused(false)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.code === 'Space' && step === 'ritual') {
        e.preventDefault()
        setIsPaused((prev) => !prev)
      }

      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyR' && step === 'ritual') {
        e.preventDefault()
        handleRestart()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [step, handleRestart])

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file')
      return
    }

    setStep('decoding')

    try {
      if (!audioCtxRef.current) {
        const AC = window.AudioContext || (window as any).webkitAudioContext
        audioCtxRef.current = new AC()
      }

      const arrayBuffer = await file.arrayBuffer()
      const decoded = await audioCtxRef.current.decodeAudioData(arrayBuffer)

      setAudioBuffer(decoded)
      setStep('ritual')
      setIsPaused(false)
    } catch (error) {
      console.error('Audio decoding failed:', error)
      alert('Failed to decode audio file. Try a different MP3.')
      setStep('upload')
    }
  }, [])

  const handleRitualComplete = useCallback(
    (result: { imageDataUrl: string; audioBlob: Blob }) => {
      setImageResult(result.imageDataUrl)
      setAudioResult(result.audioBlob)
      setStep('reveal')

      try {
        const libraryItem = {
          id: `${userData.name}_${Date.now()}`,
          name: userData.name,
          tribe: userData.tribe,
          title: userData.title,
          image: result.imageDataUrl,
          timestamp: new Date().toISOString().split('T')[0],
          duration: Math.floor(audioBuffer?.duration || 360),
          privacy: 'public' as const,
        }

        const existing = JSON.parse(localStorage.getItem('4b4ku5_public') || '[]')
        existing.unshift(libraryItem)
        localStorage.setItem('4b4ku5_public', JSON.stringify(existing))
      } catch (e) {
        console.error('Failed to auto-save to library:', e)
      }
    },
    [userData, audioBuffer?.duration],
  )

  const handleAlterRecording = useCallback(
    (blob: Blob) => {
      const file = new File([blob], 'altered.webm', { type: 'audio/webm' })
      handleFileSelect(file)
    },
    [handleFileSelect],
  )

  return (
    <main className="min-h-screen">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
          e.target.value = ''
        }}
      />

      {step === 'upload' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent mb-4">
              4B4KU5
            </h1>
            <p className="text-xl opacity-80">
              Genesis Ritual • {userData.name} — {userData.title}, {userData.tribe}
            </p>
          </div>

          <div className="card max-w-2xl w-full">
            <div className="space-y-6">
              <div
                className="border-2 border-dashed rounded-xl p-16 text-center hover:border-accent transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file) handleFileSelect(file)
                }}
              >
                <div className="text-5xl mb-4">📁</div>
                <p className="text-lg font-medium mb-2">Drop MP3 here or click to browse</p>
                <p className="text-sm opacity-70">
                  Your gestural performance will be recorded and crystallized as governance evidence.
                </p>
              </div>

              <label className="flex items-center justify-center gap-2 text-sm opacity-80 cursor-pointer p-4 rounded-lg border border-white/10">
                <input
                  type="checkbox"
                  checked={flatMode}
                  onChange={(e) => setFlatMode(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                Start with all bands muted (-18dB) — Artist Mode
              </label>

              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setShowLibrary(true)}>
                  📚 Sound Print Library
                </Button>
                <Button variant="primary" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                  Upload &amp; Begin
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'decoding' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="opacity-80">Loading ritual space...</p>
          </div>
        </div>
      )}

      {step === 'ritual' && audioBuffer && (
        <RitualCanvas audioBuffer={audioBuffer} isPaused={isPaused} flatMode={flatMode} onComplete={handleRitualComplete} />
      )}

      {step === 'reveal' && audioResult && imageResult && (
        <RevealScreen
          imageSrc={imageResult}
          audioBlob={audioResult}
          onNewRitual={handleRestart}
          onOpenLibrary={() => setShowLibrary(true)}
          onAlterRecording={handleAlterRecording}
        />
      )}

      <LibraryModal isOpen={showLibrary} onClose={() => setShowLibrary(false)} />
    </main>
  )
}

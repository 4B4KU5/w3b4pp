'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface RevealScreenProps {
  imageSrc: string
  audioBlob: Blob
  onNewRitual: () => void
  onOpenLibrary: () => void
  onAlterRecording: (blob: Blob) => void
}

export function RevealScreen({ imageSrc, audioBlob, onNewRitual, onOpenLibrary, onAlterRecording }: RevealScreenProps) {
  const [audioUrl, setAudioUrl] = useState<string>('')

  useEffect(() => {
    const url = URL.createObjectURL(audioBlob)
    setAudioUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [audioBlob])

  const handleDownload = () => {
    const url = URL.createObjectURL(audioBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `4b4ku5_${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-overlay backdrop-blur-md">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 space-y-6">
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            Sound Print Crystallized
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img 
                src={imageSrc} 
                alt="Sound Print Visualization" 
                className="w-full rounded-lg border border-bg-tertiary shadow-xl"
              />
            </div>
            
            <div className="space-y-4 flex flex-col justify-center">
              <p className="text-fg-secondary text-center md:text-left">
                Your unique pattern has been recorded as permanent governance evidence.
              </p>
              
              {audioUrl && (
                <audio controls className="w-full mt-4">
                  <source src={audioUrl} type="audio/webm" />
                  Your browser does not support the audio element.
                </audio>
              )}
              
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="secondary" onClick={handleDownload}>
                  ⬇️ Download Recording
                </Button>
                <Button variant="secondary" onClick={() => onAlterRecording(audioBlob)}>
                  🔄 Alter this Sound Print
                </Button>
                <Button variant="secondary" onClick={onOpenLibrary}>
                  📚 View in Library
                </Button>
                <Button variant="primary" onClick={onNewRitual}>
                  🎵 New Ritual
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

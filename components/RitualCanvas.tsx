'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Button } from './ui/button'

interface RitualCanvasProps {
  ritualData?: any
  isPlaying: boolean
  isPaused: boolean
  onPause: () => void
  onResume: () => void
  onRestart: () => void
}

export function RitualCanvas({ 
  ritualData, 
  isPlaying, 
  isPaused, 
  onPause, 
  onResume, 
  onRestart 
}: RitualCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas rendering logic here (your existing canvas code)
  useEffect(() => {
    // Your canvas animation logic
  }, [ritualData, isPlaying, isPaused])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="canvas-container">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        width={window.innerWidth}
        height={window.innerHeight}
      />
      
      {/* Controls */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 border-4 border-current border-dashed rounded-full mx-auto mb-8 animate-spin" />
            <p className="text-2xl opacity-75">Awaiting Ritual...</p>
          </div>
        </div>
      )}

      {/* Overlay Controls */}
      <div className="controls">
        <Button 
          variant={isPaused ? 'primary' : 'secondary'}
          onClick={isPaused ? onResume : onPause}
          size="lg"
        >
          {isPaused ? '▶️ Resume' : '⏸️ Pause'}
        </Button>
        <Button 
          variant="secondary" 
          size="lg"
          onClick={onRestart}
        >
          🔄 Restart
        </Button>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={toggleFullscreen}
          className="fullscreen-btn"
        >
          ⛶
        </Button>
      </div>

      <div className={`status-indicator ${isPlaying ? 'status-playing' : isPaused ? 'status-paused' : ''}`}>
        {isPlaying ? 'RITUAL ACTIVE' : isPaused ? 'PAUSED' : 'READY'}
      </div>
    </div>
  )
}

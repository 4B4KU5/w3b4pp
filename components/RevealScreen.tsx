'use client'

import { Button } from './ui/button'
import { Card } from './ui/card'

interface RevealScreenProps {
  result: string
  onRestart: () => void
}

export function RevealScreen({ result, onRestart }: RevealScreenProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-b from-black/50 to-transparent">
      <Card className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-accent to-purple-500 rounded-full mx-auto mb-8 shadow-2xl" />
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
            Ritual Complete
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-md mx-auto">
            The energies have aligned. Behold the manifestation:
          </p>
        </div>
        
        <div className="bg-black/20 p-8 rounded-xl border border-white/10 mb-8">
          <p className="text-2xl font-mono whitespace-pre-wrap text-accent">{result}</p>
        </div>
        
        <Button variant="primary" size="lg" onClick={onRestart}>
          🔄 New Ritual
        </Button>
      </Card>
    </div>
  )
}

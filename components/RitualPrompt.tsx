'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input' // You'll need to create this similar to Button

interface RitualPromptProps {
  onGenerate: (prompt: string) => void
  isGenerating: boolean
}

export function RitualPrompt({ onGenerate, isGenerating }: RitualPromptProps) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onGenerate(prompt)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-group max-w-md mx-auto">
      <label className="label">Ritual Intent</label>
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Speak your intention into existence..."
        disabled={isGenerating}
        className="text-center text-lg"
      />
      <Button 
        type="submit" 
        variant="primary" 
        size="lg"
        isLoading={isGenerating}
        className="w-full mt-4"
        disabled={!prompt.trim()}
      >
        {isGenerating ? 'Awakening Ritual...' : 'Begin Ritual'}
      </Button>
    </form>
  )
}

'use client'

import { useState } from 'react'
import { Button } from './ui/button'

interface LibraryItem {
  id: string
  title: string
  prompt: string
}

const LIBRARY: LibraryItem[] = [
  { id: '1', title: 'Prosperity', prompt: 'Attract wealth and abundance' },
  { id: '2', title: 'Clarity', prompt: 'Mental sharpness and focus' },
  // Add more presets
]

interface LibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPreset: (prompt: string) => void
}

export function LibraryModal({ isOpen, onClose, onSelectPreset }: LibraryModalProps) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-bold">Ritual Library</h2>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          {LIBRARY.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start h-16 mb-2 text-left hover:bg-accent/10"
              onClick={() => {
                onSelectPreset(item.prompt)
                onClose()
              }}
            >
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm opacity-75 truncate">{item.prompt}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <div className="p-6 border-t border-border bg-accent/5">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

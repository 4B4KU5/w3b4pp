'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 1. Fix the Type Definition here (add the ?)
export interface LibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPreset?: (preset: any) => void // <--- ? goes here, next to the key
}

// 2. Fix the destructuring here (assign a default empty function)
export function LibraryModal({ 
  isOpen, 
  onClose, 
  onSelectPreset = () => {} // <--- Assign default here
}: LibraryModalProps) {
  
  if (!isOpen) return null

  // Mock data for now
  const presets = [
    { id: '1', name: 'The Founder', image: '/api/placeholder/64/64' },
    { id: '2', name: 'The Architect', image: '/api/placeholder/64/64' },
  ]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Sound Print Library</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <div 
              key={preset.id}
              className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-accent transition-all group"
              onClick={() => onSelectPreset(preset)} // Safe to call now because of default value
            >
              <div className="aspect-square bg-gray-700 rounded-md mb-3 overflow-hidden">
                <img 
                  src={preset.image} 
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-200 truncate">{preset.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

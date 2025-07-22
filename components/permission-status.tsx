"use client"

import React from 'react'

interface PermissionStatusProps {
  allowed: boolean
  onToggle: (allowed: boolean) => void
  disabled?: boolean
}

export default function PermissionStatus({ allowed, onToggle, disabled = false }: PermissionStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
          allowed 
            ? 'bg-green-500' 
            : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && onToggle(!allowed)}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 mt-1 ${
            allowed ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </div>
      <span className={`text-sm font-medium ${allowed ? 'text-green-600' : 'text-gray-500'}`}>
        {allowed ? 'Allowed' : 'Denied'}
      </span>
    </div>
  )
} 
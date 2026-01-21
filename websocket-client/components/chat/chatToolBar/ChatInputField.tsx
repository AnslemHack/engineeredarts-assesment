'use client'

import { MicrophoneIcon } from './icons/MicrophoneIcon'
import { useGlobalState } from '@/hooks/useGlobalState'

interface ChatInputFieldProps {
  sendButtonRef: React.RefObject<(() => void) | null>
}

export const ChatInputField = ({ sendButtonRef }: ChatInputFieldProps) => {
    const [inputValue, setInputValue] = useGlobalState<string>('inputValue', '')
    
    const handleOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            sendButtonRef.current?.()
        }
    }
    return (
        <div className="relative mb-3">
            <input
                type="text"
                value={ inputValue }
                onChange={ handleOnchange }
                placeholder="Type your message..."
                className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onKeyDown={ handleKeyDown }
            />
            <MicrophoneIcon 
                className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            />
        </div>
    )
}


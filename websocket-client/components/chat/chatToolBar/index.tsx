'use client'

import { ChatInputField } from './ChatInputField'
import { ChatActionButtons } from './ChatActionButtons'
import { useRef } from 'react'

export const ChatToolBar = () => {
    const handleSendRef = useRef<(() => void) | null>(null)

    return (
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4">
            <ChatInputField sendButtonRef={handleSendRef} />
            <ChatActionButtons onSendRef={handleSendRef} />
        </div>
    )
}


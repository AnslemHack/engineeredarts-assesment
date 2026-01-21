'use client'

import { Message } from "@/types/message"
import { MessageTailRight } from './icons/MessageTailRight'
import { getAudioUrl, isBlobUrl } from '@/utils/messageUtils'

interface MessageBubbleProps {
    message: Message
}

export const ClientMessage = ({ message }: MessageBubbleProps) => {
    return (
        <div key={message.messageId} className="flex justify-end w-full px-4 mb-1">
            <div className="flex items-end gap-2 max-w-[70%]">
                <div className="rounded-2xl px-4 py-2 bg-white border border-gray-300 relative">
                    <MessageTailRight 
                        className="w-3 h-3 text-white"
                        borderClassName="w-3 h-3 text-gray-300"
                    />
                    <p className="text-gray-900 text-sm leading-relaxed">{message.payload}</p>
                </div>
            </div>
        </div>
    )
}  

export const ServerMessage = ({ message }: MessageBubbleProps) => {
    const audioUrl = getAudioUrl(message)
    const isBlobUrlValue = isBlobUrl(audioUrl)
    const isAudioMessage = audioUrl && isBlobUrlValue
    
    return (
        <div className="text-black">{ isAudioMessage ? <audio src={audioUrl} controls /> : 'No audio'}</div>
    )
}


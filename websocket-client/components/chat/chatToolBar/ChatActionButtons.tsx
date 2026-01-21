'use client'

import { SendIcon } from './icons/SendIcon'
import { VoiceTuneIcon } from './icons/VoiceTuneIcon'
import { ChevronDownIcon } from './icons/ChevronDownIcon'
import { useGlobalState } from '@/hooks/useGlobalState'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Message, VoiceType } from '@/types/message'
import { useWebsocket } from '@/hooks/useWebsocket'
import { useRef, useState, useEffect } from 'react'
import { handleMessageByType } from '@/utils/messageUtils'
import { MESSAGE_SENDER } from '@/constants/messageSenders'
import { cleanupBlobUrlsOnUnmount, syncBlobUrlsWithMessages } from '@/utils/blobUtils'
import { createAudioChunkHandler } from '@/lib/createAudioChunkHandler'

const VOICE_OPTIONS: VoiceType[] = ['alloy', 'nova', 'shimmer']

interface ChatActionButtonsProps {
    onSendRef: React.RefObject<(() => void) | null>
}

export const ChatActionButtons = ({ onSendRef }: ChatActionButtonsProps) => {
    const [messages, setMessages] = useGlobalState<Message[]>('messages', [])
    const [inputValue, setInputValue] = useGlobalState<string>('inputValue', '')
    const [selectedVoice, setSelectedVoice] = useGlobalState<VoiceType>('selectedVoice', 'alloy')
    const [isVoiceDropdownOpen, setIsVoiceDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const audioChunksRef = useRef<Blob[]>([])
    const currentAudioMessageIdRef = useRef<string | null>(null)
    const previousAudioUrlRef = useRef<string | null>(null)
    const blobUrlsRef = useRef<Set<string>>(new Set())

    useClickOutside(dropdownRef, () => setIsVoiceDropdownOpen(false), isVoiceDropdownOpen);

    useEffect(() => {
        return () => {
            cleanupBlobUrlsOnUnmount(blobUrlsRef, previousAudioUrlRef)
        }
    }, [])

    useEffect(() => {
        syncBlobUrlsWithMessages(messages, blobUrlsRef)
    }, [messages])

    const handleAudioChunk = createAudioChunkHandler(
        audioChunksRef,
        currentAudioMessageIdRef,
        previousAudioUrlRef,
        blobUrlsRef,
        setMessages
    )

    const messageHandlers = {
        text: () => {
            //TODO: we are not handling text messages yet
        },
        audio: handleAudioChunk,
        error: (error: string) => {
            console.error('WebSocket error message:', error)
        }
    }

    const handleMessage = (event: MessageEvent) => {
        handleMessageByType(event, messageHandlers)
    }

    const { sendMessage, isConnected, isConnecting } = useWebsocket(handleMessage)
    
    const handleSend = () => {
        if (!inputValue.trim() || !isConnected) {
            return;
        }
        currentAudioMessageIdRef.current = null
        audioChunksRef.current = []
    
        const newMessage: Message = {
            type: 'text',
            messageId: crypto.randomUUID(),
            payload: inputValue.trim(),
            sender: MESSAGE_SENDER.CLIENT,
            voiceType: selectedVoice
        }
        
        setMessages((prev) => [...prev, newMessage])
        const sent = sendMessage(JSON.stringify(newMessage));
        if (!sent) {
            return;
        }
        setInputValue('')
    }

    useEffect(() => {
        onSendRef.current = handleSend
        return () => {
            onSendRef.current = null
        }
    }, [handleSend, onSendRef])

    const handleVoiceDropdownClick = () => {
        setIsVoiceDropdownOpen(!isVoiceDropdownOpen);
    }
    return (
        <div className="flex items-center justify-between">
            <div className="relative" ref={ dropdownRef} >
                <button
                    onClick={ handleVoiceDropdownClick }
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <VoiceTuneIcon className="w-5 h-5 text-gray-600" />
                    <span>Voice: {selectedVoice}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isVoiceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isVoiceDropdownOpen ? (
                    <div className="absolute bottom-full left-0 mb-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                        {VOICE_OPTIONS.map((voice) => (
                            <button
                                key={voice}
                                onClick={() => {
                                    setSelectedVoice(voice)
                                    setIsVoiceDropdownOpen(false)
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md transition-colors ${
                                    selectedVoice === voice ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                }`}
                            >
                                {voice.charAt(0).toUpperCase() + voice.slice(1)}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="flex items-center gap-2">
                {isConnecting && (
                    <span className="text-xs text-gray-500">Connecting...</span>
                )}
                {!isConnected && !isConnecting && (
                    <span className="text-xs text-red-500">Disconnected</span>
                )}
                <div 
                    data-send-button
                    onClick={ handleSend }
                    className={`cursor-pointer ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title={!isConnected ? 'Not connected to server' : 'Send message'}
                >
                    <SendIcon 
                        className={`w-5 h-5 transition-colors ${isConnected ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400'}`}
                    />
                </div>
            </div>
        </div>
    )
}


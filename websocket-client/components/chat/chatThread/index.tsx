'use client'

import { useGlobalState } from "@/hooks/useGlobalState"
import { Message } from "@/types/message"
import { ClientMessage, ServerMessage } from "./MessageBubble"
import { LoadingIndicator } from "./LoadingIndicator"
import { MESSAGE_SENDER } from "@/constants/messageSenders"
import { useRef, useMemo } from "react"
import { useScrollToBottom } from "@/hooks/useScrollToBottom"

const renderMessagesBySenderType = (messages: Message[]) => {
    return messages.map((message: Message) => {
        const { sender } = message
        return sender === MESSAGE_SENDER.CLIENT ?
            <ClientMessage key={message.messageId} message={message} /> :
            <ServerMessage key={message.messageId} message={message} />
    })
}
    
export const ChatThread = () => {
    const [messages] = useGlobalState<Message[]>('messages', [])
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    
    const messageThread = useMemo(() => {
        return renderMessagesBySenderType(messages)
    }, [messages])
    
    const lastMessage = messages[messages.length - 1]
    const isWaitingForResponse = lastMessage?.sender === MESSAGE_SENDER.CLIENT

    useScrollToBottom(scrollContainerRef, [messages])
  
    return (
        <div ref={scrollContainerRef} className="flex flex-col gap-2 w-full min-h-full justify-start pb-4">
            {messageThread}
            {isWaitingForResponse ? <LoadingIndicator /> : null}
        </div>
    )
}


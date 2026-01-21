'use client'

import { ChatToolBar } from "../chatToolBar";
import { ChatThread } from "../chatThread";
import { ChatWelcomeMessage } from "./chatWelcomeMessage";


export const ChatScreen = () => {
    return (
        <div className="flex flex-col h-screen bg-white relative">
            <div className="absolute top-2 sm:top-4 px-4 h-64 w-full z-10 pointer-events-none">
                <ChatWelcomeMessage />
            </div>
            <div className="flex-1 flex flex-col items-center w-full pt-20 sm:pt-24 pb-32 overflow-hidden">
                <div className="w-full h-full overflow-y-auto px-4">
                    <ChatThread />
                </div>
            </div>
            <ChatToolBar />
        </div>
    )
}
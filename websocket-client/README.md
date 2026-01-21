# WebSocket Chat Client

Real-time chat client built with Next.js that connects to an LLM WebSocket server. Send text messages and receive AI-generated audio responses.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local`:
   ```env
   NEXT_PUBLIC_SERVER_URL=localhost:4000 
   ## please not this is dependent on the websocket  server's url  and port

   ```

3. Start development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) - automatically redirects to `/chat`.

**Prerequisites:** Node.js 18+ and a running LLM WebSocket Server (see [server README](../llm-websocket-server/README.md))

## Features

- Real-time WebSocket messaging
- Audio playback from AI responses
- Voice selection (alloy, nova, shimmer)
- Auto-reconnection with exponential backoff
- TypeScript + Tailwind CSS

## Tech Stack

Next.js 16, React 19, TypeScript, Tailwind CSS, React Query, WebSocket API

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## How to Test

1. **Start the WebSocket Server** (see [server README](../llm-websocket-server/README.md)):
   ```bash
   cd ../llm-websocket-server
   npm start
   ```

2. **Start the client**:
   ```bash
   npm run dev
   ```

3. **Open the application** at [http://localhost:3000](http://localhost:3000)

4. **Test functionality**:
   - Send a text message via the input field
   - Verify message appears in the chat thread
   - Check that audio response is received and plays automatically
   - Test voice selection (alloy, nova, shimmer)
   - Verify auto-reconnection by stopping/restarting the server
   - Check browser console for any errors

5. **Verify WebSocket connection**:
   - Check browser DevTools Network tab for WebSocket connection
   - Connection status should show as connected
   - Messages should appear in the console logs

## Message Format

```typescript
{
  type: 'text' | 'audio',
  messageId: string,
  payload: string,
  sender: 'client' | 'assistant',
  voiceType?: 'alloy' | 'nova' | 'shimmer'
}
```

## Troubleshooting

- **Connection issues:** Verify server is running and `NEXT_PUBLIC_SERVER_URL` is set (format: `host:port`)
- **Audio issues:** Check browser console and ensure audio chunks are being received
- **Build errors:** Run `npm install` and verify environment variables

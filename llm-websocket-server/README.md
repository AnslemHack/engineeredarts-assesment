# LLM WebSocket Server

A WebSocket service that accepts text from a client, sends it to an OpenAI LLM, and returns synthesized audio of the LLM's response.

## Overview

This service implements the following flow:
1. Client sends text via WebSocket
2. Service receives text input
3. Service sends text to OpenAI LLM API (with streaming)
4. Service receives text response
5. Service sends LLM text to OpenAI TTS API
6. Service sends audio back over WebSocket as binary chunks

## Installation

1. Clone the repository
2. Navigate to the `llm-websocket-server` directory:
   ```bash
   cd llm-websocket-server
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the `llm-websocket-server` directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=8080
LLM_MODEL=gpt-4o-mini
TTS_MODEL=tts-1
```

### Environment Variables

- **OPENAI_API_KEY** (required): Your OpenAI API key with access to Chat Completions and TTS endpoints. The server will fail to start if this is not provided.
- **PORT** (optional): Port number for the server to listen on. Defaults to 
- **LLM_MODEL** (optional): OpenAI model to use for chat completions. Defaults to `gpt-4o-mini`
- **TTS_MODEL** (optional): OpenAI model to use for text-to-speech. Defaults to `tts-1`

## Starting the Server

To start the server:

```bash
npm start
```

The server will start and listen on the configured port. You should see:
```
Server listening on port <PORT>
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test:watch
```

### Test Coverage

The test suite includes:
- **Utility Tests**: Sentence extraction and prompt generation
- **Validation Tests**: Message payload schema validation
- **Service Tests**: Critical workflow tests for the voice pipeline

All tests should pass.

## API Documentation

### WebSocket Connection

Connect to the server using WebSocket protocol:

```
ws://localhost:<PORT>
```

### Message Format

Send messages as JSON with the following schema:

```typescript
{
  type: 'text' | 'audio',
  messageId: string,          // Required, non-empty string
  payload: string,            // Required, non-empty string (the text to process)
  sender: 'client' | 'assistant',
  voiceType?: 'alloy' | 'nova' | 'shimmer'  // Optional, defaults to 'alloy'
}
```

### Example Message

```json
{
  "type": "text",
  "messageId": "123e4567-e89b-12d3-a456-426614174000",
  "payload": "Hello, how are you?",
  "sender": "client",
  "voiceType": "nova"
}
```

### Response

The server responds with audio data as binary chunks (Buffer) sent over the WebSocket connection. The audio is synthesized in real-time as complete sentences are generated, providing low-latency streaming.

### Voice Types

- `alloy` - Default voice
- `nova` - Alternative voice option
- `shimmer` - Alternative voice option

## Architecture

The service is built with a modular architecture:

```
src/
  ├── config/         # Configuration management
  ├── services/       # Business logic (LLM, TTS, Voice Pipeline)
  ├── types/          # TypeScript interfaces
  ├── utils/          # Utility functions (sentence parsing, prompts)
  ├── typeguard/      # Input validation (Zod schemas)
  └── websocket/      # WebSocket connection handling
```

### Key Components

- **LlmService**: Handles interactions with OpenAI Chat Completions API
- **TtsService**: Handles interactions with OpenAI Text-to-Speech API
- **VoicePipelineService**: Orchestrates the LLM → TTS flow with sentence-level processing
- **VoiceSocketManager**: Manages WebSocket connections and message routing


## Development

### Building

Compile TypeScript to JavaScript:

```bash
npm run build
```

The compiled output will be in the `dist/` directory.

### Project Structure

```
llm-websocket-server/
  ├── src/           # TypeScript source files
  ├── dist/          # Compiled JavaScript (generated)
  ├── test/          # Test files
  ├── package.json   # Dependencies and scripts
  ├── tsconfig.json  # TypeScript configuration
  └── .env           # Environment variables (create this)
```


## Troubleshooting

### Server won't start
- Ensure `.env` file exists with `OPENAI_API_KEY` set
- Check that the port is not already in use
- Verify all dependencies are installed (`npm install`)

### Tests failing
- Ensure all dependencies are installed
- Check that TypeScript is compiling correctly
- Verify test files are in the correct location

### Connection issues
- Verify the server is running on the expected port
- Check WebSocket URL format (`ws://` not `http://`)
- Ensure message format matches the schema




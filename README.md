# Washington ESSB 5814 Guidance Service

A modular, reusable TypeScript service for providing AI-powered assistance with Washington tax guidance under ESSB 5814. Built by [C Street Tax & Accounting](https://cstreettax.com).

## Overview

This service encapsulates the core logic for:
- Loading Washington Department of Revenue guidance documents
- Building context for OpenAI API calls
- Validating and processing chat messages
- Formatting and returning responses with suggested follow-up questions

The service is designed to be:
- **Modular**: Use it as a library in any Node.js project
- **Reusable**: Call it from multiple endpoints (REST API, GraphQL, webhooks, etc.)
- **Separable**: Can be extracted into its own repository and deployed independently
- **Testable**: Clean interfaces and dependency injection for easy testing

## Architecture

```
Input (tile ID + messages)
         ↓
   Validation layer
         ↓
   Load guidance docs
         ↓
   Build context block
         ↓
   OpenAI API call
         ↓
   Parse JSON response
         ↓
   Format & return answer + suggestions
```

## Installation

### Option 1: Local Development (Current Setup)

The service lives in `/wa-guidance-service` within the cstreet repo. Import it directly:

```typescript
import { WaGuidanceChatService } from '@/wa-guidance-service/src';
```

### Option 2: Future npm Package

Once extracted to its own repo:

```bash
npm install @cstreettax/wa-guidance-service
```

## Usage

### Basic Example

```typescript
import { WaGuidanceChatService } from '@cstreettax/wa-guidance-service';
import path from 'path';

// Initialize the service
const service = new WaGuidanceChatService({
  apiKey: process.env.OPENAI_API_KEY,
  guidanceDir: path.join(process.cwd(), 'public'), // Where guidance docs live
});

// Send a chat request
const response = await service.chat('software', [
  { role: 'user', content: 'What is ESSB 5814?' },
]);

console.log(response.answer);
// Output: "ESSB 5814 is a Washington State law that..."
console.log(response.suggestedQuestions);
// Output: ["What services does it apply to?", "When does it take effect?"]
```

### In a Next.js API Route

```typescript
// app/api/wa/chat/route.ts
import { WaGuidanceChatService } from '@/wa-guidance-service/src';
import { NextResponse, type NextRequest } from 'next/server';
import path from 'path';

const service = new WaGuidanceChatService({
  guidanceDir: path.join(process.cwd(), 'public'),
  // apiKey comes from OPENAI_API_KEY env var by default
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tileId, messages } = body;

    const response = await service.chat(tileId, messages);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
```

## Configuration

### `ChatServiceOptions`

When creating a service instance, pass an options object:

```typescript
interface ChatServiceOptions {
  apiKey?: string;              // OpenAI API key (defaults to OPENAI_API_KEY env var)
  maxContextChars?: number;     // Max chars to include from guidance (default: 18000)
  guidanceDir?: string;         // Path to guidance documents on filesystem
}
```

## Types

### `WaTileId`

Represents one of the 11 Washington service categories:

```typescript
type WaTileId =
  | 'it'
  | 'marketing'
  | 'webdev'
  | 'software'
  | 'engineering'
  | 'staffing'
  | 'security'
  | 'presentations'
  | 'professional-services'
  | 'data-processing'
  | 'contracts';
```

### `ChatMessage`

A message in the conversation:

```typescript
type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};
```

### `ChatResponse`

The response from the service:

```typescript
interface ChatResponse {
  answer: string;               // The assistant's response
  suggestedQuestions: string[]; // Up to 2 follow-up suggestions
}
```

## Guidance Document Structure

Guidance documents are stored in `/public/wa-guidance/{tile}/guidance.txt`:

```
public/wa-guidance/
├── it/
│   └── guidance.txt
├── marketing/
│   └── guidance.txt
├── webdev/
│   └── guidance.txt
├── software/
│   └── guidance.txt
├── engineering/
│   └── guidance.txt
├── staffing/
│   └── guidance.txt
├── security/
│   └── guidance.txt
├── presentations/
│   └── guidance.txt
├── professional-services/
│   └── guidance.txt
├── data-processing/
│   └── guidance.txt
├── contracts/
│   └── guidance.txt
└── shared/
    └── das-retail/
        └── guidance.txt (cross-cutting reference)
```

Each file contains extracted plain text from Washington Department of Revenue interim guidance.

## Error Handling

The service throws descriptive errors:

```typescript
try {
  await service.chat(tileId, messages);
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
    // "Invalid or missing tile id: invalid-id"
    // "OpenAI API key is required"
    // "Messages must be an array"
  }
}
```

Common errors:

| Error | Cause |
|-------|-------|
| `OpenAI API key is required` | Missing OPENAI_API_KEY env var or apiKey option |
| `Invalid or missing tile id` | tileId doesn't match valid WaTileId |
| `Messages must be an array` | messages parameter is not an array |
| `Cannot load guidance files: guidanceDir not configured` | guidanceDir not provided to service |
| `OpenAI returned invalid JSON response` | OpenAI returned malformed JSON |

## Future Separation

When you're ready to extract this into its own repository:

```bash
# In the cstreet project
$ git checkout feature/modularize-wa-service
$ cd wa-guidance-service
$ git init
$ git add .
$ git commit -m "Initial commit: WA guidance service"
$ git remote add origin https://github.com/cstreettax/wa-guidance-service.git
$ git push -u origin main
```

The service can then be installed via:
- GitHub: `npm install github:cstreettax/wa-guidance-service`
- npm registry: `npm install @cstreettax/wa-guidance-service`

## Development

Build the TypeScript:

```bash
cd wa-guidance-service
npm run build
```

Watch mode:

```bash
npm run dev
```

## License

Built by C Street Tax & Accounting for the Washington tax community.

## Questions?

For questions about the service logic, contact the C Street Tax team at [cstreettax.com](https://cstreettax.com).

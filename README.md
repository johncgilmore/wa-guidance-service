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

```bash
npm install wa-guidance-service
```

## Usage

### Basic Example

```typescript
import { WaGuidanceChatService } from 'wa-guidance-service';

// Initialize the service (uses bundled guidance automatically)
const service = new WaGuidanceChatService({
  apiKey: process.env.OPENAI_API_KEY,
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
  guidanceDir?: string;         // Optional: Path to custom guidance docs (uses bundled by default)
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

## Bundled Guidance Documents

**NEW**: Guidance documents are now bundled IN the package! 🎉

The package includes curated, up-to-date WA DOR guidance that's maintained by C Street Tax. Just install and use - no need to manage separate guidance files.

### Guidance Structure

```
guidance/wa-guidance/
├── it/guidance.txt
├── marketing/guidance.txt
├── webdev/guidance.txt
├── software/guidance.txt
├── engineering/guidance.txt
├── staffing/guidance.txt
├── security/guidance.txt
├── presentations/guidance.txt
├── professional-services/guidance.txt
├── data-processing/guidance.txt
├── contracts/guidance.txt
└── shared/das-retail/guidance.txt
```

### Keeping Guidance Current

The package is regularly updated when WA DOR releases new guidance:
- 🤖 **Automated checks**: GitHub Action monitors for updates weekly
- 📅 **Version tracking**: Check `guidance/metadata.json` for last update dates
- 📦 **Easy updates**: Run `npm update wa-guidance-service` to get the latest

To see current guidance version:
```typescript
import { getGuidanceMetadata } from 'wa-guidance-service';

const metadata = await getGuidanceMetadata();
console.log(metadata.version); // e.g., "2025.1"
console.log(metadata.lastChecked); // e.g., "2025-10-20"
```

### Using Custom Guidance (Optional)

If you want to use your own guidance files instead of the bundled ones:

```typescript
const service = new WaGuidanceChatService({
  apiKey: process.env.OPENAI_API_KEY,
  guidanceDir: path.join(process.cwd(), 'my-custom-guidance'),
});
```

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
| `No guidance files found` | Bundled guidance missing AND no guidanceDir provided |
| `OpenAI returned invalid JSON response` | OpenAI returned malformed JSON |

## Contributing

Found an error in the guidance or have suggestions? 

- [Open an issue](https://github.com/johncgilmore/wa-guidance-service/issues)
- [Submit a pull request](https://github.com/johncgilmore/wa-guidance-service/pulls)

For guidance updates, see [UPDATING_GUIDANCE.md](./UPDATING_GUIDANCE.md).

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

# Testing Guide - WA Guidance Service

## Overview

This package includes comprehensive Jest unit tests that verify the service logic without making real API calls or requiring file system access (except where specified).

**Test Coverage:** 48 tests across 3 test suites  
**Code Coverage:** ~85% statements, ~84% branches

---

## Running Tests

### Quick Start

```bash
cd wa-guidance-service

# Run tests once
npm test

# Run tests in watch mode (re-runs when files change)
npm test:watch

# Run tests with coverage report
npm run test:coverage
```

### What Happens

When you run `npm test`:

1. ✅ Jest compiles TypeScript (`ts-jest`)
2. ✅ Finds all `*.test.ts` files in `src/__tests__/`
3. ✅ Runs each test in Node.js environment
4. ✅ Mocks the OpenAI API (no real API calls!)
5. ✅ Reports pass/fail status and coverage

---

## Test Structure

### File Organization

```
src/__tests__/
├── types.test.ts         # Type validation tests
├── guidanceMap.test.ts   # Guidance mapping tests
└── chat.test.ts          # Chat service tests
```

---

## Test Suites

### 1. Types Tests (`types.test.ts`)

**Purpose:** Verify type validation and type guards work correctly

**Tests:**
- `isWaTileId` function:
  - ✅ Accepts all 11 valid tile IDs
  - ✅ Rejects invalid, null, undefined, numeric values
  - ✅ Handles edge cases (case-sensitivity, whitespace)

- `ChatMessage` type validation:
  - ✅ Accepts valid user messages
  - ✅ Accepts valid assistant messages
  - ✅ Allows empty and multiline content

**Run just these tests:**
```bash
npm test -- types.test.ts
```

---

### 2. Guidance Map Tests (`guidanceMap.test.ts`)

**Purpose:** Verify guidance documents are properly configured and accessible

**Tests:**
- `GUIDANCE_BY_TILE`:
  - ✅ Has exactly 11 tiles defined
  - ✅ Each tile has at least one guidance entry
  - ✅ Each entry has valid `href` and `label`
  - ✅ All hrefs point to `.txt` files
  - ✅ All labels mention "ESSB 5814"

- `GUIDANCE_SHARED`:
  - ✅ Has shared guidance entries
  - ✅ References DAS/retail guidance

- Tile ID validation:
  - ✅ All tiles in map are valid tile IDs
  - ✅ All valid tiles return guidance entries

**Run just these tests:**
```bash
npm test -- guidanceMap.test.ts
```

---

### 3. Chat Service Tests (`chat.test.ts`)

**Purpose:** Verify the core `WaGuidanceChatService` class works correctly

**Key Features:**
- 🎯 Mocks OpenAI API (no real API calls)
- 🎯 Tests both happy paths and error cases
- 🎯 Validates inputs thoroughly
- 🎯 Tests message sanitization

**Test Groups:**

#### Constructor
- ✅ Throws if no API key
- ✅ Throws if API key is empty
- ✅ Accepts provided API key
- ✅ Uses environment variable API key
- ✅ Handles custom configurations

#### Message Validation
- ✅ Rejects non-array messages
- ✅ Rejects empty message arrays
- ✅ Rejects malformed messages
- ✅ Accepts valid messages

#### Tile ID Validation
- ✅ Rejects invalid tile IDs
- ✅ Rejects null/undefined
- ✅ Accepts all valid tile IDs

#### OpenAI Response Handling
- ✅ Handles successful responses
- ✅ Limits suggested questions to 2
- ✅ Trims whitespace
- ✅ Throws on missing content
- ✅ Throws on invalid JSON
- ✅ Throws on missing answer
- ✅ Handles missing suggested questions

#### Message History
- ✅ Handles single message
- ✅ Handles conversation history
- ✅ Trims message content

#### Configuration
- ✅ Uses custom guidance directory
- ✅ Uses custom context character limit

**Run just these tests:**
```bash
npm test -- chat.test.ts
```

---

## Understanding the Mocks

### Why We Mock OpenAI

The tests mock the OpenAI API because:

1. **No API Costs**: Tests don't consume real OpenAI tokens
2. **Speed**: Tests run instantly (no network latency)
3. **Reliability**: Tests don't fail due to API downtime
4. **Consistency**: Always get predictable responses
5. **Edge Cases**: Can simulate errors easily

### How the Mock Works

```typescript
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(), // This gets configured per test
      },
    },
  }));
});
```

Each test sets up the mock response:

```typescript
const mockCreate = jest.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content: JSON.stringify({
          answer: 'Test answer',
          suggestedQuestions: ['Q1', 'Q2'],
        }),
      },
    },
  ],
});
```

---

## Test Scenarios

### Scenario 1: Happy Path (User Asks Question)

```typescript
// Input
service.chat('software', [
  { role: 'user', content: 'What is ESSB 5814?' }
])

// Expected Output
{
  answer: 'ESSB 5814 is a Washington State law...',
  suggestedQuestions: ['Q1?', 'Q2?']
}

// Test: chat.test.ts → OpenAI Response Handling → "should handle successful OpenAI response"
```

### Scenario 2: Invalid Tile ID (Business Logic Error)

```typescript
// Input
service.chat('invalid-tile', [...])

// Expected Output
Error: 'Invalid or missing tile id: invalid-tile'

// Test: chat.test.ts → Tile ID Validation → "should reject invalid tile ID"
```

### Scenario 3: Bad Message Format (Input Validation)

```typescript
// Input
service.chat('software', [
  { role: 'invalid-role', content: 'test' }
])

// Expected Output
Error: 'Invalid message: role must be "user" or "assistant"'

// Test: chat.test.ts → Message Validation → "should reject messages with invalid role"
```

### Scenario 4: OpenAI Returns Invalid JSON (Integration Error)

```typescript
// Input
OpenAI returns: "This is not JSON"

// Expected Output
Error: 'OpenAI returned invalid JSON response'

// Test: chat.test.ts → OpenAI Response Handling → "should throw if response is not valid JSON"
```

---

## Coverage Report

```
File            | % Stmts | % Branch | % Funcs | % Lines
----------------|---------|----------|---------|----------
guidanceMap.ts  |   100%  |   100%   |   100%  |   100%  ✓
prompts.ts      |   100%  |   100%   |   100%  |   100%  ✓
chat.ts         |   82%   |   83%    |   80%   |   82%   (good)
Overall         |   85%   |   84%    |   83%   |   85%
```

**Uncovered Lines in chat.ts:** Lines that load guidance files from disk (skipped because `guidanceDir` is optional in tests)

---

## Debugging Tests

### Run a Single Test

```bash
# Run only "should handle successful OpenAI response" test
npm test -- chat.test.ts -t "should handle successful OpenAI response"
```

### Run a Test Suite

```bash
# Run all tests in a describe block
npm test -- chat.test.ts -t "Constructor"
```

### Verbose Output

```bash
# Jest is already verbose by default (see jest.config.js)
npm test
```

### Watch Mode for Development

```bash
# Re-runs tests when you save files
npm test:watch
```

---

## Adding New Tests

When you add new features to the service, add tests:

### Example: Adding a New Tile

**File:** `src/guidanceMap.ts`
```typescript
export type WaTileId = '...' | 'new-tile';
```

**Test to Add:** `src/__tests__/guidanceMap.test.ts`
```typescript
it('should have guidance for new-tile', () => {
  expect(GUIDANCE_BY_TILE['new-tile']).toBeDefined();
  expect(GUIDANCE_BY_TILE['new-tile'][0].label).toContain('ESSB 5814');
});
```

### Example: Adding Validation

**File:** `src/chat.ts`
```typescript
// New validation: disallow empty strings
if (message.content.trim().length === 0) {
  throw new Error('Message content cannot be empty');
}
```

**Test to Add:** `src/__tests__/chat.test.ts`
```typescript
it('should reject empty message content', async () => {
  await expect(
    service.chat('software', [{ role: 'user', content: '   ' }])
  ).rejects.toThrow('Message content cannot be empty');
});
```

---

## Common Issues

### Issue: "Cannot find module 'openai'"

**Fix:** Run `npm install` in `wa-guidance-service/`

```bash
cd wa-guidance-service
npm install
```

### Issue: Tests hang or timeout

**Likely Cause:** Guidance directory is set and tests try to read files

**Fix:** Tests don't set `guidanceDir`, so they skip file I/O

### Issue: TypeScript compilation error

**Fix:** Ensure tsconfig.json is in place

```bash
ls wa-guidance-service/tsconfig.json
```

---

## Continuous Integration

To run tests in CI/CD (GitHub Actions, GitLab, etc.):

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm install
  working-directory: wa-guidance-service

- name: Run tests
  run: npm test
  working-directory: wa-guidance-service
```

---

## Next Steps

1. ✅ Run `npm test` locally
2. ✅ Review coverage with `npm run test:coverage`
3. ✅ Add tests for any new features
4. ✅ Keep tests running before pushing to git

Happy testing! 🚀

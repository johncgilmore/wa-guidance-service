# Quick Test Reference

## TL;DR - Just Run These Commands

```bash
cd wa-guidance-service

# Run all tests (takes ~2 seconds)
npm test

# See which parts of code are tested
npm run test:coverage

# Watch mode - re-runs tests as you edit
npm test:watch

# Run only a specific test file
npm test -- types.test.ts
npm test -- chat.test.ts
npm test -- guidanceMap.test.ts

# Run tests matching a name pattern
npm test -- -t "should reject invalid tile"
```

---

## What Each Command Does

| Command | What It Does |
|---------|------------|
| `npm test` | Runs all 48 tests once, shows results |
| `npm run test:coverage` | Shows % of code covered by tests |
| `npm test:watch` | Keeps running, re-runs when you save files |
| `npm test -- types.test.ts` | Only runs type tests (7 tests) |
| `npm test -- chat.test.ts` | Only runs chat service tests (32 tests) |
| `npm test -- guidanceMap.test.ts` | Only runs guidance map tests (9 tests) |

---

## Expected Output

### Successful Run

```
Test Suites: 3 passed, 3 total
Tests:       48 passed, 48 total
Time:        ~2.1s
```

### With Coverage

```
File            | % Stmts | % Branch | % Funcs | % Lines
guidanceMap.ts  |   100%  |   100%   |   100%  |   100%
prompts.ts      |   100%  |   100%   |   100%  |   100%
chat.ts         |    82%  |    83%   |    80%  |    82%
All files       |    85%  |    84%   |    83%  |    85%
```

---

## Debugging a Failed Test

```bash
# Get more detail about what failed
npm test -- chat.test.ts -v

# Run just one test
npm test -- chat.test.ts -t "should handle successful"

# Keep running that test while you debug
npm test:watch -- -t "should handle successful"
```

---

## Before You Commit

```bash
# Always run this to ensure tests pass
npm test

# Check that you didn't break anything
npm run test:coverage
```

---

## If Tests Won't Run

```bash
# Make sure dependencies are installed
npm install

# Clear cache and try again
npm test -- --clearCache
npm test
```

For more details, see **TESTING.md**

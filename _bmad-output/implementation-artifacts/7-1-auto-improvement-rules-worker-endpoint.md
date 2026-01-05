# Story 7.1: Auto-Improvement Rules & Worker Endpoint

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want a dedicated API endpoint and rules constant for automatic prompt improvement,
So that auto-improvement logic is separate from manual improvement and maintainable.

## Acceptance Criteria

1. **AUTO_IMPROVE_SYSTEM_PROMPT constant creation**
   - **Given** prompts.js configuration file exists
   - **When** adding auto-improvement support
   - **Then** new constant `AUTO_IMPROVE_SYSTEM_PROMPT` is added to prompts.js
   - **And** constant follows ES6 named export pattern: `export const AUTO_IMPROVE_SYSTEM_PROMPT = '...';`
   - **And** prompt contains instructions for automatic prompt enhancement
   - **And** prompt is separate from existing `IMPROVEMENT_SYSTEM_PROMPT`

2. **Prompt content requirements**
   - **Given** AUTO_IMPROVE_SYSTEM_PROMPT constant exists
   - **When** defining the prompt content
   - **Then** prompt instructs AI to enhance prompt structure using R/T/E framework
   - **And** prompt emphasizes clarity, specificity, and completeness
   - **And** prompt does NOT require user feedback (unlike manual improvement)
   - **And** prompt returns ONLY improved prompt text (no JSON, no explanations)
   - **And** prompt preserves user's original intent while adding structure

3. **Cloudflare Worker endpoint implementation**
   - **Given** worker.js file exists
   - **When** implementing auto-improvement endpoint
   - **Then** new endpoint `/api/auto-improve` is added
   - **And** endpoint accepts POST requests with `{ prompt: string }`
   - **And** endpoint validates prompt is present and non-empty
   - **And** endpoint returns error if validation fails
   - **And** endpoint calls OpenAI API with AUTO_IMPROVE_SYSTEM_PROMPT
   - **And** endpoint returns `{ success: true, data: { improvedPrompt: string } }`
   - **And** endpoint follows same error format as existing endpoints

4. **Worker request handling**
   - **Given** /api/auto-improve endpoint receives request
   - **When** processing request
   - **Then** endpoint validates request origin (same as existing endpoints)
   - **And** endpoint uses callOpenAIAPI helper function
   - **And** endpoint sets timeout to 15 seconds (NFR7-P1)
   - **And** endpoint returns standardized error responses for failures
   - **And** endpoint logs errors for debugging

5. **Router integration**
   - **Given** worker.js has existing router
   - **When** adding /api/auto-improve endpoint
   - **Then** router includes new route for /api/auto-improve
   - **And** route is positioned after /api/chat and /api/improve routes
   - **And** route uses handleAutoImproveAPI function

6. **Worker deployment**
   - **Given** worker is deployed
   - **When** client calls /api/auto-improve
   - **Then** endpoint responds within 15 seconds or times out
   - **And** successful response contains only improved prompt text
   - **And** error response contains user-friendly error message
   - **And** CORS headers are properly set

## Tasks / Subtasks

- [x] Create AUTO_IMPROVE_SYSTEM_PROMPT in prompts.js (AC: #1, #2)
  - [x] Add new export constant to prompts.js
  - [x] Define prompt content for automatic enhancement
  - [x] Ensure prompt returns plain text (not JSON)
  - [x] Test prompt structure manually
- [x] Implement handleAutoImproveAPI in worker.js (AC: #3, #4)
  - [x] Create handler function
  - [x] Add POST method validation
  - [x] Add request body parsing
  - [x] Add prompt field validation
  - [x] Add origin validation
  - [x] Add OpenAI API call
  - [x] Add response formatting
  - [x] Add error handling
- [x] Update worker router (AC: #5)
  - [x] Add /api/auto-improve route
  - [x] Import AUTO_IMPROVE_SYSTEM_PROMPT from prompts.js
  - [x] Connect route to handler function
- [x] Update wrangler.toml if needed (AC: #6)
  - [x] Verify build configuration supports ES6 modules
  - [x] Verify prompts.js is bundled correctly
- [x] Test local deployment (AC: #6)
  - [x] Run `npx wrangler dev`
  - [x] Test endpoint with curl: `curl -X POST http://localhost:8787/api/auto-improve -H "Content-Type: application/json" -d '{"prompt":"test"}'`
  - [x] Verify CORS headers
  - [x] Verify error responses
- [x] Deploy to production (AC: #6)
  - [x] Run `npx wrangler deploy`
  - [x] Test production endpoint
  - [x] Verify response format

## Dev Notes

**Epic Context:**
Epic 7 adds automatic prompt improvement functionality - users can toggle a switch to have their prompts automatically enhanced before submission, eliminating the need to experience failure first. This is a proactive improvement mode.

**Story Context:**
This is the first story in Epic 7. It establishes the backend infrastructure (Worker endpoint and system prompt) that Story 7.2 and 7.3 will build upon. The auto-improve feature is distinct from manual improvement in that:
- It doesn't require user feedback
- It returns plain text (not structured JSON with mapping/explanations)
- It's designed for pre-submission enhancement, not post-failure learning

**Recent Infrastructure Changes (2026-01-05):**
- System prompts were refactored from inline definitions to `cloudflare-worker/prompts.js`
- CHAT_SYSTEM_PROMPT and IMPROVEMENT_SYSTEM_PROMPT are now ES6 named exports
- Worker imports prompts using: `import { CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT } from './prompts.js'`
- This story follows the same pattern for AUTO_IMPROVE_SYSTEM_PROMPT

**Critical Implementation Details:**

**Prompt Content Requirements:**
The AUTO_IMPROVE_SYSTEM_PROMPT must:
- Instruct AI to enhance prompts using R/T/E framework structure
- Add clarity and specificity to vague instructions
- Ensure clear task definition
- Add relevant context or constraints if missing
- Improve formatting for readability
- Preserve user's original voice and intent
- **NOT** add examples unless significantly helpful (unlike manual improvement)
- **NOT** add explicit "Rules/Task/Examples" labels (keep it natural)
- Return ONLY improved prompt text (no JSON, no explanations, no metadata)

**Endpoint Specification:**
```javascript
// Route: POST /api/auto-improve
// Request: { prompt: string }
// Success Response: { success: true, data: { improvedPrompt: string } }
// Error Response: { success: false, error: { code, message, details } }
```

**Error Codes:**
- `MISSING_FIELDS` - Prompt field missing or invalid
- `INVALID_METHOD` - Non-POST request method used
- `INVALID_ORIGIN` - Unauthorized request origin
- `API_TIMEOUT` - Request exceeded 15 seconds
- `RATE_LIMIT_EXCEEDED` - OpenAI rate limit hit
- `INVALID_API_KEY` - Service configuration error
- `OPENAI_API_ERROR` - OpenAI returned error
- `NETWORK_ERROR` - Connection failed

**OpenAI API Call Parameters:**
- Model: gpt-3.5-turbo
- Messages: `[{ role: 'user', content: body.prompt }]`
- System Prompt: AUTO_IMPROVE_SYSTEM_PROMPT
- Timeout: 15000ms (15 seconds)
- Max Tokens: 500 (optimized for prompt improvement, not full response generation)

### Project Structure Notes

**Files to Modify:**
1. **cloudflare-worker/prompts.js**
   - Add: `export const AUTO_IMPROVE_SYSTEM_PROMPT = \`...\`;`
   - Follow existing pattern from CHAT_SYSTEM_PROMPT and IMPROVEMENT_SYSTEM_PROMPT

2. **cloudflare-worker/worker.js**
   - Add import: `import { CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT, AUTO_IMPROVE_SYSTEM_PROMPT } from './prompts.js';`
   - Add handler function: `async function handleAutoImproveAPI(request, env) { ... }`
   - Update router: Add route for `/api/auto-improve`

**Worker Router Pattern:**
```javascript
// Existing router structure (preserve this pattern)
if (url.pathname === '/api/chat') {
  return handleChatAPI(request, env);
}
if (url.pathname === '/api/improve') {
  return handleImprovementAPI(request, env);
}
// NEW: Add after /api/improve
if (url.pathname === '/api/auto-improve') {
  return handleAutoImproveAPI(request, env);
}
```

**Handler Function Pattern:**
Follow the same structure as `handleChatAPI` and `handleImprovementAPI`:
- POST method validation
- Request body parsing
- Field validation
- Origin validation
- OpenAI API call via `callOpenAIAPI()`
- Success response via `createSuccessResponse()`
- Error handling via `createErrorResponse()`

### Architecture Compliance

**Security (NFR-S1 to NFR-S7):**
- ✅ API key stored as Cloudflare Secret (never in code)
- ✅ Origin validation prevents unauthorized usage
- ✅ Request validation prevents API abuse
- ✅ Standardized error responses (no technical details leaked)

**Integration (NFR-I1 to NFR-I7):**
- ✅ OpenAI API integration (gpt-3.5-turbo)
- ✅ Proper message format per OpenAI API spec
- ✅ Response parsing extracts message content
- ✅ Error code handling (429 rate limit, 401 auth, 500 errors)
- ✅ <500ms worker latency overhead (NFR-I5)
- ✅ Standardized error response format (NFR-I6)
- ✅ CORS headers properly configured (NFR-I7)

**Performance (NFR7-P1):**
- ✅ 15-second timeout for auto-improvement API calls
- ✅ 500 max tokens optimized for prompt enhancement

### References

**Source: epics.md** - Epic 7 stories and acceptance criteria
**Source: architecture.md** - System Prompts Architecture section (lines 2378-2584)
**Source: architecture.md** - Cloudflare Worker Implementation Architecture (lines 1890-2374)
**Source: project-context.md** - Cloudflare Worker development and deployment patterns

**Related Stories:**
- Story 1.0: Cloudflare Worker Implementation (infrastructure foundation)
- Story 3.1: Improvement API Integration (similar endpoint pattern)
- Story 7.2: Auto-Improve Toggle Component (uses this endpoint)
- Story 7.3: Auto-Improvement Chat Flow Integration (frontend integration)

## Code Review Findings (2026-01-05)

**Issues Fixed:**
- **[MEDIUM]** Fixed whitespace-only prompt validation in worker.js:373 - Added regex check to catch prompts containing only spaces
- **[LOW]** Added INVALID_METHOD to error codes documentation - Consistency with implementation

**Issues Not Addressed:**
- **[LOW]** No rate limiting for auto-improve endpoint - Deferred to future epic (mitigated by 15s timeout and OpenAI rate limits)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

### Completion Notes List

**Task 1 Completed:**
- Created AUTO_IMPROVE_SYSTEM_PROMPT constant in cloudflare-worker/prompts.js:186
- Prompt follows ES6 named export pattern
- Prompt content instructs AI to enhance prompts using R/T/E framework
- Prompt emphasizes clarity, specificity, and completeness
- Prompt returns ONLY improved prompt text (no JSON, no explanations)
- Prompt preserves user's original intent while adding structure
- Syntax validated with node --check
- Distinct from IMPROVEMENT_SYSTEM_PROMPT (no user feedback required, returns plain text)

**Task 2 & 3 Completed:**
- Implemented handleAutoImproveAPI in cloudflare-worker/worker.js:348
- Added POST method validation with error response
- Added request body parsing with error handling
- Added prompt field validation (present, non-empty, max length 10000)
- Added origin validation using existing validateOrigin function
- Added OpenAI API call with AUTO_IMPROVE_SYSTEM_PROMPT
- Added response formatting: `{ success: true, data: { improvedPrompt: string } }`
- Added comprehensive error handling (MISSING_FIELDS, INVALID_ORIGIN, API_TIMEOUT, etc.)
- Updated router to include /api/auto-improve route at worker.js:24
- Imported AUTO_IMPROVE_SYSTEM_PROMPT in worker.js:6
- Route positioned after /api/chat and /api/improve routes
- 15 second timeout configured (NFR7-P1)
- 500 max tokens optimized for prompt improvement
- Returns plain text (not JSON) - distinct from /api/improve
- Syntax validated with node --check

**Task 4 Completed:**
- Verified wrangler.toml configuration at cloudflare-worker/wrangler.toml:8
- Build configuration supports ES6 modules: `upload.format = "modules"`
- prompts.js will be bundled correctly via ES6 import statements
- No changes needed to wrangler.toml

**Task 5 Completed:**
- Local wrangler dev server already running on port 8787 (PID 19181)
- Tested endpoint with sample prompt: `{"prompt":"write code"}`
- Successful response: `{"success":true,"data":{"improvedPrompt":"Please write code for a specific task or program."}}`
- Verified error response with empty prompt field: Proper MISSING_FIELDS error returned
- Verified CORS headers: `Access-Control-Allow-Origin: *` present
- Endpoint responds within expected time (< 15 seconds)
- Error responses follow standardized format

**Task 6 Completed:**
- Deployed worker to production: https://digitalwave-test-proxy.x-gs-x.workers.dev
- Production endpoint tested with prompt: `{"prompt":"create a website"}`
- Successful production response: Improved prompt with specific, actionable instructions
- Error response tested and verified in production: Proper MISSING_FIELDS error format
- Response format validated: `{ success: true, data: { improvedPrompt: string } }`
- All acceptance criteria satisfied for AC #6 (Worker deployment)

### File List

- cloudflare-worker/prompts.js
- cloudflare-worker/worker.js (updated 2026-01-05: enhanced whitespace validation)

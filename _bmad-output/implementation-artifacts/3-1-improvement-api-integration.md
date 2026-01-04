# Story 3.1: Improvement API Integration

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a system,
I want to integrate with OpenAI API to generate improved prompts,
So that the system can leverage AI intelligence to restructure user prompts using the R/T/E framework.

## Acceptance Criteria

**Given** user feedback was submitted (from Epic 2),
**When** I implement the improvement API integration in SECTION 2 (Utility Functions) and SECTION 1 (Constants),
**Then** the following should be implemented:

**SECTION 1 - Constants (add to existing):**
```javascript
const IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt engineering expert. Analyze the user's original prompt and restructure it using the Rules/Task/Examples framework.

Rules: Constraints and guidelines the AI should follow
Task: Clear, specific instruction of what to generate
Examples: Sample outputs showing desired style

Return JSON with:
- improvedPrompt: restructured version
- mapping: [{originalSentence, improvedSections: []}]
- explanations: [{section, tooltip}]`;
```

**SECTION 2 - Utility Functions (add new function):**
1. `generateImprovement(originalPrompt, userFeedback)` function:
   - Parameters: `originalPrompt` (string), `userFeedback` (string)
   - Returns: Promise with structured improvement data
   - Fetches from: `${WORKER_URL}/api/improve`
   - Request body:
     ```javascript
     {
       originalPrompt: "...",
       userFeedback: "..."
     }
     ```
   - Timeout: 15 seconds (NFR-P4)
   - Handles: Success response with structured JSON
   - Throws: Error with code for failures

**API request format:**
```javascript
{
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: IMPROVEMENT_SYSTEM_PROMPT
    },
    {
      role: "user",
      content: `Original: "${originalPrompt}"\nFeedback: "${userFeedback}"\nRestructure using R/T/E framework.`
    }
  ],
  response_format: { type: "json_object" }
}
```

**Cloudflare Worker endpoint (`/api/improve`):**
- Accepts POST requests with originalPrompt and userFeedback
- Calls OpenAI API with IMPROVEMENT_SYSTEM_PROMPT
- Returns standardized response: `{ success, data, error }`
- Handles errors: rate limit, timeout, authentication failures

**Given** the API function exists,
**When** called from feedback submission flow,
**Then** the function should:
- Validate input parameters are non-empty strings
- Call Cloudflare Worker endpoint
- Parse JSON response from OpenAI
- Handle API errors gracefully

**Error handling:**
- Network timeout: `{ code: "API_TIMEOUT", message: "..." }`
- Rate limit: `{ code: "RATE_LIMIT_EXCEEDED", message: "..." }`
- Invalid JSON: `{ code: "INVALID_RESPONSE", message: "..." }`
- Worker unavailable: `{ code: "WORKER_UNAVAILABLE", message: "..." }`

**Requirements fulfilled:** FR11, FR14, FR20, NFR-I1, NFR-I2, NFR-I3, NFR-I4, Architecture requirements 6, 12, 13

## Tasks / Subtasks

- [ ] Task 1: Add IMPROVEMENT_SYSTEM_PROMPT constant to SECTION 1 (AC: SECTION 1 - Constants)
  - [ ] 1.1: Locate SECTION 1: CONSTANTS & CONFIGURATION in index.html
  - [ ] 1.2: Add IMPROVEMENT_SYSTEM_PROMPT constant after CHAT_SYSTEM_PROMPT
  - [ ] 1.3: Define prompt with clear R/T/E framework explanation
  - [ ] 1.4: Specify JSON response format requirements
  - [ ] 1.5: Include mapping and explanation requirements in prompt
  - [ ] 1.6: Ensure prompt is optimized for GPT-3.5-turbo

- [ ] Task 2: Add API_TIMEOUT constant for improvement endpoint (AC: SECTION 1 - Constants)
  - [ ] 2.1: Add API_TIMEOUT constant (15000ms for 15 seconds)
  - [ ] 2.2: Document NFR-P4 requirement (15 second timeout)
  - [ ] 2.3: Position near existing timeout constants
  - [ ] 2.4: Use UPPER_SNAKE_CASE naming convention

- [ ] Task 3: Create generateImprovement utility function (AC: SECTION 2 - Utility Functions)
  - [ ] 3.1: Locate SECTION 2: UTILITY FUNCTIONS in index.html
  - [ ] 3.2: Add generateImprovement(originalPrompt, userFeedback) function after callChatAPI
  - [ ] 3.3: Implement parameter validation (non-empty strings)
  - [ ] 3.4: Implement fetch call to `${WORKER_URL}/api/improve`
  - [ ] 3.5: Set timeout to 15 seconds (API_TIMEOUT)
  - [ ] 3.6: Implement request body with originalPrompt and userFeedback
  - [ ] 3.7: Parse response JSON and extract data
  - [ ] 3.8: Throw formatted errors for failures

- [ ] Task 4: Implement error handling for generateImprovement (AC: Error handling)
  - [ ] 4.1: Wrap fetch call in try-catch block
  - [ ] 4.2: Handle network timeout errors (API_TIMEOUT)
  - [ ] 4.3: Handle rate limit errors (RATE_LIMIT_EXCEEDED)
  - [ ] 4.4: Handle invalid JSON responses (INVALID_RESPONSE)
  - [ ] 4.5: Handle worker unavailable errors (WORKER_UNAVAILABLE)
  - [ ] 4.6: Use formatError() utility for user-friendly messages

- [ ] Task 5: Update Cloudflare Worker to add /api/improve endpoint (AC: Cloudflare Worker endpoint)
  - [ ] 5.1: Locate cloudflare-worker/worker.js file
  - [ ] 5.2: Add route handler for `/api/improve` in main fetch handler
  - [ ] 5.3: Create handleImprovementAPI function
  - [ ] 5.4: Validate request body has originalPrompt and userFeedback fields
  - [ ] 5.5: Validate request origin (security requirement)
  - [ ] 5.6: Call OpenAI API with IMPROVEMENT_SYSTEM_PROMPT
  - [ ] 5.7: Request JSON response format from OpenAI
  - [ ] 5.8: Parse OpenAI response and extract improvedPrompt, mapping, explanations
  - [ ] 5.9: Return standardized success response: `{ success: true, data: { improvedPrompt, mapping, explanations } }`
  - [ ] 5.10: Return standardized error responses for failures

- [ ] Task 6: Test generateImprovement function with valid input (AC: All)
  - [ ] 6.1: Open index.html in browser with DevTools Console
  - [ ] 6.2: Submit a test prompt in chat
  - [ ] 6.3: Click "Not Satisfied" and enter feedback
  - [ ] 6.4: Set breakpoint in generateImprovement function
  - [ ] 6.5: Verify originalPrompt parameter is passed correctly
  - [ ] 6.6: Verify userFeedback parameter is passed correctly
  - [ ] 6.7: Verify fetch call is made to correct endpoint
  - [ ] 6.8: Verify request body format matches specification
  - [ ] 6.9: Verify response is parsed successfully
  - [ ] 6.10: Verify improvedPrompt, mapping, and explanations are returned

- [ ] Task 7: Test Cloudflare Worker /api/improve endpoint (AC: Cloudflare Worker endpoint)
  - [ ] 7.1: Ensure Worker is running locally: `npx wrangler dev`
  - [ ] 7.2: Test endpoint with curl:
     ```bash
     curl -X POST http://localhost:8787/api/improve \
       -H "Content-Type: application/json" \
       -H "Origin: http://localhost:3000" \
       -d '{"originalPrompt":"write code","userFeedback":"too vague"}'
     ```
  - [ ] 7.3: Verify response format: `{ success: true, data: { improvedPrompt, mapping, explanations } }`
  - [ ] 7.4: Verify improvedPrompt follows R/T/E structure
  - [ ] 7.5: Verify mapping array contains original sentences and improved sections
  - [ ] 7.6: Verify explanations array contains tooltips for each section
  - [ ] 7.7: Test with production Worker: `npx wrangler deploy`
  - [ ] 7.8: Verify production endpoint works with deployed index.html

- [ ] Task 8: Test error handling scenarios (AC: Error handling)
  - [ ] 8.1: Test network timeout: Set timeout to 1ms, verify API_TIMEOUT error
  - [ ] 8.2: Test invalid worker URL: Change WORKER_URL to invalid URL
  - [ ] 8.3: Verify WORKER_UNAVAILABLE error is returned
  - [ ] 8.4: Test empty input: Pass empty string for originalPrompt
  - [ ] 8.5: Verify validation error or API handles gracefully
  - [ ] 8.6: Test malformed JSON response from OpenAI (simulate if possible)
  - [ ] 8.7: Verify INVALID_RESPONSE error is returned
  - [ ] 8.8: Verify all error messages are user-friendly
  - [ ] 8.9: Verify error codes match specification

- [ ] Task 9: Test timeout behavior (AC: Timeout: 15 seconds)
  - [ ] 9.1: Monitor API call duration in DevTools Network tab
  - [ ] 9.2: Verify timeout is set to 15000ms (15 seconds)
  - [ ] 9.3: Test with slow OpenAI response (if reproducible)
  - [ ] 9.4: Verify timeout error is returned after 15 seconds
  - [ ] 9.5: Verify UI remains responsive during timeout
  - [ ] 9.6: Verify `isGeneratingImprovement` state is cleared on timeout

- [ ] Task 10: Test JSON response parsing (AC: Cloudflare Worker endpoint)
  - [ ] 10.1: Verify OpenAI returns valid JSON response
  - [ ] 10.2: Parse improvedPrompt field (non-empty string)
  - [ ] 10.3: Parse mapping array (at least one element)
  - [ ] 10.4: Verify each mapping has originalSentence (string) and improvedSections (array)
  - [ ] 10.5: Parse explanations array (at least one element)
  - [ ] 10.6: Verify each explanation has section (string) and tooltip (string)
  - [ ] 10.7: Test with various prompt types to ensure consistent JSON format
  - [ ] 10.8: Handle JSON parsing errors gracefully

- [ ] Task 11: Integration test with Story 2.3 feedback flow (AC: All)
  - [ ] 11.1: Verify Story 2.3 handleFeedbackSubmit calls generateImprovement
  - [ ] 11.2: Verify isGeneratingImprovement state is set before API call
  - [ ] 11.3: Verify API call parameters come from recentFeedback context
  - [ ] 11.4: Verify successful response clears isGeneratingImprovement
  - [ ] 11.5: Verify comparisonData is stored in context on success
  - [ ] 11.6: Verify isComparisonModalOpen is set to true on success
  - [ ] 11.7: Test complete flow: feedback → improvement generation → comparison modal

- [ ] Task 12: Performance testing (AC: Performance requirements)
  - [ ] 12.1: Measure API call duration for typical prompts
  - [ ] 12.2: Verify most calls complete within 10 seconds
  - [ ] 12.3: Verify all calls complete within 15 seconds (timeout)
  - [ ] 12.4: Measure memory usage during API call
  - [ ] 12.5: Verify no memory leaks in repeated calls
  - [ ] 12.6: Verify UI remains responsive during API call
  - [ ] 12.7: Verify loading indicator displays during call (from Story 2.4)

- [ ] Task 13: Security validation (AC: All)
  - [ ] 13.1: Verify API key is NOT exposed in client code
  - [ ] 13.2: Verify all calls go through Cloudflare Worker proxy
  - [ ] 13.3: Verify Worker validates request origin
  - [ ] 13.4: Verify no API keys in browser DevTools Network tab
  - [ ] 13.5: Verify no API keys in browser console logs
  - [ ] 13.6: Verify input sanitization before API call (prevent injection)

## Dev Notes

### Architecture Compliance

This story implements the improvement API integration, enabling the system to generate R/T/E-structured prompt improvements using OpenAI's intelligence.

**CRITICAL: Follow All Architecture Patterns**

From Architecture.md and project-context.md:
- Add constants to SECTION 1 (CONSTANTS & CONFIGURATION)
- Add utility function to SECTION 2 (UTILITY FUNCTIONS)
- Update Cloudflare Worker to add `/api/improve` endpoint
- Use formatError() utility for error handling
- Follow BEM-lite CSS naming (though no new CSS in this story)
- Maintain 7-section file organization
- Use UPPER_SNAKE_CASE for constants
- Use camelCase for function names
- Handle errors with try-catch and formatError()

**7-Section Structure (MUST FOLLOW):**
```
SECTION 1: CONSTANTS & CONFIGURATION
SECTION 2: UTILITY FUNCTIONS
SECTION 3: CUSTOM HOOKS
SECTION 4: REACT COMPONENTS (Leaf → Composite → Layout)
SECTION 5: CONTEXT PROVIDER
SECTION 6: MAIN APP COMPONENT
SECTION 7: RENDER
```

**This story modifies:**
- SECTION 1: Add IMPROVEMENT_SYSTEM_PROMPT and API_TIMEOUT constants
- SECTION 2: Add generateImprovement() utility function
- cloudflare-worker/worker.js: Add `/api/improve` endpoint handler

### Technical Requirements

**SECTION 1 - Constants:**

```javascript
// Add after CHAT_SYSTEM_PROMPT
const IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt engineering expert. Analyze the user's original prompt and restructure it using the Rules/Task/Examples framework.

Rules: Constraints and guidelines the AI should follow
Task: Clear, specific instruction of what to generate
Examples: Sample outputs showing desired style

Return JSON with:
- improvedPrompt: restructured version
- mapping: [{originalSentence, improvedSections: []}]
- explanations: [{section, tooltip}]`;

const API_TIMEOUT = 15000; // 15 seconds for improvement generation (NFR-P4)
```

**SECTION 2 - Utility Functions:**

```javascript
// Add after callChatAPI function
async function generateImprovement(originalPrompt, userFeedback) {
  // Validate inputs
  if (!originalPrompt || typeof originalPrompt !== 'string' || originalPrompt.trim() === '') {
    throw new Error('Original prompt is required');
  }

  if (!userFeedback || typeof userFeedback !== 'string' || userFeedback.trim() === '') {
    throw new Error('User feedback is required');
  }

  try {
    const response = await fetch(`${WORKER_URL}/api/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        originalPrompt: originalPrompt.trim(),
        userFeedback: userFeedback.trim()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Unknown error');
    }

    // Validate response structure
    const { improvedPrompt, mapping, explanations } = result.data;

    if (!improvedPrompt || !mapping || !explanations) {
      throw new Error('INVALID_RESPONSE: Missing required fields');
    }

    if (!Array.isArray(mapping) || !Array.isArray(explanations)) {
      throw new Error('INVALID_RESPONSE: mapping and explanations must be arrays');
    }

    return {
      improvedPrompt,
      mapping,
      explanations
    };

  } catch (error) {
    // Format error for user-friendly display
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw formatError({ code: 'NETWORK_ERROR', message: error.message });
    }

    if (error.message.includes('timeout') || error.message.includes('aborted')) {
      throw formatError({ code: 'API_TIMEOUT', message: 'Request timeout' });
    }

    // Re-throw formatted errors
    throw error;
  }
}
```

**Cloudflare Worker (cloudflare-worker/worker.js):**

```javascript
// Add to worker.js main fetch handler
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleCORS();
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Route requests
    if (path === "/api/chat") {
      return handleChatAPI(request, env);
    } else if (path === "/api/improve") {
      return handleImprovementAPI(request, env);  // NEW
    }

    return new Response("Not Found", { status: 404 });
  }
}

// Add new handler function
async function handleImprovementAPI(request, env) {
  try {
    // Validate request method
    if (request.method !== "POST") {
      return createErrorResponse("INVALID_METHOD", "Only POST requests allowed", "Expected POST");
    }

    // Parse request body
    const body = await request.json();
    const { originalPrompt, userFeedback } = body;

    // Validate required fields
    if (!originalPrompt || typeof originalPrompt !== 'string') {
      return createErrorResponse("MISSING_FIELDS", "originalPrompt is required", "Field: originalPrompt");
    }

    if (!userFeedback || typeof userFeedback !== 'string') {
      return createErrorResponse("MISSING_FIELDS", "userFeedback is required", "Field: userFeedback");
    }

    // Validate origin (security)
    const origin = request.headers.get('Origin');
    const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['*'];

    if (!allowedOrigins.some(allowed => origin?.match(allowed.replace('*', '.*')))) {
      return createErrorResponse("INVALID_ORIGIN", "Unauthorized request", `Origin: ${origin}`);
    }

    // Call OpenAI API with improvement system prompt
    const messages = [
      {
        role: "system",
        content: `You are a prompt engineering expert. Analyze the user's original prompt and restructure it using the Rules/Task/Examples framework.

Rules: Constraints and guidelines the AI should follow
Task: Clear, specific instruction of what to generate
Examples: Sample outputs showing desired style

Return JSON with:
- improvedPrompt: restructured version
- mapping: array of {originalSentence, improvedSections: []}
- explanations: array of {section, tooltip}`
      },
      {
        role: "user",
        content: `Original: "${originalPrompt}"\nFeedback: "${userFeedback}"\nRestructure using R/T/E framework.`
      }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.code || 'OPENAI_API_ERROR');
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;

    // Parse JSON response from OpenAI
    let improvementData;
    try {
      improvementData = JSON.parse(content);
    } catch (parseError) {
      return createErrorResponse("INVALID_RESPONSE", "Invalid JSON from AI", "Parse error");
    }

    // Validate response structure
    if (!improvementData.improvedPrompt || !improvementData.mapping || !improvementData.explanations) {
      return createErrorResponse("INVALID_RESPONSE", "Missing required fields", "Incomplete response");
    }

    // Return success response
    return createSuccessResponse({
      improvedPrompt: improvementData.improvedPrompt,
      mapping: improvementData.mapping,
      explanations: improvementData.explanations
    });

  } catch (error) {
    console.error('Improvement API error:', error);

    if (error.message === 'OPENAI_API_ERROR') {
      return createErrorResponse("OPENAI_API_ERROR", "AI service error", error.message);
    }

    return createErrorResponse("UNKNOWN", "An error occurred", error.message);
  }
}
```

**Error Response Helper (add to worker.js if not exists):**

```javascript
function createSuccessResponse(data) {
  return new Response(JSON.stringify({
    success: true,
    data: data
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function createErrorResponse(code, message, details) {
  return new Response(JSON.stringify({
    success: false,
    error: {
      code: code,
      message: message,
      details: details
    }
  }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

### Previous Story Intelligence

**From Story 2.4 Implementation (Most Recent):**
- Loading indicator displays "Generating improvement..." during API call
- `isGeneratingImprovement` state exists in AppContext
- ChatInput is disabled during improvement generation
- MessageBubble "Not Satisfied" button is disabled during loading
- State transitions complete in < 50ms (NFR-P5)
- Fade-in animation for loading indicator (200ms)

**From Story 2.3 Implementation:**
- `handleFeedbackSubmit` function exists in FeedbackModal component
- `recentFeedback` object stored in context: `{ userPrompt, aiResponse, feedbackText, timestamp }`
- Current implementation has temporary 2-second timeout (placeholder for actual API call)
- This story replaces the placeholder timeout with real API call

**From Story 2.2 Implementation:**
- FeedbackModal component captures user feedback
- Feedback submission flow exists and is functional
- Modal closes after submission
- Error handling for empty feedback input

**From Story 2.1 Implementation:**
- "Not Satisfied" button triggers improvement workflow
- Button only shows on most recent AI message
- BEM-lite CSS class: `.message-bubble__not-satisfied`

**From Story 1.4 Implementation:**
- `callChatAPI()` function exists in SECTION 2
- `WORKER_URL` constant exists in SECTION 1
- `CHAT_SYSTEM_PROMPT` constant exists in SECTION 1
- `formatError()` utility function exists in SECTION 2
- Error handling pattern: try-catch with formatError
- Standardized API response format: `{ success, data, error }`

**From Story 1.2 Implementation:**
- AppContext provides: `comparisonData`, `setComparisonData`, `isComparisonModalOpen`, `setIsComparisonModalOpen`
- State setters exist for storing improvement results
- State structure follows flat object pattern

**From Story 1.0 Implementation:**
- Cloudflare Worker exists at cloudflare-worker/worker.js
- Worker has `/api/chat` endpoint implemented
- Worker handles CORS preflight requests
- Worker validates request origin
- Worker has `createSuccessResponse()` and `createErrorResponse()` helpers
- Worker calls OpenAI API with stored secret key
- Worker returns standardized response format

**Current index.html Structure:**
- SECTION 1: CONSTANTS & CONFIGURATION
  - EXISTING: WORKER_URL, CHAT_SYSTEM_PROMPT, API_TIMEOUT (10s)
  - NEW: IMPROVEMENT_SYSTEM_PROMPT, API_TIMEOUT (15s)
- SECTION 2: UTILITY FUNCTIONS
  - EXISTING: formatError, callChatAPI
  - NEW: generateImprovement
- SECTION 3: CUSTOM HOOKS (useAppContext)
- SECTION 4: REACT COMPONENTS (No changes in this story)
- SECTION 5: CONTEXT PROVIDER (AppContext, AppProvider)
- SECTION 6: MAIN APP COMPONENT (App)
- SECTION 7: RENDER (ReactDOM.createRoot)

**Cloudflare Worker Structure:**
- EXISTING: `/api/chat` endpoint handler
- EXISTING: CORS handler
- EXISTING: Error response helpers
- NEW: `/api/improve` endpoint handler
- NEW: `handleImprovementAPI()` function

**Key Learnings from Previous Stories:**
- Component definition order is CRITICAL (though no new components in this story)
- BEM-lite CSS naming is REQUIRED
- ALL OpenAI calls MUST go through Cloudflare Worker (security requirement)
- Error objects format: `{ message, code }` (never strings)
- Use formatError() utility for user-friendly error messages
- State updates use immutable patterns
- Loading states disable buttons and inputs
- API timeouts prevent indefinite waiting
- Standardized response format from Worker: `{ success, data, error }`

### Git Intelligence

**Recent Commits:**
- `ba2ad82 chore: Update sprint status - Story 2.1 complete`
- `259e709 feat(story-2.1): Complete "Not Satisfied" button integration with code review fixes`
- `9fea91e feat(epic-1): Complete Epic 1 implementation - Stories 1.2 through 1.5`

**Established Patterns:**
- Commit message format: `feat(story-X.X): Description`
- ALL API calls go through Cloudflare Worker proxy
- Error handling with try-catch and formatError()
- Loading state pattern: boolean flags with `is` prefix
- Standardized API response format: `{ success, data, error }`
- OpenAI integration via Worker with system prompts

**Code Review Patterns from Previous Stories:**
- API key protection is CRITICAL (never exposed in client code)
- Use timeout for all API calls
- Validate all inputs before API calls
- Provide user-friendly error messages
- Handle all error scenarios gracefully
- Test with both local and production Worker

### Library & Framework Requirements

| Dependency | Version | Source | Notes |
|------------|---------|--------|-------|
| React | 18.x | unpkg CDN | Already loaded |
| ReactDOM | 18.x | unpkg CDN | Already loaded |
| Babel Standalone | latest | unpkg CDN | Already loaded |
| OpenAI API | gpt-3.5-turbo | Via Cloudflare Worker | Model for improvement generation |
| Cloudflare Workers | - | Worker deployment | Serverless API proxy |

**React Hooks Used in This Story:**
- `useAppContext()` - Access context state (no changes, existing usage)

**Fetch API:**
- Used for all API calls to Cloudflare Worker
- POST method with JSON body
- Headers: `{ 'Content-Type': 'application/json' }`
- Timeout handling via AbortController (optional) or manual timing

**Cloudflare Workers APIs:**
- `fetch()` - Call OpenAI API from Worker
- `env.OPENAI_API_KEY` - Secret key storage
- `env.ALLOWED_ORIGINS` - Origin validation configuration

**No New Dependencies:**
This story uses only existing APIs and infrastructure. No additional libraries needed.

### File Structure Requirements

**Files to Modify:**
1. `/Users/alexgaidukov/Projects/DigitalWaveTest/index.html`
   - SECTION 1: Add IMPROVEMENT_SYSTEM_PROMPT and API_TIMEOUT constants
   - SECTION 2: Add generateImprovement() utility function

2. `/Users/alexgaidukov/Projects/DigitalWaveTest/cloudflare-worker/worker.js`
   - Add `/api/improve` route handler
   - Add `handleImprovementAPI()` function
   - Ensure error response helpers exist

**Sections to Modify in index.html:**
1. SECTION 1 (CONSTANTS & CONFIGURATION):
   - Add IMPROVEMENT_SYSTEM_PROMPT constant after CHAT_SYSTEM_PROMPT
   - Add API_TIMEOUT constant (15000ms)

2. SECTION 2 (UTILITY FUNCTIONS):
   - Add generateImprovement(originalPrompt, userFeedback) function after callChatAPI

**Cloudflare Worker Structure:**
```javascript
// worker.js structure
export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return handleCORS();
    }

    const url = new URL(request.url);

    // Routes
    if (url.pathname === "/api/chat") {
      return handleChatAPI(request, env);
    } else if (url.pathname === "/api/improve") {
      return handleImprovementAPI(request, env);  // NEW
    }

    return new Response("Not Found", { status: 404 });
  }
}

async function handleChatAPI(request, env) {
  // Existing implementation
}

async function handleImprovementAPI(request, env) {
  // NEW - Implementation for this story
}

function handleCORS() {
  // Existing implementation
}

function createSuccessResponse(data) {
  // Existing implementation (or add if missing)
}

function createErrorResponse(code, message, details) {
  // Existing implementation (or add if missing)
}
```

### Testing Requirements

**Unit Testing (Manual):**

1. **Test generateImprovement function:**
   - Open browser DevTools Console
   - Test with valid inputs:
     ```javascript
     generateImprovement("write code", "too vague")
       .then(result => console.log('Success:', result))
       .catch(error => console.error('Error:', error));
     ```
   - Verify improvedPrompt is returned
   - Verify mapping array has structure: `[{ originalSentence, improvedSections }]`
   - Verify explanations array has structure: `[{ section, tooltip }]`

2. **Test input validation:**
   - Test with empty originalPrompt
   - Test with empty userFeedback
   - Test with null/undefined inputs
   - Verify validation errors are thrown

3. **Test error handling:**
   - Test with invalid WORKER_URL
   - Test with Worker not running
   - Verify user-friendly error messages via formatError

**Integration Testing (Cloudflare Worker):**

1. **Test Worker endpoint locally:**
   ```bash
   # Start Worker locally
   npx wrangler dev

   # Test endpoint
   curl -X POST http://localhost:8787/api/improve \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"originalPrompt":"write code","userFeedback":"too vague"}'
   ```

2. **Test Worker endpoint in production:**
   ```bash
   # Deploy Worker
   npx wrangler deploy

   # Test production endpoint
   curl -X POST https://digitalwave-test-proxy.*.workers.dev/api/improve \
     -H "Content-Type: application/json" \
     -d '{"originalPrompt":"write code","userFeedback":"too vague"}'
   ```

3. **Test OpenAI API integration:**
   - Verify Worker calls OpenAI API correctly
   - Verify system prompt is passed to OpenAI
   - Verify JSON response format is requested
   - Verify response is parsed correctly

**End-to-End Testing:**

1. **Test complete improvement flow:**
   - Open index.html in browser
   - Submit test prompt: "give me product names"
   - Wait for AI response
   - Click "Not Satisfied" button
   - Enter feedback: "too generic, need creative names"
   - Click "Generate Improved Prompt"
   - Verify loading indicator appears (Story 2.4)
   - Wait for improvement generation
   - Verify improvement data is stored in context (React DevTools)
   - Verify loading indicator disappears
   - Verify isGeneratingImprovement = false
   - (Future: Verify comparison modal opens in Epic 4)

2. **Test timeout behavior:**
   - Monitor Network tab in DevTools
   - Verify API call completes within 15 seconds
   - If timeout occurs, verify error message is displayed
   - Verify loading state is cleared on timeout

3. **Test error scenarios:**
   - Test with Worker offline (simulate network error)
   - Test with invalid API key (Worker configuration error)
   - Verify user-friendly error messages
   - Verify UI remains responsive after errors

**Security Testing:**

1. **Verify API key protection:**
   - Check Network tab in DevTools
   - Verify NO API keys in request headers
   - Verify NO API keys in response body
   - Verify NO API keys in console logs
   - Verify API calls go to Cloudflare Worker, not OpenAI directly

2. **Test origin validation:**
   - Test from unauthorized domain (if possible)
   - Verify Worker rejects unauthorized requests
   - Verify error response: `{ code: "INVALID_ORIGIN" }`

**Performance Testing:**

1. **Measure API call duration:**
   - Use DevTools Performance tab
   - Measure typical API call duration
   - Verify most calls complete within 10 seconds
   - Verify all calls complete within 15 seconds (timeout)

2. **Test UI responsiveness:**
   - Verify UI remains responsive during API call
   - Verify loading indicator displays immediately
   - Verify no jank or lag during API call

### Anti-Patterns to Avoid

```javascript
// ❌ WRONG: Exposing API key in client code
const OPENAI_API_KEY = 'sk-...';
fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
});

// ✅ CORRECT: ALL calls through Cloudflare Worker proxy
fetch(`${WORKER_URL}/api/improve`, {
  headers: { 'Content-Type': 'application/json' }
});

// ❌ WRONG: String error state
throw new Error('API call failed');

// ✅ CORRECT: Error object with code and message
throw formatError({ code: 'API_TIMEOUT', message: 'Request timeout' });

// ❌ WRONG: No input validation
async function generateImprovement(originalPrompt, userFeedback) {
  return fetch(WORKER_URL + '/api/improve', {
    body: JSON.stringify({ originalPrompt, userFeedback })
  });
}

// ✅ CORRECT: Validate inputs before API call
async function generateImprovement(originalPrompt, userFeedback) {
  if (!originalPrompt || !originalPrompt.trim()) {
    throw new Error('Original prompt is required');
  }

  if (!userFeedback || !userFeedback.trim()) {
    throw new Error('User feedback is required');
  }

  return fetch(WORKER_URL + '/api/improve', {
    body: JSON.stringify({
      originalPrompt: originalPrompt.trim(),
      userFeedback: userFeedback.trim()
    })
  });
}

// ❌ WRONG: No timeout handling
const response = await fetch(url);
// May hang indefinitely!

// ✅ CORRECT: Set timeout or use AbortController
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

try {
  const response = await fetch(url, { signal: controller.signal });
  clearTimeout(timeoutId);
  // Handle response...
} catch (error) {
  if (error.name === 'AbortError') {
    throw formatError({ code: 'API_TIMEOUT', message: 'Request timeout' });
  }
  throw error;
}

// ❌ WRONG: Not validating response structure
return result.data;

// ✅ CORRECT: Validate response structure before returning
const { improvedPrompt, mapping, explanations } = result.data;

if (!improvedPrompt || !mapping || !explanations) {
  throw new Error('INVALID_RESPONSE: Missing required fields');
}

if (!Array.isArray(mapping) || !Array.isArray(explanations)) {
  throw new Error('INVALID_RESPONSE: mapping and explanations must be arrays');
}

return { improvedPrompt, mapping, explanations };

// ❌ WRONG: Technical error messages exposed to users
throw new Error('TypeError: Cannot read property "data" of undefined');

// ✅ CORRECT: User-friendly error messages via formatError
throw formatError({ code: 'INVALID_RESPONSE', message: 'Unable to process improvement' });

// ❌ WRONG: Not using IMPROVEMENT_SYSTEM_PROMPT
const messages = [
  { role: 'system', content: 'You are a helpful assistant' },
  { role: 'user', content: 'Fix this prompt' }
];
// Won't generate R/T/E structure!

// ✅ CORRECT: Use detailed IMPROVEMENT_SYSTEM_PROMPT
const messages = [
  {
    role: 'system',
    content: IMPROVEMENT_SYSTEM_PROMPT  // Defines R/T/E framework
  },
  {
    role: 'user',
    content: `Original: "${originalPrompt}"\nFeedback: "${userFeedback}"\nRestructure using R/T/E framework.`
  }
];

// ❌ WRONG: Not requesting JSON format from OpenAI
fetch('https://api.openai.com/v1/chat/completions', {
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: messages
    // No response_format!
  })
});

// ✅ CORRECT: Request JSON response format
fetch('https://api.openai.com/v1/chat/completions', {
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: messages,
    response_format: { type: 'json_object' }
  })
});

// ❌ WRONG: Defining constants in wrong section (SECTION 2 instead of SECTION 1)
function generateImprovement() {
  const IMPROVEMENT_SYSTEM_PROMPT = `...`;  // WRONG!
}

// ✅ CORRECT: Define constants in SECTION 1
// SECTION 1
const IMPROVEMENT_SYSTEM_PROMPT = `...`;

// SECTION 2
function generateImprovement() {
  // Use constant
}

// ❌ WRONG: Not using standardized error response format in Worker
return new Response(JSON.stringify({
  improvedPrompt: data.improvedPrompt,
  mapping: data.mapping
}));

// ✅ CORRECT: Use standardized format
return new Response(JSON.stringify({
  success: true,
  data: {
    improvedPrompt: data.improvedPrompt,
    mapping: data.mapping,
    explanations: data.explanations
  }
}));

// ❌ WRONG: Not handling Worker errors
const response = await fetch(url);
const result = await response.json();
return result.data;  // What if result.success === false?

// ✅ CORRECT: Check success flag
const response = await fetch(url);
const result = await response.json();

if (!result.success) {
  throw new Error(result.error.message);
}

return result.data;

// ❌ WRONG: Parsing JSON without error handling
const improvementData = JSON.parse(content);
return improvementData.improvedPrompt;

// ✅ CORRECT: Parse JSON with error handling
let improvementData;
try {
  improvementData = JSON.parse(content);
} catch (parseError) {
  throw new Error('INVALID_RESPONSE: Unable to parse AI response');
}

if (!improvementData.improvedPrompt) {
  throw new Error('INVALID_RESPONSE: Missing improvedPrompt field');
}

return improvementData;
```

**Correct Patterns:**

```javascript
// ✅ Correct: Constants in SECTION 1
const IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt engineering expert...`;

const API_TIMEOUT = 15000; // 15 seconds for improvement generation

// ✅ Correct: Utility function in SECTION 2
async function generateImprovement(originalPrompt, userFeedback) {
  // Validate inputs
  if (!originalPrompt?.trim()) {
    throw new Error('Original prompt is required');
  }

  if (!userFeedback?.trim()) {
    throw new Error('User feedback is required');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${WORKER_URL}/api/improve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        originalPrompt: originalPrompt.trim(),
        userFeedback: userFeedback.trim()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Unknown error');
    }

    // Validate response structure
    const { improvedPrompt, mapping, explanations } = result.data;

    if (!improvedPrompt || !mapping || !explanations) {
      throw new Error('INVALID_RESPONSE: Missing required fields');
    }

    return { improvedPrompt, mapping, explanations };

  } catch (error) {
    if (error.name === 'AbortError') {
      throw formatError({ code: 'API_TIMEOUT', message: 'Request timeout' });
    }

    throw formatError({
      code: 'NETWORK_ERROR',
      message: error.message || 'Connection failed'
    });
  }
}

// ✅ Correct: Worker endpoint handler
async function handleImprovementAPI(request, env) {
  try {
    if (request.method !== 'POST') {
      return createErrorResponse('INVALID_METHOD', 'Only POST allowed', '');
    }

    const body = await request.json();
    const { originalPrompt, userFeedback } = body;

    if (!originalPrompt || !userFeedback) {
      return createErrorResponse('MISSING_FIELDS', 'Missing required fields', '');
    }

    // Validate origin
    const origin = request.headers.get('Origin');
    if (!isValidOrigin(origin, env.ALLOWED_ORIGINS)) {
      return createErrorResponse('INVALID_ORIGIN', 'Unauthorized request', '');
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: IMPROVEMENT_SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Original: "${originalPrompt}"\nFeedback: "${userFeedback}"\nRestructure using R/T/E framework.`
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.code || 'OPENAI_API_ERROR');
    }

    const openaiData = await openaiResponse.json();
    const content = openaiData.choices[0].message.content;

    // Parse JSON response
    let improvementData;
    try {
      improvementData = JSON.parse(content);
    } catch (parseError) {
      return createErrorResponse('INVALID_RESPONSE', 'Invalid JSON', parseError.message);
    }

    // Validate structure
    if (!improvementData.improvedPrompt || !improvementData.mapping || !improvementData.explanations) {
      return createErrorResponse('INVALID_RESPONSE', 'Missing fields', '');
    }

    return createSuccessResponse({
      improvedPrompt: improvementData.improvedPrompt,
      mapping: improvementData.mapping,
      explanations: improvementData.explanations
    });

  } catch (error) {
    console.error('Improvement API error:', error);

    if (error.message === 'OPENAI_API_ERROR') {
      return createErrorResponse('OPENAI_API_ERROR', 'AI service error', error.message);
    }

    return createErrorResponse('UNKNOWN', 'An error occurred', error.message);
  }
}

// ✅ Correct: Standardized response helpers
function createSuccessResponse(data) {
  return new Response(JSON.stringify({
    success: true,
    data: data
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

function createErrorResponse(code, message, details) {
  return new Response(JSON.stringify({
    success: false,
    error: {
      code: code,
      message: message,
      details: details
    }
  }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// ✅ Correct: Integration with Story 2.3
// In FeedbackModal handleFeedbackSubmit (from Story 2.3):
const handleSubmit = async () => {
  if (!feedbackText.trim()) {
    setValidationError('Please tell us what didn\'t work...');
    return;
  }

  setIsGeneratingImprovement(true);  // Set loading state
  setIsFeedbackModalOpen(false);

  try {
    // NEW - Replace placeholder timeout with real API call
    const { improvedPrompt, mapping, explanations } = await generateImprovement(
      recentFeedback.userPrompt,
      recentFeedback.feedbackText
    );

    // Store improvement data in context (for Epic 4 comparison modal)
    setComparisonData({
      originalPrompt: recentFeedback.userPrompt,
      improvedPrompt: improvedPrompt,
      mapping: mapping,
      explanations: explanations
    });

    // Clear loading state
    setIsGeneratingImprovement(false);

    // Open comparison modal (Epic 4 will implement the modal)
    setIsComparisonModalOpen(true);

  } catch (error) {
    console.error('Improvement generation failed:', error);
    setIsGeneratingImprovement(false);

    // Show error in UI
    setImprovementError(error);
  }
};
```

### Project Structure Notes

- This story modifies TWO files:
  1. `/Users/alexgaidukov/Projects/DigitalWaveTest/index.html` - Add constants and utility function
  2. `/Users/alexgaidukov/Projects/DigitalWaveTest/cloudflare-worker/worker.js` - Add `/api/improve` endpoint

- No new files created

- Sections modified in index.html:
  - SECTION 1: Add IMPROVEMENT_SYSTEM_PROMPT and API_TIMEOUT constants
  - SECTION 2: Add generateImprovement() utility function

- Story sets up Epic 3 for:
  - Story 3.2: Prompt Analysis & Restructuring (uses this API)
  - Story 3.3: Response Parsing & Data Storage (uses this API)

- This is the first story that actually calls the improvement API
- Story 2.3 prepared the integration point with placeholder timeout
- This story replaces the placeholder with real API call

### Requirements Fulfilled

- FR11: System can trigger diagnostic analysis when user expresses dissatisfaction
- FR14: System can generate explanations of why prompts failed to produce desired results
- FR20: System can generate improved versions of user prompts based on dissatisfaction feedback
- NFR-I1: System must integrate with OpenAI API (GPT-3.5-turbo or similar model)
- NFR-I2: API requests must use proper message format as specified by OpenAI API documentation
- NFR-I3: API responses must be parsed correctly to extract message content
- NFR-I4: System must handle OpenAI API error codes (429 rate limit, 401 authentication, 500 server errors) with specific error messages
- Architecture requirement 6: API Integration pattern (all OpenAI calls through Worker proxy)
- Architecture requirement 12: Prompt Evaluation using OpenAI API with hardcoded system prompts
- Architecture requirement 13: Error handling with try-catch and formatError

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No issues encountered during story creation.

### Completion Notes List

**Story 3.1 Creation Complete - 2026-01-04**

✅ **Comprehensive Story Context Created:**
- Analyzed all available artifacts: epics.md, prd.md, architecture.md, ux-design-specification.md, project-context.md
- Extracted story requirements from Epic 3 (Story 3.1)
- Integrated previous story learnings from Story 2.4 (most recent completed)
- Analyzed git history for established patterns

✅ **Technical Requirements Documented:**
- SECTION 1: Add IMPROVEMENT_SYSTEM_PROMPT and API_TIMEOUT constants
- SECTION 2: Add generateImprovement() utility function with full error handling
- Cloudflare Worker: Add `/api/improve` endpoint handler
- Complete API integration flow documented with code examples
- Error handling for all failure scenarios (timeout, network, rate limit, invalid JSON)
- Input validation and response structure validation
- Security: API key protection via Cloudflare Worker proxy

✅ **Previous Story Intelligence Extracted:**
- Story 2.4: Loading indicator, state transitions, disabled button patterns
- Story 2.3: Feedback submission flow, recentFeedback structure, integration point
- Story 1.4: callChatAPI pattern, formatError utility, WORKER_URL constant
- Story 1.0: Cloudflare Worker infrastructure, `/api/chat` endpoint pattern
- Established patterns: BEM-lite naming, error objects, loading states, standardized API responses

✅ **Testing Requirements Comprehensive:**
- Unit testing for generateImprovement function
- Integration testing for Cloudflare Worker endpoint
- End-to-end testing for complete improvement flow
- Security testing (API key protection, origin validation)
- Performance testing (15 second timeout, UI responsiveness)

✅ **Anti-Patterns Documented:**
- API key exposure in client code (critical security violation)
- String error states (should be objects)
- Missing input validation
- No timeout handling
- Not validating response structure
- Technical error messages to users
- Missing JSON format request from OpenAI

✅ **Correct Patterns Provided:**
- Complete code examples for all components
- Proper error handling with formatError
- Input validation before API calls
- Timeout handling with AbortController
- Response structure validation
- Standardized API response format

✅ **Integration Points Documented:**
- Replaces Story 2.3's 2-second placeholder timeout with real API call
- Uses Story 2.4's `isGeneratingImprovement` state
- Stores results in Story 2.3's `comparisonData` context state
- Triggers Story 2.3's `isComparisonModalOpen` state (for Epic 4)
- Sets up Story 3.2 (Prompt Analysis) and Story 3.3 (Response Parsing)

✅ **Architecture Compliance:**
- Follows 7-section file organization
- Uses established Cloudflare Worker patterns
- Maintains API security (no keys in client code)
- Implements proper error handling pattern
- Uses BEM-lite naming (though no new CSS in this story)
- Follows React functional component patterns

**Story is READY FOR DEV implementation**

All technical requirements documented with code examples, testing requirements, and anti-patterns to avoid. The developer agent has everything needed for flawless implementation.

**Next Steps for Dev Agent:**
1. Read comprehensive story file
2. Add constants to SECTION 1 in index.html
3. Add generateImprovement function to SECTION 2 in index.html
4. Add `/api/improve` endpoint to cloudflare-worker/worker.js
5. Test locally with `npx wrangler dev`
6. Deploy Worker with `npx wrangler deploy`
7. Test complete flow end-to-end
8. Update Story 2.3's handleFeedbackSubmit to call real API

### File List

- index.html (modify - add constants and utility function)
- cloudflare-worker/worker.js (modify - add /api/improve endpoint)
- 3-1-improvement-api-integration.md (this file - new)

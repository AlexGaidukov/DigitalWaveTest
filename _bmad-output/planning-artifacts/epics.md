---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: [
  '_bmad-output/planning-artifacts/prd.md',
  '_bmad-output/planning-artifacts/architecture.md',
  '_bmad-output/planning-artifacts/ux-design-specification.md',
  '_bmad-output/project-context.md'
]
workflowType: 'epics-and-stories'
lastStep: 4
project_name: 'DigitalWaveTest'
user_name: 'Alexgaidukov'
date: '2026-01-04'
totalStories: 21
totalEpics: 5
validationStatus: 'COMPLETE'
allFRsCovered: true
allNFRsCovered: true
---

# DigitalWaveTest - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for DigitalWaveTest, decomposing the requirements from the PRD, UX Design, Architecture, and Project Context into implementable stories.

## Requirements Inventory

### Functional Requirements

**Prompt Testing & Interaction (FR1-FR9):**
- FR1: Users can enter free-text prompts into an interactive chat interface
- FR2: Users can submit prompts for AI response generation via OpenAI API
- FR3: Users can view AI-generated responses to their prompts in real-time
- FR4: Users can test multiple prompts sequentially within a single session
- FR5: Users can indicate dissatisfaction with AI responses by clicking "Not Satisfied" (applies to most recent response only)
- FR6: Users can clear prompt input field before submitting
- FR7: Users can view visual focus indication on active input field
- FR8: System can prevent submission of empty prompts with validation message
- FR9: System can validate maximum prompt length before submission

**Failure-Driven Learning Flow (FR10-FR14):**
- FR10: System can capture user feedback on what they didn't like about the most recent AI response
- FR11: System can trigger diagnostic analysis when user expresses dissatisfaction with specific response
- FR12: System can evaluate prompts for compliance with Rules/Task/Examples framework
- FR13: System can identify specific deficiencies in user prompts (missing rules, unclear task, no examples)
- FR14: System can generate explanations of why prompts failed to produce desired results

**Feedback Modal Workflow (FR15-FR18):**
- FR15: Users can open feedback modal by clicking "Not Satisfied" button
- FR16: Users can enter free-text feedback describing what they didn't like about the result
- FR17: Users can submit feedback via "Generate Improved Prompt" button to trigger improvement generation
- FR18: Users can cancel feedback modal and return to chat without submitting

**Prompt Improvement & Transformation (FR19-FR27):**
- FR19: System can restructure vague prompts into Rules/Task/Examples framework format
- FR20: System can generate improved versions of user prompts based on dissatisfaction feedback
- FR21: System can preserve user intent while adding framework structure to prompts
- FR22: System can detect common prompt mistakes from user feedback patterns
- FR23: System can parse original prompts into sentences (delimited by periods)
- FR24: System can map original sentences to improved prompt sections in one-to-many relationship
- FR25: Users can apply improved prompts by clicking "Use This Prompt" button (inserts into chat input, does not auto-submit)
- FR26: System can insert improved prompt text into main chat input field without automatic submission
- FR27: Users must manually submit the improved prompt after it's inserted into chat input

**Visual Comparison & Educational Feedback (FR28-FR38):**
- FR28: System can display side-by-side comparison of original vs. improved prompts
- FR29: System can highlight specific differences between original and improved prompts
- FR30: System can show visual indicators for additions, changes, and enhancements
- FR31: System can segment original prompt by sentences (period-delimited)
- FR32: System can display mapping between original sentences and corresponding improved sections
- FR33: System can show one-to-many relationships where one original sentence maps to multiple improved sections
- FR34: System can provide contextual tooltips explaining WHY each improvement matters
- FR35: System can tie tooltip explanations directly to specific sentence components of the user's actual prompt
- FR36: System can explain R/T/E framework components (Rules, Task, Examples) with context-specific guidance
- FR37: Users can close side-by-side comparison modal via close button or ESC key
- FR38: Users can view framework education tooltips explaining Rules/Task/Examples definitions

**Framework Education & Skill Transfer (FR39-FR42):**
- FR39: System can educate users on Rules/Task/Examples structured prompt construction
- FR40: System can demonstrate how framework structure improves AI response quality through before/after comparison
- FR41: System can create memorable "aha moments" through failure-then-transformation experience
- FR42: System can enable skill transfer by teaching repeatable methodology applicable beyond the tool

**Session Management & State (FR43-FR48):**
- FR43: System can maintain conversation state within a single browser session
- FR44: System can track prompt testing history during active session
- FR45: Users can clear chat history and start fresh session via reset button
- FR46: Users can copy AI responses to clipboard via copy button
- FR47: Users can copy improved prompts to clipboard via copy button
- FR48: System can preserve chat history context after user applies improved prompt

**Loading & Processing States (FR49-FR52):**
- FR49: System can display loading spinner during OpenAI API calls
- FR50: System can disable submit buttons during API processing to prevent duplicate requests
- FR51: System can show "Generating improvement..." indicator during feedback processing
- FR52: System can provide visual feedback for all asynchronous operations

**Error Handling & Resilience (FR53-FR58):**
- FR53: System can handle API errors gracefully with user-friendly error messages
- FR54: System can display specific error message when OpenAI API fails (rate limit, authentication, etc.)
- FR55: System can display specific error message when Cloudflare Workers proxy is unavailable
- FR56: System can provide retry mechanism for failed API calls
- FR57: System can handle timeout scenarios for long-running API calls
- FR58: System can provide loading states during API calls to indicate processing

### NonFunctional Requirements

**Performance (NFR-P1 to NFR-P8):**
- NFR-P1: User interface interactions (button clicks, modal open/close) must respond within 100ms
- NFR-P2: Initial page load must complete within 3 seconds on standard broadband connection
- NFR-P3: OpenAI API calls must complete within 10 seconds or display timeout message
- NFR-P4: Prompt improvement generation must complete within 15 seconds or display timeout message
- NFR-P5: UI state transitions (loading spinners, disabled buttons) must activate within 50ms of user action
- NFR-P6: Side-by-side comparison modal must render within 200ms of improvement generation completion
- NFR-P7: Tooltip interactions must display within 100ms of hover/click
- NFR-P8: Chat history with up to 20 messages must render without noticeable lag (<500ms)

**Security (NFR-S1 to NFR-S7):**
- NFR-S1: OpenAI API keys must never be exposed in client-side code
- NFR-S2: API calls must be proxied through Cloudflare Workers (or equivalent) to protect credentials
- NFR-S3: API proxy must validate request origin to prevent unauthorized usage
- NFR-S4: All user input must be sanitized to prevent XSS attacks before rendering in UI
- NFR-S5: Prompt text must be validated for maximum length to prevent API abuse
- NFR-S6: No user data may be stored on external servers without user consent
- NFR-S7: Session data in localStorage must be clearable by user via reset functionality

**Integration (NFR-I1 to NFR-I7):**
- NFR-I1: System must integrate with OpenAI API (GPT-3.5-turbo or similar model)
- NFR-I2: API requests must use proper message format as specified by OpenAI API documentation
- NFR-I3: API responses must be parsed correctly to extract message content
- NFR-I4: System must handle OpenAI API error codes (429 rate limit, 401 authentication, 500 server errors) with specific error messages
- NFR-I5: Proxy must route requests to OpenAI API without introducing >500ms latency overhead
- NFR-I6: Proxy must return standardized error responses for failure scenarios
- NFR-I7: Proxy must handle CORS headers for cross-origin requests from GitHub Pages domain

**Reliability & Availability (NFR-R1 to NFR-R9):**
- NFR-R1: System must remain functional when displayed offline during demo presentation
- NFR-R2: System must gracefully degrade if OpenAI API is unavailable (display error, allow retry)
- NFR-R3: UI must remain responsive even when API calls fail or timeout
- NFR-R4: System must recover from errors without requiring page refresh
- NFR-R5: All API failures must display user-friendly error messages (not technical stack traces)
- NFR-R6: System must provide retry mechanism for transient API failures
- NFR-R7: System must handle network interruptions gracefully without breaking UI state
- NFR-R8: System must function correctly in Chrome, Firefox, and Safari (latest stable versions)
- NFR-R9: System must detect and warn users if browser lacks required ES6 support

### Additional Requirements

**Technical Architecture Requirements (from Architecture.md):**

1. **Single HTML File Architecture** - ALL code in one `index.html` file with React CDN (no build process, no bundlers)
2. **7-Section Internal Structure** - Strict organization: (1) Constants, (2) Utilities, (3) Hooks, (4) Components, (5) Context, (6) App, (7) Render
3. **Component Definition Order** - Define LEAF components first (Button, Tooltip), then COMPOSITE (MessageList, ChatInput), then LAYOUT (ChatInterface, Modals), then APP last
4. **React 18.x via CDN** - Babel Standalone for in-browser JSX transformation
5. **State Management** - React Context API for centralized application state
6. **API Proxy** - Cloudflare Workers serverless proxy for OpenAI API calls
7. **Error Handling** - ErrorBoundary component (class component with getDerivedStateFromError) + formatError() utility
8. **CSS Naming** - BEM-lite convention (format: `block-element--modifier`, examples: `.chat-interface__message--sent`)
9. **Immutable State Updates** - Always return new objects/arrays (use spread operator: `setChatHistory(prev => [...prev, message])`)
10. **Error Object Pattern** - Store errors as OBJECTS: `{ message, code }` - NEVER as strings
11. **Loading State Pattern** - Use `isLoading` boolean naming, disable buttons during async operations, local loading states per feature
12. **API Response Structure** - Standardized format: `{ success: boolean, data: any, error?: { code: string, message: string, details: string } }`
13. **OpenAI API Integration** - GPT-3.5-turbo with hardcoded system prompts (CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT)
14. **In-Memory State Only** - No localStorage for MVP (page refresh = lost all state)
15. **Desktop-Only Scope** - 1024px minimum viewport, no responsive design, no mobile optimization
16. **GitHub Pages Deployment** - Static file hosting, direct URL access for demo
17. **Starter Template** - No traditional starter template (Next.js, Vite) - manual single HTML file creation

**Project Context Implementation Rules (from project-context.md):**

18. **No Build Process** - Single HTML file with Babel in-browser compilation
19. **No TypeScript** - JavaScript ES6+ only
20. **No CSS Frameworks** - Inline CSS in `<style>` tag
21. **No State Management Libraries** - Vanilla React Context API only
22. **No Testing Framework** - Manual browser testing for MVP
23. **Component Communication** - Parent → Child via props, Child → Parent via callbacks, Cross-component via Context
24. **Event Handler Naming** - Props: `on{Event}` (onSubmit, onClose), Implementations: `handle{Event}` (handleSubmit, handleClose)
25. **API Integration** - ALL OpenAI calls MUST go through Cloudflare Worker proxy, NO direct API calls from client
26. **Input Validation** - Enforce `MAX_PROMPT_LENGTH` limit, sanitize all user inputs
27. **Security** - NEVER commit API keys to git, store keys in Cloudflare Workers secrets, use `.gitignore` for `.dev.vars`
28. **Anti-Patterns** - Never mutate state directly, never store errors as strings, never expose technical errors to users, never call OpenAI directly from client

**User Experience Requirements (from UX Design Specification):**

29. **Failure-Driven Learning** - Users experience inadequate results FIRST, then see improvement (creates "aha moment")
30. **Side-by-Side Comparison** - Visual transformation reveal with instant clarity
31. **Contextual Tooltips** - Explanations tied to user's actual prompt, not generic advice
32. **Non-Technical Language** - Conversational tone ("What didn't you like?") not technical jargon
33. **Psychological Safety** - Empowerment language ("Let's see how we can improve") not blame ("You did it wrong")
34. **One-Click Actions** - "Not Satisfied", "Use This Prompt", copy buttons - no multi-step workflows
35. **Celebratory Reveal Design** - Smooth animation, generous whitespace, color-coded highlighting
36. **ChatGPT-Familiar Interface** - Minimal chrome, input always accessible at bottom, clear message distinction
37. **Educational Microcopy** - Supportive coach tone, not condescending teacher ("This helps the AI understand..." not "You should have...")
38. **Desktop-Optimized Layouts** - Spacious side-by-side views, detailed tooltips, 1024px minimum viewport
39. **Visual Hierarchy** - Guide eye to most important changes first
40. **Progressive Disclosure** - Information reveals gradually to prevent cognitive overload

### FR Coverage Map

**Epic 1: Interactive Chat Testing (13 FRs)**
- FR1: Chat interface with free-text prompt input
- FR2: Submit prompts for AI response generation via OpenAI API
- FR3: View AI-generated responses in real-time
- FR4: Test multiple prompts sequentially within single session
- FR5: Indicate dissatisfaction with "Not Satisfied" button
- FR6: Clear prompt input field before submitting
- FR7: View visual focus indication on active input field
- FR8: Prevent submission of empty prompts with validation message
- FR9: Validate maximum prompt length before submission
- FR43: Maintain conversation state within single browser session
- FR44: Track prompt testing history during active session
- FR49: Display loading spinner during OpenAI API calls
- FR50: Disable submit buttons during API processing to prevent duplicate requests

**Epic 2: Failure-Driven Feedback Capture (10 FRs)**
- FR5: Indicate dissatisfaction with "Not Satisfied" button (shared with Epic 1)
- FR10: Capture user feedback on what they didn't like about the most recent AI response
- FR11: Trigger diagnostic analysis when user expresses dissatisfaction with specific response
- FR12: Evaluate prompts for compliance with Rules/Task/Examples framework
- FR13: Identify specific deficiencies in user prompts (missing rules, unclear task, no examples)
- FR14: Generate explanations of why prompts failed to produce desired results
- FR15: Open feedback modal by clicking "Not Satisfied" button
- FR16: Enter free-text feedback describing what they didn't like about the result
- FR17: Submit feedback via "Generate Improved Prompt" button to trigger improvement generation
- FR18: Cancel feedback modal and return to chat without submitting
- FR51: Show "Generating improvement..." indicator during feedback processing

**Epic 3: AI-Powered Prompt Transformation (9 FRs)**
- FR19: Restructure vague prompts into Rules/Task/Examples framework format
- FR20: Generate improved versions of user prompts based on dissatisfaction feedback
- FR21: Preserve user intent while adding framework structure to prompts
- FR22: Detect common prompt mistakes from user feedback patterns
- FR23: Parse original prompts into sentences (delimited by periods)
- FR24: Map original sentences to improved prompt sections in one-to-many relationship
- FR11: Trigger diagnostic analysis when user expresses dissatisfaction with specific response (shared with Epic 2)
- FR12: Evaluate prompts for compliance with Rules/Task/Examples framework (shared with Epic 2)
- FR13: Identify specific deficiencies in user prompts (shared with Epic 2)
- FR14: Generate explanations of why prompts failed to produce desired results (shared with Epic 2)

**Epic 4: Visual Comparison & Educational Tooltips (11 FRs)**
- FR28: Display side-by-side comparison of original vs. improved prompts
- FR29: Highlight specific differences between original and improved prompts
- FR30: Show visual indicators for additions, changes, and enhancements
- FR31: Segment original prompt by sentences (period-delimited)
- FR32: Display mapping between original sentences and corresponding improved sections
- FR33: Show one-to-many relationships where one original sentence maps to multiple improved sections
- FR34: Provide contextual tooltips explaining WHY each improvement matters
- FR35: Tie tooltip explanations directly to specific sentence components of the user's actual prompt
- FR36: Explain R/T/E framework components (Rules, Task, Examples) with context-specific guidance
- FR37: Close side-by-side comparison modal via close button or ESC key
- FR38: View framework education tooltips explaining Rules/Task/Examples definitions

**Epic 5: Prompt Application & Skill Transfer (15 FRs)**
- FR25: Apply improved prompts by clicking "Use This Prompt" button (inserts into chat input, does not auto-submit)
- FR26: Insert improved prompt text into main chat input field without automatic submission
- FR27: Manually submit the improved prompt after it's inserted into chat input
- FR39: Educate users on Rules/Task/Examples structured prompt construction
- FR40: Demonstrate how framework structure improves AI response quality through before/after comparison
- FR41: Create memorable "aha moments" through failure-then-transformation experience
- FR42: Enable skill transfer by teaching repeatable methodology applicable beyond the tool
- FR45: Clear chat history and start fresh session via reset button
- FR46: Copy AI responses to clipboard via copy button
- FR47: Copy improved prompts to clipboard via copy button
- FR48: Preserve chat history context after user applies improved prompt
- FR52: Provide visual feedback for all asynchronous operations
- FR53: Handle API errors gracefully with user-friendly error messages
- FR54: Display specific error message when OpenAI API fails (rate limit, authentication, etc.)
- FR55: Display specific error message when Cloudflare Workers proxy is unavailable
- FR56: Provide retry mechanism for failed API calls
- FR57: Handle timeout scenarios for long-running API calls
- FR58: Provide loading states during API calls to indicate processing

## Epic List

### Epic 1: Interactive Chat Testing

Users can write prompts in a familiar chat interface and test them against AI to see results, experiencing the chat interface they're already comfortable with (like ChatGPT).

**User Outcome:** Users can test prompts and receive AI-generated responses in a clean, intuitive chat interface.

**FRs covered:** FR1-FR9, FR43-FR44, FR49-FR50 (13 FRs)

**Implementation Notes:**
- Creates the foundational chat interface with single HTML file (React CDN)
- OpenAI API integration via Cloudflare Workers proxy
- React Context API for state management (in-memory only)
- Input validation and loading states
- Desktop-optimized layout (1024px+ viewport)

**Why standalone:** Complete chat testing functionality - users can write prompts and see AI responses independently.

---

### Epic 2: Failure-Driven Feedback Capture

Users can signal dissatisfaction when results don't meet their needs and provide contextual feedback about what went wrong, triggering the learning journey.

**User Outcome:** Users can express dissatisfaction and provide feedback context about inadequate AI responses.

**FRs covered:** FR5, FR10-FR18, FR51 (10 FRs, 1 shared with Epic 1)

**Implementation Notes:**
- Adds feedback modal UI with "Not Satisfied" button trigger
- Non-technical language: "What didn't you like about this result?"
- Psychological safety: empowerment language, not blame
- "Generating improvement..." loading indicator

**Why standalone:** Complete feedback capture mechanism - users can provide context about dissatisfaction even before improvement generation.

---

### Epic 3: AI-Powered Prompt Transformation

System analyzes user feedback and generates improved prompts using the Rules/Task/Examples framework, creating intelligent restructures that preserve user intent while adding systematic structure.

**User Outcome:** System generates improved prompt versions with R/T/E framework structure based on user feedback.

**FRs covered:** FR11-FR14, FR19-FR24 (9 FRs, 4 shared with Epic 2)

**Implementation Notes:**
- Uses OpenAI API with IMPROVEMENT_SYSTEM_PROMPT (hardcoded system prompt)
- Returns structured JSON: improvedPrompt, sentence mapping, explanations
- Parses original prompt into sentences (period-delimited)
- Creates one-to-many mapping between original sentences and improved sections
- Detects common prompt mistakes from feedback patterns

**Why standalone:** Core AI intelligence complete - system can analyze and restructure prompts with framework compliance.

---

### Epic 4: Visual Comparison & Educational Tooltips

Users see side-by-side comparison with visual highlighting and contextual tooltips explaining WHY each improvement matters, creating the "aha moment" of understanding.

**User Outcome:** Users see visual transformation of their prompt with educational explanations that create clarity and understanding.

**FRs covered:** FR28-FR38 (11 FRs)

**Implementation Notes:**
- Side-by-side comparison modal (desktop-optimized layout)
- Color-coded highlighting for additions/changes/enhancements
- One-to-many sentence mapping visualization
- Contextual tooltips tied to user's actual prompt components
- Framework education: Rules/Task/Examples definitions
- Celebratory reveal design: smooth animation, generous whitespace
- Progressive disclosure: tooltips on hover/click

**Why standalone:** Complete educational visualization - users see and understand the transformation with full explanatory context.

---

### Epic 5: Prompt Application & Skill Transfer

Users can apply improved prompts with one-click action, test them immediately to see better results, and experience the validation moment that builds confidence and enables independent skill transfer.

**User Outcome:** Users complete the learning loop by applying improved prompts, experiencing validation through better results, and building independent prompt engineering skills.

**FRs covered:** FR25-FR27, FR39-FR42, FR45-FR48, FR52-FR58 (15 FRs)

**Implementation Notes:**
- "Use This Prompt" button: one-click insertion into chat input (no auto-submit)
- User manually submits to see better results (proof moment)
- Copy to clipboard functionality for portability to other AI tools
- Reset/clear session button for fresh start
- Comprehensive error handling: user-friendly messages, retry buttons
- Framework education and skill transfer reinforcement

**Why standalone:** Completes the full learning loop - users experience transformation, apply improvements, validate results, and build lasting skills.

---

## Epic 1: Interactive Chat Testing

### Story 1.0: Cloudflare Worker Implementation

As a developer,
I want to deploy a Cloudflare Worker that proxies requests to the OpenAI API,
So that API keys are never exposed in client-side code and all API calls are secure.

**Acceptance Criteria:**

**Given** I have a Cloudflare account and Wrangler installed,
**When** I create and deploy the Cloudflare Worker,
**Then** the following infrastructure should be in place:

**Project Setup:**
1. Create `cloudflare-worker/` directory in project root
2. Initialize Cloudflare Worker project: `npx wrangler init`
3. Create `worker.js` file with proxy logic
4. Create `wrangler.toml` configuration file
5. Create `.dev.vars` file for local development (gitignored)

**Worker Configuration (`wrangler.toml`):**
```toml
name = "digitalwave-test-proxy"
main = "worker.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "http://localhost:*,http://127.0.0.1:*"
```

**Environment Variables:**
- **Production:** Store `OPENAI_API_KEY` as Cloudflare Secret: `npx wrangler secret put OPENAI_API_KEY`
- **Development:** Store in `.dev.vars` file (never committed to git)
- **Update `.gitignore`:** Add `.dev.vars` to prevent accidental commits

**Worker Implementation (`worker.js`):**

**Request handling:**
```javascript
export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleCORS();
    }

    // Route requests
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/api/chat") {
      return handleChatAPI(request, env);
    } else if (path === "/api/improve") {
      return handleImprovementAPI(request, env);
    }

    return new Response("Not Found", { status: 404 });
  }
}
```

**CORS handling:**
```javascript
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
```

**Chat endpoint (`/api/chat`):**
- **Given** POST request to `/api/chat`
- **When** request body contains `{ prompt: string }`
- **Then** execute:
  1. Validate request has `prompt` field
  2. Validate request origin (NFR-S3)
  3. Forward to OpenAI API: `https://api.openai.com/v1/chat/completions`
  4. Use `CHAT_SYSTEM_PROMPT` as system message
  5. Return standardized response: `{ success: true, data: { message: "..." } }`
  6. Handle errors: rate limit, auth failure, timeout

**Improvement endpoint (`/api/improve`):**
- **Given** POST request to `/api/improve`
- **When** request body contains `{ originalPrompt: string, userFeedback: string }`
- **Then** execute:
  1. Validate request has both fields
  2. Validate request origin (NFR-S3)
  3. Forward to OpenAI API with `IMPROVEMENT_SYSTEM_PROMPT`
  4. Request JSON response format from OpenAI
  5. Return standardized response: `{ success: true, data: { improvedPrompt, mapping, explanations } }`
  6. Handle errors and return standardized error format

**Error handling:**
```javascript
function createErrorResponse(code, message, details) {
  return new Response(JSON.stringify({
    success: false,
    error: {
      code: code,      // "API_TIMEOUT", "RATE_LIMIT_EXCEEDED", etc.
      message: message, // User-friendly message
      details: details  // Technical details for debugging
    }
  }), {
    status: 400,
    headers: { "Content-Type": "application/json" }
  });
}
```

**Origin validation (NFR-S3):**
- Extract `Origin` header from request
- Check against `ALLOWED_ORIGINS` environment variable
- Reject requests from unauthorized origins with `{ code: "UNAUTHORIZED_ORIGIN", message: "..."}`
- For production: Update `ALLOWED_ORIGINS` to include GitHub Pages URL

**OpenAI API integration:**
```javascript
async function callOpenAIAPI(messages, env) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: messages,
      timeout: 15000 // 15 seconds
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  return response.json();
}
```

**Deployment:**
1. **Given** Worker code is complete and API key is set as secret
2. **When** I run `npx wrangler deploy`
3. **Then** Worker should deploy successfully
4. **And** Output should show deployment URL: `https://digitalwave-test-proxy.*.workers.dev`
5. **And** Worker should respond to health check at `/`
6. **And** Worker should handle CORS preflight requests

**Testing:**
1. **Given** Worker is deployed
2. **When** I test with curl: `curl -X POST https://worker-url/api/chat -d '{"prompt":"test"}'`
3. **Then** receive valid JSON response
4. **And** verify API key is NOT exposed in response
5. **And** verify CORS headers are present

**Documentation:**
1. Add Worker deployment instructions to project README.md
2. Document environment variable setup (OPENAI_API_KEY)
3. Document local development: `npx wrangler dev`
4. Document deployment: `npx wrangler deploy`
5. Document how to update ALLOWED_ORIGINS for production

**Security requirements (NFR-S1 to NFR-S7):**
- ✅ API key stored as Cloudflare Secret (never in code)
- ✅ Origin validation prevents unauthorized usage
- ✅ No user data stored (stateless worker)
- ✅ Input validation on all endpoints
- ✅ Maximum prompt length enforcement
- ✅ Standardized error responses (no technical details leaked)

**Performance requirements (NFR-I5, NFR-I6):**
- ✅ Worker adds <500ms latency overhead
- ✅ Standardized error response format
- ✅ CORS headers properly configured for cross-origin requests

**Frontend integration preparation:**
- Worker URL should be added to client-side constants: `WORKER_URL`
- For development: `http://localhost:8787` (Wrangler dev server)
- For production: Deployed Worker URL

**Requirements fulfilled:** NFR-S1, NFR-S2, NFR-S3, NFR-I1, NFR-I5, NFR-I6, NFR-I7, Architecture requirements 6, 25, 27

---

### Story 1.1: Project Initialization & HTML Scaffolding

As a developer,
I want to set up the single HTML file foundation with React CDN and proper structure,
So that the application has a solid technical foundation for building the chat interface.

**Acceptance Criteria:**

**Given** the project directory exists,
**When** I create the `index.html` file,
**Then** the file should include:
- HTML5 doctype and proper `<head>` section with title "DigitalWaveTest"
- CDN links for React 18.x UMD builds from unpkg
- CDN link for Babel Standalone for in-browser JSX transformation
- `<style>` tag in `<head>` for CSS
- `<div id="root"></div>` container in `<body>`
- `<script type="text/babel">` tag with 7-section structure comments

**And** the 7-section structure should include placeholder comments for:
1. CONSTANTS & CONFIGURATION
2. UTILITY FUNCTIONS
3. CUSTOM HOOKS
4. REACT COMPONENTS
5. CONTEXT PROVIDER
6. MAIN APP COMPONENT
7. RENDER

**And** CSS custom properties should be defined in the `<style>` tag:
- `--color-primary` for main brand color
- `--color-background` for page background
- `--color-text` for text color
- `--spacing-unit` for consistent spacing
- `--border-radius` for rounded corners

**Requirements fulfilled:** Architecture requirements 1, 3, 4, 15, 20, 38

---

### Story 1.2: React Context & State Management

As a developer,
I want to implement React Context API for centralized state management,
So that all components can share chat history, loading states, and error states without prop drilling.

**Acceptance Criteria:**

**Given** the HTML file with 7-section structure exists,
**When** I implement the Context Provider in SECTION 5,
**Then** the AppContext should provide:

**State structure:**
```javascript
{
  // Chat state
  chatHistory: [],
  isChatLoading: false,
  chatError: null,
  
  // Modal states (for future epics)
  isFeedbackModalOpen: false,
  isComparisonModalOpen: false,
  comparisonData: null,
  
  // Improvement state (for future epics)
  isGeneratingImprovement: false,
  improvementError: null
}
```

**And** the context should be created with:
- `React.createContext()` initialized with default values
- `AppProvider` component that wraps children
- State updates using `useState` hooks
- Immutable update pattern: `setChatHistory(prev => [...prev, message])`

**And** error states must follow the pattern:
- Store errors as OBJECTS: `{ message, code }`
- Use `null` for no error (never empty string)

**And** loading states must use the pattern:
- Boolean naming: `isChatLoading`, `isGeneratingImprovement`
- `true` when loading, `false` when complete

**Given** the context is created,
**When** I render the AppProvider,
**Then** it should wrap the App component:
```javascript
<AppProvider>
  <App />
</AppProvider>
```

**Requirements fulfilled:** FR43, FR44, Architecture requirements 5, 9, 10, 11, 14

---

### Story 1.3: Chat Interface Components

As a user,
I want to see a clean chat interface with input field and message display,
So that I can write prompts and view AI responses in a familiar chat interface.

**Acceptance Criteria:**

**Given** the Context Provider is implemented,
**When** I create React components in SECTION 4 (following Leaf → Composite → Layout order),
**Then** the following components should be defined:

**Leaf Components (defined first):**
1. `Button` component:
   - Props: `children`, `onClick`, `disabled`, `className`
   - Renders: `<button>` with BEM-lite class naming
   - Disabled state: applies `disabled` attribute and visual styling

2. `MessageBubble` component:
   - Props: `message` (object with `role` and `content`), `type` ('sent' or 'received')
   - Renders: message with distinct styling for user vs AI
   - BEM-lite classes: `.chat-interface__message--sent`, `.chat-interface__message--received`

**Composite Components (defined after leaf):**
3. `MessageList` component:
   - Props: `messages` (array from context)
   - Renders: list of `MessageBubble` components
   - Auto-scrolls to bottom when new message arrives
   - Displays "No messages yet" when empty

4. `ChatInput` component:
   - Props: `onSubmit`, `isLoading`
   - Renders: `<input>` field + Send button
   - Input has placeholder: "Enter your prompt..."
   - Input shows visual focus indication (FR7)
   - Button displays "Send" or "Sending..." when loading
   - Button is disabled when `isLoading` is true

**Layout Component (defined last):**
5. `ChatInterface` component:
   - Uses `useAppContext()` hook to access state
   - Renders: `MessageList` + `ChatInput` in vertical layout
   - Styling: Desktop-optimized, minimum 1024px viewport
   - Input anchored at bottom (ChatGPT-familiar pattern)
   - Clear visual distinction between user and AI messages

**Given** the components are defined,
**When** I view the chat interface,
**Then** I should see:
- Empty state message or existing messages
- Input field at bottom of screen
- Send button ready for interaction
- Clean, ChatGPT-familiar layout

**Requirements fulfilled:** FR1, FR6, FR7, FR43, FR44, UX requirements 36, 38

---

### Story 1.4: OpenAI API Integration

As a user,
I want to submit prompts and receive AI responses,
So that I can test my prompts against the AI and see results.

**Acceptance Criteria:**

**Given** the chat interface components exist,
**When** I implement the API integration in SECTION 2 (Utility Functions) and SECTION 1 (Constants),
**Then** the following should be implemented:

**SECTION 1 - Constants:**
```javascript
const WORKER_URL = 'https://your-worker.workers.dev'; // Cloudflare Worker URL
const CHAT_SYSTEM_PROMPT = `You are a helpful assistant. Respond to user prompts naturally.`;
const API_TIMEOUT = 10000; // 10 seconds
const MAX_PROMPT_LENGTH = 2000;
```

**SECTION 2 - Utility Functions:**
1. `callChatAPI(userPrompt)` function:
   - Returns: Promise with API response
   - Fetches from: `${WORKER_URL}/api/chat`
   - Request body: `{ prompt: userPrompt }`
   - Handles: Success response with `message` data
   - Throws: Error with code for failures

2. `formatError(error)` function:
   - Maps technical errors to user-friendly messages
   - Returns error object: `{ message, code }`
   - Error codes: `API_TIMEOUT`, `RATE_LIMIT_EXCEEDED`, `NETWORK_ERROR`, `UNKNOWN`

**Given** the API functions exist,
**When** the user submits a prompt,
**Then** the chat flow should execute:

1. User types prompt in ChatInput
2. User clicks Send button
3. `handleSubmit` function executes:
   - Validates input is not empty (FR8)
   - Validates length ≤ MAX_PROMPT_LENGTH (FR9)
   - Sets `isChatLoading = true`
   - Clears input field (FR6)
   - Calls `callChatAPI(userPrompt)`
   - On success: Adds `{ role: 'user', content: userPrompt }` to chatHistory
   - On success: Adds `{ role: 'assistant', content: response }` to chatHistory
   - On error: Sets `chatError` object
   - Finally: Sets `isChatLoading = false`

**And** the user can see:
- Their prompt appear in the chat
- Loading indicator during API call (FR49)
- AI response appear when complete (FR3)
- Multiple prompts in sequence (FR4)

**And** the system:
- Disables Send button during API call (FR50)
- Shows loading spinner or text (FR49)
- Completes API call within 10 seconds or displays timeout (NFR-P3)

**Requirements fulfilled:** FR1, FR2, FR3, FR4, FR6, FR8, FR9, FR43, FR44, FR49, FR50, NFR-P3, NFR-I1, Architecture requirements 6, 12, 25, 26

---

### Story 1.5: Input Validation & Loading States

As a user,
I want clear feedback when I submit prompts and guidance when input is invalid,
So that I understand what's happening and can correct mistakes easily.

**Acceptance Criteria:**

**Given** the API integration is working,
**When** I implement validation and loading states,
**Then** the following behaviors should exist:

**Input Validation:**
1. Empty prompt validation (FR8):
   - **Given** input field is empty
   - **When** user clicks Send button
   - **Then** prevent submission
   - **And** display validation message: "Please enter a prompt"
   - **And** show visual focus on input field (FR7)

2. Maximum length validation (FR9):
   - **Given** user types prompt exceeding MAX_PROMPT_LENGTH (2000 chars)
   - **When** user attempts to submit
   - **Then** prevent submission
   - **And** display validation message: "Prompt is too long. Maximum 2000 characters."
   - **And** show character count if approaching limit

**Loading States (FR49, FR50):**
1. **Given** user submits valid prompt
2. **When** API call is in progress
3. **Then** display loading indicator:
   - Spinner or "Sending..." text in ChatInput
   - Send button disabled (prevents duplicate submissions)
   - Input field disabled during loading
   - Loading state activates within 50ms of user action (NFR-P5)

**Error Handling (FR53, FR54):**
1. **Given** API call fails
2. **When** error occurs
3. **Then** display user-friendly error message:
   - `API_TIMEOUT`: "The request took too long. Please try again."
   - `RATE_LIMIT_EXCEEDED`: "We're experiencing high demand. Please wait a moment and try again."
   - `NETWORK_ERROR`: "Connection issue. Please check your internet and try again."
   - `UNKNOWN`: "Something went wrong. Please try again."

4. **And** show retry button for retryable errors (FR56):
   - Errors: `API_TIMEOUT`, `NETWORK_ERROR`, `RATE_LIMIT_EXCEEDED`
   - Button text: "Try Again"
   - Clicking re-executes the API call with same prompt

**Performance (NFR-P1, NFR-P5):**
- Button clicks respond within 100ms
- UI state transitions activate within 50ms
- Loading states display immediately

**Requirements fulfilled:** FR7, FR8, FR9, FR49, FR50, FR53, FR54, FR56, FR57, NFR-P1, NFR-P5

---

## Epic 2: Failure-Driven Feedback Capture

### Story 2.1: "Not Satisfied" Button Integration

As a user,
I want to indicate when I'm not satisfied with an AI response,
So that I can signal the need for improvement and access the feedback mechanism.

**Acceptance Criteria:**

**Given** the chat interface displays an AI response (from Epic 1),
**When** I view the most recent AI message,
**Then** the MessageBubble component for AI messages should include:

**Button placement:**
- "Not Satisfied" button positioned below or adjacent to the AI response
- Button uses BEM-lite class: `.message-bubble__not-satisfied`
- Button styling: Secondary button style (outline or different color)
- Button text: "Not Satisfied" (non-technical language)

**Button behavior:**
- **Given** the button is clicked
- **When** onClick event fires
- **Then** trigger `handleNotSatisfied()` function
- **And** pass the most recent message's context (prompt and response)
- **And** open the feedback modal (Story 2.2)
- **And** set `isFeedbackModalOpen = true` in context

**Button state management:**
- Only show on the most recent AI response (FR5)
- Don't show on older messages
- Don't show on user messages
- Disable button if feedback modal is already open

**Given** the button is rendered,
**When** I hover over the button,
**Then** the button should show visual hover state within 100ms (NFR-P1)

**Requirements fulfilled:** FR5, FR15, UX requirements 32, 34

---

### Story 2.2: Feedback Modal Component

As a user,
I want to see a modal dialog where I can explain what I didn't like,
So that I can provide context about my dissatisfaction in a psychologically safe environment.

**Acceptance Criteria:**

**Given** the "Not Satisfied" button was clicked,
**When** the feedback modal renders,
**Then** the FeedbackModal component should display:

**Modal structure (Layout component in SECTION 4):**
- Modal overlay: Semi-transparent backdrop
- Modal container: Centered box with generous whitespace
- Modal header: Title "Let's improve this result" (empowerment language)
- Modal body: Textarea for feedback input
- Modal footer: Two buttons ("Generate Improved Prompt" and "Cancel")

**Text area input (FR16):**
- Placeholder text: "What didn't you like about this result?" (conversational)
- Multi-line input (textarea element)
- BEM-lite class: `.feedback-modal__textarea`
- Auto-focus on textarea when modal opens
- Minimum rows: 3
- Maximum characters: 500 (to encourage concise feedback)

**Psychological safety (UX requirement 33):**
- Title uses empowerment language: "Let's see how we can improve this"
- No judgmental or blaming language
- Supportive, coach tone throughout

**Modal close behavior (FR18):**
- **Given** the modal is open
- **When** user clicks Cancel button
- **Then** close the modal (set `isFeedbackModalOpen = false`)
- **And** clear any feedback text input
- **And** return to chat interface

- **Given** the modal is open
- **When** user clicks overlay/backdrop
- **Then** close the modal
- **And** clear any feedback text input

- **Given** the modal is open
- **When** user presses ESC key
- **Then** close the modal
- **And** clear any feedback text input

**Modal state management:**
- Component uses context state: `isFeedbackModalOpen`
- Stores feedback input in local state (not global context)
- Passes `onClose` callback to handle close actions

**Given** the modal renders,
**When** I view the modal,
**Then** I should see:
- Clear title explaining purpose
- Textarea ready for input
- Two action buttons
- No technical jargon

**Requirements fulfilled:** FR15, FR16, FR18, UX requirements 32, 33, 35

---

### Story 2.3: Feedback Submission Handler

As a user,
I want to submit my feedback and trigger the improvement analysis,
So that the system can understand my dissatisfaction and begin generating improvements.

**Acceptance Criteria:**

**Given** the feedback modal is open with text entered,
**When** I click the "Generate Improved Prompt" button (FR17),
**Then** the submission handler should execute:

**Validation:**
- **Given** textarea is empty or only whitespace
- **When** user clicks submit button
- **Then** prevent submission
- **And** display validation message: "Please tell us what didn't work so we can help improve it."
- **And** keep focus on textarea

**Submission flow:**
1. **Given** textarea has valid feedback text
2. **When** user clicks submit button
3. **Then** execute the following:
   - Capture feedback text from textarea
   - Capture context: most recent user prompt and AI response
   - Store feedback data in context state: `recentFeedback`
   - Close feedback modal (set `isFeedbackModalOpen = false`)
   - Trigger improvement generation (sets up Epic 3)
   - Set `isGeneratingImprovement = true` for loading state

**Data structure stored in context:**
```javascript
recentFeedback: {
  userPrompt: "...",        // Most recent user prompt
  aiResponse: "...",        // Most recent AI response
  feedbackText: "...",      // User's feedback description
  timestamp: Date.now()
}
```

**Button states during submission:**
- **Given** submit button is clicked
- **When** submission processing begins
- **Then** disable submit button
- **And** show button text: "Generating..."
- **And** disable Cancel button

**Clear feedback on cancel:**
- **Given** Cancel button is clicked
- **When** modal closes
- **Then** clear textarea input
- **And** don't store feedback in context
- **And** don't trigger improvement generation

**UI responsiveness:**
- Button clicks respond within 100ms (NFR-P1)
- State transitions activate within 50ms (NFR-P5)

**Requirements fulfilled:** FR10, FR11, FR16, FR17, FR51

---

### Story 2.4: Feedback Processing State

As a user,
I want visual feedback that the system is analyzing my feedback,
So that I know the system is working and understand what's happening.

**Acceptance Criteria:**

**Given** feedback was submitted and improvement generation triggered,
**When** the system processes the feedback,
**Then** the UI should display loading state:

**Loading indicator (FR51):**
- Display "Generating improvement..." message in chat interface
- Position below the most recent AI message
- BEM-lite class: `.chat-interface__loading-indicator`
- Show loading spinner or animated dots

**State management:**
- Context state: `isGeneratingImprovement = true`
- Derived from feedback submission in Story 2.3
- Persists until Epic 3 completes improvement generation

**Visual design:**
- Loading message uses conversational tone
- Not technical: "Analyzing your feedback..." or "Generating improvement..."
- Matches the psychological safety pattern
- Clear visual distinction from chat messages

**Loading behavior:**
- **Given** `isGeneratingImprovement` is true
- **When** user views the chat
- **Then** display loading indicator below most recent AI message
- **And** disable "Not Satisfied" button on current message
- **And** disable chat input during processing (optional, prevents confusion)

**Performance:**
- Loading indicator appears within 50ms of state change (NFR-P5)
- Smooth fade-in animation for loading element

**Completion:**
- Loading state will be cleared by Epic 3 when improvement generation completes
- Epic 3 will set `isGeneratingImprovement = false`
- Epic 3 will open comparison modal with results

**Requirements fulfilled:** FR51, NFR-P5, UX requirement 35

---

## Epic 3: AI-Powered Prompt Transformation

### Story 3.1: Improvement API Integration

As a system,
I want to integrate with OpenAI API to generate improved prompts,
So that the system can leverage AI intelligence to restructure user prompts using the R/T/E framework.

**Acceptance Criteria:**

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

---

### Story 3.2: Prompt Analysis & Restructuring

As a system,
I want to analyze the original prompt and restructure it into Rules/Task/Examples framework,
So that users receive improved prompts with systematic structure that produces better AI results.

**Acceptance Criteria:**

**Given** the improvement API call is successful,
**When** OpenAI returns the improved prompt structure,
**Then** the response should contain:

**Improved prompt structure (FR19, FR21):**
```javascript
{
  "improvedPrompt": "Rules: ...\n\nTask: ...\n\nExamples: ...",
  "mapping": [
    {
      "originalSentence": "red can, images of fruits, sun, beach",
      "improvedSections": ["Rules", "Task"]
    }
  ],
  "explanations": [
    {
      "section": "Rules",
      "tooltip": "Rules establish constraints that guide the AI's creative direction"
    },
    {
      "section": "Task",
      "tooltip": "Clear task definition tells the AI exactly what to generate"
    },
    {
      "section": "Examples",
      "tooltip": "Examples anchor the AI's understanding of your desired style"
    }
  ]
}
```

**Prompt analysis requirements (FR11-FR13, FR22):**
- **Given** original prompt is vague or unstructured
- **When** OpenAI analyzes it
- **Then** identify specific deficiencies:
  - Missing Rules (constraints, guidelines)
  - Unclear Task (what to generate)
  - No Examples (desired style)
- **And** detect common mistakes from user feedback

**R/T/E Framework restructuring (FR19, FR21):**
- **Given** original prompt and user feedback
- **When** generating improvement
- **Then** preserve user's core intent
- **And** add structured sections:
  - **Rules**: Constraints from user feedback ("premium positioning", "ocean-safe ingredients")
  - **Task**: Clear action ("Generate 10 product names for...")
  - **Examples**: Reference points (successful similar products)

**Sentence parsing (FR23):**
- **Given** original prompt
- **When** parsing for mapping
- **Then** split into sentences by period delimiter
- **And** preserve original sentence text for mapping

**One-to-many mapping (FR24):**
- **Given** parsed original sentences
- **When** creating mapping
- **Then** map each original sentence to one or more improved sections
- **Example**: "red can" → maps to Rules AND Task sections

**Explanation generation (FR14):**
- **Given** improved prompt structure
- **When** generating explanations
- **Then** create tooltips for each R/T/E section
- **And** explain WHY each section matters
- **And** use supportive coach tone: "This helps the AI understand..."

**Quality requirements:**
- Improved prompt must be valid JSON
- All original sentences must be mapped
- At least 3 sections: Rules, Task, Examples
- Tooltips must be concise (2-3 sentences each)

**Requirements fulfilled:** FR11-FR14, FR19-FR24

---

### Story 3.3: Response Parsing & Data Storage

As a system,
I want to parse the structured improvement response and store it in context,
So that the comparison modal (Epic 4) can access and display the transformation data.

**Acceptance Criteria:**

**Given** the improvement API returns successful response,
**When** I parse and store the data,
**Then** the following should execute:

**Response parsing utility (SECTION 2):**
1. `parseImprovementResponse(apiResponse)` function:
   - Input: Raw API response object from OpenAI
   - Validates response has required fields: `improvedPrompt`, `mapping`, `explanations`
   - Parses JSON strings if needed
   - Returns structured object or throws error if invalid

**Validation checks:**
- **Given** API response
- **When** parsing
- **Then** validate:
  - `improvedPrompt` is a non-empty string
  - `mapping` is an array with at least one item
  - Each mapping item has: `originalSentence` (string), `improvedSections` (array of strings)
  - `explanations` is an array with at least one item
  - Each explanation has: `section` (string), `tooltip` (string)
- **And** throw error with code `INVALID_RESPONSE` if validation fails

**Storage in context (FR20, FR24):**
- **Given** successfully parsed improvement data
- **When** storing in context
- **Then** update context state:
  ```javascript
  comparisonData: {
    originalPrompt: "...",
    improvedPrompt: "...",
    mapping: [...],
    explanations: [...]
  }
  ```

**Complete improvement generation flow:**
1. **Given** user submitted feedback (Epic 2)
2. **When** `isGeneratingImprovement` is true
3. **Then** execute `generateImprovement(originalPrompt, feedback)`
4. **And** parse response with `parseImprovementResponse()`
5. **And** store `comparisonData` in context
6. **And** set `isGeneratingImprovement = false`
7. **And** set `isComparisonModalOpen = true` (triggers Epic 4)
8. **And** handle errors:
   - Set `improvementError` object
   - Display user-friendly error message
   - Enable retry mechanism

**Error handling:**
- **Given** API call fails
- **When** error occurs
- **Then** set `improvementError: { message, code }`
- **And** clear loading state (`isGeneratingImprovement = false`)
- **And** keep feedback modal closed (don't show comparison)
- **And** show error message in chat interface
- **And** display "Try Again" button for retryable errors

**Performance:**
- Complete improvement generation within 15 seconds (NFR-P4)
- Display timeout message if exceeded

**State transitions:**
- Loading state clears within 50ms of completion (NFR-P5)
- Comparison modal opens smoothly after data is stored

**Requirements fulfilled:** FR20, FR23, FR24, NFR-P4, NFR-P5

---

## Epic 4: Visual Comparison & Educational Tooltips

### Story 4.1: Comparison Modal Structure

As a user,
I want to see a side-by-side comparison of my original prompt and the improved version,
So that I can visually understand how my prompt was transformed.

**Acceptance Criteria:**

**Given** the improvement data is stored in context (from Epic 3),
**When** the comparison modal opens,
**Then** the ComparisonModal component should display (Layout component in SECTION 4):

**Modal structure:**
- Modal overlay: Semi-transparent backdrop (`.comparison-modal__overlay`)
- Modal container: Centered, desktop-optimized box (`.comparison-modal`)
- Modal header: Title "See how your prompt improved" + close button
- Modal body: Two-column side-by-side layout (`.comparison-modal__body`)
- Modal footer: "Use This Prompt" button (sets up Epic 5)

**Two-column layout (FR28):**
- Left column: "Your Original Prompt" (`.comparison-modal__column--original`)
- Right column: "Improved Version" (`.comparison-modal__column--improved`)
- Equal width columns (50% each)
- Generous spacing between columns (using `--spacing-unit` custom property)
- Vertical text alignment at top

**Column headers:**
- Left header: "Your Original Prompt" in subtle color
- Right header: "Improved Version" with highlight color
- Headers use smaller font size, muted color
- Clear visual distinction between sections

**Content display:**
- **Given** comparisonData from context
- **When** modal renders
- **Then** left column displays: `originalPrompt` text
- **And** right column displays: `improvedPrompt` text
- **And** preserve line breaks and formatting
- **And** wrap text appropriately (no horizontal scroll)
- **And** use readable font size (16px minimum)

**Modal open behavior:**
- **Given** `isComparisonModalOpen` is true in context
- **When** App component renders
- **Then** display ComparisonModal
- **And** overlay blocks interaction with chat interface
- **And** modal renders within 200ms (NFR-P6)

**Modal dimensions:**
- Maximum width: 900px (desktop-optimized)
- Maximum height: 80vh (fits within viewport)
- Scrollable if content exceeds height
- Centered horizontally and vertically

**Accessibility:**
- Close button visible and accessible
- Keyboard trap: Tab focus stays within modal
- ESC key closes modal (FR37)

**Given** the modal is displayed,
**When** I view the layout,
**Then** I should see:
- Clear side-by-side comparison
- Readable text in both columns
- Obvious visual distinction between original and improved
- Generous whitespace (celebratory reveal design)

**Requirements fulfilled:** FR28, FR37, UX requirements 35, 38

---

### Story 4.2: Prompt Highlighting & Visualization

As a user,
I want to see visual highlighting showing what changed between my original and improved prompt,
So that I can instantly recognize the improvements and understand the transformation.

**Acceptance Criteria:**

**Given** the comparison modal is displaying the prompts,
**When** I apply highlighting to the improved version,
**Then** the visual indicators should show (FR29, FR30):

**Highlighting approach:**
- Highlight ONLY the improved prompt (right column)
- Keep original prompt plain text (no highlighting)
- Use color-coded highlighting:
  - **Additions**: Green/yellow background (`.highlight--addition`)
  - **Changes**: Orange/amber background (`.highlight--change`)
  - **Enhancements**: Blue/purple background (`.highlight--enhancement`)

**R/T/E Section highlighting:**
- **Given** improved prompt has Rules/Task/Examples structure
- **When** rendering improved prompt
- **Then** highlight each section header:
  - **Rules:** Highlight with addition color
  - **Task:** Highlight with addition color
  - **Examples:** Highlight with addition color
- **And** highlight section content with appropriate color
- **And** create clear visual separation between sections

**Highlight rendering component:**
- Create `HighlightedText` leaf component (SECTION 4)
- Props: `text`, `highlights` (array of highlight objects)
- Each highlight object: `{ text, type, startIndex, endIndex }`
- Component renders text with `<span>` tags for highlights
- BEM-lite classes: `.highlighted-text__segment--addition`

**Visual design:**
- **Given** highlights are applied
- **When** I view the improved prompt
- **Then** see:
  - Subtle background colors (not overwhelming)
  - Good contrast for text readability
  - Smooth transitions on hover
  - Clear distinction between highlight types

**Performance:**
- **Given** modal opens
- **When** highlighting renders
- **Then** complete within 200ms (NFR-P6)
- **And** no laggy scrolling or interaction

**Edge cases:**
- **Given** very long improved prompt
- **When** rendering with highlights
- **Then** maintain readability
- **And** preserve performance
- **And** enable scrolling if needed

**Given** I view the comparison,
**When** highlighting is applied,
**Then** the transformation should be:
- Instantly obvious at a glance
- Scannable without reading every word
- Clear what's new vs. what changed

**Requirements fulfilled:** FR29, FR30, FR31, NFR-P6, UX requirements 35, 39

---

### Story 4.3: Sentence Mapping Display

As a user,
I want to see how my original prompt sentences map to the improved R/T/E sections,
So that I can understand the relationship between my input and the structured output.

**Acceptance Criteria:**

**Given** the comparison data includes mapping from Epic 3,
**When** I display the sentence mapping,
**Then** the visualization should show (FR32, FR33):

**Mapping display approach:**
- Display mapping indicators on the improved prompt (right column)
- Use visual connectors or numbering to show relationships
- Support one-to-many mappings (one original → multiple improved sections)

**Mapping indicators:**
- **Given** mapping array from comparisonData
- **When** rendering improved prompt
- **Then** add indicators next to each section:
  - Numbered badges: "①", "②", "③"
  - Badge styling: Small circle with number (`.mapping-badge`)
  - Badge positioned: Left of each section header
  - Badge color: Muted, non-distracting

**Original sentence highlighting (FR31):**
- **Given** mapping shows which original sentences were used
- **When** rendering original prompt (left column)
- **Then** highlight mapped sentences:
  - Subtle underline or background
  - Number badge matching improved prompt
  - Shows which parts were incorporated

**One-to-many mapping visualization (FR33):**
- **Given** one original sentence maps to multiple improved sections
- **When** displaying the mapping
- **Then** show:
  - Same number badge on multiple sections in improved prompt
  - Visual connector (optional): Line or color coding
  - Clear indication of one-to-many relationship

**Example mapping display:**
```
Original: "red can, images of fruits, sun, beach" [①]
Improved:
  ① Rules: Premium positioning, ocean-safe ingredients
  ① Task: Generate 10 product names for...
  Examples: Similar successful brand names
```

**Interactive elements (optional):**
- **Given** mapping indicators are displayed
- **When** user hovers over a badge
- **Then** highlight all related badges
- **And** show connection visual
- **And** dim non-related content

**Performance:**
- **Given** modal is open
- **When** mapping renders
- **Then** complete within 200ms (NFR-P6)
- **And** hover interactions respond within 100ms (NFR-P7)

**Accessibility:**
- Mapping badges are keyboard accessible
- Screen reader announcements for mappings
- Color not sole indicator (use badges + text)

**Given** I view the mapping,
**When** I compare original to improved,
**Then** I should understand:
- Which parts of my original were used
- How they were distributed across sections
- The relationship between input and output

**Requirements fulfilled:** FR31, FR32, FR33, NFR-P6, NFR-P7

---

### Story 4.4: Educational Tooltips

As a user,
I want to see contextual tooltips explaining WHY each improvement matters,
So that I can learn the R/T/E framework and understand the value of each section.

**Acceptance Criteria:**

**Given** the comparison modal is displaying the improved prompt,
**When** I interact with the R/T/E sections,
**Then** educational tooltips should appear (FR34, FR35, FR36, FR38):

**Tooltip component (Leaf component in SECTION 4):**
- `Tooltip` component with props: `children`, `content`
- Renders: Children wrapped with tooltip trigger
- Displays tooltip on hover or click
- Position: Above or below the target element
- BEM-lite class: `.tooltip`

**Tooltip triggers:**
- **Given** improved prompt with R/T/E sections
- **When** user hovers over section headers
- **Then** show tooltip explaining that section
- **And** use explanations from comparisonData.explanations array

**Framework education tooltips (FR36, FR38):**
- **Rules section tooltip:**
  - "Rules establish constraints and guidelines that guide the AI's creative direction. They help the AI understand your brand voice, positioning, and requirements."
  
- **Task section tooltip:**
  - "A clear task definition tells the AI exactly what to generate. Be specific about the output you want (e.g., 'Generate 10 product names' vs. 'Generate names')."
  
- **Examples section tooltip:**
  - "Examples anchor the AI's understanding of your desired style. Providing reference points helps the AI match your expectations."

**Contextual explanations (FR34, FR35):**
- **Given** tooltips are displayed
- **When** user reads tooltip content
- **Then** explanations should:
  - Use supportive coach tone (UX requirement 37)
  - Explain WHY the section matters
  - Connect to user's specific prompt context
  - Be concise (2-3 sentences, not paragraphs)

**Tooltip behavior:**
- **Given** tooltip trigger
- **When** user hovers over element
- **Then** display tooltip within 100ms (NFR-P7)
- **And** position tooltip to avoid clipping
- **And** keep tooltip visible while hovering

- **Given** tooltip is displayed
- **When** user moves mouse away
- **Then** hide tooltip smoothly
- **And** no abrupt disappearance

**Tooltip styling:**
- Background: Dark or distinct color
- Text: High contrast, readable
- Arrow pointer to target element
- Maximum width: 250px (prevents overly wide tooltips)
- Padding: Generous for readability

**Progressive disclosure (UX requirement 40):**
- Tooltips are hidden by default
- Only show on user interaction (hover/click)
- Don't overwhelm with all tooltips at once
- Let users explore at their own pace

**Accessibility:**
- Tooltips work on focus (keyboard navigation)
- Tooltips can be dismissed with ESC
- Screen reader can access tooltip content
- High contrast for text readability

**Tooltip content examples:**
- **Generic:** "This helps the AI understand your intent"
- **Context-specific:** "Adding 'premium positioning' as a Rule helps the AI create sophisticated names instead of generic ones"

**Given** I interact with the tooltips,
**When** I read the explanations,
**Then** I should feel:
- Educated about the R/T/E framework
- Empowered to apply it myself
- Clear on the value of each section

**Requirements fulfilled:** FR34, FR35, FR36, FR38, NFR-P7, UX requirements 37, 40

---

## Epic 5: Prompt Application & Skill Transfer

### Story 5.1: "Use This Prompt" Functionality

As a user,
I want to apply the improved prompt with one click,
So that I can quickly test the better version without manual copy-paste.

**Acceptance Criteria:**

**Given** the comparison modal is displaying the improved prompt,
**When** I click the "Use This Prompt" button in the modal footer,
**Then** the following should execute (FR25, FR26):

**Button placement:**
- Position in comparison modal footer
- Prominent styling (primary button color)
- Button text: "Use This Prompt"
- BEM-lite class: `.comparison-modal__use-button`

**Insertion behavior:**
- **Given** "Use This Prompt" button is clicked
- **When** onClick handler executes
- **Then** extract `improvedPrompt` from comparisonData
- **And** insert improved prompt text into ChatInput component
- **And** set input field value to improved prompt text
- **And** close comparison modal (set `isComparisonModalOpen = false`)
- **And** focus on input field (ready for user to submit)

**No auto-submit (FR27):**
- **Given** improved prompt is inserted into input
- **When** insertion completes
- **Then** do NOT automatically submit the prompt
- **And** do NOT trigger API call
- **And** let user review the improved prompt before submitting
- **And** let user modify the improved prompt if desired

**Context preservation (FR48):**
- **Given** comparison modal closes
- **When** user views the chat interface
- **Then** chat history should remain visible
- **And** all previous messages are preserved
- **And** input field contains the improved prompt
- **And** user can see the full conversation context

**Button state during loading:**
- **Given** button is clicked
- **When** executing insertion
- **Then** show brief loading state (if needed)
- **Or** complete instantly (it's just text insertion)
- **And** disable button temporarily during execution

**Visual feedback:**
- **Given** improved prompt is inserted
- **When** input field updates
- **Then** show visual confirmation:
  - Brief highlight flash on input field
  - Or subtle animation to draw attention
  - Clear indication that prompt is ready to submit

**Accessibility:**
- "Use This Prompt" button is keyboard accessible
- Focus moves to input field after insertion
- Screen reader announces: "Improved prompt inserted into input field"

**Given** I click "Use This Prompt",
**When** the modal closes and returns to chat,
**Then** I should see:
- Chat interface with full history
- Improved prompt in the input field
- Input field focused and ready
- Send button enabled and waiting

**Requirements fulfilled:** FR25, FR26, FR27, FR48, UX requirement 34

---

### Story 5.2: Prompt Testing & Validation

As a user,
I want to submit the improved prompt and see better AI results,
So that I experience the validation moment that proves the framework works.

**Acceptance Criteria:**

**Given** the improved prompt is inserted in the chat input (from Story 5.1),
**When** I click the Send button to submit the improved prompt,
**Then** the validation flow should execute (FR40, FR41):

**Submit behavior:**
- **Given** input field contains improved prompt
- **When** user clicks Send
- **Then** execute normal chat submission flow (from Epic 1)
- **And** validate input is not empty
- **And** call `callChatAPI(improvedPrompt)`
- **And** set `isChatLoading = true`
- **And** clear input field after submission

**API response handling:**
- **Given** improved prompt is submitted
- **When** OpenAI API returns response
- **Then** add user message to chatHistory
- **And** add AI response to chatHistory
- **And** set `isChatLoading = false`
- **And** display both messages in chat interface

**Proof moment (FR40):**
- **Given** user sees both original result and improved result
- **When** comparing the two responses
- **Then** the improved response should demonstrate:
  - Better quality than original response
  - More aligned with user's intent
  - Clear improvement from using R/T/E framework
- **And** user experiences validation: "It actually works!"

**Framework education (FR39, FR42):**
- **Given** user sees improved results
- **When** they review the transformation
- **Then** the experience should:
  - Reinforce R/T/E framework learning
  - Demonstrate value of structured prompts
  - Enable skill transfer for future prompts
  - Create memorable "aha moment" (FR41)

**Chat history context (FR48):**
- **Given** improved prompt is submitted
- **When** chat updates
- **Then** preserve complete conversation:
  - Original prompt and poor result
  - User feedback
  - Improved prompt and better result
  - All messages visible in sequence
- **And** enable user to see full learning journey

**Performance:**
- API call completes within 10 seconds (NFR-P3)
- Chat history renders within 500ms (NFR-P8)
- UI interactions respond within 100ms (NFR-P1)

**Example user journey:**
1. User: "red can, fruits, sun, beach" → AI: "Generic Soda"
2. User: "Not Satisfied" → Feedback: "Too generic, need creative names"
3. System shows improved prompt with R/T/E structure
4. User: "Use This Prompt"
5. User submits improved prompt
6. AI: "SunSplash Citrus Fizz, OceanBreeze Tropical, Beachside Berry Bliss" ✨
7. User: "Aha! I see how the structure works now!"

**Given** I submit the improved prompt,
**When** I see the better results,
**Then** I should feel:
- Validated that the framework works
- Empowered to use R/T/E independently
- Confident in my prompt engineering skills

**Requirements fulfilled:** FR39, FR40, FR41, FR42, FR48, NFR-P1, NFR-P3, NFR-P8

---

### Story 5.3: Copy to Clipboard

As a user,
I want to copy AI responses and improved prompts to my clipboard,
So that I can use them in other AI tools or save them for future reference.

**Acceptance Criteria:**

**Given** the chat interface or comparison modal is displaying content,
**When** I click copy buttons,
**Then** the following functionality should work (FR46, FR47):

**Copy buttons for AI responses (FR46):**
- **Given** MessageBubble displays an AI response
- **When** rendering the message
- **Then** include a "Copy" button
- **And** position button: Top-right corner of message bubble
- **And** BEM-lite class: `.message-bubble__copy-button`
- **And** button icon: "Copy" text or clipboard icon
- **And** button styling: Subtle, not distracting

**Copy button for improved prompt (FR47):**
- **Given** comparison modal displays improved prompt
- **When** rendering the modal
- **Then** include "Copy" button for improved prompt
- **And** position button: In improved prompt column header
- **Or** position button: Below improved prompt text
- **And** BEM-lite class: `.comparison-modal__copy-button`

**Copy behavior:**
- **Given** copy button is clicked
- **When** onClick executes
- **Then** use Clipboard API: `navigator.clipboard.writeText()`
- **And** copy the text content:
  - For AI response: Copy the full response text
  - For improved prompt: Copy the `improvedPrompt` from comparisonData
- **And** handle errors gracefully if clipboard access fails

**Visual feedback:**
- **Given** copy button is clicked
- **When** text is copied
- **Then** show confirmation feedback:
  - Change button text to "Copied!"
  - Or show tooltip: "Copied to clipboard"
  - Or flash success color
- **And** revert button to original state after 2 seconds

**Error handling:**
- **Given** clipboard API is unavailable
- **When** copy fails
- **Then** display error message:
  - "Unable to copy. Please select and copy manually."
  - Or fallback to text selection method
- **And** don't break the UI

**Accessibility:**
- Copy buttons are keyboard accessible
- Screen reader announces: "Copied to clipboard"
- Focus remains on button after copy

**Button states:**
- Default: "Copy" text/icon
- Loading: (if needed, instant operation)
- Success: "Copied!" (briefly, then revert)
- Error: Error icon or message

**Given** I click a copy button,
**When** the text is copied,
**Then** I should:
- See confirmation that it worked
- Be able to paste in other applications
- Use the content in ChatGPT, Claude, etc.

**Requirements fulfilled:** FR46, FR47, NFR-P1

---

### Story 5.4: Session Management

As a user,
I want to clear my chat history and start fresh,
So that I can begin a new session without refreshing the page.

**Acceptance Criteria:**

**Given** the chat interface is displaying messages,
**When** I want to start a new session,
**Then** the reset functionality should work (FR45):

**Reset button placement:**
- **Given** ChatInterface component
- **When** rendering the interface
- **Then** include "Start Fresh" or "Reset" button
- **And** position button: Top-right corner of chat interface
- **Or** position button: In header area
- **And** BEM-lite class: `.chat-interface__reset-button`
- **And** button styling: Secondary/muted style (not prominent)

**Reset behavior:**
- **Given** reset button is clicked
- **When** onClick executes
- **Then** confirm action with user (optional, based on implementation)
- **And** clear chatHistory: set to empty array `[]`
- **And** clear all modal states:
  - `isFeedbackModalOpen = false`
  - `isComparisonModalOpen = false`
  - `comparisonData = null`
- **And** clear error states:
  - `chatError = null`
  - `improvementError = null`
- **And** clear loading states:
  - `isChatLoading = false`
  - `isGeneratingImprovement = false`
- **And** reset input field to empty
- **And** clear `recentFeedback` from context

**Confirmation dialog (optional):**
- **Given** reset button is clicked
- **When** chat has messages
- **Then** show confirmation:
  - "Clear all chat history? This cannot be undone."
  - Two buttons: "Clear History" and "Cancel"
- **And** only proceed if user confirms

**In-memory state only (Architecture requirement):**
- **Given** page is refreshed
- **When** browser reloads
- **Then** all state is lost (in-memory only, no localStorage)
- **And** reset button is optional alternative to page refresh

**Visual feedback:**
- **Given** reset completes successfully
- **When** chat clears
- **Then** show empty state:
  - "No messages yet. Start by entering a prompt."
  - Or similar welcoming message
- **And** input field is ready for new prompt
- **And** interface feels fresh and clean

**State preservation during reset:**
- **Given** reset is in progress
- **When** clearing state
- **Then** maintain UI stability
- **And** don't break during state transitions
- **And** complete reset within 100ms (NFR-P1)

**Accessibility:**
- Reset button is keyboard accessible
- Screen reader announces: "Chat history cleared"
- Focus moves to input field after reset

**Given** I click reset,
**When** the session clears,
**Then** I should see:
- Empty chat interface
- Ready for new prompts
- No previous messages or context

**Requirements fulfilled:** FR45, NFR-P1, Architecture requirement 14

---

### Story 5.5: Comprehensive Error Handling

As a system,
I want to handle all API errors gracefully with user-friendly messages and retry mechanisms,
So that users experience resilience even when things go wrong.

**Acceptance Criteria:**

**Given** various error scenarios can occur,
**When** errors happen during API calls,
**Then** comprehensive error handling should be in place (FR52-FR58):

**Error types to handle:**
1. **OpenAI API errors (FR54):**
   - Rate limit exceeded (429)
   - Authentication failed (401)
   - Server error (500)
   - Timeout (FR57)

2. **Cloudflare Worker errors (FR55):**
   - Worker unavailable
   - Worker timeout
   - CORS errors

3. **Network errors:**
   - Connection lost
   - Timeout (FR57)
   - DNS resolution failed

**Error display (FR53):**
- **Given** API call fails
- **When** error occurs
- **Then** display user-friendly error message
- **And** use `formatError()` utility from Epic 1
- **And** show error in chat interface (not technical stack traces)
- **And** never expose: raw error objects, stack traces, or technical jargon

**Error messages:**
```javascript
{
  'API_TIMEOUT': 'The request took too long. Please try again.',
  'RATE_LIMIT_EXCEEDED': 'We\'re experiencing high demand. Please wait a moment and try again.',
  'INVALID_API_KEY': 'Service configuration error. Please contact support.',
  'NETWORK_ERROR': 'Connection issue. Please check your internet and try again.',
  'WORKER_UNAVAILABLE': 'Service temporarily unavailable. Please try again.',
  'UNKNOWN': 'Something went wrong. Please try again.'
}
```

**Retry mechanism (FR56):**
- **Given** retryable error occurs
- **When** error is displayed
- **Then** show "Try Again" button
- **And** retryable errors include:
  - `API_TIMEOUT`
  - `NETWORK_ERROR`
  - `RATE_LIMIT_EXCEEDED`
- **And** clicking "Try Again" re-executes the failed operation
- **And** non-retryable errors don't show retry button

**RetryButton component:**
- Props: `onRetry`, `error`
- Displays error message + retry button
- Only shows retry button for retryable error codes
- Re-executes original function on retry click

**Loading states during errors (FR58):**
- **Given** error occurs during operation
- **When** displaying error
- **Then** clear loading states:
  - `isChatLoading = false`
  - `isGeneratingImprovement = false`
- **And** re-enable disabled buttons
- **And** restore UI to responsive state

**Error recovery (FR53):**
- **Given** error is displayed
- **When** user retries successfully
- **Then** clear error message
- **And** display success result
- **And** continue normal flow
- **And** no page refresh required (FR53: recover without refresh)

**Visual feedback for async operations (FR52):**
- **Given** async operation is in progress
- **When** operation is loading
- **Then** show visual indicators:
  - Spinner or loading text
  - Disabled buttons
  - Progress indication
- **And** maintain visual feedback throughout operation

**Error boundary integration:**
- **Given** unexpected rendering error occurs
- **When** ErrorBoundary catches error
- **Then** display fallback UI:
  - "Something went wrong. Please refresh the page."
  - Don't show technical error details
  - Log error to console for debugging

**Timeout handling (FR57):**
- **Given** API call exceeds timeout limit
- **When** timeout triggers
- **Then** cancel the request
- **And** display timeout error message
- **And** offer retry option
- **And** clear loading state

**Multiple error scenarios:**
- Chat API errors: Show in chat interface with retry
- Improvement API errors: Show with retry, keep feedback modal available
- Worker errors: Show worker-specific message, suggest trying again

**Given** an error occurs,
**When** I see the error message,
**Then** I should understand:
- What went wrong (in simple terms)
- What I can do about it (retry, wait, check internet)
- That the system is still responsive

**Requirements fulfilled:** FR52, FR53, FR54, FR55, FR56, FR57, FR58, NFR-R2, NFR-R3, NFR-R4, NFR-R5, NFR-R6

---

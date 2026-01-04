---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-01-04'
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/product-brief-DigitalWaveTest-2026-01-03.md', '_bmad-output/planning-artifacts/ux-design-specification.md']
project_name: 'DigitalWaveTest'
user_name: 'Alexgaidukov'
date: '2026-01-03'
---

# Architecture Decision Document - DigitalWaveTest

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

DigitalWaveTest requires **58 functional requirements** spanning 9 major capability areas:

1. **Prompt Testing & Interaction (FR1-FR9)**: Interactive chat interface with real-time AI response generation, input validation, and multi-prompt testing within sessions
2. **Failure-Driven Learning Flow (FR10-FR14)**: Diagnostic analysis triggered by user dissatisfaction, prompt evaluation against R/T/E framework, deficiency identification
3. **Feedback Modal Workflow (FR15-FR18)**: User feedback capture, improvement generation triggering, modal state management
4. **Prompt Improvement & Transformation (FR19-FR27)**: Vague prompt restructuring into R/T/E format, sentence parsing, one-to-many mapping, improved prompt application
5. **Visual Comparison & Educational Feedback (FR28-FR38)**: Side-by-side comparison display, visual highlighting, contextual tooltips, sentence-to-section mapping visualization
6. **Framework Education & Skill Transfer (FR39-FR42)**: R/T/E framework teaching, "aha moment" creation, skill transfer enablement
7. **Session Management & State (FR43-FR48)**: Conversation state tracking, history management, clipboard operations
8. **Loading & Processing States (FR49-FR52)**: Visual feedback during async operations, button state management
9. **Error Handling & Resilience (FR53-FR58)**: Graceful API failure handling, retry mechanisms, timeout management

**Architecturally Significant Requirements:**

- **FR19-24**: Prompt transformation engine requires sophisticated agent logic to restructure user input into R/T/E framework
- **FR28-33**: Visual comparison system needs complex rendering logic for one-to-many sentence mapping
- **FR34-36**: Contextual tooltip generation requires dynamic content tied to specific prompt components
- **FR53-58**: Comprehensive error handling across multiple async boundaries (OpenAI API, proxy, improvement generation)

**Non-Functional Requirements:**

**Performance (NFR-P1 to NFR-P8):**
- UI interactions: <100ms response
- Page load: <3s on standard broadband
- OpenAI API calls: <10s timeout
- Improvement generation: <15s timeout
- Modal rendering: <200ms
- Tooltip display: <100ms on hover
- Chat history (20 messages): <500ms render

**Security (NFR-S1 to NFR-S7):**
- API key protection: Never exposed client-side, proxied through Cloudflare Workers
- Origin validation on proxy to prevent unauthorized usage
- XSS prevention: All user input sanitized before rendering
- Input validation: Maximum length enforcement
- Data privacy: No external storage without consent, localStorage clearable by user

**Integration (NFR-I1 to NFR-I7):**
- OpenAI API integration (GPT-3.5-turbo or similar)
- Cloudflare Workers proxy with <500ms latency overhead
- CORS handling for cross-origin requests from GitHub Pages
- Standardized error response format from proxy

**Reliability (NFR-R1 to NFR-R9):**
- Graceful degradation when OpenAI API unavailable
- UI remains responsive during API failures
- Error recovery without page refresh required
- User-friendly error messages (no stack traces)
- Retry mechanisms for transient failures
- Browser compatibility: Chrome, Firefox, Safari (latest stable)

**Scale & Complexity:**

- **Primary domain**: Single-page web application (React SPA) with AI integration
- **Complexity level**: Low-to-Medium
  - Sophisticated UI interactions and visual comparison engine
  - Complex agent logic for prompt evaluation and restructuring
  - Constrained scope for 2-day demonstration timeline
  - No backend persistence, authentication, or multi-user features
- **Estimated architectural components**:
  - Frontend: 8-12 React components (Chat, FeedbackModal, ComparisonModal, Tooltip, MessageList, etc.)
  - Agent Logic: 2-3 AI-powered services (Prompt Evaluator, R/T/E Restructurer, Improvement Generator)
  - API Layer: 1 proxy service (Cloudflare Workers)
  - State Management: Client-side only (React state/context)

### Technical Constraints & Dependencies

**Hard Constraints:**

1. **2-Day Timeline**: All architectural decisions must prioritize rapid implementation over extensibility
2. **Single HTML File Deployment**: No build process, no bundlers, no npm packages - React via CDN only
3. **GitHub Pages Hosting**: Static file serving only, no server-side logic
4. **Desktop-Only Scope**: 1024px minimum viewport, no responsive/mobile optimization required
5. **Browser Support**: Chrome/Firefox/Safari latest stable only, ES6+ required

**External Dependencies:**

- **React (CDN)**: UI framework, loaded via CDN link
- **OpenAI API**: GPT-3.5-turbo or similar for prompt testing and improvement generation
- **Cloudflare Workers**: API proxy layer for key protection and CORS handling

**Technology Constraints:**

- No TypeScript (single HTML file limitation)
- No CSS preprocessors or frameworks (inline/embedded CSS only)
- No state management libraries (Redux, MobX) - vanilla React state/context
- No routing library (single-page, no navigation)
- No testing frameworks for MVP (2-day timeline constraint)

### Cross-Cutting Concerns Identified

**1. API Key Security**
- Affects: All OpenAI API interactions
- Concern: Client-side JavaScript can never contain API keys
- Architectural Impact: Requires proxy layer (Cloudflare Workers) to protect credentials

**2. Error Handling & Resilience**
- Affects: Chat interface, feedback modal, comparison generation, all API calls
- Concern: Multiple async failure points (OpenAI API, proxy, network issues)
- Architectural Impact: Consistent error handling strategy across all components, retry mechanisms, user-friendly messaging

**3. Loading State Management**
- Affects: Chat submission, feedback processing, improvement generation, modal rendering
- Concern: Users need visual feedback during async operations
- Architectural Impact: Centralized loading state pattern, disabled button states during processing

**4. Client-Side State Management**
- Affects: Chat history, prompt mappings, comparison data, feedback context, modal visibility
- Concern: Complex state relationships between chat, feedback, and comparison flows
- Architectural Impact: Clear state ownership strategy (component state vs context), state preservation during errors

**5. Visual Highlighting & Mapping Engine**
- Affects: Comparison modal, tooltip rendering, sentence-to-section visualization
- Concern: One-to-many mapping complexity, dynamic highlight generation
- Architectural Impact: Reusable highlighting component, mapping data structure design, tooltip positioning logic

**6. Input Validation & Sanitization**
- Affects: Chat input, feedback modal input, any user-generated content
- Concern: XSS prevention, API abuse prevention
- Architectural Impact: Centralized sanitization utility, maximum length enforcement before API calls

**7. Performance Optimization**
- Affects: Modal rendering, chat history display, tooltip interactions
- Concern: Meeting <100ms UI response, <200ms modal render targets
- Architectural Impact: React optimization techniques (memoization, virtualization if needed for long chat histories)

## Starter Template Evaluation

### Primary Technology Domain

**Single-page web application (React SPA)** with unique deployment constraints that preclude traditional starter templates.

### Technical Approach Analysis

**Traditional Starter Templates NOT Applicable:**

After evaluating standard React starters (Next.js, Vite, Create React App, Remix), none are suitable because they all require:
- Build processes and bundlers
- npm package management
- Node.js development environment
- Multiple file compilation and optimization

**PRD Constraints Driving Architecture:**

The PRD explicitly mandates:
- Single HTML file deployment
- React via CDN (no npm packages)
- No build process or bundlers
- GitHub Pages static hosting
- 2-day demonstration timeline

These constraints eliminate traditional starter approaches and require a **manual single-file architecture**.

### Selected Approach: Pure Single HTML File

**Rationale for Selection:**

1. **Requirements Compliance**: Perfectly matches PRD's explicit "single HTML file with React CDN" constraint
2. **Zero Setup Time**: No initialization, configuration, or tooling - immediate development start
3. **Deployment Simplicity**: Drop file in GitHub Pages repository, done
4. **Timeline Optimization**: No build complexity eating into 2-day development window
5. **Dependency Minimization**: No package.json, no node_modules, no version conflicts

**Trade-offs Accepted:**

- All code in one file (limited organization)
- No component file separation during development
- Limited IDE tooling support for inline JSX
- Manual dependency management via CDN versions

For a 2-day demonstration prototype, these trade-offs are acceptable and actually enforced by requirements.

### Initialization Approach

**No CLI Command Required** - Manual file creation:

```bash
# Create project directory
mkdir DigitalWaveTest
cd DigitalWaveTest

# Create single HTML file
touch index.html

# Optional: Initialize git for GitHub Pages
git init
git branch -M main
```

### Architectural Decisions Provided by Approach

**Language & Runtime:**
- **JavaScript ES6+**: Browser-native execution, no TypeScript (single file limitation)
- **JSX Compilation**: Babel Standalone for in-browser JSX transformation
- **Runtime**: Modern browsers only (Chrome, Firefox, Safari latest stable)

**React Setup:**
- **Version**: React 18.x via unpkg CDN
- **Loading**: UMD production builds for performance
- **CDN Links**:
  - React: `https://unpkg.com/react@18/umd/react.production.min.js`
  - ReactDOM: `https://unpkg.com/react-dom@18/umd/react-dom.production.min.js`
  - Babel Standalone: `https://unpkg.com/@babel/standalone/babel.min.js`

**Styling Solution:**
- **Inline CSS**: `<style>` tag in HTML head
- **No frameworks**: No Tailwind, no CSS-in-JS libraries
- **Organization**: CSS custom properties for theming, BEM-style class naming for component styles
- **Responsive**: Desktop-only (1024px minimum), no media queries for mobile

**Build Tooling:**
- **None**: Zero build process
- **JSX Transformation**: Babel Standalone in browser (`<script type="text/babel">`)
- **Optimization**: Minified CDN dependencies, manual code minification if needed
- **Hot Reload**: None - manual browser refresh during development

**Testing Framework:**
- **None for MVP**: 2-day timeline constraint
- **Manual Testing**: Browser-based functional testing only
- **Future**: Could add Jest/Testing Library post-demo if project continues

**Code Organization:**
- **Single File Structure**:
  ```html
  <!DOCTYPE html>
  <html>
  <head>
      <!-- CDN imports -->
      <!-- Inline CSS -->
  </head>
  <body>
      <div id="root"></div>
      <script type="text/babel">
          // Utility functions
          // React components (ordered by dependency)
          // Main App component
          // ReactDOM.render
      </script>
  </body>
  </html>
  ```
- **Component Organization Pattern**: Define child components first, parent components last
- **Logical Sections**: Comments to separate utilities, components, API logic, main app

**Development Experience:**
- **Editor**: Any text editor or IDE
- **Debugging**: Browser DevTools only
- **Version Control**: Git for GitHub Pages deployment
- **Preview**: Open file directly in browser or use simple HTTP server
- **No Dependencies**: No package installation, no node_modules, no compatibility issues

**Deployment Strategy:**
- **GitHub Pages**: Direct file commit to repository
- **Workflow**: Push `index.html` to main branch, enable GitHub Pages
- **CDN Reliability**: Using unpkg for React/Babel (stable, production-ready)
- **Versioning**: Pin React 18 major version (`@18` resolves to latest 18.x)

**Note:** This approach is the "project initialization" - creating `index.html` with CDN scaffolding should be the first implementation task.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. State Management: React Context API
2. API Proxy: Cloudflare Workers
3. Component Architecture: Functional Components with Hooks
4. Prompt Evaluation: OpenAI API with hardcoded system prompts

**Important Decisions (Shape Architecture):**
5. Error Handling: Centralized Error Boundary + Try-Catch
6. Data Persistence: In-Memory Only (no localStorage)

**Already Decided by Approach (From Starter Template Evaluation):**
- Language: JavaScript ES6+
- Framework: React 18.x via CDN
- Build tooling: None (Babel Standalone)
- Styling: Inline CSS
- Testing: None for MVP
- Deployment: GitHub Pages

### State Management

**Decision:** React Context API for centralized application state

**Rationale:**
- Complex state relationships across chat, feedback modal, and comparison flows (FR43-48)
- Prevents prop-drilling hell when sharing state between deeply nested components
- Standard React approach with no additional dependencies
- Clean separation between UI and state logic

**Implementation Pattern:**
- Single `AppContext` providing global state (chat history, modal visibility, comparison data, loading states)
- Custom hooks (`useAppContext`) for component access
- State updates through context actions/reducers

**Affects:**
- All components: Chat, FeedbackModal, ComparisonModal, MessageList, Tooltip
- Cross-component state sharing (prompt mappings, feedback context, session data)

### API Architecture

**Decision:** Cloudflare Workers serverless proxy for OpenAI API calls

**Rationale:**
- NFR-S1 requirement: API keys must never be exposed client-side
- Free tier: 100,000 requests/day (more than sufficient for demo)
- <500ms latency overhead meets NFR-I5 requirement
- Automatic CORS handling for GitHub Pages cross-origin requests
- Simple fetch-based proxy implementation

**Implementation Pattern:**
```javascript
// Cloudflare Worker proxy structure
export default {
  async fetch(request) {
    // Validate origin (NFR-S3)
    // Forward to OpenAI API with stored API key
    // Return standardized response format
  }
}
```

**Proxy Responsibilities:**
- API key protection (stored as Cloudflare secret)
- Request validation and origin checking
- OpenAI API communication
- CORS header management
- Error standardization

**Client Integration:**
- Single `fetch()` call to Cloudflare Worker endpoint
- Worker URL stored as constant in `index.html`
- Standardized error responses from proxy

**Affects:**
- All OpenAI API interactions (chat testing, prompt improvement generation)
- Error handling for API failures
- Performance metrics (NFR-P3: <10s timeout for API calls)

### Error Handling & Resilience

**Decision:** Centralized Error Boundary + Try-Catch Pattern with user-friendly messaging

**Rationale:**
- NFR-R5 to NFR-R7 requirements: graceful degradation, user-friendly errors, no stack traces
- Multiple async failure points: OpenAI API, Cloudflare proxy, network issues
- App must remain responsive during failures (NFR-R3)
- Consistent error UX across all components

**Implementation Pattern:**

**1. React Error Boundary Component:**
```javascript
class ErrorBoundary extends React.Component {
  // Catches rendering errors
  // Displays fallback UI
  // Logs errors without exposing stack traces to user
}
```

**2. Centralized Error Formatter Utility:**
```javascript
function formatError(error) {
  // Maps technical errors to user-friendly messages
  // "API rate limit" → "We're experiencing high demand. Please try again."
  // "Network timeout" → "Connection issue. Please check your internet."
}
```

**3. Try-Catch Around All Async Operations:**
```javascript
try {
  const response = await callOpenAI();
} catch (error) {
  const userMessage = formatError(error);
  // Display in UI, enable retry button
}
```

**Error Recovery:**
- Retry buttons for transient failures (NFR-R6)
- UI remains functional even when API fails
- Clear, actionable error messages (no "undefined is not a function")

**Affects:**
- Chat interface (API call failures)
- Feedback modal (improvement generation failures)
- Comparison modal (rendering errors)
- All async operations

### Component Architecture

**Decision:** Functional Components with React Hooks (modern React pattern)

**Rationale:**
- React 18 best practice (aligns with CDN version)
- Cleaner, more maintainable code than class components
- Hooks enable powerful reusable logic (custom hooks for API calls, prompt evaluation)
- NFR-P requirements for performance: React.memo for optimization

**Component Organization Pattern:**
- All components use function syntax
- State managed with `useState`, `useContext`, `useEffect`
- Custom hooks for reusable logic:
  - `useAPI()`: Handles OpenAI API calls with loading/error states
  - `usePromptEvaluation()`: Manages improvement generation flow
  - `useAppContext()`: Accesses global state from Context

**Performance Optimizations:**
- `React.memo()` for expensive components (ComparisonModal, MessageList)
- `useMemo()` for complex calculations (sentence mapping, highlight generation)
- `useCallback()` for event handlers passed to child components

**Component Hierarchy:**
```
App (Context Provider)
├── ErrorBoundary
│   ├── ChatInterface
│   │   ├── MessageList
│   │   └── ChatInput
│   ├── FeedbackModal
│   └── ComparisonModal
│       ├── PromptComparison (side-by-side)
│       └── Tooltip (contextual explanations)
```

**Affects:**
- All 8-12 React components
- Code reusability and maintainability
- Performance optimization strategies

### Prompt Evaluation & Improvement Logic

**Decision:** OpenAI API for all intelligence with hardcoded system prompts

**Rationale:**
- 2-day timeline: Offload complexity to GPT rather than writing custom evaluation logic
- Leverages GPT's natural language understanding for R/T/E framework compliance
- Two distinct API call patterns: (1) Chat testing, (2) Prompt improvement
- System prompts encode business logic as instructions to GPT

**Implementation Pattern:**

**1. Chat Testing (User Prompt Evaluation):**
```javascript
const CHAT_SYSTEM_PROMPT = "You are a helpful assistant. Respond to user prompts naturally.";

async function testUserPrompt(userPrompt) {
  return callAPI({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ]
  });
}
```

**2. Prompt Improvement (R/T/E Restructuring):**
```javascript
const IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt engineering expert. Analyze the user's original prompt and restructure it using the Rules/Task/Examples framework.

Rules: Constraints and guidelines the AI should follow
Task: Clear, specific instruction of what to generate
Examples: Sample outputs showing desired style

Return JSON with:
- improvedPrompt: restructured version
- mapping: [{originalSentence, improvedSections: []}]
- explanations: [{section, tooltip}]`;

async function generateImprovement(originalPrompt, userFeedback) {
  return callAPI({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: IMPROVEMENT_SYSTEM_PROMPT },
      { role: "user", content: `Original: "${originalPrompt}"\nFeedback: "${userFeedback}"\nRestructure using R/T/E framework.` }
    ]
  });
}
```

**Hardcoded System Prompts:**
- `CHAT_SYSTEM_PROMPT`: Simple assistant behavior for user prompt testing
- `IMPROVEMENT_SYSTEM_PROMPT`: Detailed R/T/E restructuring instructions with JSON response format
- System prompts are the "business logic" - tuning them tunes the app behavior

**JSON Response Parsing:**
- GPT returns structured JSON with improvement data
- Client parses JSON to extract: improved prompt, sentence mappings, tooltip explanations
- Handles JSON parsing errors gracefully

**Affects:**
- FR19-24: Prompt transformation engine
- FR28-33: Visual comparison system (needs mapping data from API)
- FR34-36: Contextual tooltip generation (explanations from API)
- NFR-P3/P4: API timeout requirements (<10s chat, <15s improvement)

### Data Persistence

**Decision:** In-Memory Only (No LocalStorage/SessionStorage)

**Rationale:**
- 2-day timeline: Simplicity over features
- Zero data persistence complexity (no serialization, no storage management)
- No privacy concerns (NFR-S6/S7 requirements moot)
- Demo context: Users unlikely to refresh during single demonstration session

**Trade-offs Accepted:**
- Page refresh = lose all chat history and session state
- User cannot resume previous sessions

**Future Enhancement:**
- If demo becomes real product, add localStorage with:
  - Automatic save on state changes
  - Restore on page load
  - Clear/reset button (FR45 requirement)

**Affects:**
- FR43-48: Session Management & State (in-memory only)
- User experience during page refresh
- NFR-S6/S7: Data privacy requirements (not applicable)

### Decision Impact Analysis

**Implementation Sequence:**

1. **First: Project Initialization** - Create `index.html` with React CDN scaffolding
2. **Second: Cloudflare Worker Proxy** - Deploy API proxy for OpenAI calls
3. **Third: Core State Architecture** - Implement Context Provider and Error Boundary
4. **Fourth: Base Components** - Build functional components (Chat, Modal, etc.)
5. **Fifth: API Integration** - Implement OpenAI calls with hardcoded system prompts
6. **Sixth: Visual Comparison Logic** - Parse mapping data, render side-by-side with highlighting
7. **Seventh: Polish** - Performance optimization, error UX refinement

**Cross-Component Dependencies:**

- **Context → All Components**: Every component depends on AppContext for state access
- **Error Boundary → All Components**: Wraps entire app, catches all rendering errors
- **API Logic → Cloudflare Worker**: All OpenAI calls route through proxy
- **Improvement API → Comparison Modal**: Modal depends on structured JSON from improvement endpoint
- **System Prompts → User Experience**: Quality of hardcoded prompts directly impacts R/T/E restructuring quality

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
7 major areas where AI agents could make different choices that would cause inconsistencies

### Naming Patterns

**Database Naming Conventions:**
Not applicable - No database in this architecture (client-side only)

**API Naming Conventions:**
- **Chat testing endpoint:** `callChatAPI(prompt, options)` - Generic, clear intent
- **Improvement generation:** `generateImprovement(originalPrompt, feedback)` - Descriptive of action
- **Cloudflare Worker endpoint:** `/api/chat` and `/api/improve` - RESTful plural nouns
- **Query parameters:** camelCase (`userPrompt`, `sessionId`)
- **Response structure:** `{ success: boolean, data: any, error?: { code, message, details } }`

**Code Naming Conventions:**
- **Components:** PascalCase (`ChatInterface`, `FeedbackModal`, `MessageBubble`)
- **Functions:** camelCase (`formatError`, `parseImprovementResponse`)
- **Custom Hooks:** `use{Purpose}` (`useAPI`, `useAppContext`, `usePromptEvaluation`)
- **Constants:** UPPER_SNAKE_CASE (`API_TIMEOUT`, `MAX_PROMPT_LENGTH`, `WORKER_URL`)
- **Event Handler Props:** `on{Event}` (`onSubmit`, `onClose`, `onRetry`)
- **Event Handler Implementations:** `handle{Event}` (`handleSubmit`, `handleClose`)
- **Boolean Variables:** `is{Adjective}` or `has{Noun}` (`isLoading`, `isOpen`, `hasError`)
- **CSS Classes:** BEM-lite `block-element--modifier` (`chat-interface__message--sent`)

### Structure Patterns

**Project Organization:**
Single HTML file (`index.html`) with strict internal organization:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DigitalWaveTest</title>
    <!-- CDN Imports -->
    <style>
        /* CSS Custom Properties */
        /* Global Styles */
        /* Component Styles (BEM-organized) */
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        // ============================================
        // SECTION 1: CONSTANTS & CONFIGURATION
        // ============================================
        // UPPER_SNAKE_CASE constants (API URLs, timeouts, system prompts)

        // ============================================
        // SECTION 2: UTILITY FUNCTIONS
        // ============================================
        // Pure functions (formatError, sanitizeInput, etc.)

        // ============================================
        // SECTION 3: CUSTOM HOOKS
        // ============================================
        // useAPI, useAppContext, usePromptEvaluation

        // ============================================
        // SECTION 4: REACT COMPONENTS
        // ============================================
        // Leaf components (Button, Tooltip, MessageBubble)
        // Composite components (MessageList, ChatInput)
        // Layout components (ChatInterface, FeedbackModal, ComparisonModal)

        // ============================================
        // SECTION 5: CONTEXT PROVIDER
        // ============================================
        // AppContext definition and provider component

        // ============================================
        // SECTION 6: MAIN APP COMPONENT
        // ============================================
        // App component (orchestrates everything)

        // ============================================
        // SECTION 7: RENDER
        // ============================================
        // ReactDOM.createRoot and render call
    </script>
</body>
</html>
```

**Component Definition Order:** Leaf → Composite → Layout → App (ensures dependencies defined before use)

**File Structure Patterns:**
- No external files (all in `index.html`)
- No build process or bundlers
- No node_modules or package.json
- Optional: `.gitignore` for Cloudflare Worker secrets if deploying worker separately

### Format Patterns

**API Response Formats:**

**Success Response:**
```javascript
{
  success: true,
  data: {
    // Chat API
    message: "AI response text",
    usage: { promptTokens: 50, completionTokens: 100 },

    // Improvement API
    improvedPrompt: "Restructured R/T/E prompt",
    mapping: [
      { originalSentence: "...", improvedSections: ["Rules", "Task"] }
    ],
    explanations: [
      { section: "Rules", tooltip: "Explanation..." }
    ]
  }
}
```

**Error Response:**
```javascript
{
  success: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED", // Machine-readable
    message: "We're experiencing high demand. Please wait a moment and try again.", // User-facing
    details: "OpenAI API rate limit: 100 requests/minute" // Technical debugging
  }
}
```

**Data Exchange Formats:**
- **JSON fields:** camelCase (`userPrompt`, `chatHistory`, `improvedPrompt`)
- **Booleans:** `true`/`false` (not 0/1)
- **Null handling:** `null` for absent values (not `undefined`)
- **Arrays:** Always use arrays, even for single items (`messages: [msg]` not `messages: msg`)

### Communication Patterns

**Event System Patterns:**
Not applicable - No event bus or pub/sub (React Context handles state propagation)

**State Management Patterns:**
- **State structure:** Flat object (no deep nesting for simplicity)
- **State updates:** Direct `setState` calls (no reducer pattern - overkill for this scope)
- **Immutability:** Always return new objects/arrays, never mutate existing state
- **Loading states:** `isLoading` boolean pattern consistently
- **Error states:** Store error objects `{ message, code }` (not strings)

```javascript
// Context state structure
{
  // Chat state
  chatHistory: [],
  isChatLoading: false,
  chatError: null,

  // Modal states
  isFeedbackModalOpen: false,
  isComparisonModalOpen: false,
  comparisonData: null,

  // Improvement state
  isGeneratingImprovement: false,
  improvementError: null
}

// State update pattern
const addMessage = (message) => {
  setChatHistory(prev => [...prev, message]);
};

const setError = (error) => {
  setErrorState({ message: error.message, code: error.code });
};
```

### Process Patterns

**Error Handling Patterns:**

**Global Error Boundary:**
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>Please refresh the page to continue.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Async Error Handling:**
```javascript
// Wrapper function for all API calls
async function callAPI(endpoint, data) {
  try {
    const response = await fetch(WORKER_URL + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error.message);
    }

    return result.data;
  } catch (error) {
    throw formatError(error); // Convert to user-friendly message
  }
}
```

**Error Message Mapping:**
```javascript
function formatError(error) {
  const errorMessages = {
    'API_TIMEOUT': 'The request took too long. Please try again.',
    'RATE_LIMIT_EXCEEDED': 'We\'re experiencing high demand. Please wait a moment and try again.',
    'INVALID_API_KEY': 'Service configuration error. Please contact support.',
    'NETWORK_ERROR': 'Connection issue. Please check your internet and try again.',
    'UNKNOWN': 'Something went wrong. Please try again.'
  };

  const code = error.code || 'UNKNOWN';
  return {
    message: errorMessages[code] || errorMessages.UNKNOWN,
    code: code
  };
}
```

**Loading State Patterns:**
- **Global vs Local:** Local loading states per feature (`isChatLoading`, `isGeneratingImprovement`)
- **Button states:** Disable button during async operations
- **Loading indicators:** Show spinner or text "Processing..." during API calls
- **Persistence:** Loading state persists until API call completes or fails
- **UI pattern:**
  ```javascript
  <button
    onClick={handleSubmit}
    disabled={isLoading}
  >
    {isLoading ? 'Processing...' : 'Submit'}
  </button>
  ```

**Retry Mechanism:**
```javascript
const RetryButton = ({ onRetry, error }) => {
  if (!error) return null;

  const isRetriable = ['API_TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMIT_EXCEEDED'].includes(error.code);

  if (!isRetriable) {
    return <p className="error-message">{error.message}</p>;
  }

  return (
    <div className="error-with-retry">
      <p className="error-message">{error.message}</p>
      <button onClick={onRetry}>Try Again</button>
    </div>
  );
};
```

### Enforcement Guidelines

**All AI Agents MUST:**

1. **Follow the 7-section file organization** - No rearranging sections within the single HTML file
2. **Use BEM-lite CSS naming** - `block-element--modifier` for all component classes
3. **Implement error boundaries** - Wrap entire app in ErrorBoundary component
4. **Use camelCase for JSON fields** - Consistent with JavaScript conventions
5. **Handle all async operations with try-catch** - No unhandled promise rejections
6. **Disable buttons during loading** - Prevent duplicate API submissions
7. **Use user-friendly error messages** - No technical jargon or stack traces exposed
8. **Define components before use** - Leaf → Composite → Layout → App order
9. **Store errors as objects** - `{ message, code }` not strings
10. **Use `isLoading` for loading states** - Consistent boolean naming

**Pattern Enforcement:**
- Code review against this architecture document before marking stories complete
- Browser DevTools to inspect state structure (must match flat pattern)
- Console logging to verify no technical errors exposed to users
- Manual testing of error scenarios (timeout, invalid input, network issues)

**Process for Updating Patterns:**
- Architect agent must approve pattern changes
- Update this architecture document
- Re-scaffold affected components to match new patterns
- Document migration path if patterns change mid-implementation

### Pattern Examples

**Good Examples:**

```javascript
// ✅ Correct: Component definition order
const Button = ({ children, onClick, disabled }) => (
  <button className="btn" onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

const ChatInput = ({ onSubmit, isLoading }) => (
  <div className="chat-interface__input-group">
    <input type="text" placeholder="Enter your prompt..." />
    <Button onClick={onSubmit} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send'}
    </Button>
  </div>
);

// ✅ Correct: State update with immutability
const addMessage = (message) => {
  setChatHistory(prev => [...prev, message]); // New array, not mutation
};

// ✅ Correct: API call with error handling
async function submitChat(userPrompt) {
  setIsChatLoading(true);
  setChatError(null);

  try {
    const response = await callChatAPI(userPrompt);
    addMessage(response);
  } catch (error) {
    setChatError(error); // Store error object
  } finally {
    setIsChatLoading(false);
  }
}

// ✅ Correct: CSS class naming
.chat-interface { }
.chat-interface__message { }
.chat-interface__message--sent { }
.chat-interface__message--received { }

// ✅ Correct: Event handler naming
<ChatInput onSubmit={handleSubmit} />
function handleSubmit() { /* ... */ }

// ✅ Correct: Constants
const API_TIMEOUT = 10000;
const MAX_PROMPT_LENGTH = 2000;
```

**Anti-Patterns:**

```javascript
// ❌ Wrong: Mutating state directly
const addMessage = (message) => {
  chatHistory.push(message); // Mutation!
  setChatHistory(chatHistory);
};

// ❌ Wrong: Component definition order (parent before child)
const ChatInterface = () => (
  <MessageList /> // MessageList not defined yet!
);
const MessageList = () => { /* ... */ };

// ❌ Wrong: Inconsistent CSS naming
.chatInterface { } // camelCase
.chat_message { } // Inconsistent separator
.chatmessage { } // No separator

// ❌ Wrong: Exposing technical errors
const errorMsg = error.toString(); // "TypeError: undefined is not a function"
// Shown to user!

// ❌ Wrong: String error state
const [error, setError] = useState(""); // Should be object or null

// ❌ Wrong: Not disabling buttons during loading
<button onClick={handleSubmit}>Submit</button> // Allows duplicate clicks!

// ❌ Wrong: Inconsistent naming
const User_Prompt = ""; // UPPER_SNAKE but not constant
const getuserdata = ""; // lowercase function
```

## Project Structure & Boundaries

### Complete Project Directory Structure

```
DigitalWaveTest/
├── index.html                          # Complete React application (single file)
├── README.md                           # Project documentation
├── .gitignore                          # Git ignore rules (optional)
└── cloudflare-worker/                  # Optional: API proxy deployment
    ├── worker.js                       # Cloudflare Worker code
    ├── wrangler.toml                   # Worker configuration
    └── .dev.vars                       # Local environment variables (API key)
```

**Alternative Structure (if Worker in same repo):**

```
DigitalWaveTest/
├── index.html                          # Complete React application
├── README.md
├── .gitignore
├── worker.js                           # Cloudflare Worker at root
└── wrangler.toml                       # Worker configuration
```

### Architectural Boundaries

**API Boundaries:**

**External APIs:**
- OpenAI API (`api.openai.com/v1/chat/completions`)
  - Accessed only via Cloudflare Worker proxy
  - Never called directly from client-side JavaScript

- Cloudflare Worker (`your-worker.workers.dev`)
  - Endpoints: `/api/chat` and `/api/improve`
  - CORS-enabled for GitHub Pages origin
  - Validates requests before forwarding to OpenAI

**Client-Server Boundary:**
- All OpenAI API calls cross Cloudflare Worker boundary
- Worker handles: API key protection, origin validation, error standardization
- Client sends: `{ prompt: string, feedback?: string }`
- Worker returns: `{ success: boolean, data: any, error?: { code, message, details } }`

**Component Boundaries:**

**React Component Hierarchy:**
```
App (Context Provider)
├── ErrorBoundary
│   ├── ChatInterface
│   │   ├── MessageList
│   │   │   └── MessageBubble (leaf)
│   │   └── ChatInput
│   │       └── Button (leaf)
│   ├── FeedbackModal
│   │   ├── Button (leaf)
│   │   └── TextArea
│   └── ComparisonModal
│       ├── PromptComparison (side-by-side view)
│       │   └── HighlightedText (with Tooltip)
│       └── Tooltip (leaf)
```

**State Management Boundary:**
- Single `AppContext` provides global state to all components
- No prop drilling for shared state
- Component-local state for UI-specific concerns (form inputs, local UI state)

**Communication Patterns:**
- Parent → Child: Props (`onSubmit`, `isOpen`, `data`)
- Child → Parent: Callback functions (`onClose()`, `onSubmit()`)
- Cross-component: Context updates (e.g., FeedbackModal triggers ComparisonModal via context)

**Service Boundaries:**

**No Backend Services:**
- All business logic in client-side JavaScript
- No authentication/authorization services (demo only)
- No database or data persistence services

**External Service Integration:**
- Cloudflare Worker: Stateless function-as-a-service
  - No service boundaries within worker (single file)
  - Direct API calls to OpenAI, no intermediate layers

**Data Boundaries:**

**Client-Side Data:**
- In-memory state (lost on page refresh)
- No database, no localStorage, no session storage
- Data structures: Plain JavaScript objects and arrays

**API Data Flow:**
```
User Input (index.html)
  → callChatAPI() or generateImprovement()
  → fetch(WORKER_URL + endpoint)
  → Cloudflare Worker
  → OpenAI API
  → Worker response standardization
  → Client-side error handling
  → Update Context state
  → Re-render components
```

**No Caching Layer:**
- All data is transient (current session only)
- No cache invalidation concerns

### Requirements to Structure Mapping

**Feature/Epic Mapping:**

**FR1-FR9: Prompt Testing & Interaction**
- Location: `index.html` → `<script type="text/babel">` → Components: `ChatInterface`, `MessageList`, `ChatInput`, `MessageBubble`
- API Functions: `callChatAPI()` (Section 2)
- System Prompt: `CHAT_SYSTEM_PROMPT` constant (Section 1)

**FR10-FR14: Failure-Driven Learning Flow**
- Location: `index.html` → Components: `FeedbackModal`
- State: Context state `isFeedbackModalOpen`
- Trigger: User indicates dissatisfaction (button click)

**FR15-FR18: Feedback Modal Workflow**
- Location: `index.html` → Components: `FeedbackModal`
- State: Context state for feedback input and modal visibility
- API: None directly (captures user input for improvement generation)

**FR19-FR27: Prompt Improvement & Transformation**
- Location: `index.html` → API Function: `generateImprovement()` (Section 2)
- System Prompt: `IMPROVEMENT_SYSTEM_PROMPT` constant (Section 1)
- Response Parsing: Utility function to extract improvedPrompt, mapping, explanations

**FR28-FR38: Visual Comparison & Educational Feedback**
- Location: `index.html` → Components: `ComparisonModal`, `PromptComparison`, `HighlightedText`, `Tooltip`
- State: Context state `comparisonData` (improved prompt, mappings, explanations)
- CSS Classes: BEM-lite styling for visual highlighting

**FR39-FR42: Framework Education & Skill Transfer**
- Location: `index.html` → Component: `Tooltip`
- Content: Tooltip explanations from API response (`explanations` array)
- UI: Educational tooltips showing R/T/E framework rationale

**FR43-FR48: Session Management & State**
- Location: `index.html` → Context Provider (Section 5)
- State: `chatHistory`, `isFeedbackModalOpen`, `isComparisonModalOpen`, `comparisonData`
- Implementation: React Context API with flat state structure

**FR49-FR52: Loading & Processing States**
- Location: `index.html` → All components with API calls
- Pattern: `isLoading` boolean states per feature
- UI: Disabled buttons, "Processing..." text

**FR53-FR58: Error Handling & Resilience**
- Location: `index.html` → `ErrorBoundary` component + `formatError()` utility
- Components: `RetryButton` for retryable errors
- Pattern: Try-catch around all async operations, user-friendly error messages

**Cross-Cutting Concerns:**

**API Key Security (NFR-S1)**
- Location: `cloudflare-worker/worker.js` → Cloudflare Secret (`OPENAI_API_KEY`)
- Client-side: No API keys exposed, all calls via Worker proxy

**Error Handling (NFR-R5-R7)**
- Location: `index.html` → Section 2 (Utilities): `formatError()` function
- Component: `ErrorBoundary` (Section 4: Components)
- Pattern: Centralized error formatting, consistent UX

**Loading States (NFR-P1-P8)**
- Location: `index.html` → Context state (Section 5)
- Pattern: `isChatLoading`, `isGeneratingImprovement` booleans
- UI: Disabled buttons during async operations

**Input Validation & Sanitization (NFR-S4)**
- Location: `index.html` → Section 2 (Utilities): `sanitizeInput()` function
- Enforcement: Maximum length validation before API calls

**Performance Optimization (NFR-P1-P8)**
- Location: `index.html` → Component optimizations
- Techniques: `React.memo()` for expensive components, `useMemo()` for calculations
- CSS: Optimized rendering, desktop-only (no responsive overhead)

### Integration Points

**Internal Communication:**

**Component Communication:**
- **Props Flow:** Parent components pass callbacks and data to children
  - Example: `ChatInterface` → `ChatInput` passes `onSubmit={handleSubmit}`
- **Context Updates:** Components update global state via context
  - Example: `FeedbackModal` calls `setComparisonData()` when improvement generated
  - `App` component observes context changes and opens `ComparisonModal`
- **Event Bubbling:** User actions bubble up through callback chain
  - Example: Button click → `ChatInput` → `ChatInterface` → `App` → Context update

**No Event Bus:** Direct component communication via props and context only

**External Integrations:**

**Cloudflare Worker Integration:**
```
index.html (Client)
  ↓ fetch(WORKER_URL + '/api/chat')
cloudflare-worker/worker.js
  ↓ fetch('https://api.openai.com/v1/chat/completions')
OpenAI API
  ↓ Response
Worker standardization
  ↓ { success, data, error }
index.html (Client processes response)
```

**GitHub Pages Deployment:**
- Static file serving only
- No server-side processing
- `index.html` served directly from repository

**Data Flow:**

**Chat Flow:**
```
1. User types prompt in ChatInput
2. User clicks Send button
3. onSubmit callback → handleSubmit function
4. setIsChatLoading(true)
5. callChatAPI(userPrompt) → fetch(WORKER_URL + '/api/chat')
6. Cloudflare Worker → OpenAI API
7. Response returned to client
8. setChatHistory(prev => [...prev, { user: prompt, ai: response }])
9. setIsChatLoading(false)
10. MessageList re-renders with new message
```

**Improvement Generation Flow:**
```
1. User indicates dissatisfaction (button click)
2. FeedbackModal opens (context state: isFeedbackModalOpen = true)
3. User enters feedback, clicks Submit
4. isGeneratingImprovement = true
5. generateImprovement(originalPrompt, feedback) → fetch(WORKER_URL + '/api/improve')
6. Cloudflare Worker → OpenAI API with IMPROVEMENT_SYSTEM_PROMPT
7. Response parsed: { improvedPrompt, mapping, explanations }
8. setComparisonData({ improvedPrompt, mapping, explanations })
9. isFeedbackModalOpen = false
10. isComparisonModalOpen = true
11. ComparisonModal renders side-by-side view with tooltips
```

**Error Recovery Flow:**
```
1. API call fails (timeout, rate limit, network error)
2. catch block executes
3. formatError(error) → { message: "User-friendly text", code: "ERROR_CODE" }
4. setErrorState({ message, code })
5. Component displays error message
6. If retryable error (TIMEOUT, NETWORK_ERROR, RATE_LIMIT_EXCEEDED):
   - Show "Try Again" button
   - onRetry re-executes original API call
7. If non-retryable error:
   - Show error message only
   - User must refresh or retry manually
```

### File Organization Patterns

**Configuration Files:**

**Root Directory:**
- `README.md`: Project documentation, setup instructions, deployment guide
- `.gitignore`: Ignore Cloudflare Worker `.dev.vars` (API secrets)

**cloudflare-worker/ Directory:**
- `worker.js`: Main Cloudflare Worker code (proxy logic)
- `wrangler.toml`: Worker deployment configuration
- `.dev.vars`: Local development environment variables (API key - not committed)

**Source Organization:**

**Single HTML File Structure:**
```html
<!DOCTYPE html>
<html>
<head>
    <!-- CDN Links: React, ReactDOM, Babel -->
    <!-- <style>: CSS Custom Properties, Global Styles, Component Styles (BEM) -->
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        // ========================================
        // SECTION 1: CONSTANTS & CONFIGURATION
        // ========================================
        const WORKER_URL = 'https://your-worker.workers.dev';
        const API_TIMEOUT = 10000;
        const CHAT_SYSTEM_PROMPT = `...`;
        const IMPROVEMENT_SYSTEM_PROMPT = `...`;

        // ========================================
        // SECTION 2: UTILITY FUNCTIONS
        // ========================================
        function formatError(error) { ... }
        function sanitizeInput(input) { ... }
        function parseImprovementResponse(data) { ... }

        // ========================================
        // SECTION 3: CUSTOM HOOKS
        // ========================================
        function useAPI() { ... }
        function useAppContext() { ... }

        // ========================================
        // SECTION 4: REACT COMPONENTS
        // ========================================
        // Leaf Components
        const Button = ({ children, onClick, disabled }) => { ... };
        const Tooltip = ({ content, children }) => { ... };

        // Composite Components
        const MessageBubble = ({ message, type }) => { ... };
        const MessageList = ({ messages }) => { ... };
        const ChatInput = ({ onSubmit, isLoading }) => { ... };

        // Layout Components
        const ChatInterface = () => { ... };
        const FeedbackModal = ({ isOpen, onClose }) => { ... };
        const ComparisonModal = ({ isOpen, data, onClose }) => { ... };

        // ========================================
        // SECTION 5: CONTEXT PROVIDER
        // ========================================
        const AppContext = React.createContext();
        function AppProvider({ children }) { ... }

        // ========================================
        // SECTION 6: MAIN APP COMPONENT
        // ========================================
        const App = () => { ... };

        // ========================================
        // SECTION 7: RENDER
        // ========================================
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            <AppProvider>
                <App />
            </AppProvider>
        );
    </script>
</body>
</html>
```

**Test Organization:**

**MVP (2-Day Timeline):**
- No test files (manual browser testing only)
- Manual testing checklist in README.md

**Future Enhancement (Post-Demo):**
- If project continues, could add:
  - `tests/` directory with Jest/Testing Library
  - Component tests for critical UI flows
  - API integration tests with mocked Cloudflare Worker

**Asset Organization:**

**No External Assets:**
- No images, icons, or fonts (all text-based UI)
- No static asset directory needed
- All styling via inline CSS in `<style>` tag

**CDN Assets:**
- React, ReactDOM, Babel loaded via unpkg CDN
- No local asset management required

### Development Workflow Integration

**Development Server Structure:**

**Local Development:**
- Open `index.html` directly in browser (double-click)
- Or use simple HTTP server: `npx serve .` or `python -m http.server 8000`
- Live reload: Not available (manual browser refresh required)
- Debugging: Browser DevTools (Console, Elements, Network tabs)

**No Build Process:**
- No compilation step
- No bundling
- No hot module replacement
- Edit `index.html`, save, refresh browser to see changes

**Cloudflare Worker Development:**
- Local development: `npx wrangler dev` (runs Worker locally)
- Testing: Worker console at `http://localhost:8787`
- Deploy: `npx wrangler deploy` (deploys to Cloudflare)

**Build Process Structure:**

**No Build Step:**
- Babel Standalone compiles JSX in browser at runtime
- No production build optimization (acceptable for MVP demo)
- Future enhancement: Could add build step with Babel CLI for better performance

**CDN Loading:**
- React 18 UMD builds loaded from unpkg
- Babel Standalone for in-browser JSX transformation
- All dependencies loaded synchronously before app renders

**Deployment Structure:**

**GitHub Pages Deployment:**
```bash
# Initial setup
git init
git add index.html
git commit -m "Initial commit"
git branch -M main

# Deploy to GitHub Pages
git remote add origin https://github.com/username/DigitalWaveTest.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Source: Deploy from branch 'main' /root folder
```

**Cloudflare Worker Deployment:**
```bash
cd cloudflare-worker
npx wrangler login
npx wrangler deploy
```

**Worker Configuration (`wrangler.toml`):**
```toml
name = "digitalwave-test-proxy"
main = "worker.js"
compatibility_date = "2024-01-01"

[vars]
# Environment variables (non-sensitive)
ALLOWED_ORIGINS = "https://username.github.io"

# API keys stored as secrets (not in wrangler.toml)
# npx wrangler secret put OPENAI_API_KEY
```

**Production URL Structure:**
- Frontend: `https://username.github.io/DigitalWaveTest/`
- Cloudflare Worker: `https://digitalwave-test-proxy.username.workers.dev`

**Environment-Specific Configuration:**
- Development: `WORKER_URL = 'http://localhost:8787'` (local Worker)
- Production: `WORKER_URL = 'https://digitalwave-test-proxy.username.workers.dev'`
- Manual URL switching required (no environment variable system)

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**

✅ **Technology Stack Compatibility:**
- React 18.x UMD builds via CDN are fully compatible with Babel Standalone for in-browser JSX transformation
- Cloudflare Workers support fetch API and ES6+ JavaScript used in client code
- OpenAI API integrates seamlessly with Cloudflare Workers (no compatibility issues)
- GitHub Pages static hosting is compatible with single HTML file deployment
- Desktop-only scope aligns with modern browser requirements (ES6+)

✅ **No Contradictory Decisions:**
- State Management (React Context) aligns with Component Architecture (Functional Components with Hooks)
- API Architecture (Cloudflare Workers proxy) supports Error Handling pattern (centralized error formatting)
- Single HTML file structure reinforces Implementation Patterns (7-section organization)
- In-memory persistence aligns with 2-day MVP timeline constraint

**Pattern Consistency:**

✅ **Patterns Support Architectural Decisions:**
- BEM-lite CSS naming aligns with single HTML file structure (no CSS modules)
- Flat Context state structure matches simplicity goal (no reducers for MVP)
- `isLoading` boolean pattern consistent across all async operations
- Component definition order (Leaf → Composite → Layout) prevents dependency issues
- camelCase JSON fields align with JavaScript conventions

✅ **Naming Conventions Consistent:**
- PascalCase for components (`ChatInterface`, `FeedbackModal`)
- camelCase for functions (`callChatAPI`, `generateImprovement`)
- UPPER_SNAKE_CASE for constants (`API_TIMEOUT`, `WORKER_URL`)
- `on*` for event handler props, `handle*` for implementations
- BEM-lite `block-element--modifier` for CSS classes

**Structure Alignment:**

✅ **Project Structure Supports Architecture:**
- Single `index.html` file supports React CDN architecture perfectly
- Cloudflare Worker directory structure enables API proxy deployment
- No `src/` or `components/` directories needed (all in single HTML file)
- 7-section organization within `<script>` tag enables code organization despite single-file constraint

✅ **Boundaries Properly Defined:**
- Client-Server boundary at Cloudflare Worker (API key protection)
- Component boundaries via React Context (global state vs local state)
- API boundaries clearly specified (`/api/chat`, `/api/improve`)
- Data boundaries explicit (in-memory only, no persistence)

✅ **Integration Points Structured:**
- Component communication via props and context (well-defined patterns)
- External integration via fetch API to Cloudflare Worker (standard pattern)
- Data flow clearly documented (chat flow, improvement flow, error recovery)

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**

✅ **All 9 FR Categories Fully Supported:**

1. **FR1-FR9: Prompt Testing & Interaction** ✅
   - Components: `ChatInterface`, `MessageList`, `ChatInput`, `MessageBubble`
   - API: `callChatAPI()` with `CHAT_SYSTEM_PROMPT`
   - State: Context `chatHistory`, `isChatLoading`, `chatError`

2. **FR10-FR14: Failure-Driven Learning Flow** ✅
   - Component: `FeedbackModal`
   - State: `isFeedbackModalOpen`
   - Trigger: User dissatisfaction button

3. **FR15-FR18: Feedback Modal Workflow** ✅
   - Component: `FeedbackModal` with textarea input
   - Flow: Opens → User enters feedback → Submits → Triggers improvement

4. **FR19-FR27: Prompt Improvement & Transformation** ✅
   - API: `generateImprovement()` with `IMPROVEMENT_SYSTEM_PROMPT`
   - Parsing: Utility function extracts improvedPrompt, mapping, explanations
   - Response: Structured JSON from OpenAI API

5. **FR28-FR38: Visual Comparison & Educational Feedback** ✅
   - Components: `ComparisonModal`, `PromptComparison`, `HighlightedText`, `Tooltip`
   - State: `comparisonData` (improved prompt, mappings, explanations)
   - CSS: BEM-lite styling for visual highlighting

6. **FR39-FR42: Framework Education & Skill Transfer** ✅
   - Component: `Tooltip` with educational explanations
   - Content: Tooltips show R/T/E framework rationale from API

7. **FR43-FR48: Session Management & State** ✅
   - State: React Context with flat structure
   - Scope: In-memory only (matches MVP constraints)
   - Operations: Add message, update modal states, store comparison data

8. **FR49-FR52: Loading & Processing States** ✅
   - Pattern: `isLoading` boolean states per feature
   - UI: Disabled buttons, "Processing..." text
   - Coverage: `isChatLoading`, `isGeneratingImprovement`

9. **FR53-FR58: Error Handling & Resilience** ✅
   - Components: `ErrorBoundary`, `RetryButton`
   - Utilities: `formatError()` function
   - Pattern: Try-catch around all async operations
   - Recovery: Retry buttons for transient failures

**Non-Functional Requirements Coverage:**

✅ **Performance (NFR-P1 to NFR-P8):**
- UI interactions <100ms: React.memo, useMemo optimizations documented
- Page load <3s: Lightweight single HTML file with CDN dependencies
- API timeouts: `API_TIMEOUT = 10000ms` (10s for chat), 15s for improvement
- Modal render <200ms: Optimized component hierarchy

✅ **Security (NFR-S1 to NFR-S7):**
- API key protection: Cloudflare Worker proxy (NFR-S1) ✅
- Origin validation: Worker validates requests (NFR-S3) ✅
- XSS prevention: `sanitizeInput()` utility documented (NFR-S4) ✅
- Input validation: `MAX_PROMPT_LENGTH` constant specified (NFR-S4) ✅
- Data privacy: In-memory only, no external storage (NFR-S6/S7) ✅

✅ **Integration (NFR-I1 to NFR-I7):**
- OpenAI API: Fully integrated via Cloudflare Worker ✅
- Cloudflare Workers: Proxy with <500ms latency overhead ✅
- CORS handling: Worker manages CORS headers for GitHub Pages ✅
- Error response format: Standardized `{ success, data, error }` structure ✅

✅ **Reliability (NFR-R1 to NFR-R9):**
- Graceful degradation: ErrorBoundary + user-friendly errors ✅
- UI responsiveness during failures: Non-blocking error handling ✅
- Error recovery without refresh: Retry buttons for transient failures ✅
- User-friendly messages: `formatError()` mapping technical→user-friendly ✅
- Retry mechanisms: Documented for timeout, network, rate limit errors ✅

### Implementation Readiness Validation ✅

**Decision Completeness:**

✅ **All Critical Decisions Documented:**
- State Management: React Context API with flat structure ✅
- API Architecture: Cloudflare Workers proxy ✅
- Component Architecture: Functional Components with Hooks ✅
- Prompt Evaluation: OpenAI API with hardcoded system prompts ✅
- Error Handling: Error Boundary + Try-Catch pattern ✅
- Data Persistence: In-Memory Only ✅

✅ **Technology Versions Specified:**
- React 18.x via unpkg CDN ✅
- Babel Standalone for JSX transformation ✅
- GPT-3.5-turbo (or similar) specified ✅
- Modern browsers (Chrome/Firefox/Safari latest stable) ✅

✅ **Implementation Patterns Comprehensive:**
- 7 pattern categories defined (naming, structure, format, communication, process) ✅
- 10 enforcement guidelines for AI agents ✅
- Good examples and anti-patterns provided ✅
- Concrete code examples for all major patterns ✅

**Structure Completeness:**

✅ **Project Structure Specific:**
- Complete directory tree: `index.html`, `README.md`, `cloudflare-worker/` ✅
- Alternative structure documented (worker at root) ✅
- All files clearly described with purposes ✅

✅ **Integration Points Specified:**
- Component communication: Props and context patterns documented ✅
- External integration: Cloudflare Worker integration flowchart ✅
- Data flow: Chat flow, improvement flow, error recovery flow ✅

✅ **Component Boundaries Well-Defined:**
- Complete component hierarchy tree provided ✅
- State management boundaries explicit (Context vs local state) ✅
- API boundaries specified (`/api/chat`, `/api/improve`) ✅

**Pattern Completeness:**

✅ **All Conflict Points Addressed:**
- Code organization within single file ✅
- State management patterns ✅
- API integration patterns ✅
- Component prop patterns ✅
- Styling patterns ✅
- Error handling patterns ✅

✅ **Naming Conventions Comprehensive:**
- Components: PascalCase ✅
- Functions: camelCase ✅
- Constants: UPPER_SNAKE_CASE ✅
- Event handlers: `on*` (props), `handle*` (implementations) ✅
- CSS classes: BEM-lite ✅

✅ **Communication Patterns Fully Specified:**
- Parent → Child: Props ✅
- Child → Parent: Callbacks ✅
- Cross-component: Context updates ✅
- Event bubbling: Documented ✅

✅ **Process Patterns Complete:**
- Error handling: ErrorBoundary + try-catch + formatError ✅
- Loading states: `isLoading` + disabled buttons ✅
- Retry mechanism: RetryButton with error code detection ✅

### Gap Analysis Results

**Critical Gaps:** NONE

All critical architectural elements are present and documented. No blocking issues found.

**Important Gaps:** MINOR ENHANCEMENTS

1. **System Prompt Tuning Guidelines:**
   - Current: System prompts documented as constants
   - Enhancement: Could add guidelines for tuning `CHAT_SYSTEM_PROMPT` and `IMPROVEMENT_SYSTEM_PROMPT` for better results
   - Impact: Low (works as-is, tuning is iterative)
   - Priority: Nice-to-have

2. **Manual Testing Checklist:**
   - Current: "Manual testing checklist in README.md" mentioned
   - Enhancement: Could provide explicit test scenarios checklist
   - Impact: Low (testing is straightforward for this MVP)
   - Priority: Nice-to-have

**Nice-to-Have Gaps:**

1. **Post-Demo Enhancements Documented:**
   - localStorage persistence (future enhancement)
   - Build step with Babel CLI (future optimization)
   - Test framework (post-MVP)
   - All documented as future enhancements ✅

2. **Development Workflow Optimizations:**
   - Live reload (not available with single HTML file)
   - Hot module replacement (not applicable without build process)
   - These are constraints, not gaps

### Validation Issues Addressed

**No Critical or Important Issues Found**

The architecture is coherent, complete, and ready for implementation. All validation checks passed successfully.

**Minor Suggestions (Optional Refinements):**

1. **Add example system prompts** to architecture document for easier tuning
2. **Create manual testing checklist** in README.md before implementation begins
3. **Document common issues** with single HTML file development (e.g., CORS when opening file directly)

These are truly optional - the architecture is complete without them.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** ✅ **READY FOR IMPLEMENTATION**

**Confidence Level:** **HIGH** based on validation results

**Key Strengths:**

1. **Coherent Technology Stack:** All decisions work together without conflicts
2. **Comprehensive Patterns:** 7 pattern categories with 10 enforcement guidelines
3. **Complete Requirements Coverage:** All 58 FRs and all NFRs architecturally supported
4. **Clear Structure:** Single HTML file organization with 7-section internal structure
5. **Implementation-Ready:** Concrete examples, anti-patterns, and code snippets provided
6. **Security-First:** API key protection via Cloudflare Worker proxy
7. **Timeline-Appropriate:** Architecture optimized for 2-day MVP delivery

**Areas for Future Enhancement:**

1. **Persistence:** Add localStorage for chat history (post-demo)
2. **Testing:** Add Jest/Testing Library after MVP
3. **Build Optimization:** Add Babel CLI build step for production performance
4. **System Prompt Tuning:** Iteratively refine prompts based on user feedback
5. **Responsive Design:** Mobile optimization if demo expands beyond desktop scope

### Implementation Handoff

**AI Agent Guidelines:**

- ✅ Follow all architectural decisions exactly as documented
- ✅ Use implementation patterns consistently across all components
- ✅ Respect project structure and boundaries (single HTML file with 7 sections)
- ✅ Refer to this document for all architectural questions
- ✅ Enforce the 10 mandatory pattern guidelines
- ✅ Use good examples as reference, avoid anti-patterns

**First Implementation Priority:**

**Create `index.html` with React CDN Scaffolding**

```bash
# Create project directory
mkdir DigitalWaveTest
cd DigitalWaveTest

# Create single HTML file
touch index.html
```

Add the following structure to `index.html`:
- HTML5 doctype
- CDN links (React 18, ReactDOM 18, Babel Standalone)
- `<style>` tag with CSS custom properties and BEM-lite classes
- `<div id="root"></div>` container
- `<script type="text/babel">` with 7-section organization:
  1. Constants & Configuration
  2. Utility Functions
  3. Custom Hooks
  4. React Components
  5. Context Provider
  6. Main App Component
  7. Render

This is the foundational step that enables all subsequent development.

## Architecture Completion Summary

### Workflow Completion

**Architecture Decision Workflow:** COMPLETED ✅
**Total Steps Completed:** 8
**Date Completed:** 2026-01-04
**Document Location:** _bmad-output/planning-artifacts/architecture.md

### Final Architecture Deliverables

**📋 Complete Architecture Document**

- All architectural decisions documented with specific versions
- Implementation patterns ensuring AI agent consistency
- Complete project structure with all files and directories
- Requirements to architecture mapping
- Validation confirming coherence and completeness

**🏗️ Implementation Ready Foundation**

- 6 critical architectural decisions made
- 7 implementation pattern categories defined
- 8-12 React components specified in hierarchy
- 58 functional requirements fully supported
- All non-functional requirements addressed

**📚 AI Agent Implementation Guide**

- Technology stack with verified versions
- Consistency rules that prevent implementation conflicts
- Project structure with clear boundaries
- Integration patterns and communication standards

### Implementation Handoff

**For AI Agents:**
This architecture document is your complete guide for implementing DigitalWaveTest. Follow all decisions, patterns, and structures exactly as documented.

**First Implementation Priority:**

**Create `index.html` with React CDN Scaffolding**

```bash
# Create project directory
mkdir DigitalWaveTest
cd DigitalWaveTest

# Create single HTML file
touch index.html
```

Add the following structure to `index.html`:
- HTML5 doctype
- CDN links (React 18, ReactDOM 18, Babel Standalone)
- `<style>` tag with CSS custom properties and BEM-lite classes
- `<div id="root"></div>` container
- `<script type="text/babel">` with 7-section organization:
  1. Constants & Configuration
  2. Utility Functions
  3. Custom Hooks
  4. React Components
  5. Context Provider
  6. Main App Component
  7. Render

**Development Sequence:**

1. Initialize project using documented starter template
2. Set up development environment per architecture
3. Implement core architectural foundations
4. Build features following established patterns
5. Maintain consistency with documented rules

### Quality Assurance Checklist

**✅ Architecture Coherence**

- [x] All decisions work together without conflicts
- [x] Technology choices are compatible
- [x] Patterns support the architectural decisions
- [x] Structure aligns with all choices

**✅ Requirements Coverage**

- [x] All functional requirements are supported
- [x] All non-functional requirements are addressed
- [x] Cross-cutting concerns are handled
- [x] Integration points are defined

**✅ Implementation Readiness**

- [x] Decisions are specific and actionable
- [x] Patterns prevent agent conflicts
- [x] Structure is complete and unambiguous
- [x] Examples are provided for clarity

### Project Success Factors

**🎯 Clear Decision Framework**
Every technology choice was made collaboratively with clear rationale, ensuring all stakeholders understand the architectural direction.

**🔧 Consistency Guarantee**
Implementation patterns and rules ensure that multiple AI agents will produce compatible, consistent code that works together seamlessly.

**📋 Complete Coverage**
All project requirements are architecturally supported, with clear mapping from business needs to technical implementation.

**🏗️ Solid Foundation**
The chosen single HTML file architecture provides a rapid-development foundation optimized for the 2-day MVP timeline while maintaining best practices.

## Cloudflare Worker Implementation Architecture

### Overview

**Story Reference:** 1-0-cloudflare-worker-implementation
**Component Type:** Serverless API Proxy
**Purpose:** Secure OpenAI API integration with client-side applications

**Architectural Role:**
The Cloudflare Worker serves as the critical security boundary between the client-side application (hosted on GitHub Pages) and OpenAI API. It provides API key protection, CORS handling, request validation, and response standardization.

### Technical Architecture

**Cloudflare Workers Runtime:**
- **Runtime:** V8 isolate-based JavaScript engine (Edge computing)
- **Compatibility Date:** 2024-01-01 (ensures consistent API behavior)
- **Execution Model:** Stateless, request-scoped, auto-scaling
- **Cold Start Time:** <5ms (typically negligible for API proxy workload)
- **Maximum Request Size:** 100MB (far exceeds our prompt size requirements)
- **Free Tier Limits:** 100,000 requests/day (sufficient for MVP demonstration)

**Worker Hierarchy:**
```
Cloudflare Worker Entry Point (worker.js)
├── CORS Handler (OPTIONS preflight)
├── Router (pathname-based routing)
│   ├── /api/chat → Chat API Handler
│   └── /api/improve → Improvement API Handler
└── Error Response Generator
```

### Request Flow Architecture

**1. Incoming Request Processing:**
```
Client Request (GitHub Pages)
  ↓
Cloudflare Edge (Nearest PoP)
  ↓
Worker Execution (worker.js)
  ↓
CORS Preflight Check (OPTIONS)
  ↓
Route Determination (/api/chat or /api/improve)
  ↓
Origin Validation
  ↓
Request Validation
  ↓
OpenAI API Forwarding
  ↓
Response Standardization
  ↓
CORS Headers Injection
  ↓
Client Response
```

**2. Error Handling Flow:**
```
Request Failure
  ↓
Error Type Detection
  ├── OpenAI API Errors (rate limit, auth, timeout)
  ├── Validation Errors (missing fields, invalid origin)
  └── Network Errors (DNS, connection)
  ↓
Error Code Mapping
  ↓
Standardized Error Response
  ↓
Client Receives User-Friendly Message
```

### Core Architectural Decisions

**Decision 1: Request Routing Pattern**
- **Pattern:** Pathname-based routing in single worker entry point
- **Rationale:** Single worker handles both endpoints, reducing deployment complexity
- **Alternative Considered:** Separate workers for each endpoint (rejected as over-engineering)
- **Trade-offs:** Single point of failure (mitigated by Cloudflare's 99.99% uptime SLA)

**Decision 2: CORS Strategy**
- **Pattern:** Wildcard CORS (`Access-Control-Allow-Origin: *`)
- **Rationale:** GitHub Pages deployment with unpredictable user domains
- **Security Mitigation:** Origin validation at application logic layer (not just CORS headers)
- **Future Enhancement:** Whitelist specific origins in production (ALLOWED_ORIGINS env var)

**Decision 3: Error Standardization**
- **Pattern:** Centralized error response format with { success, error: { code, message, details } }
- **Rationale:** Consistent client-side error handling across all API failures
- **Impact:** Enables `formatError()` utility in client code to map technical→user-friendly messages

**Decision 4: OpenAI API Integration**
- **Pattern:** Direct fetch() calls to OpenAI from Worker (no SDK)
- **Rationale:** Minimal dependencies, faster cold starts, full control over request format
- **Trade-off:** Manual request/response handling vs. SDK convenience (acceptable for simple proxy)

**Decision 5: Secret Management**
- **Pattern:** Environment variables via Cloudflare Secrets (`OPENAI_API_KEY`)
- **Rationale:** Secrets encrypted at rest, never logged, scoped to worker deployment
- **Development:** `.dev.vars` for local testing (gitignored)
- **Security:** API key never exposed in client code or worker source

### Implementation Patterns

**Pattern 1: Request Handler Structure**

All endpoint handlers follow this signature:
```javascript
async function handleEndpoint(request, env) {
  try {
    // 1. Validate request method (POST only)
    // 2. Parse request body JSON
    // 3. Validate required fields
    // 4. Validate origin
    // 5. Call OpenAI API
    // 6. Parse API response
    // 7. Return standardized success response
  } catch (error) {
    // Return standardized error response
    return createErrorResponse(error.code, error.message, error.details);
  }
}
```

**Pattern 2: Origin Validation**

```javascript
function validateOrigin(request, env) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

  // Development: Allow localhost
  // Production: Validate against whitelist
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      return origin.match(allowed.replace('*', '.*'));
    }
    return origin === allowed;
  });

  if (!isAllowed) {
    throw new Error('INVALID_ORIGIN');
  }
}
```

**Pattern 3: OpenAI API Forwarding**

```javascript
async function callOpenAIAPI(messages, env) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.code || 'OPENAI_API_ERROR');
  }

  return response.json();
}
```

**Pattern 4: Response Standardization**

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
    status: 400, // or appropriate status code
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
```

### Security Architecture

**API Key Protection (NFR-S1):**
- **Storage:** Cloudflare Secrets (encrypted at rest)
- **Transmission:** HTTPS only (TLS 1.3 enforced by Cloudflare)
- **Exposure:** Never logged, never returned in responses, never accessible from client

**Origin Validation (NFR-S3):**
```javascript
// Production: Whitelist specific GitHub Pages domain
ALLOWED_ORIGINS = "https://username.github.io"

// Development: Allow localhost for testing
ALLOWED_ORIGINS = "http://localhost:*,http://127.0.0.1:*"
```

**Request Validation:**
- **Method Enforcement:** Only POST requests accepted for API endpoints
- **Content-Type Validation:** Only `application/json` accepted
- **Field Validation:** Required fields checked before OpenAI API call
- **Size Limits:** Maximum prompt length enforced (10,000 characters)

**Rate Limiting:**
- **OpenAI Side:** Respects OpenAI's rate limits (3,000 RPM for gpt-3.5-turbo)
- **Cloudflare Side:** No additional rate limiting for MVP (OpenAI limits are sufficient)
- **Future Enhancement:** Implement Cloudflare Workers KV for rate limiting if abuse detected

**XSS Prevention (NFR-S4):**
- **Sanitization:** All user inputs validated before forwarding to OpenAI
- **Response Sanitization:** OpenAI responses treated as untrusted, not executed as JavaScript
- **Content-Type:** Explicitly set to `application/json` to prevent MIME sniffing

### Error Handling Architecture

**Error Code Mapping:**

| Error Code | HTTP Status | User Message | Technical Details | Retry |
|------------|-------------|--------------|-------------------|-------|
| `INVALID_ORIGIN` | 403 | "Unauthorized request" | Origin not in ALLOWED_ORIGINS | No |
| `MISSING_FIELDS` | 400 | "Invalid request data" | Required field missing from request | No |
| `API_TIMEOUT` | 504 | "Request timed out" | OpenAI API call exceeded 10s | Yes |
| `RATE_LIMIT_EXCEEDED` | 429 | "Too many requests" | OpenAI rate limit hit | Yes (after delay) |
| `INVALID_API_KEY` | 500 | "Service configuration error" | OPENAI_API_KEY invalid | No |
| `OPENAI_API_ERROR` | 502 | "API service error" | OpenAI returned error response | Yes |
| `NETWORK_ERROR` | 503 | "Connection failed" | Network/DNS failure | Yes |

**Retry Strategy:**
- **Retryable Errors:** API_TIMEOUT, RATE_LIMIT_EXCEEDED, OPENAI_API_ERROR, NETWORK_ERROR
- **Non-Retryable Errors:** INVALID_ORIGIN, MISSING_FIELDS, INVALID_API_KEY
- **Exponential Backoff:** Client-side responsibility (worker returns retryable error code)

### Performance Architecture

**Latency Budget (NFR-I5):**
- **Cloudflare Worker Processing:** <50ms (routing, validation, response formatting)
- **OpenAI API Call:** Variable (typically 500ms-2000ms for simple prompts)
- **Total Client-Perceived Latency:** Worker overhead + OpenAI latency
- **Target:** <500ms worker overhead (well within NFR-I5 requirement)

**Optimization Techniques:**
- **Connection Pooling:** Cloudflare automatically pools HTTP connections to OpenAI
- **Edge Caching:** Not applicable (API responses are dynamic, user-specific)
- **Cold Start Mitigation:** Worker is "always warm" due to Cloudflare's edge infrastructure
- **Response Streaming:** Not used (complete response required for error handling)

**Monitoring & Observability:**
- **Cloudflare Analytics:** Built-in request count, error rate, latency metrics
- **Logging:** Use `console.log()` for development (visible in Wrangler dev mode)
- **Production Logging:** Cloudflare Workers Logs (optional, paid feature)
- **MVP Approach:** Manual testing and Cloudflare dashboard metrics only

### Configuration Architecture

**wrangler.toml Structure:**
```toml
name = "digitalwave-test-proxy"
main = "worker.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "http://localhost:*,http://127.0.0.1:*"

# Secrets (not in wrangler.toml):
# npx wrangler secret put OPENAI_API_KEY
```

**Environment-Specific Configuration:**

| Environment | ALLOWED_ORIGINS | OPENAI_API_KEY | Deployment |
|-------------|-----------------|----------------|------------|
| Development | `http://localhost:*` | `.dev.vars` file | `npx wrangler dev` |
| Production | `https://username.github.io` | Cloudflare Secret | `npx wrangler deploy` |

**Configuration Management:**
- **Version Control:** `wrangler.toml` committed to git (non-sensitive config)
- **Secrets:** `.dev.vars` excluded via `.gitignore`
- **Environment Variables:** Accessible in worker via `env.VARIABLE_NAME`
- **Secret Access:** `env.OPENAI_API_KEY` (only accessible at runtime, never logged)

### Deployment Architecture

**Development Workflow:**
```bash
# 1. Install dependencies
npm install -g wrangler

# 2. Authenticate
npx wrangler login

# 3. Initialize worker project
npx wrangler init

# 4. Configure secrets (local)
echo "OPENAI_API_KEY=sk-..." > .dev.vars

# 5. Local development
npx wrangler dev
# Worker available at http://localhost:8787

# 6. Test locally
curl http://localhost:8787/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

**Production Deployment:**
```bash
# 1. Configure production secrets
npx wrangler secret put OPENAI_API_KEY
# Enter API key when prompted

# 2. Deploy to Cloudflare
npx wrangler deploy

# 3. Worker URL
# https://digitalwave-test-proxy.username.workers.dev

# 4. Test production endpoint
curl https://digitalwave-test-proxy.username.workers.dev/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

**Rollback Strategy:**
- **Git Version Control:** Revert `worker.js` commit and redeploy
- **Cloudflare Versioning:** Automatic (wrangler deploys as new version, can rollback)
- **Zero Downtime:** Cloudflare gradually shifts traffic (instant rollback available)

### Integration Architecture

**Client-Worker Integration:**

**Client-side constants (index.html):**
```javascript
const WORKER_URL = 'https://digitalwave-test-proxy.username.workers.dev';

async function callChatAPI(prompt) {
  const response = await fetch(`${WORKER_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return result.data.message;
}
```

**Worker-OpenAI Integration:**
- **Protocol:** HTTPS (TLS 1.3)
- **Authentication:** Bearer token (API key in `Authorization` header)
- **Request Format:** JSON (OpenAI API specification)
- **Response Parsing:** Extract `choices[0].message.content`
- **Error Handling:** Parse `error.code` from OpenAI response

### Testing Architecture

**Local Development Testing:**
```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:8787/api/chat \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"

# Test chat endpoint
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"prompt": "Write a haiku"}'

# Test improvement endpoint
curl -X POST http://localhost:8787/api/improve \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"originalPrompt": "write code", "userFeedback": "too vague"}'
```

**Production Testing:**
```bash
# Test production endpoint
npx wrangler tail --format pretty
# Watch live logs from deployed worker

# Run production curl tests
curl https://digitalwave-test-proxy.username.workers.dev/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

**Error Scenario Testing:**
1. **Invalid Origin:** Request from unauthorized domain → 403 error
2. **Missing Fields:** Request without `prompt` field → 400 error
3. **Invalid API Key:** Deploy worker with invalid secret → 500 error
4. **Rate Limit:** Exceed OpenAI limits → 429 error (retryable)
5. **Network Timeout:** Simulate slow OpenAI response → 504 error

### Maintenance & Operations

**Monitoring Checklist:**
- [ ] Check Cloudflare Dashboard for error rates
- [ ] Monitor request volume (100,000/day free tier limit)
- [ ] Review OpenAI API usage and costs
- [ ] Validate origin whitelist for production

**Debugging Tools:**
- **Wrangler Dev Mode:** `npx wrangler dev` (local testing with live logs)
- **Wrangler Tail:** `npx wrangler tail` (production log streaming)
- **Cloudflare Dashboard:** Analytics, logs, deployment history
- **Browser DevTools:** Network tab for client-side debugging

**Common Issues & Resolutions:**

| Issue | Symptom | Resolution |
|-------|---------|------------|
| CORS error | "No 'Access-Control-Allow-Origin' header" | Check CORS handler, verify OPTIONS preflight |
| Invalid origin | 403 Unauthorized | Update ALLOWED_ORIGINS in wrangler.toml |
| API key not found | 500 error with missing secret | Run `npx wrangler secret put OPENAI_API_KEY` |
| Timeout errors | Requests taking >10s | Increase timeout or optimize prompt size |
| High costs | Unexpected OpenAI charges | Monitor usage, implement rate limiting |

### Architecture Compliance

**Requirements Mapping:**

✅ **NFR-S1 (API Key Protection):**
- API key stored as Cloudflare Secret
- Never exposed to client
- Encrypted at rest and in transit

✅ **NFR-S3 (Origin Validation):**
- ALLOWED_ORIGINS configuration
- Origin validation before API calls
- Development vs. production configuration

✅ **NFR-I5 (Worker Latency Overhead):**
- <500ms overhead target
- Efficient request routing
- Minimal processing logic

✅ **NFR-I6 (CORS Handling):**
- Automatic CORS preflight handling
- Wildcard CORS for GitHub Pages
- Proper headers injection

✅ **NFR-I7 (Error Response Format):**
- Standardized { success, data, error } structure
- Machine-readable error codes
- User-friendly error messages

---

## System Prompts Architecture (Added 2026-01-05)

### Overview

System prompts are externalized to a dedicated configuration file for improved maintainability and version control.

### Configuration File Structure

**Location:** `cloudflare-worker/prompts.js`

**Pattern:** ES6 module with named exports

```javascript
/**
 * System prompts configuration for DigitalWave Worker
 * Centralized location for all AI system prompts
 */

export const CHAT_SYSTEM_PROMPT = `...`;
export const IMPROVEMENT_SYSTEM_PROMPT = `...`;
```

### Import Pattern

**Worker Implementation:**

```javascript
// cloudflare-worker/worker.js
import { CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT } from './prompts.js';

// Usage in handleChatAPI
const response = await callOpenAIAPI(
  [{ role: 'user', content: body.prompt }],
  CHAT_SYSTEM_PROMPT,  // Imported constant
  env,
  10000,
  null,
  1000
);
```

### Prompt Definitions

#### 1. CHAT_SYSTEM_PROMPT

**Purpose:** Guide AI to generate product names based on packaging descriptions

**Used by:** `/api/chat` endpoint

**Content:**
- Base instruction: Product name generation assistant
- 4 detailed product packaging descriptions:
  - Option 1: Condiment Packet (patriotic ketchup)
  - Option 2: Dairy Carton (milk with natural branding)
  - Option 3: Beverage Cans (healthier soda variety pack)
  - Option 4: Cheese Product (processed cheese slices)

**Source:** Migrated from `js/config.js` (was defined but unused)

**Rationale:** Worker was using simplified hardcoded prompt instead of detailed version

#### 2. IMPROVEMENT_SYSTEM_PROMPT

**Purpose:** Restructure user prompts into Task/Rules/Examples format

**Used by:** `/api/improve` endpoint

**Content:**
- R/T/E framework instructions
- Section order requirements (Task → Rules → Examples)
- Sentence parsing guidelines
- Restructuring rules
- JSON response format specification
- Quality checks
- User feedback integration patterns

**Source:** Migrated from inline definition in worker.js (~125 lines)

**Rationale:** Reduce worker.js file size and improve maintainability

### Deployment Architecture

**Build Configuration:**

```toml
# cloudflare-worker/wrangler.toml
[build]
upload.format = "modules"
```

**Bundling Process:**
1. Wrangler detects ES6 imports
2. Bundles prompts.js with worker.js at build time
3. No runtime import() calls (all resolved statically)
4. Single deployment artifact created

**Deployment Command:**

```bash
wrangler deploy
```

**Result:**
- Worker deployed to `https://digitalwave-test-proxy.*.workers.dev`
- prompts.js included in bundle
- No additional configuration needed

### Benefits

1. **Maintainability:**
   - Single source of truth for all AI prompts
   - Easy to update and iterate on prompts
   - Clear separation between configuration and logic

2. **Version Control:**
   - Prompt changes tracked in git history
   - Easy to diff and review prompt modifications
   - Can revert to previous prompt versions

3. **Code Quality:**
   - Removed ~125 lines from worker.js
   - Eliminated unused code in js/config.js
   - Better code organization

4. **Functionality:**
   - Fixed bug where detailed CHAT_SYSTEM_PROMPT was defined but unused
   - Worker now uses correct detailed prompt for product generation

### Security Considerations

**No Security Impact:**
- Prompts are not secrets (no sensitive data)
- Still bundled into worker code (not publicly accessible)
- Same security posture as inline prompts

**Configuration Management:**
- Prompts versioned in git
- No separate secrets management needed
- Changes require redeployment (expected for config)

### Client Access Pattern

**CRITICAL:** Client code does NOT import prompts directly

**Reason:**
- All AI calls must go through Worker proxy
- Prevents direct OpenAI API calls from client
- Maintains security architecture

**Pattern:**

```javascript
// ❌ WRONG - Client cannot import prompts
import { CHAT_SYSTEM_PROMPT } from '../cloudflare-worker/prompts.js';

// ✅ CORRECT - Client calls Worker API
const response = await callChatAPI(userPrompt);
// Worker internally uses CHAT_SYSTEM_PROMPT
```

### Future Extensions

**Adding New Prompts:**

1. Add export to `cloudflare-worker/prompts.js`:
   ```javascript
   export const NEW_PROMPT = `...`;
   ```

2. Import in `worker.js`:
   ```javascript
   import { CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT, NEW_PROMPT } from './prompts.js';
   ```

3. Use in endpoint handlers:
   ```javascript
   await callOpenAIAPI(messages, NEW_PROMPT, env, timeout);
   ```

4. Deploy:
   ```bash
   wrangler deploy
   ```

**A/B Testing Prompts:**

Create variations and switch based on environment:

```javascript
// prompts.js
export const CHAT_SYSTEM_PROMPT_V1 = `...`;
export const CHAT_SYSTEM_PROMPT_V2 = `...`;

// worker.js
const prompt = env.PROMPT_VERSION === 'v2'
  ? CHAT_SYSTEM_PROMPT_V2
  : CHAT_SYSTEM_PROMPT_V1;
```

---

**Architecture Status:** READY FOR IMPLEMENTATION ✅

**Next Phase:** Begin implementation using the architectural decisions and patterns documented herein.

**Document Maintenance:** Update this architecture when major technical decisions are made during implementation.




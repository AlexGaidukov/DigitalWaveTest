---
project_name: 'DigitalWaveTest'
user_name: 'Alexgaidukov'
date: '2026-01-04'
sections_completed: ['technology_stack', 'implementation_rules', 'usage_guidelines']
existing_patterns_found: 7
status: 'complete'
rule_count: 25
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**Core Stack:**
- React 18.x (UMD via unpkg CDN) - REQUIRED version for in-browser JSX
- Babel Standalone (in-browser JSX transformation)
- OpenAI API (GPT-3.5-turbo) via Cloudflare Workers proxy

**Architecture:**
- Single HTML file (`index.html`) - ALL code in one file
- No build process, no bundlers, no package.json
- In-memory state only (no persistence for MVP)
- Desktop-only (no responsive design)

**Deployment:**
- GitHub Pages (static hosting)
- Cloudflare Workers (API proxy)

**Browser Requirements:**
- Modern browsers with ES6+ support
- Chrome/Firefox/Safari latest stable versions

## Critical Implementation Rules

### File Organization (CRITICAL)

**7-Section Internal Structure (MUST FOLLOW):**
```
SECTION 1: CONSTANTS & CONFIGURATION
SECTION 2: UTILITY FUNCTIONS
SECTION 3: CUSTOM HOOKS
SECTION 4: REACT COMPONENTS (Leaf → Composite → Layout)
SECTION 5: CONTEXT PROVIDER
SECTION 6: MAIN APP COMPONENT
SECTION 7: RENDER
```

**Component Definition Order (CRITICAL):**
- Define LEAF components first (Button, Tooltip)
- Then COMPOSITE components (MessageList, ChatInput)
- Then LAYOUT components (ChatInterface, Modals)
- Then APP component last
- Violation causes "ReferenceError: X is not defined"

### State Management Rules

**Immutable Updates ONLY:**
```javascript
// ✅ Correct - Create new array
setChatHistory(prev => [...prev, message]);

// ❌ WRONG - Direct mutation
chatHistory.push(message);
setChatHistory(chatHistory);
```

**Error State Pattern (STRICT):**
- Store errors as OBJECTS: `{ message, code }`
- NEVER store errors as STRINGS
- Use `null` for no error, never empty string

**Loading State Pattern:**
- Use `isLoading` boolean naming
- Disable buttons during async operations
- Local loading states per feature (not global)

### CSS Naming Convention

**BEM-lite (REQUIRED):**
- Format: `block-element--modifier`
- Examples: `.chat-interface__message--sent`
- NEVER use: camelCase, snake_case, or no separators

### Error Handling (CRITICAL)

**API Error Pattern:**
1. Wrap all async operations in try-catch
2. Use `formatError()` to convert errors to user-friendly
3. NEVER expose technical errors or stack traces to users
4. Show retry button for: TIMEOUT, NETWORK_ERROR, RATE_LIMIT_EXCEEDED

**Error Boundary (REQUIRED):**
- Wrap entire app in ErrorBoundary component
- Class component with `getDerivedStateFromError`

### API Integration Rules

**NEVER Call OpenAI Directly:**
- ALL OpenAI calls MUST go through Cloudflare Worker
- Worker URL constant: `WORKER_URL`
- No API keys in client code (security violation)

**API Response Structure:**
```javascript
{
  success: boolean,
  data: any,
  error?: { code: string, message: string, details: string }
}
```

### Component Communication Patterns

**Props Flow:**
- Parent → Child: Pass data and callbacks via props
- Child → Parent: Call callback functions
- Cross-component: Use Context updates

**Event Handler Naming:**
- Props: `on{Event}` (onSubmit, onClose)
- Implementations: `handle{Event}` (handleSubmit, handleClose)

### Performance Constraints

**No Build Process = Limitations:**
- Babel compiles JSX in browser (slower)
- No code splitting or lazy loading
- Acceptable for MVP demo only
- Use React.memo() sparingly for expensive components

### Security Rules (CRITICAL)

**API Key Protection:**
- NEVER commit API keys to git
- Store keys in Cloudflare Workers secrets
- Use `.gitignore` for `.dev.vars` file

**Input Validation:**
- Sanitize all user inputs before API calls
- Enforce `MAX_PROMPT_LENGTH` limit
- No raw HTML rendering (XSS prevention)

### Testing (MVP Constraints)

**No Test Framework:**
- Manual browser testing only
- No Jest, no Testing Library
- Test checklist in README.md
- Future enhancement post-demo

### Anti-Patterns to Avoid

```javascript
// ❌ WRONG: Component definition order
const ChatInterface = () => <MessageList />; // MessageList undefined!
const MessageList = () => { };

// ❌ WRONG: String error state
const [error, setError] = useState("");

// ❌ WRONG: Not disabling buttons
<button onClick={handleSubmit}>Submit</button>

// ❌ WRONG: Mutating state
const addItem = (item) => {
  items.push(item); // Mutation!
  setItems(items);
};

// ❌ WRONG: Exposing technical errors
<p>Error: {error.toString()}</p> // Shows stack trace!

// ❌ WRONG: Direct OpenAI call
fetch('https://api.openai.com/...') // Security violation!
```

### Good Pattern Examples

```javascript
// ✅ Correct: Component order
const Button = ({ children, onClick }) => <button onClick={onClick}>{children}</button>;
const ChatInput = ({ onSubmit }) => <Button onClick={onSubmit}>Send</Button>;

// ✅ Correct: Error object
const [error, setError] = useState(null);
setError({ message: "User-friendly text", code: "API_TIMEOUT" });

// ✅ Correct: Disabled button
<button onClick={handleSubmit} disabled={isLoading}>
  {isLoading ? 'Sending...' : 'Send'}
</button>

// ✅ Correct: Immutable update
setChatHistory(prev => [...prev, newMessage]);

// ✅ Correct: User-friendly error
<p className="error-message">{error.message}</p>;

// ✅ Correct: Worker proxy
fetch(`${WORKER_URL}/api/chat`, { body: JSON.stringify(data) });
```

---

## Usage Guidelines

**For AI Agents:**

- Read this file BEFORE implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge during implementation
- NEVER violate the 7-section file organization or component definition order

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack or patterns change
- Review quarterly for outdated rules
- Remove rules that become obvious over time
- Add new anti-patterns as you discover them

**Integration Points:**

- This file complements the full architecture document
- Architecture document provides comprehensive decisions
- This file provides optimized rules for agent implementation
- Both should be read before starting development

**Last Updated:** 2026-01-04

**File Location:** `_bmad-output/project-context.md`

**Status:** Ready for AI Agent Integration ✅

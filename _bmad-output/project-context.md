---
project_name: 'DigitalWaveTest'
user_name: 'Alexgaidukov'
date: '2026-01-04'
sections_completed: ['technology_stack', 'implementation_rules', 'cloudflare_worker_architecture', 'usage_guidelines']
existing_patterns_found: 9
status: 'complete'
rule_count: 30
optimized_for_llm: true
includes_infrastructure: true
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
- Modular file structure - Refactored from monolithic single file (2026-01-04)
- Cloudflare Worker (`cloudflare-worker/`) - Serverless API proxy
- No build process, no bundlers, no package.json
- In-memory state only (no persistence for MVP)
- Desktop-only (no responsive design)

**Project Structure:**
```
DigitalWaveTest/
├── index.html                    # Entry point (27 lines - references external files)
├── styles/                       # CSS stylesheets
│   └── main.css                  # All application styles (958 lines)
├── js/                           # JavaScript modules
│   ├── config.js                 # Configuration constants (62 lines)
│   ├── utils.js                  # Utility functions (369 lines)
│   ├── components.js             # React components (1259 lines)
│   └── app.js                    # Main App component (349 lines)
├── cloudflare-worker/            # API proxy deployment (Story 1.0)
│   ├── prompts.js                # System prompts configuration (2026-01-05)
│   ├── worker.js                 # Cloudflare Worker code
│   ├── wrangler.toml             # Worker configuration
│   └── .dev.vars                 # Local environment variables (gitignored)
├── README.md                     # Project documentation
└── .gitignore                    # Git ignore rules
```

**Deployment:**
- GitHub Pages (static hosting for frontend)
- Cloudflare Workers (serverless API proxy)

**Cloudflare Worker Development:**
```bash
# Local development
npx wrangler dev  # Runs at http://localhost:8787

# Test local worker
curl http://localhost:8787/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```

**Cloudflare Worker Deployment:**
```bash
# Set production secret
npx wrangler secret put OPENAI_API_KEY

# Deploy to production
npx wrangler deploy

# Worker URL: https://digitalwave-test-proxy.*.workers.dev
```

**Browser Requirements:**
- Modern browsers with ES6+ support
- Chrome/Firefox/Safari latest stable versions

## Critical Implementation Rules

### File Organization (CRITICAL)

**Modular Structure (Refactored 2026-01-04):**

The codebase was refactored from a single 3000+ line HTML file into a modular structure for better maintainability:

**File Responsibilities:**
- `index.html` - Entry point, loads CDN dependencies and external scripts
- `styles/main.css` - All CSS styles (BEM-lite naming convention)
- `js/config.js` - Configuration constants (API URLs, timeouts)
- `js/utils.js` - Utility functions (API calls, error formatting, parsing)
- `js/components.js` - All React components, hooks, and Context Provider
- `js/app.js` - Main App component and ReactDOM render
- `cloudflare-worker/prompts.js` - AI system prompts (CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT)
- `cloudflare-worker/worker.js` - Cloudflare Worker API proxy logic

**Internal Structure Within `js/components.js` (MUST FOLLOW):**
```
1. CUSTOM HOOKS (useAppContext)
2. ERROR BOUNDARY (ErrorBoundary class component)
3. LEAF COMPONENTS (Tooltip, HighlightedText, Button, etc.)
4. COMPOSITE COMPONENTS (ImprovedPromptWithBadges, MessageList, etc.)
5. LAYOUT COMPONENTS (ChatInterface, FeedbackModal, ComparisonModal)
6. CONTEXT PROVIDER (AppContext, AppProvider)
```

**Component Definition Order (CRITICAL):**
- Define LEAF components first (Button, Tooltip)
- Then COMPOSITE components (MessageList, ChatInput)
- Then LAYOUT components (ChatInterface, Modals)
- Then CONTEXT PROVIDER (AppProvider)
- App component is in separate `app.js` file
- Violation causes "ReferenceError: X is not defined"

**Script Loading Order in HTML (REQUIRED):**
```html
<script type="text/babel" src="js/config.js"></script>     <!-- 1. Constants first -->
<script type="text/babel" src="js/utils.js"></script>      <!-- 2. Utils use constants -->
<script type="text/babel" src="js/components.js"></script> <!-- 3. Components use utils -->
<script type="text/babel" src="js/app.js"></script>        <!-- 4. App uses everything -->
```

**HTTP Server Required:**
- Browser CORS policy blocks loading external scripts from `file://` protocol
- Must serve via HTTP: `python3 -m http.server 8001`
- Access at: `http://localhost:8001/index.html`

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

**Cloudflare Worker Architecture:**
- **Story:** 1.0 - Cloudflare Worker Implementation (MUST be completed before client-side API integration)
- **Purpose:** Secure API proxy that protects OpenAI API keys
- **Endpoints:**
  - `/api/chat` - For chat testing (POST request with `{ prompt: string }`)
  - `/api/improve` - For prompt improvement (POST request with `{ originalPrompt, userFeedback }`)
- **Development URL:** `http://localhost:8787` (Wrangler dev server)
- **Production URL:** `https://digitalwave-test-proxy.*.workers.dev` (deployed worker)

**Worker Configuration:**
```toml
name = "digitalwave-test-proxy"
main = "worker.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "http://localhost:*,http://127.0.0.1:*"
```

**Secret Management:**
- **Production:** Store `OPENAI_API_KEY` via `npx wrangler secret put OPENAI_API_KEY`
- **Development:** Store in `.dev.vars` file (gitignored)
- **Security:** API keys encrypted at rest, never logged, never exposed to client

**API Response Structure:**
```javascript
{
  success: boolean,
  data: any,
  error?: { code: string, message: string, details: string }
}
```

**Worker Error Codes:**
- `INVALID_ORIGIN` - Request from unauthorized domain
- `MISSING_FIELDS` - Required field missing
- `API_TIMEOUT` - Request exceeded timeout
- `RATE_LIMIT_EXCEEDED` - OpenAI rate limit hit
- `INVALID_API_KEY` - Service configuration error
- `OPENAI_API_ERROR` - OpenAI returned error
- `NETWORK_ERROR` - Connection failed

**System Prompts Configuration (2026-01-05):**
- **Location:** `cloudflare-worker/prompts.js`
- **Pattern:** ES6 module with named exports
- **Imports:** Worker imports using `import { CHAT_SYSTEM_PROMPT, IMPROVEMENT_SYSTEM_PROMPT } from './prompts.js'`
- **Client Access:** Client code does NOT import prompts directly - all AI calls go through Worker proxy
- **CRITICAL:** All AI system prompts MUST be defined in prompts.js, not inline in worker.js
- **Deployment:** Wrangler automatically bundles prompts.js with worker.js (ES6 modules enabled via `wrangler.toml`)

**Available Prompts:**
- `CHAT_SYSTEM_PROMPT` - Product name generation with 4 packaging options
- `IMPROVEMENT_SYSTEM_PROMPT` - R/T/E framework for prompt optimization

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

**Infrastructure Status:**
- ✅ Story 1.0 (Cloudflare Worker) added to Epic 1
- ✅ Architecture documentation updated with Worker details
- ✅ Project context includes Worker deployment patterns
- ⚠️  Worker implementation REQUIRED before client-side API integration (Stories 1.4+)

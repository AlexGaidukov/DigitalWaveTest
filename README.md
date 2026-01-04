# DigitalWave Test

Interactive prompt testing tool powered by AI.

## Overview

DigitalWave Test helps users improve their prompts through:
- Interactive chat testing with AI
- AI-powered prompt improvement suggestions
- Visual comparison between original and improved prompts
- Educational tooltips explaining prompt engineering techniques

## Project Structure

```
DigitalWaveTest/
├── index.html                    # Complete React application (single file)
├── cloudflare-worker/            # API proxy deployment
│   ├── worker.js                 # Cloudflare Worker code
│   ├── wrangler.toml             # Worker configuration
│   └── .dev.vars                 # Local environment variables (gitignored)
└── README.md                     # This file
```

## Technology Stack

- **Frontend**: React 18.x (via CDN, in-browser JSX transformation)
- **Backend**: Cloudflare Workers (serverless API proxy)
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: GitHub Pages (frontend) + Cloudflare Workers (API)

## Getting Started

### Prerequisites

- Cloudflare account (free tier)
- OpenAI API key
- Node.js (for Wrangler CLI)

### 1. Clone and Setup Frontend

The frontend is a single HTML file that runs directly in the browser.

1. Open `index.html` in your browser
2. Or serve it with a local server:
   ```bash
   python -m http.server 3000
   # or
   npx serve
   ```

### 2. Deploy Cloudflare Worker

The Worker proxies requests to OpenAI API, protecting your API keys.

#### Local Development

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create `cloudflare-worker/.dev.vars` file:
   ```bash
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. Start local development server:
   ```bash
   cd cloudflare-worker
   npx wrangler dev
   ```
   Worker runs at http://localhost:8787

#### Production Deployment

1. Set production secret:
   ```bash
   cd cloudflare-worker
   npx wrangler secret put OPENAI_API_KEY
   # Paste your API key when prompted
   ```

2. Deploy to Cloudflare:
   ```bash
   npx wrangler deploy
   ```

3. Note the deployment URL (e.g., `https://digitalwave-test-proxy.abc123.workers.dev`)

4. Update `index.html` with your Worker URL:
   ```javascript
   // In SECTION 1: CONSTANTS
   const WORKER_URL = "https://digitalwave-test-proxy.abc123.workers.dev";
   ```

5. Update ALLOWED_ORIGINS in `cloudflare-worker/wrangler.toml`:
   ```toml
   [vars]
   ALLOWED_ORIGINS = "http://localhost:*,http://127.0.0.1:*,https://your-username.github.io"
   ```

6. Redeploy:
   ```bash
   npx wrangler deploy
   ```

### 3. Deploy Frontend to GitHub Pages

1. Push code to GitHub repository

2. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: main, folder: / (root)

3. Access your app at `https://your-username.github.io/DigitalWaveTest/`

## Testing the Worker

### Test Chat Endpoint

```bash
curl -X POST http://localhost:8787/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"prompt":"Write a haiku about coding"}'
```

### Test Improvement Endpoint

```bash
curl -X POST http://localhost:8787/api/improve \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"originalPrompt":"write code","userFeedback":"too vague"}'
```

### Test CORS Preflight

```bash
curl -X OPTIONS http://localhost:8787/api/chat \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

## API Endpoints

### POST /api/chat

Send a prompt to OpenAI and get a response.

**Request:**
```json
{
  "prompt": "Write a haiku about coding"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "AI response here"
  }
}
```

### POST /api/improve

Get AI-powered suggestions to improve a prompt.

**Request:**
```json
{
  "originalPrompt": "write code",
  "userFeedback": "too vague"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "improvedPrompt": "restructured prompt",
    "mapping": [
      {
        "originalSentence": "...",
        "improvedSections": ["Rules", "Task"]
      }
    ],
    "explanations": [
      {
        "section": "Task",
        "tooltip": "Explanation here"
      }
    ]
  }
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": "Technical details"
  }
}
```

**Error Codes:**
- `INVALID_ORIGIN` - Request from unauthorized domain
- `MISSING_FIELDS` - Required field missing
- `API_TIMEOUT` - Request exceeded timeout
- `RATE_LIMIT_EXCEEDED` - OpenAI rate limit hit
- `INVALID_API_KEY` - Service configuration error
- `OPENAI_API_ERROR` - OpenAI returned error
- `NETWORK_ERROR` - Connection failed

## Security

- ✅ API keys stored as Cloudflare Secrets (encrypted at rest)
- ✅ Origin validation prevents unauthorized usage
- ✅ Input validation on all endpoints
- ✅ No user data stored (stateless worker)
- ✅ `.dev.vars` gitignored to prevent accidental commits

## Development

### Architecture

- **Single File React**: All frontend code in `index.html`
- **No Build Process**: In-browser JSX transformation via Babel Standalone
- **State Management**: React Context API
- **API Proxy**: Cloudflare Worker for security

### File Organization (index.html)

The `index.html` file follows a strict 7-section structure:

1. **CONSTANTS & CONFIGURATION** - API URLs, error codes, limits
2. **UTILITY FUNCTIONS** - Formatters, validators
3. **CUSTOM HOOKS** - `useChat`, `useImprovement`
4. **REACT COMPONENTS** - Leaf → Composite → Layout order
5. **CONTEXT PROVIDER** - App state management
6. **MAIN APP COMPONENT** - Root component
7. **RENDER** - React root rendering

⚠️ **CRITICAL**: Component definition order matters! Define leaf components first, then composite, then layout. Violation causes "ReferenceError: X is not defined".

## Troubleshooting

### Worker fails to deploy

- Verify `wrangler.toml` has correct `name` and `main` fields
- Check that you've run `wrangler login`
- Ensure `OPENAI_API_KEY` secret is set

### CORS errors in browser

- Verify `ALLOWED_ORIGINS` in `wrangler.toml` includes your frontend URL
- Check that Worker is deployed and accessible
- Ensure Worker returns CORS headers in all responses

### API returns errors

- Verify `OPENAI_API_KEY` is valid and has GPT-3.5-turbo access
- Check OpenAI API status: https://status.openai.com
- Review Worker logs: `npx wrangler tail`

## Testing the Learning Journey (Story 5.2)

This section demonstrates the complete user flow from vague prompt to improved results.

### Test Scenario 1: Product Name Generation

**Objective:** Validate the "aha moment" experience and framework education.

**Steps:**

1. **Submit vague prompt:**
   ```
   red can, fruits, sun, beach
   ```

2. **Observe generic AI response:**
   - Expected: Generic, low-quality response (e.g., "Generic Soda")
   - This demonstrates the problem with vague prompts

3. **Click "Not Satisfied" button** (appears on most recent AI message)

4. **Enter feedback:**
   ```
   Too generic, need creative product names
   ```

5. **Click "Generate Improved Prompt"**
   - Loading indicator appears
   - Wait for improvement API response

6. **Review comparison modal:**
   - **Left column**: Original vague prompt with mapping badges
   - **Right column**: Improved R/T/E structured prompt with color-coded sections
   - **Interactive elements**:
     - Hover over Rules:/Task:/Examples: headers for educational tooltips
     - Click mapping badges to see connections
     - Observe visual highlighting

7. **Click "Use This Prompt"**
   - Modal closes
   - Improved prompt appears in chat input field
   - Input field flashes green (visual confirmation)
   - Focus moves to input field

8. **Review inserted prompt:**
   ```
   Rules: Premium positioning, ocean-safe ingredients
   Task: Generate 10 creative product names for eco-friendly beverages
   Examples: SunSplash, OceanBreeze, Beachside
   ```

9. **Click "Send" button** (manual submission required)
   - Loading state appears
   - Wait for OpenAI API response

10. **Observe improved AI response:**
    - Expected: Specific, creative names (e.g., "SunSplash Citrus Fizz, OceanBreeze Tropical, Beachside Berry Bliss")
    - Quality difference is immediately obvious

11. **Validate learning journey:**
    - Complete conversation visible in chat history
    - Both prompts and both responses preserved
    - Side-by-side quality comparison proves framework works

**Success Criteria:**
✅ Original response is generic/poor quality
✅ Improved response is specific/high quality
✅ Quality difference is obvious to non-technical users
✅ R/T/E framework structure is visible and explained
✅ "Aha moment" achieved: "It actually works!"

### Test Scenario 2: Iterative Improvement

**Objective:** Verify users can refine prompts multiple times.

**Steps:**

1. Complete Test Scenario 1 above

2. **Click "Not Satisfied"** on the improved AI response
   - Button appears even on improved results
   - Enables iterative refinement

3. **Enter new feedback:**
   ```
   Need more upscale, luxury positioning
   ```

4. **Generate second improvement:**
   - Process repeats with enhanced context
   - New comparison shows further refinement

5. **Test improved prompt again:**
   - Submit and verify even better results

**Success Criteria:**
✅ "Not Satisfied" button works on any AI response
✅ Iterative improvements build on previous context
✅ Chat history preserves complete journey
✅ No duplicate messages or state corruption

### Test Scenario 3: Edge Cases

**Test empty input submission:**
- Try submitting without entering prompt
- Expected: Validation error "Please enter a prompt"

**Test very long prompt (>2000 characters):**
- Paste 2500 character prompt
- Expected: Validation error "Prompt is too long. Maximum 2000 characters."

**Test rapid button clicks:**
- Click Send button multiple times quickly
- Expected: Button disabled during API call, prevents duplicate submissions

**Test network timeout:**
- Disconnect network during API call
- Expected: Timeout error after 10 seconds with retry button

**Test prompt customization:**
- After "Use This Prompt", edit the inserted text
- Submit modified version
- Expected: Works normally with edited prompt

**Test abandoned improved prompt:**
- Click "Use This Prompt"
- Clear input field without submitting
- Expected: No error, user can abandon improved prompt

**Success Criteria:**
✅ All edge cases handled gracefully
✅ Clear error messages for validation failures
✅ Retry capability for recoverable errors
✅ No crashes or state corruption

### Expected Performance Metrics

| Metric | Target | Typical Actual |
|--------|--------|----------------|
| Button click → API call | <100ms | ~5-10ms |
| OpenAI chat API response | <10s | 500ms-2s |
| OpenAI improvement API | <15s | 1-3s |
| Chat history render (20 messages) | <500ms | ~20-50ms |
| Comparison modal parsing | <200ms | ~10-50ms |
| UI responsiveness during load | No lag | Fully responsive |

**Performance monitoring:** Check browser console for warnings if parsing exceeds targets.

### Accessibility Checklist

- ✅ Keyboard navigation (Tab, Enter, Space, ESC)
- ✅ Screen reader support (ARIA labels, live regions)
- ✅ Focus management (input focus after modal close)
- ✅ Semantic HTML (buttons, forms, headings)
- ✅ Keyboard shortcuts (Enter to submit, ESC to close)
- ✅ Focus trap in modals
- ✅ Color contrast (WCAG AA compliant)

**Screen reader test:** Enable VoiceOver (Mac) or NVDA (Windows) and complete Test Scenario 1 without using mouse.

## License

MIT License - See LICENSE file for details

## Contributing

This is a demonstration project. For improvements, please fork and create a pull request.

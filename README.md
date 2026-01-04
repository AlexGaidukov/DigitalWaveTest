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

## License

MIT License - See LICENSE file for details

## Contributing

This is a demonstration project. For improvements, please fork and create a pull request.

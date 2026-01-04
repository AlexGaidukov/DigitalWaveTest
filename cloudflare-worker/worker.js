/**
 * Cloudflare Worker for DigitalWave Test
 * Proxies requests to OpenAI API, protecting API keys
 */

export default {
  async fetch(request, env, ctx) {
    try {
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

    } catch (error) {
      return createErrorResponse(
        "NETWORK_ERROR",
        "An unexpected error occurred",
        error.message
      );
    }
  }
};

/**
 * Handle CORS preflight requests
 */
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

/**
 * Create standardized error response
 */
function createErrorResponse(code, message, details) {
  return new Response(JSON.stringify({
    success: false,
    error: {
      code: code,
      message: message,
      details: details
    }
  }), {
    status: code === "RATE_LIMIT_EXCEEDED" ? 429 : 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

/**
 * Validate request origin
 */
function validateOrigin(request, env) {
  const origin = request.headers.get('Origin');
  if (!origin) return; // Allow same-origin requests

  const allowedOrigins = env.ALLOWED_ORIGINS.split(',');

  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace('*', '.*');
      return origin.match(new RegExp(`^${pattern}`));
    }
    return origin === allowed;
  });

  if (!isAllowed) {
    throw new Error('INVALID_ORIGIN');
  }
}

/**
 * Handle /api/chat endpoint
 */
async function handleChatAPI(request, env) {
  try {
    // Validate origin
    validateOrigin(request, env);

    // Parse request body
    const body = await request.json();

    if (!body.prompt || typeof body.prompt !== 'string') {
      return createErrorResponse(
        "MISSING_FIELDS",
        "Request must contain a 'prompt' field",
        "Required field: prompt (string)"
      );
    }

    // Validate prompt length
    const MAX_PROMPT_LENGTH = 10000;
    if (body.prompt.length > MAX_PROMPT_LENGTH) {
      return createErrorResponse(
        "MISSING_FIELDS",
        `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`,
        `Provided: ${body.prompt.length} characters`
      );
    }

    // Call OpenAI API
    const response = await callOpenAIAPI(
      [{ role: 'user', content: body.prompt }],
      "You are a helpful assistant. Respond to user prompts naturally.",
      env,
      10000, // 10 second timeout
      null,  // No JSON format required for chat
      1000   // Chat endpoint needs fewer tokens
    );

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        message: response.choices[0].message.content
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    if (error.message === 'INVALID_ORIGIN') {
      return createErrorResponse(
        "INVALID_ORIGIN",
        "Request from unauthorized domain",
        "Origin not in ALLOWED_ORIGINS"
      );
    }
    return handleOpenAIError(error);
  }
}

/**
 * Handle /api/improve endpoint
 */
async function handleImprovementAPI(request, env) {
  try {
    // Validate request method
    if (request.method !== "POST") {
      return createErrorResponse(
        "INVALID_METHOD",
        "Only POST requests allowed",
        "Expected POST"
      );
    }

    // Validate origin
    validateOrigin(request, env);

    // Parse request body
    const body = await request.json();

    if (!body.originalPrompt || typeof body.originalPrompt !== 'string') {
      return createErrorResponse(
        "MISSING_FIELDS",
        "originalPrompt is required",
        "Field: originalPrompt"
      );
    }

    if (!body.userFeedback || typeof body.userFeedback !== 'string') {
      return createErrorResponse(
        "MISSING_FIELDS",
        "userFeedback is required",
        "Field: userFeedback"
      );
    }

    // Define enhancement system prompt
    const IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt engineering expert specializing in the Rules/Task/Examples (R/T/E) framework. Analyze the user's original prompt and restructure it into a systematic format that produces better AI results.

**R/T/E Framework:**
- **Rules**: Constraints, guidelines, and requirements that guide the AI's output
- **Task**: Clear, specific instruction of what to generate
- **Examples**: Sample outputs, reference points, or style guides that anchor understanding

**Analysis Process:**
1. Identify the user's core intent and goal
2. Detect missing or unclear components:
   - No constraints or guidelines (missing Rules)
   - Vague or unclear objective (missing Task)
   - No reference points or style guidance (missing Examples)
3. Identify common prompt mistakes:
   - Overly vague language ("give me stuff")
   - Missing context (who, what, where, why)
   - No constraints or boundaries
   - Assumes AI knows unstated requirements
4. Extract user feedback to understand what went wrong

**Sentence Parsing for Mapping:**
- Split the original prompt into sentences using period (.) as delimiter
- Preserve exact original sentence text for the mapping array
- Each sentence can map to one or more improved sections (Rules, Task, or Examples)
- Example: "red can, fruit images" might map to Rules (color constraint) AND Task (product description)
- **Edge Cases - DO NOT split on periods in:**
  - Common abbreviations: Mr., Mrs., Ms., Dr., Prof., Sr., Jr., Capt., Lt., Gen., Sen., Rep., Gov., etc.
  - Titles: St. (Saint), Mt. (Mount)
  - Measurements: 3.14, 2.5, 0.99
  - Websites: example.com, site.org
  - Latin abbreviations: etc., e.g., i.e., vs., et al.
  - Time: a.m., p.m., A.M., P.M.
- Only split on periods that mark sentence boundaries (followed by space and capital letter, or end of string)

**Restructuring Guidelines:**
- **Rules Section**: Add constraints from user feedback and inferred requirements
  - Examples: "Premium positioning", "Family-friendly", "Ocean-safe ingredients"
  - Include tone, style, format, and boundary constraints
- **Task Section**: Create clear, specific action instruction
  - Bad: "Generate names"
  - Good: "Generate 10 creative product names for a premium sunscreen brand"
  - Include: quantity, type of output, target audience, context
- **Examples Section**: Add reference points that anchor the AI's understanding
  - Reference successful similar outputs
  - Provide style guidance or competitive examples
  - Give the AI a concrete target to aim for

**One-to-Many Mapping:**
- Each original sentence in the mapping array can map to MULTIPLE improved sections
- Example mapping structure:
  {
    "originalSentence": "red can, summer vibes",
    "improvedSections": ["Rules", "Task"]
  }
- This shows how one part of the user's input influenced multiple sections

**Explanation Generation:**
- Create a tooltip for EACH of the three sections (Rules, Task, Examples)
- Use supportive coach tone: "This helps the AI understand..."
- Explain WHY the section matters for better results
- Keep explanations concise (2-3 sentences max)
- Avoid technical jargon
- Make it actionable and educational

**Response Format (JSON):**
Return valid JSON with this exact structure:
{
  "improvedPrompt": "Rules: [constraints]\\n\\nTask: [clear instruction]\\n\\nExamples: [references]",
  "mapping": [
    {
      "originalSentence": "[exact text from original prompt]",
      "improvedSections": ["Rules", "Task", "Examples"]
    }
  ],
  "explanations": [
    {
      "section": "Rules",
      "tooltip": "Rules establish constraints that guide the AI's creative direction and ensure alignment with your requirements."
    },
    {
      "section": "Task",
      "tooltip": "A clear task definition tells the AI exactly what to generate, eliminating ambiguity and improving output quality."
    },
    {
      "section": "Examples",
      "tooltip": "Examples anchor the AI's understanding of your desired style, giving it a concrete reference point for the output."
    }
  ]
}

**Quality Checks:**
- improvedPrompt must be a non-empty string with clear R/T/E structure
- mapping must be an array with at least one item
- Every original sentence must be included in mapping
- Each mapping item must have originalSentence (string) and improvedSections (array of strings)
- explanations must be an array with exactly 3 items (one per section)
- Each explanation must have section (string) and tooltip (string)
- Tooltips must be 2-3 sentences, supportive tone, non-technical

**User Feedback Integration:**
- Incorporate specific feedback to address identified issues
- If user says "too generic", add specific constraints to Rules
- If user says "not clear what I want", clarify the Task
- If user says "style is wrong", add Examples showing desired style

**Preserve User Intent:**
- Don't change the user's goal, only structure it better
- Add helpful structure without altering core meaning
- Enhance clarity while maintaining original purpose

Now analyze the user's original prompt and feedback, then return the improved version in the specified JSON format.`;

    // Build user message with original prompt and feedback
    const userMessage = `Original: "${body.originalPrompt}"\nFeedback: "${body.userFeedback}"\nRestructure using R/T/E framework.`;

    // Track analysis start time for performance measurement (Task 14.2)
    const analysisStartTime = Date.now();

    // Call OpenAI API with JSON response format
    const response = await callOpenAIAPI(
      [{ role: 'user', content: userMessage }],
      IMPROVEMENT_SYSTEM_PROMPT,
      env,
      15000, // 15 second timeout (NFR-P4)
      { type: "json_object" },
      1500   // Improve endpoint needs more tokens for comprehensive analysis
    );

    // Log analysis duration for performance monitoring
    const analysisDuration = Date.now() - analysisStartTime;
    console.log(`Prompt analysis completed in ${analysisDuration}ms`);

    // Parse JSON response from OpenAI
    let improvementData;
    try {
      improvementData = JSON.parse(response.choices[0].message.content);
    } catch (parseError) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Invalid JSON from AI",
        "Parse error"
      );
    }

    // ENHANCED: Validate response structure thoroughly
    if (!improvementData.improvedPrompt || typeof improvementData.improvedPrompt !== 'string' || improvementData.improvedPrompt.trim().length === 0) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Missing or invalid improvedPrompt",
        "Expected non-empty string"
      );
    }

    if (!improvementData.mapping || !Array.isArray(improvementData.mapping)) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Missing or invalid mapping",
        "Expected array"
      );
    }

    if (improvementData.mapping.length === 0) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Empty mapping array",
        "Expected at least one mapping"
      );
    }

    // Validate each mapping item
    for (const item of improvementData.mapping) {
      if (!item.originalSentence || typeof item.originalSentence !== 'string') {
        return createErrorResponse(
          "INVALID_RESPONSE",
          "Invalid mapping item missing originalSentence",
          "Mapping validation failed"
        );
      }
      if (!item.improvedSections || !Array.isArray(item.improvedSections)) {
        return createErrorResponse(
          "INVALID_RESPONSE",
          "Invalid mapping item missing improvedSections",
          "Mapping validation failed"
        );
      }
    }

    if (!improvementData.explanations || !Array.isArray(improvementData.explanations)) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Missing or invalid explanations",
        "Expected array"
      );
    }

    if (improvementData.explanations.length !== 3) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Invalid explanations length",
        "Expected exactly 3 explanations (Rules, Task, Examples)"
      );
    }

    // Validate each explanation
    const requiredSections = ['Rules', 'Task', 'Examples'];
    for (const explanation of improvementData.explanations) {
      if (!explanation.section || typeof explanation.section !== 'string' || explanation.section.trim().length === 0) {
        return createErrorResponse(
          "INVALID_RESPONSE",
          "Invalid explanation missing section",
          "Explanation validation failed"
        );
      }
      if (!explanation.tooltip || typeof explanation.tooltip !== 'string' || explanation.tooltip.trim().length === 0) {
        return createErrorResponse(
          "INVALID_RESPONSE",
          "Invalid explanation missing tooltip",
          "Explanation validation failed"
        );
      }
    }

    // Verify all three sections are present
    const actualSections = improvementData.explanations.map(e => e.section);
    for (const required of requiredSections) {
      if (!actualSections.includes(required)) {
        return createErrorResponse(
          "INVALID_RESPONSE",
          `Missing explanation for ${required} section`,
          `Sections found: ${actualSections.join(', ')}`
        );
      }
    }

    // Return success response
    return new Response(JSON.stringify({
      success: true,
      data: {
        improvedPrompt: improvementData.improvedPrompt,
        mapping: improvementData.mapping,
        explanations: improvementData.explanations
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    if (error.message === 'INVALID_ORIGIN') {
      return createErrorResponse(
        "INVALID_ORIGIN",
        "Request from unauthorized domain",
        `Origin: ${request.headers.get('Origin')}`
      );
    }
    return handleOpenAIError(error);
  }
}

/**
 * Call OpenAI API
 */
async function callOpenAIAPI(messages, systemPrompt, env, timeout, responseFormat = null, maxTokens = 1500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: maxTokens  // Configurable per endpoint
    };

    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      } else if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.code || 'OPENAI_API_ERROR');
      }
    }

    return response.json();

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('API_TIMEOUT');
    }
    throw error;
  }
}

/**
 * Handle OpenAI API errors
 */
function handleOpenAIError(error) {
  const errorMap = {
    'INVALID_ORIGIN': {
      code: 'INVALID_ORIGIN',
      message: 'Request from unauthorized domain',
      details: 'Origin not in ALLOWED_ORIGINS'
    },
    'RATE_LIMIT_EXCEEDED': {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'OpenAI API rate limit exceeded',
      details: 'Please try again later'
    },
    'INVALID_API_KEY': {
      code: 'INVALID_API_KEY',
      message: 'Invalid API key configuration',
      details: 'Service configuration error'
    },
    'API_TIMEOUT': {
      code: 'API_TIMEOUT',
      message: 'Request timed out',
      details: 'OpenAI API took too long to respond'
    },
    'OPENAI_API_ERROR': {
      code: 'OPENAI_API_ERROR',
      message: 'OpenAI API returned an error',
      details: error.message || 'Unknown error'
    },
    'NETWORK_ERROR': {
      code: 'NETWORK_ERROR',
      message: 'Network connection failed',
      details: error.message || 'Connection error'
    }
  };

  const errorInfo = errorMap[error.message] || errorMap['NETWORK_ERROR'];
  return createErrorResponse(errorInfo.code, errorInfo.message, errorInfo.details);
}

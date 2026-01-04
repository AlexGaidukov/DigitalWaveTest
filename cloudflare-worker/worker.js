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
      10000 // 10 second timeout
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

    // Define improvement system prompt (matches IMPROVEMENT_SYSTEM_PROMPT from client)
    const IMPROVEMENT_SYSTEM_PROMPT = `You are a prompt engineering expert. Analyze the user's original prompt and restructure it using the Rules/Task/Examples framework.

Rules: Constraints and guidelines the AI should follow
Task: Clear, specific instruction of what to generate
Examples: Sample outputs showing desired style

Return JSON with:
- improvedPrompt: restructured version
- mapping: array of {originalSentence, improvedSections: []}
- explanations: array of {section, tooltip}`;

    // Build user message with original prompt and feedback
    const userMessage = `Original: "${body.originalPrompt}"\nFeedback: "${body.userFeedback}"\nRestructure using R/T/E framework.`;

    // Call OpenAI API with JSON response format
    const response = await callOpenAIAPI(
      [{ role: 'user', content: userMessage }],
      IMPROVEMENT_SYSTEM_PROMPT,
      env,
      15000, // 15 second timeout (NFR-P4)
      { type: "json_object" }
    );

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

    // Validate response structure
    if (!improvementData.improvedPrompt || !improvementData.mapping || !improvementData.explanations) {
      return createErrorResponse(
        "INVALID_RESPONSE",
        "Missing required fields",
        "Incomplete response"
      );
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
async function callOpenAIAPI(messages, systemPrompt, env, timeout, responseFormat = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
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

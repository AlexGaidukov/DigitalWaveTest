// ============================================================
// UTILITY FUNCTIONS
// ============================================================

// parseImprovedPrompt - Parse improved prompt to extract R/T/E section highlights (Story 4.2)
// Returns array of highlight objects for HighlightedText component
// Each highlight object: { text, type, startIndex, endIndex }
// Type can be: 'addition' (section headers), 'enhancement' (section content)
// Story 4.2 Performance: Measures parsing time to verify <200ms target (NFR-P6)
const parseImprovedPrompt = (improvedPrompt) => {
  const startTime = performance.now();

  if (!improvedPrompt || typeof improvedPrompt !== 'string') {
    return [];
  }

  const highlights = [];
  const sections = [
    { name: 'Rules', pattern: /Rules:/i },
    { name: 'Task', pattern: /Task:/i },
    { name: 'Examples', pattern: /Examples:/i }
  ];

  sections.forEach(section => {
    const match = improvedPrompt.match(section.pattern);
    if (match) {
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;

      // Highlight section header (e.g., "Rules:")
      highlights.push({
        text: match[0],
        type: 'addition',
        startIndex: startIndex,
        endIndex: endIndex
      });

      // Find the end of this section (start of next section or end of string)
      let sectionEnd = improvedPrompt.length;
      for (let nextSection of sections) {
        if (nextSection.name !== section.name) {
          const nextMatch = improvedPrompt.match(nextSection.pattern);
          if (nextMatch && nextMatch.index > endIndex) {
            sectionEnd = nextMatch.index;
            break;
          }
        }
      }

      // Highlight section content (after header until next section)
      if (sectionEnd > endIndex) {
        // Find the actual end of content (skip trailing whitespace) for highlighting
        const contentEnd = improvedPrompt.substring(endIndex, sectionEnd).trimEnd().length + endIndex;

        // Keep original text for display (includes newlines between sections)
        highlights.push({
          text: improvedPrompt.substring(endIndex, sectionEnd),
          type: 'enhancement',
          startIndex: endIndex,
          endIndex: contentEnd
        });
      }
    }
  });

  const endTime = performance.now();
  const parsingTime = endTime - startTime;

  // Log performance in development (verify <200ms target per NFR-P6)
  if (parsingTime > 50) {
    console.warn(`parseImprovedPrompt took ${parsingTime.toFixed(2)}ms (target: <200ms)`);
  }

  // CRITICAL: Sort highlights by startIndex to ensure correct rendering order
  // Without sorting, highlights are in detection order (Rules, Task, Examples)
  // but need to be in text position order for proper segment creation
  return highlights.sort((a, b) => a.startIndex - b.startIndex);
};

// Error formatting utility - maps technical errors to user-friendly messages
// Returns error object: { message, code, details }
// Enhanced for Story 5.4: Comprehensive error handling
function formatError(error) {
  // Extract error code and message from various error types
  let errorCode = 'UNKNOWN';
  let errorMessage = 'Something went wrong. Please try again.';
  let errorDetails = '';

  if (error && typeof error === 'object') {
    // Handle Error objects with code property
    if (error.code) {
      errorCode = error.code;
      errorMessage = error.message || errorMessage;
      errorDetails = error.details || '';
    }
    // Handle fetch Response errors
    else if (error.status) {
      errorCode = getStatusErrorCode(error.status);
      errorMessage = getErrorMessageForStatus(error.status);
      errorDetails = error.statusText || '';
    }
    // Handle standard Error objects
    else if (error.message) {
      // Check for TypeError from fetch (likely CORS or worker unavailable)
      if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
        errorCode = 'WORKER_UNAVAILABLE';
        errorMessage = 'Service temporarily unavailable. Please try again.';
      }
      // Parse error message for known patterns
      else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        errorCode = 'API_TIMEOUT';
        errorMessage = 'The request took too long. Please try again.';
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorCode = 'NETWORK_ERROR';
        errorMessage = 'Connection issue. Please check your internet and try again.';
      } else if (error.message.includes('rate limit') || error.message.includes('429')) {
        errorCode = 'RATE_LIMIT_EXCEEDED';
        errorMessage = 'We\'re experiencing high demand. Please wait a moment and try again.';
      }
      errorDetails = error.message;
    }
  } else if (typeof error === 'string') {
    // Handle string errors (legacy, shouldn't happen)
    errorMessage = error;
    errorDetails = error;
  }

  // Error code to message mapping
  const errorMessages = {
    'API_TIMEOUT': 'The request took too long. Please try again.',
    'RATE_LIMIT_EXCEEDED': 'We\'re experiencing high demand. Please wait a moment and try again.',
    'AUTHENTICATION_FAILED': 'Service configuration error. Please contact support.',
    'NETWORK_ERROR': 'Connection issue. Please check your internet and try again.',
    'WORKER_UNAVAILABLE': 'Service temporarily unavailable. Please try again.',
    'INVALID_RESPONSE': 'The AI returned an invalid response. Please try again.',
    'MISSING_FIELDS': 'Required information is missing. Please check your input and try again.',
    'UNKNOWN': 'Something went wrong. Please try again.'
  };

  // Get user-friendly message for error code
  const userMessage = errorMessages[errorCode] || errorMessages.UNKNOWN;

  return {
    code: errorCode,
    message: userMessage,
    details: errorDetails
  };
}

// Helper: Map HTTP status to error code
function getStatusErrorCode(status) {
  const statusMap = {
    401: 'AUTHENTICATION_FAILED',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'WORKER_UNAVAILABLE',
    502: 'WORKER_UNAVAILABLE',
    503: 'WORKER_UNAVAILABLE',
    504: 'API_TIMEOUT'
  };
  return statusMap[status] || 'UNKNOWN';
}

// Helper: Get message for HTTP status
function getErrorMessageForStatus(status) {
  const messages = {
    401: 'Service configuration error. Please contact support.',
    429: 'We\'re experiencing high demand. Please wait a moment and try again.',
    500: 'Service temporarily unavailable. Please try again.',
    502: 'Service temporarily unavailable. Please try again.',
    503: 'Service temporarily unavailable. Please try again.',
    504: 'The request took too long. Please try again.'
  };
  return messages[status] || 'Something went wrong. Please try again.';
}

// Chat API integration - calls Cloudflare Worker proxy
// Returns: Promise with AI response message
// Throws: Formatted error object with code and message
async function callChatAPI(userPrompt) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT);

    const response = await fetch(`${WORKER_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'API call failed');
    }

    return result.data.message;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw formatError({ code: 'API_TIMEOUT' });
    }
    throw formatError(error);
  }
}

// Improvement API integration - calls Cloudflare Worker proxy for prompt enhancement
// Returns: Promise with { improvedPrompt, mapping, explanations }
// Throws: Formatted error object with code and message
async function generateImprovement(originalPrompt, userFeedback) {
  // Validate inputs
  if (!originalPrompt || typeof originalPrompt !== 'string' || originalPrompt.trim() === '') {
    throw formatError({ code: 'MISSING_FIELDS', message: 'Original prompt is required' });
  }

  if (!userFeedback || typeof userFeedback !== 'string' || userFeedback.trim() === '') {
    throw formatError({ code: 'MISSING_FIELDS', message: 'User feedback is required' });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), IMPROVEMENT_TIMEOUT);

    const response = await fetch(`${WORKER_URL}/api/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        originalPrompt: originalPrompt.trim(),
        userFeedback: userFeedback.trim()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error?.message || 'Unknown error');
    }

    // Parse and validate response using parseImprovementResponse utility
    const improvementData = parseImprovementResponse(result);

    return improvementData;

  } catch (error) {
    // Format error for user-friendly display
    if (error.name === 'AbortError') {
      throw formatError({ code: 'API_TIMEOUT', message: 'Request timeout' });
    }

    if (error.message.includes('fetch') || error.message.includes('Network')) {
      throw formatError({ code: 'NETWORK_ERROR', message: error.message });
    }

    // Handle parseImprovementResponse errors
    if (error.message && error.message.includes('INVALID_RESPONSE')) {
      throw formatError({ code: 'INVALID_RESPONSE', message: error.message });
    }

    // Re-throw formatted errors
    throw error;
  }
}

// Response parsing utility - validates and parses improvement API response
// Returns: { improvedPrompt, mapping, explanations }
// Throws: Error with code 'INVALID_RESPONSE' if validation fails
function parseImprovementResponse(apiResponse) {
  // Extract data from Worker response
  const { success, data, error } = apiResponse;

  // Check for Worker error
  if (!success || error) {
    throw new Error(error?.code || 'WORKER_UNAVAILABLE');
  }

  // Validate improvedPrompt
  if (!data.improvedPrompt || typeof data.improvedPrompt !== 'string') {
    throw new Error('INVALID_RESPONSE: Missing or invalid improvedPrompt');
  }

  if (data.improvedPrompt.trim().length === 0) {
    throw new Error('INVALID_RESPONSE: improvedPrompt is empty');
  }

  // Validate mapping
  if (!data.mapping || !Array.isArray(data.mapping)) {
    throw new Error('INVALID_RESPONSE: Missing or invalid mapping');
  }

  if (data.mapping.length === 0) {
    throw new Error('INVALID_RESPONSE: mapping array is empty');
  }

  // Validate each mapping item
  for (let i = 0; i < data.mapping.length; i++) {
    const item = data.mapping[i];

    if (!item.originalSentence || typeof item.originalSentence !== 'string') {
      throw new Error(`INVALID_RESPONSE: mapping[${i}] missing originalSentence`);
    }

    if (!item.improvedSections || !Array.isArray(item.improvedSections)) {
      throw new Error(`INVALID_RESPONSE: mapping[${i}] missing improvedSections`);
    }

    if (item.improvedSections.length === 0) {
      throw new Error(`INVALID_RESPONSE: mapping[${i}].improvedSections is empty`);
    }
  }

  // Validate explanations
  if (!data.explanations || !Array.isArray(data.explanations)) {
    throw new Error('INVALID_RESPONSE: Missing or invalid explanations');
  }

  if (data.explanations.length !== 3) {
    throw new Error('INVALID_RESPONSE: Expected exactly 3 explanations (Rules, Task, Examples)');
  }

  // Validate each explanation
  const requiredSections = ['Rules', 'Task', 'Examples'];
  const foundSections = [];

  for (let i = 0; i < data.explanations.length; i++) {
    const explanation = data.explanations[i];

    if (!explanation.section || typeof explanation.section !== 'string') {
      throw new Error(`INVALID_RESPONSE: explanations[${i}] missing section`);
    }

    if (!explanation.tooltip || typeof explanation.tooltip !== 'string') {
      throw new Error(`INVALID_RESPONSE: explanations[${i}] missing tooltip`);
    }

    if (explanation.tooltip.trim().length === 0) {
      throw new Error(`INVALID_RESPONSE: explanations[${i}].tooltip is empty`);
    }

    foundSections.push(explanation.section);
  }

  // Verify all required sections are present
  for (const required of requiredSections) {
    if (!foundSections.includes(required)) {
      throw new Error(`INVALID_RESPONSE: Missing explanation for ${required} section`);
    }
  }

  // Return validated data
  return {
    improvedPrompt: data.improvedPrompt,
    mapping: data.mapping,
    explanations: data.explanations
  };
}

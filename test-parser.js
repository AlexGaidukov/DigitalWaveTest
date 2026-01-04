// Test script for parseImprovementResponse function
// Run this in browser console after loading index.html

console.log('=== Testing parseImprovementResponse ===\n');

// Test 1: Valid response
console.log('Test 1: Valid response');
const validResponse = {
  success: true,
  data: {
    improvedPrompt: "Rules: premium positioning\n\nTask: Generate 10 names\n\nExamples: SunSplash",
    mapping: [
      { originalSentence: "red can", improvedSections: ["Rules", "Task"] }
    ],
    explanations: [
      { section: "Rules", tooltip: "Rules establish constraints..." },
      { section: "Task", tooltip: "Clear task definition..." },
      { section: "Examples", tooltip: "Examples anchor understanding..." }
    ]
  }
};

try {
  const result = parseImprovementResponse(validResponse);
  console.log('✅ PASS: Valid response parsed successfully');
  console.log('Result:', result);
} catch (error) {
  console.log('❌ FAIL:', error.message);
}

// Test 2: Missing improvedPrompt
console.log('\nTest 2: Missing improvedPrompt');
const invalidResponse1 = {
  success: true,
  data: { mapping: [], explanations: [] }
};

try {
  const result = parseImprovementResponse(invalidResponse1);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 3: Empty improvedPrompt
console.log('\nTest 3: Empty improvedPrompt');
const invalidResponse2 = {
  success: true,
  data: { improvedPrompt: "   ", mapping: [], explanations: [] }
};

try {
  const result = parseImprovementResponse(invalidResponse2);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 4: Invalid mapping (not an array)
console.log('\nTest 4: Invalid mapping (not an array)');
const invalidResponse3 = {
  success: true,
  data: {
    improvedPrompt: "valid",
    mapping: "not an array",
    explanations: []
  }
};

try {
  const result = parseImprovementResponse(invalidResponse3);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 5: Empty mapping array
console.log('\nTest 5: Empty mapping array');
const invalidResponse4 = {
  success: true,
  data: {
    improvedPrompt: "valid",
    mapping: [],
    explanations: []
  }
};

try {
  const result = parseImprovementResponse(invalidResponse4);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 6: Invalid mapping item (missing originalSentence)
console.log('\nTest 6: Invalid mapping item (missing originalSentence)');
const invalidResponse5 = {
  success: true,
  data: {
    improvedPrompt: "valid",
    mapping: [{ improvedSections: ["Rules"] }],
    explanations: []
  }
};

try {
  const result = parseImprovementResponse(invalidResponse5);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 7: Invalid mapping item (missing improvedSections)
console.log('\nTest 7: Invalid mapping item (missing improvedSections)');
const invalidResponse6 = {
  success: true,
  data: {
    improvedPrompt: "valid",
    mapping: [{ originalSentence: "test" }],
    explanations: []
  }
};

try {
  const result = parseImprovementResponse(invalidResponse6);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 8: Invalid explanations (wrong count)
console.log('\nTest 8: Invalid explanations (wrong count)');
const invalidResponse7 = {
  success: true,
  data: {
    improvedPrompt: "valid",
    mapping: [{ originalSentence: "test", improvedSections: ["Rules"] }],
    explanations: [
      { section: "Rules", tooltip: "test" },
      { section: "Task", tooltip: "test" }
    ]
  }
};

try {
  const result = parseImprovementResponse(invalidResponse7);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('INVALID_RESPONSE')) {
    console.log('✅ PASS: Correctly threw INVALID_RESPONSE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

// Test 9: Missing explanation section
console.log('\nTest 9: Missing explanation section');
const invalidResponse8 = {
  success: true,
  data: {
    improvedPrompt: "valid",
    mapping: [{ originalSentence: "test", improvedSections: ["Rules"] }],
    explanations: [
      { section: "Rules", tooltip: "test" },
      { section: "Task", tooltip: "test" },
      { section: "Examples", tooltip: "test" }
    ]
  }
};

try {
  const result = parseImprovementResponse(invalidResponse8);
  console.log('✅ PASS: All required sections present');
} catch (error) {
  console.log('❌ FAIL:', error.message);
}

// Test 10: Worker error response
console.log('\nTest 10: Worker error response');
const workerErrorResponse = {
  success: false,
  error: { code: 'WORKER_UNAVAILABLE', message: 'Worker error' }
};

try {
  const result = parseImprovementResponse(workerErrorResponse);
  console.log('❌ FAIL: Should have thrown error');
} catch (error) {
  if (error.message.includes('WORKER_UNAVAILABLE')) {
    console.log('✅ PASS: Correctly threw WORKER_UNAVAILABLE error');
    console.log('Error:', error.message);
  } else {
    console.log('❌ FAIL: Wrong error:', error.message);
  }
}

console.log('\n=== All tests completed ===');

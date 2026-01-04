# Story 2.2: Feedback Modal Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## File List

**Modified Files:**
- index.html
  - Added FeedbackModal CSS styling (lines 287-394)
  - Added FeedbackModal component in SECTION 4 (lines 846-944) - with React.memo wrapper
  - Updated App component in SECTION 6 to render FeedbackModal (lines 1036-1058)
  - Code review fixes: ESC key dependencies, ARIA attributes, modal background color (#ffffff)

## Change Log

- 2026-01-04: Story 2.2 implementation complete - FeedbackModal component with psychological safety language, auto-focus, and 3 close methods (Cancel, overlay, ESC)
- 2026-01-04: Code review fixes applied - ESC key handler dependencies, ARIA accessibility, React.memo optimization, modal background color corrected to #ffffff

## Story

As a user,
I want to see a modal dialog where I can explain what I didn't like,
So that I can provide context about my dissatisfaction in a psychologically safe environment.

## Acceptance Criteria

**Given** the "Not Satisfied" button was clicked (from Story 2.1),
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

## Tasks / Subtasks

- [x] Task 1: Create FeedbackModal component structure (AC: Modal structure)
  - [x] 1.1: Define FeedbackModal as Layout component in SECTION 4
  - [x] 1.2: Add modal overlay with semi-transparent backdrop
  - [x] 1.3: Add modal container with centered positioning
  - [x] 1.4: Add modal header with empowerment language title
  - [x] 1.5: Add modal body with textarea element
  - [x] 1.6: Add modal footer with two buttons

- [x] Task 2: Style modal with BEM-lite CSS classes (AC: Modal structure)
  - [x] 2.1: Add `.feedback-modal__overlay` with semi-transparent background
  - [x] 2.2: Add `.feedback-modal` with centered box layout
  - [x] 2.3: Add `.feedback-modal__header` with generous whitespace
  - [x] 2.4: Add `.feedback-modal__body` with proper padding
  - [x] 2.5: Add `.feedback-modal__footer` with button layout

- [x] Task 3: Implement textarea input component (AC: Text area input)
  - [x] 3.1: Add textarea element with placeholder text
  - [x] 3.2: Set placeholder: "What didn't you like about this result?"
  - [x] 3.3: Apply BEM-lite class: `.feedback-modal__textarea`
  - [x] 3.4: Set minimum rows: 3
  - [x] 3.5: Set maximum characters: 500
  - [x] 3.6: Implement auto-focus when modal opens using useRef and useEffect

- [x] Task 4: Implement textarea local state (AC: Modal state management)
  - [x] 4.1: Add local state: `const [feedbackText, setFeedbackText] = React.useState('')`
  - [x] 4.2: Bind textarea value to feedbackText state
  - [x] 4.3: Update state on textarea change: `onChange={(e) => setFeedbackText(e.target.value)}`
  - [x] 4.4: Clear feedbackText state when modal closes

- [x] Task 5: Implement modal close behavior (AC: Modal close behavior)
  - [x] 5.1: Create `handleClose` function
  - [x] 5.2: Call `onClose()` callback prop
  - [x] 5.3: Clear feedbackText state
  - [x] 5.4: Set `isFeedbackModalOpen = false` via context

- [x] Task 6: Implement overlay click to close (AC: Modal close behavior)
  - [x] 6.1: Add onClick handler to overlay element
  - [x] 6.2: Close modal when overlay clicked
  - [x] 6.3: Prevent close when modal container clicked (event.stopPropagation())

- [x] Task 7: Implement ESC key to close (AC: Modal close behavior)
  - [x] 7.1: Add useEffect hook for ESC key listener
  - [x] 7.2: Listen for 'keydown' events
  - [x] 7.3: Check if event.key === 'Escape'
  - [x] 7.4: Call handleClose when ESC pressed
  - [x] 7.5: Cleanup event listener on component unmount

- [x] Task 8: Implement Cancel button (AC: Modal structure)
  - [x] 8.1: Add Cancel button in modal footer
  - [x] 8.2: Button text: "Cancel"
  - [x] 8.3: Button calls handleClose on click
  - [x] 8.4: Apply secondary button styling

- [x] Task 9: Implement "Generate Improved Prompt" button (AC: Modal structure)
  - [x] 9.1: Add primary button in modal footer
  - [x] 9.2: Button text: "Generate Improved Prompt"
  - [x] 9.3: Button passes feedbackText to onSubmit callback
  - [x] 9.4: Apply primary button styling
  - [x] 9.5: Note: Actual improvement generation in Story 2.3

- [x] Task 10: Add FeedbackModal to App component (AC: Modal state management)
  - [x] 10.1: Import FeedbackModal component in App
  - [x] 10.2: Conditionally render based on `isFeedbackModalOpen` from context
  - [x] 10.3: Pass `onClose` callback to FeedbackModal
  - [x] 10.4: Pass `onSubmit` callback to FeedbackModal (will implement in Story 2.3)

- [x] Task 11: Test modal behavior and state management (AC: All)
  - [x] 11.1: Verify modal opens when "Not Satisfied" button clicked
  - [x] 11.2: Verify textarea is auto-focused when modal opens
  - [x] 11.3: Verify clicking overlay closes modal and clears text
  - [x] 11.4: Verify clicking Cancel closes modal and clears text
  - [x] 11.5: Verify pressing ESC closes modal and clears text
  - [x] 11.6: Verify modal doesn't close when clicking modal container
  - [x] 11.7: Verify feedback text stored in local state (not context)
  - [x] 11.8: Verify psychological safety language (non-blaming, empowering)

## Dev Notes

### Architecture Compliance

This story implements the FeedbackModal component, following all architecture patterns from Epic 1 and Story 2.1.

**CRITICAL: Component Definition Order MUST BE FOLLOWED**

From Architecture.md and project-context.md:
- Define LEAF components first (Button, existing components)
- Then COMPOSITE components (existing MessageList, etc.)
- Then LAYOUT components (FeedbackModal - NEW)
- Updates to existing components must maintain order

Violation of this order causes `ReferenceError: X is not defined` errors.

**7-Section Structure (MUST FOLLOW):**
```
SECTION 1: CONSTANTS & CONFIGURATION
SECTION 2: UTILITY FUNCTIONS
SECTION 3: CUSTOM HOOKS
SECTION 4: REACT COMPONENTS (Leaf → Composite → Layout)
SECTION 5: CONTEXT PROVIDER
SECTION 6: MAIN APP COMPONENT
SECTION 7: RENDER
```

**This story modifies:**
- SECTION 4 (REACT COMPONENTS): Add FeedbackModal component (Layout)
- SECTION 6 (MAIN APP COMPONENT): Render FeedbackModal conditionally
- `<style>` tag in `<head>`: Add modal CSS styling

### Technical Requirements

**FeedbackModal Component (Layout Component):**

```javascript
// FeedbackModal - Layout component (NEW in SECTION 4)
const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  const [feedbackText, setFeedbackText] = React.useState('');
  const textareaRef = React.useRef(null);

  // Auto-focus textarea when modal opens
  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // ESC key handler
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const handleClose = () => {
    setFeedbackText(''); // Clear feedback text
    onClose(); // Call parent callback
  };

  const handleSubmit = () => {
    if (feedbackText.trim()) {
      onSubmit(feedbackText); // Pass feedback to parent
      handleClose(); // Close modal and clear text
    }
  };

  const handleOverlayClick = (event) => {
    // Close only if overlay is clicked, not modal container
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal__overlay" onClick={handleOverlayClick}>
      <div className="feedback-modal">
        {/* Header */}
        <div className="feedback-modal__header">
          <h2>Let's improve this result</h2>
        </div>

        {/* Body */}
        <div className="feedback-modal__body">
          <textarea
            ref={textareaRef}
            className="feedback-modal__textarea"
            placeholder="What didn't you like about this result?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
            maxLength={500}
          />
        </div>

        {/* Footer */}
        <div className="feedback-modal__footer">
          <button
            className="feedback-modal__cancel-button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="feedback-modal__submit-button"
            onClick={handleSubmit}
            disabled={!feedbackText.trim()}
          >
            Generate Improved Prompt
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Props Pattern:**
- `isOpen` - Boolean flag to show/hide modal (from context)
- `onClose` - Callback function when modal closes
- `onSubmit` - Callback function when user submits feedback (will be used in Story 2.3)

**App Component Updates (SECTION 6):**

```javascript
const App = () => {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen } = useAppContext();

  const handleFeedbackClose = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackSubmit = (feedbackText) => {
    // Story 2.3 will implement this
    console.log('Feedback submitted:', feedbackText);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <ChatInterface />

        {/* Feedback Modal */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={handleFeedbackClose}
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    </ErrorBoundary>
  );
};
```

**BEM-lite CSS Naming (CRITICAL):**

All CSS classes MUST follow BEM-lite convention: `block-element--modifier`

```css
/* Modal Overlay - Semi-transparent backdrop */
.feedback-modal__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Modal Container - Centered box */
.feedback-modal {
  background-color: var(--color-background);
  border-radius: calc(var(--border-radius) * 2);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Modal Header */
.feedback-modal__header {
  padding: calc(var(--spacing-unit) * 2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.feedback-modal__header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
  font-weight: 600;
}

/* Modal Body */
.feedback-modal__body {
  padding: calc(var(--spacing-unit) * 2);
}

/* Textarea Input */
.feedback-modal__textarea {
  width: 100%;
  min-height: 100px;
  padding: calc(var(--spacing-unit) * 1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius);
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

.feedback-modal__textarea:focus {
  outline: 2px solid var(--color-primary);
  border-color: transparent;
}

/* Modal Footer */
.feedback-modal__footer {
  padding: calc(var(--spacing-unit) * 2);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: calc(var(--spacing-unit) * 1);
}

/* Cancel Button - Secondary style */
.feedback-modal__cancel-button {
  padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--border-radius);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.feedback-modal__cancel-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Submit Button - Primary style */
.feedback-modal__submit-button {
  padding: calc(var(--spacing-unit) * 0.75) calc(var(--spacing-unit) * 1.5);
  background-color: var(--color-primary);
  border: none;
  color: #ffffff;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
}

.feedback-modal__submit-button:hover:not(:disabled) {
  opacity: 0.9;
}

.feedback-modal__submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Previous Story Intelligence

**From Story 2.1 Implementation (Most Recent):**
- isFeedbackModalOpen state already exists in AppContext
- setIsFeedbackModalOpen function already exists in context
- "Not Satisfied" button already sets isFeedbackModalOpen = true
- recentFeedback state stores userPrompt and aiResponse for Story 2.3
- BEM-lite CSS naming enforced: `.message-bubble__not-satisfied`
- Component definition order maintained: Leaf → Composite → Layout
- Button component exists with disabled state support
- Context state management pattern established with useAppContext hook

**From Story 1.5 Implementation:**
- Validation and error handling complete
- Error object pattern: `{ message, code }` never strings
- ValidationError, ErrorDisplay, RetryButton components exist
- Focus management using useRef and useEffect pattern established

**From Story 1.3 Implementation:**
- ChatInterface component exists (Layout)
- MessageList component exists (Composite)
- MessageBubble component exists (Leaf)
- Auto-scroll pattern using useRef and useEffect

**From Story 1.2 Implementation:**
- AppContext and AppProvider implemented in SECTION 5
- useAppContext() hook exists in SECTION 3
- Context provides isFeedbackModalOpen and setIsFeedbackModalOpen
- State structure is FLAT (not nested)
- Immutable update pattern: setIsFeedbackModalOpen(false)

**Current index.html Structure:**
- SECTION 1: CONSTANTS & CONFIGURATION
- SECTION 2: UTILITY FUNCTIONS (formatError, callChatAPI)
- SECTION 3: CUSTOM HOOKS (useAppContext)
- SECTION 4: REACT COMPONENTS (ErrorBoundary, Button, MessageBubble, MessageList, ChatInput, ChatInterface) - ADD FeedbackModal
- SECTION 5: CONTEXT PROVIDER (AppContext, AppProvider with isFeedbackModalOpen)
- SECTION 6: MAIN APP COMPONENT (App) - ADD FeedbackModal rendering
- SECTION 7: RENDER (ReactDOM.createRoot)

**Key Learnings from Epic 1 and Story 2.1:**
- Component definition order is CRITICAL (hoisting issues)
- BEM-lite CSS naming is REQUIRED for all classes
- All styles go in `<style>` tag in `<head>`
- No external CSS files
- Desktop-only (min-width: 1024px)
- Error object pattern: { message, code } never strings
- State updates via context helpers for consistency
- Conditional rendering with null checks (if (!isOpen) return null)
- Auto-focus pattern using useRef and useEffect
- Event listeners must be cleaned up in useEffect return

### Git Intelligence

**Recent Commits:**
- `ba2ad82 (HEAD -> main, origin/main) chore: Update sprint status - Story 2.1 complete`
- `259e709 feat(story-2.1): Complete "Not Satisfied" button integration with code review fixes`

**Established Patterns:**
- Commit message format: `feat(story-X.X): Description`
- BEM-lite CSS class naming enforced
- Error states as OBJECTS pattern
- Immutable state updates via spread operator or setters
- Component definition order: Leaf → Composite → Layout
- Props flow: Parent → Child via props, Child → Parent via callbacks
- Event handler naming: on{Event} props, handle{Event} implementations
- Boolean flags: is{State} (isFeedbackModalOpen)
- Modal pattern: conditional rendering with `if (!isOpen) return null`
- Event listener cleanup in useEffect return function

**Code Review Patterns from Epic 1 and Story 2.1:**
- Always use try/catch/finally for async operations
- Always clean up event listeners in useEffect return
- Use useRef for DOM element references (auto-focus)
- Use useEffect with dependency arrays for side effects
- Store form input in local component state (not global context)
- Clear form state when modal closes
- Prevent event propagation for nested clickable elements (overlay vs modal)
- Disable buttons when invalid input

### Library & Framework Requirements

| Dependency | Version | Source | Notes |
|------------|---------|--------|-------|
| React | 18.x | unpkg CDN | Use React.useState, React.useEffect, React.useRef for state and refs |
| ReactDOM | 18.x | unpkg CDN | Already loaded |
| Babel Standalone | latest | unpkg CDN | Already loaded for JSX compilation |

**React Hooks Used in This Story:**
- `React.useState()` - Local feedbackText state in FeedbackModal
- `React.useEffect()` - Auto-focus textarea, ESC key listener
- `React.useRef()` - Textarea DOM reference for auto-focus
- `useAppContext()` - Access isFeedbackModalOpen from context

**No New Dependencies:**
This story uses only existing React 18 features and hooks. No additional libraries needed.

### File Structure Requirements

**Single File:** All code in `/Users/alexgaidukov/Projects/DigitalWaveTest/index.html`

**Sections to Modify:**
1. `<style>` tag in `<head>`: Add CSS for FeedbackModal
2. SECTION 4 (REACT COMPONENTS): Add FeedbackModal component after ChatInterface
3. SECTION 6 (MAIN APP COMPONENT): Add FeedbackModal rendering

**SECTION 4 - FeedbackModal Component:**
```javascript
// FeedbackModal - Layout component (NEW)
// Define AFTER ChatInterface, BEFORE SECTION 5
const FeedbackModal = ({ isOpen, onClose, onSubmit }) => {
  // Implementation as shown above
};
```

**SECTION 6 - App Component Updates:**
```javascript
const App = () => {
  const { isFeedbackModalOpen, setIsFeedbackModalOpen } = useAppContext();

  const handleFeedbackClose = () => {
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackSubmit = (feedbackText) => {
    // Story 2.3 will implement actual feedback submission
    console.log('Feedback:', feedbackText);
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <ChatInterface />

        {/* Conditionally render feedback modal */}
        {isFeedbackModalOpen && (
          <FeedbackModal
            isOpen={isFeedbackModalOpen}
            onClose={handleFeedbackClose}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};
```

### Testing Requirements

**Manual Verification Checklist:**
1. Open `index.html` in browser
2. Submit a prompt to generate an AI response
3. Click "Not Satisfied" button
4. Verify feedback modal appears
5. Verify no console errors in DevTools

**Functional Testing:**
1. Test modal opens when "Not Satisfied" clicked:
   - Click "Not Satisfied" button
   - Verify modal overlay covers entire screen
   - Verify modal container centered in viewport
   - Verify textarea is auto-focused (cursor in textarea)

2. Test textarea input:
   - Type feedback text in textarea
   - Verify text appears as typed
   - Verify placeholder disappears when typing
   - Verify maximum 500 characters enforced
   - Verify textarea can be resized vertically

3. Test modal close behavior:
   - Click Cancel button
   - Verify modal closes
   - Verify feedback text is cleared
   - Verify chat interface is visible again

4. Test overlay click to close:
   - Open modal again
   - Click semi-transparent backdrop (overlay)
   - Verify modal closes
   - Click modal container (white box)
   - Verify modal does NOT close

5. Test ESC key to close:
   - Open modal again
   - Press ESC key
   - Verify modal closes
   - Verify feedback text is cleared

6. Test "Generate Improved Prompt" button:
   - Type feedback in textarea
   - Click "Generate Improved Prompt" button
   - Verify modal closes
   - Note: Story 2.3 will implement actual improvement generation

7. Test button disabled state:
   - Open modal with empty textarea
   - Verify "Generate Improved Prompt" button is disabled
   - Type feedback text
   - Verify button becomes enabled
   - Clear all text
   - Verify button becomes disabled again

8. Test psychological safety language:
   - Verify title is "Let's improve this result" (empowerment)
   - Verify placeholder is "What didn't you like about this result?" (conversational)
   - Verify no judgmental or blaming language
   - Verify supportive coach tone

**Visual Testing:**
- Modal overlay has semi-transparent black background (50% opacity)
- Modal container has white background
- Modal container centered on screen
- Modal has rounded corners
- Modal has drop shadow
- Header has bottom border
- Footer has top border
- Buttons are right-aligned in footer
- Cancel button has outline style
- Submit button has filled primary color style
- Textarea has focus ring (2px primary color)
- Generous whitespace throughout (psychological safety)

**State Testing (React DevTools):**
- isFeedbackModalOpen = false initially
- isFeedbackModalOpen = true after clicking "Not Satisfied"
- feedbackText = '' initially
- feedbackText updates as user types
- feedbackText = '' after modal closes

### Anti-Patterns to Avoid

```javascript
// ❌ WRONG: Storing feedback text in global context
const [feedbackText, setFeedbackText] = React.useState('');
// In AppContext - this is wrong!

// ✅ CORRECT: Store feedback text in local component state
const FeedbackModal = () => {
  const [feedbackText, setFeedbackText] = React.useState('');
  // Local state only
};

// ❌ WRONG: Not clearing feedback text when modal closes
const handleClose = () => {
  onClose();
  // Forgot to clear feedbackText!
};

// ✅ CORRECT: Clear feedback text when modal closes
const handleClose = () => {
  setFeedbackText('');
  onClose();
};

// ❌ WRONG: Not using auto-focus
const FeedbackModal = () => {
  return <textarea placeholder="Enter feedback" />;
  // User has to manually click textarea
};

// ✅ CORRECT: Auto-focus textarea when modal opens
const FeedbackModal = () => {
  const textareaRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  return <textarea ref={textareaRef} />;
};

// ❌ WRONG: Not cleaning up event listener
React.useEffect(() => {
  document.addEventListener('keydown', handleEsc);
  // Memory leak!
}, []);

// ✅ CORRECT: Clean up event listener
React.useEffect(() => {
  document.addEventListener('keydown', handleEsc);
  return () => document.removeEventListener('keydown', handleEsc);
}, [isOpen]);

// ❌ WRONG: Closing modal when clicking modal container
const handleOverlayClick = () => {
  handleClose();
};

return (
  <div className="overlay" onClick={handleOverlayClick}>
    <div className="modal">
      {/* Clicking modal closes it! */}
    </div>
  </div>
);

// ✅ CORRECT: Close only when overlay clicked
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose();
  }
};

return (
  <div className="overlay" onClick={handleOverlayClick}>
    <div className="modal">
      {/* Clicking modal doesn't close it */}
    </div>
  </div>
);

// ❌ WRONG: Technical or blaming language
<h2>Report Issue</h2>
<h2>What's wrong with this response?</h2>
<h3>You made a mistake</h3>

// ✅ CORRECT: Empowerment language (UX requirement 33)
<h2>Let's improve this result</h2>
<h3>What didn't you like about this result?</h3>

// ❌ WRONG: Not disabling submit button when empty
<button onClick={handleSubmit}>
  Generate Improved Prompt
</button>

// ✅ CORRECT: Disable submit button when textarea empty
<button
  onClick={handleSubmit}
  disabled={!feedbackText.trim()}
>
  Generate Improved Prompt
</button>

// ❌ WRONG: Using alert() for validation
const handleSubmit = () => {
  if (!feedbackText.trim()) {
    alert('Please enter feedback'); // Bad UX!
  }
};

// ✅ CORRECT: Disable button (prevent invalid submission)
<button disabled={!feedbackText.trim()}>
  Generate Improved Prompt
</button>

// ❌ WRONG: Not using BEM-lite CSS
<div className="feedbackModal">
  <div className="modalOverlay">
    <div className="textareaInput"></div>
  </div>
</div>

// ✅ CORRECT: BEM-lite CSS
<div className="feedback-modal">
  <div className="feedback-modal__overlay">
    <div className="feedback-modal__textarea"></div>
  </div>
</div>

// ❌ WRONG: Primary button styling for Cancel button
<button className="primary-button">Cancel</button>

// ✅ CORRECT: Secondary button styling for Cancel
<button className="feedback-modal__cancel-button">Cancel</button>

// ❌ WRONG: Conditional rendering without null check
{isOpen && (
  <div className="feedback-modal__overlay">
    {/* isOpen undefined causes crash */}
  </div>
)}

// ✅ CORRECT: Early return with null check
const FeedbackModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="feedback-modal__overlay">
      {/* Safe to render */}
    </div>
  );
};

// ❌ WRONG: Not preventing button clicks during processing
<button onClick={handleSubmit}>
  Generate Improved Prompt
</button>
// User can click multiple times!

// ✅ CORRECT: Disable button during processing (Story 2.3)
<button
  onClick={handleSubmit}
  disabled={isGeneratingImprovement}
>
  {isGeneratingImprovement ? 'Generating...' : 'Generate Improved Prompt'}
</button>
```

**Correct Patterns:**
```javascript
// ✅ Correct: Component definition order
const FeedbackModal = () => { ... }; // Layout, defined after ChatInterface

// ✅ Correct: BEM-lite CSS
.feedback-modal__overlay
.feedback-modal
.feedback-modal__header
.feedback-modal__body
.feedback-modal__textarea
.feedback-modal__footer

// ✅ Correct: Props naming
isOpen (boolean flag)
onClose (callback)
onSubmit (callback)

// ✅ Correct: Event handler naming
handleClose (implementation)
handleSubmit (implementation)
handleOverlayClick (implementation)

// ✅ Correct: Local state for form input
const [feedbackText, setFeedbackText] = React.useState('');

// ✅ Correct: Auto-focus with useRef
const textareaRef = React.useRef(null);
React.useEffect(() => {
  if (isOpen && textareaRef.current) {
    textareaRef.current.focus();
  }
}, [isOpen]);

// ✅ Correct: Event listener cleanup
React.useEffect(() => {
  const handleEsc = (event) => {
    if (event.key === 'Escape') handleClose();
  };
  document.addEventListener('keydown', handleEsc);
  return () => document.removeEventListener('keydown', handleEsc);
}, [isOpen]);

// ✅ Correct: Overlay click detection
const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose();
  }
};

// ✅ Correct: Clear state on close
const handleClose = () => {
  setFeedbackText('');
  onClose();
};

// ✅ Correct: Conditional rendering
if (!isOpen) return null;

// ✅ Correct: Disabled button
<button disabled={!feedbackText.trim()}>
  Generate Improved Prompt
</button>
```

### UX Requirements from UX Design Specification

**Non-Technical Language (UX Requirement #32):**
- Title: "Let's improve this result" (empowerment, not technical)
- Placeholder: "What didn't you like about this result?" (conversational)
- Button text: "Generate Improved Prompt" (action-oriented, clear)
- Avoid technical jargon: "Report Bug", "Submit Error", "Flag Issue"

**Psychological Safety (UX Requirement #33):**
- Empowerment language: "Let's improve" instead of "You did it wrong"
- No judgmental or blaming language
- Supportive, coach tone throughout
- Collaborative framing: "What didn't you like?" not "What did you do wrong?"
- Celebratory modal design: generous whitespace, not cramped or overwhelming

**One-Click Actions (UX Requirement #34):**
- Single click to close modal (Cancel, overlay, ESC)
- Single click to submit feedback
- No multi-step wizards
- Immediate response to all actions

**Visual Feedback:**
- Semi-transparent overlay (blocks interaction with chat)
- Clear modal container with shadow
- Auto-focus on textarea (ready for input)
- Disabled button state (visual indication when invalid)
- Hover states on buttons
- Focus ring on textarea

**Performance (NFR-P1):**
- Button clicks respond within 100ms
- Modal renders within 200ms (NFR-P6)
- Auto-focus activates immediately
- No laggy animations

**Generous Whitespace (Celebratory Reveal Design):**
- Modal has generous padding (calc(var(--spacing-unit) * 2))
- Spacious layout creates psychological safety
- No cramped or overwhelming feeling
- Clear visual hierarchy

### Project Structure Notes

- This story modifies ONLY the `index.html` file
- No new files are created
- Adds FeedbackModal component (Layout) in SECTION 4
- Updates App component in SECTION 6 to conditionally render FeedbackModal
- Adds CSS for modal in `<style>` tag
- No changes to SECTION 1, 2, 3, 5, or 7
- Component definition order: FeedbackModal added after ChatInterface (maintains Leaf → Composite → Layout order)

**File Locations:**
- `/Users/alexgaidukov/Projects/DigitalWaveTest/index.html` (modify)
- `/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/implementation-artifacts/2-2-feedback-modal-component.md` (this file)

### References

- [Epics: Epic 2: Failure-Driven Feedback Capture](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/epics.md#epic-2-failure-driven-feedback-capture)
- [Epics: Story 2.2 Requirements](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/epics.md#story-22-feedback-modal-component)
- [Architecture: Modal Pattern](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/architecture.md#modal-patterns)
- [Architecture: Component Definition Order](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/architecture.md#component-definition-order)
- [Architecture: CSS Naming Convention](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/architecture.md#css-naming-convention-bem-lite)
- [Architecture: State Management](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/architecture.md#state-management)
- [Project Context: Component Definition Order](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/project-context.md#file-organization-critical)
- [Project Context: CSS Naming Convention](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/project-context.md#css-naming-convention)
- [Previous Story: 2-1 Not Satisfied Button Integration](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/implementation-artifacts/2-1-not-satisfied-button-integration.md)
- [Previous Story: 1-5 Input Validation & Loading States](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/implementation-artifacts/1-5-input-validation-loading-states.md)
- [UX Design: Non-Technical Language](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/ux-design-specification.md#non-technical-language)
- [UX Design: Psychological Safety](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/ux-design-specification.md#psychological-safety)
- [UX Design: One-Click Actions](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/ux-design-specification.md#zero-friction-triggers)
- [UX Design: Generous Whitespace](/Users/alexgaidukov/Projects/DigitalWaveTest/_bmad-output/planning-artifacts/ux-design-specification.md#defining-experience)

### Requirements Fulfilled

- FR15: Users can open feedback modal by clicking "Not Satisfied" button
- FR16: Users can enter free-text feedback describing what they didn't like about the result
- FR18: Users can cancel feedback modal and return to chat without submitting
- NFR-P1: User interface interactions (button clicks) respond within 100ms
- NFR-P6: Modal renders within 200ms
- Architecture requirement 3: Component definition order (Leaf → Composite → Layout)
- Architecture requirement 8: BEM-lite CSS naming convention
- Architecture requirement 24: Component Communication - Event Handler Naming (onClose, onSubmit, handleClose)
- UX requirement 32: Non-Technical Language (conversational placeholder and title)
- UX requirement 33: Psychological Safety (empowerment language, supportive tone)
- UX requirement 34: One-Click Actions (single click to close or submit)
- UX requirement 35: Celebratory Reveal Design (generous whitespace, spacious layout)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

**Story Preparation Completed: 2026-01-04**

**Comprehensive Analysis Performed:**
- Analyzed Epic 2 and Story 2.2 requirements from epics.md (lines 882-945)
- Extracted acceptance criteria for Feedback Modal Component
- Identified dependencies on Story 2.1 (isFeedbackModalOpen state, "Not Satisfied" button)
- Modal state management: local feedbackText state, not global context
- Modal close behavior: Cancel button, overlay click, ESC key
- Psychological safety requirements: empowerment language, supportive tone

**Previous Story Intelligence Extracted:**
- Story 2.1: "Not Satisfied" button complete, isFeedbackModalOpen state exists
- Story 2.1: recentFeedback state stores userPrompt and aiResponse
- Story 1.5: Validation complete, focus management pattern established
- Story 1.3: Component structure established (Leaf → Composite → Layout)
- Story 1.2: React Context infrastructure ready
- Code review findings: BEM-lite CSS, component order, state management

**Technical Requirements Documented:**
- FeedbackModal component structure (Layout component)
- Modal overlay and container styling
- Textarea input with auto-focus
- Local state management for feedbackText
- Modal close behavior (3 methods: Cancel, overlay click, ESC key)
- Event listener cleanup in useEffect return
- BEM-lite CSS: feedback-modal__overlay, feedback-modal__header, etc.
- Generous whitespace for psychological safety
- Empowerment language: "Let's improve this result"

**Architecture Compliance Verified:**
- 7-section structure maintained
- Component definition order: FeedbackModal (Layout) after ChatInterface
- BEM-lite CSS naming: feedback-modal__overlay, feedback-modal, etc.
- Props naming: isOpen, onClose, onSubmit
- Event handler naming: handleClose, handleSubmit, handleOverlayClick
- State management: Local feedbackText state, isFeedbackModalOpen in context
- Immutable state updates via setFeedbackText
- Psychological safety language: "Let's improve this result"

**Implementation Patterns Documented:**
- Conditional rendering with early return: if (!isOpen) return null
- Auto-focus with useRef and useEffect
- Event listener cleanup: return () => document.removeEventListener()
- Overlay click detection: event.target === event.currentTarget
- Clear form state on close: setFeedbackText('')
- Disable submit button when invalid: disabled={!feedbackText.trim()}
- Secondary button styling for Cancel
- Primary button styling for "Generate Improved Prompt"
- Generous whitespace (calc(var(--spacing-unit) * 2))

**Anti-Patterns Documented:**
- 13 comprehensive anti-patterns with corrections
- Storing feedback text in global context vs local state
- Not clearing feedback text when modal closes
- Not using auto-focus on textarea
- Not cleaning up event listeners (memory leak)
- Closing modal when clicking modal container vs overlay only
- Technical or blaming language vs empowerment language
- Not disabling submit button when textarea empty
- Not using BEM-lite CSS naming
- Primary button styling for Cancel vs secondary
- Conditional rendering without null check
- Event propagation issues

**Testing Requirements Specified:**
- Manual browser testing checklist
- Modal opens when "Not Satisfied" clicked
- Textarea auto-focused when modal opens
- Modal close behavior (3 methods tested)
- Overlay click to close (not modal container)
- ESC key to close
- Button disabled state (when textarea empty)
- Psychological safety language verification
- Visual testing (overlay, container, whitespace)
- State testing (React DevTools)

**UX Requirements Incorporated:**
- Non-technical language: "Let's improve this result", "What didn't you like?" (UX requirement 32)
- Psychological safety: empowerment language, supportive tone (UX requirement 33)
- One-click action: single click to close or submit (UX requirement 34)
- Fast response: <100ms button clicks, <200ms modal render (NFR-P1, NFR-P6)
- Generous whitespace: calc(var(--spacing-unit) * 2) padding (celebratory reveal)
- Clear visual feedback: disabled button, focus ring, hover states

**Git Intelligence:**
- Story 2.1 completed with isFeedbackModalOpen state
- Established patterns: BEM-lite, component order, state management
- Commit format: feat(story-X.X): Description
- All code changes in single index.html file
- Modal pattern established for future stories (Story 2.3 will use feedback)

**File Structure:**
- Single file modification: index.html
- Sections to modify: SECTION 4 (add FeedbackModal), SECTION 6 (render FeedbackModal), <style> (modal CSS)
- No external files or new dependencies
- FeedbackModal is Layout component (after ChatInterface)

**Developer Ready:**
- Complete technical specifications
- Code examples for FeedbackModal component
- Comprehensive testing checklist
- Anti-patterns to avoid
- Architecture compliance verified
- Previous story context incorporated
- Modal close behavior fully specified (3 methods)
- Psychological safety requirements addressed
- UX requirements for non-technical language met

### Completion Notes List

**Story Preparation Completed: 2026-01-04**

**Story Status:** ready-for-dev → in-progress → review

**Implementation Completed: 2026-01-04**

**Implementation Summary:**
- ✅ Implemented FeedbackModal component as Layout component in SECTION 4
- ✅ Added complete modal structure (overlay, container, header, body, footer)
- ✅ Implemented BEM-lite CSS styling with generous whitespace (calc(var(--spacing-unit) * 2))
- ✅ Added textarea input with auto-focus using useRef and useEffect
- ✅ Implemented local feedbackText state (not global context)
- ✅ Implemented 3 modal close methods: Cancel button, overlay click, ESC key
- ✅ Added event listener cleanup in useEffect return
- ✅ Implemented psychological safety language: "Let's improve this result"
- ✅ Disabled submit button when textarea empty
- ✅ Integrated FeedbackModal into App component with conditional rendering
- ✅ All 11 tasks and 47 subtasks completed
- ✅ All acceptance criteria verified via manual testing

**Files Modified:**
- index.html (added FeedbackModal CSS, component, and App integration)

**Technical Implementation:**
- Component Definition Order: FeedbackModal added after ChatInterface (Layout component)
- CSS Classes: `.feedback-modal__overlay`, `.feedback-modal`, `.feedback-modal__header`, `.feedback-modal__body`, `.feedback-modal__textarea`, `.feedback-modal__footer`, `.feedback-modal__cancel-button`, `.feedback-modal__submit-button`
- Local State: `feedbackText` (string)
- Refs: `textareaRef` for auto-focus
- Event Handlers: `handleClose`, `handleSubmit`, `handleOverlayClick`
- Props: `isOpen` (boolean), `onClose` (callback), `onSubmit` (callback with feedbackText)
- Context Integration: `isFeedbackModalOpen`, `setIsFeedbackModalOpen`

**Testing Performed:**
- ✅ Modal opens when "Not Satisfied" button clicked
- ✅ Textarea auto-focused when modal opens
- ✅ Overlay click closes modal and clears text
- ✅ Cancel button closes modal and clears text
- ✅ ESC key closes modal and clears text
- ✅ Modal container click does NOT close modal
- ✅ Feedback text stored in local component state (not context)
- ✅ Psychological safety language verified (empowerment, non-blaming)
- ✅ Submit button disabled when textarea empty
- ✅ Submit button enabled when text entered
- ✅ Maximum 500 characters enforced
- ✅ Minimum 3 rows displayed
- ✅ No console errors
- ✅ All BEM-lite CSS classes applied correctly
- ✅ Generous whitespace throughout

**Architecture Compliance:**
- ✅ 7-section structure maintained
- ✅ Component definition order: FeedbackModal (Layout) after ChatInterface
- ✅ BEM-lite CSS naming convention followed
- ✅ Props naming: isOpen, onClose, onSubmit
- ✅ Event handler naming: handleClose, handleSubmit, handleOverlayClick
- ✅ State management: Local feedbackText state, isFeedbackModalOpen in context
- ✅ Immutable state updates
- ✅ Event listener cleanup in useEffect return
- ✅ Auto-focus pattern using useRef and useEffect
- ✅ Conditional rendering with early return (if (!isOpen) return null)

**Requirements Fulfilled:**
- FR15: Users can open feedback modal by clicking "Not Satisfied" button
- FR16: Users can enter free-text feedback describing what they didn't like
- FR18: Users can cancel feedback modal and return to chat
- NFR-P1: Button clicks respond within 100ms
- NFR-P6: Modal renders within 200ms
- Architecture requirement 3: Component definition order (Leaf → Composite → Layout)
- Architecture requirement 8: BEM-lite CSS naming convention
- Architecture requirement 24: Event handler naming (onClose, onSubmit, handleClose)
- UX requirement 32: Non-technical language (conversational placeholder and title)
- UX requirement 33: Psychological safety (empowerment language, supportive tone)
- UX requirement 34: One-click actions (single click to close or submit)
- UX requirement 35: Celebratory reveal design (generous whitespace)

**Code Review (2026-01-04):**
- ✅ 7 issues fixed (5 HIGH, 2 MEDIUM)
- ESC key handler: Added handleClose to dependency array (stale closure fix)
- Auto-focus effect: Added clarifying comment about no cleanup needed
- Modal background: Changed from var(--color-background) to #ffffff
- Architecture: Added comment explaining local state pattern for feedbackText
- Accessibility: Added role="dialog", aria-labelledby, aria-describedby, aria-label
- Performance: Wrapped FeedbackModal with React.memo to prevent unnecessary re-renders
- Focus management: Verified pattern consistency with Story 1.5 (no changes needed)

**Next Story:**
- Story 2.3 will implement feedback submission handler (Generate Improved Prompt functionality)

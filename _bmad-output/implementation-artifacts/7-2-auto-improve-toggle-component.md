# Story 7.2: Auto-Improve Toggle Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want a toggle switch to enable/disable automatic prompt improvement,
So that I can choose when to have my prompts automatically enhanced before submission.

## Acceptance Criteria

1. **Toggle component visibility and default state**
   - **Given** user is on the chat interface page
   - **When** user views the chat input area
   - **Then** toggle component labeled "Automatically Improve Prompt" is visible near the chat input field
   - **And** toggle is in OFF state by default
   - **And** toggle has clear visual ON/OFF states

2. **Toggle OFF → ON behavior**
   - **Given** toggle is in OFF state
   - **When** user clicks the toggle
   - **Then** toggle animates to ON state
   - **And** toggle state persists during the session
   - **And** chat input behavior changes to use auto-improvement flow
   - **And** visual distinction shows active state (green or accent color)

3. **Toggle ON → OFF behavior**
   - **Given** toggle is in ON state
   - **When** user clicks the toggle
   - **Then** toggle animates to OFF state
   - **And** chat input behavior reverts to normal direct submission
   - **And** user's original prompts are sent without auto-improvement
   - **And** visual distinction shows inactive state (gray)

4. **Toggle state management in React Context**
   - **Given** AppProvider exists in js/components.js
   - **When** adding auto-improve toggle support
   - **Then** new boolean state `isAutoImproveEnabled` is added to AppContext
   - **And** state defaults to false (OFF)
   - **And** state persists during browser session (in-memory only)
   - **And** state is accessible via useAppContext hook

5. **Visual design and positioning**
   - **Given** chat interface layout exists
   - **When** adding toggle component
   - **Then** toggle is positioned above or beside chat input field for easy access
   - **And** toggle uses BEM-lite class naming: `.auto-improve-toggle`, `.auto-improve-toggle--active`
   - **And** toggle has smooth CSS transition animation (200ms)
   - **And** OFF state uses gray/inactive color
   - **And** ON state uses green or accent color
   - **And** toggle label is clear and non-technical

6. **Toggle component reusability**
   - **Given** toggle component is created
   - **When** defining component structure
   - **Then** AutoImproveToggle is a leaf component defined early in js/components.js
   - **And** component follows reusable pattern: props include `isEnabled`, `onToggle`
   - **And** component is self-contained with internal styling
   - **And** component can be reused elsewhere if needed

7. **Integration with ChatInput component**
   - **Given** ChatInput component exists in js/components.js
   - **When** adding auto-improve toggle
   - **Then** AutoImproveToggle is included in ChatInput JSX
   - **And** ChatInput reads `isAutoImproveEnabled` from context
   - **And** ChatInput passes toggle state to submission handler (for Story 7.3)
   - **And** toggle placement doesn't break existing input layout

8. **Performance and responsiveness**
   - **Given** toggle is rendered
   - **When** user interacts with toggle
   - **Then** click responds within 100ms (NFR-P1)
   - **And** visual state transition completes within 200ms (NFR-P5)
   - **And** toggle doesn't cause layout shifts or jank
   - **And** toggle works smoothly across Chrome/Firefox/Safari

## Tasks / Subtasks

- [x] Add isAutoImproveEnabled state to AppContext (AC: #4)
  - [x] Add `isAutoImproveEnabled: false` to AppContext initial state
  - [x] Expose state in useAppContext hook return value
  - [x] Add setter function (optional, can use toggle handler)
- [x] Create AutoImproveToggle leaf component (AC: #1, #2, #3, #5, #6)
  - [x] Define component at top of js/components.js (leaf components section)
  - [x] Add props: `isEnabled`, `onToggle`
  - [x] Implement toggle switch UI with CSS
  - [x] Add BEM-lite classes: `.auto-improve-toggle`, `.auto-improve-toggle--active`
  - [x] Add label: "Automatically Improve Prompt"
  - [x] Add smooth CSS transition (200ms)
  - [x] Style OFF state: gray/inactive color
  - [x] Style ON state: green or accent color (use `--color-primary` if exists)
  - [x] Add cursor pointer for interactivity
- [x] Add toggle styles to styles/main.css (AC: #5, #8)
  - [x] Add `.auto-improve-toggle` base styles
  - [x] Add `.auto-improve-toggle--active` modifier styles
  - [x] Add transition animation (200ms ease-in-out)
  - [x] Ensure no layout shifts or jank
- [x] Integrate AutoImproveToggle into ChatInput (AC: #7)
  - [x] Import/use useAppContext in ChatInput component
  - [x] Read `isAutoImproveEnabled` from context
  - [x] Add toggle handler: `handleToggleAutoImprove` function
  - [x] Include `<AutoImproveToggle>` in ChatInput JSX
  - [x] Position toggle above or beside input field
  - [x] Ensure existing input layout remains functional
- [x] Test toggle interactions (AC: #2, #3, #8)
  - [x] Test OFF → ON transition and visual state
  - [x] Test ON → OFF transition and visual state
  - [x] Test click responsiveness (<100ms)
  - [x] Test visual transition smoothness (200ms)
  - [x] Test state persistence during session
  - [x] Test cross-browser compatibility (Chrome/Firefox/Safari)
  - [x] Verify no console errors

## Dev Notes

**Epic Context:**
Epic 7 adds automatic prompt improvement functionality - users can toggle a switch to have their prompts automatically enhanced before submission, eliminating the need to experience failure first. This is a proactive improvement mode. Story 7.2 creates the UI toggle component that controls this feature.

**Story Context:**
This story creates the toggle switch UI component. It does NOT implement the auto-improvement logic itself - that's Story 7.3. This story focuses purely on:
- Creating the toggle component as a reusable leaf component
- Adding the state to React Context
- Integrating the toggle into ChatInput
- Visual design and smooth animations

The toggle state (`isAutoImproveEnabled`) will be READ by Story 7.3 to determine whether to call `/api/auto-improve` or `/api/chat` directly.

**Previous Story Intelligence (Story 7.1):**
- Story 7.1 successfully implemented the `/api/auto-improve` endpoint in Cloudflare Worker
- The endpoint returns `{ success: true, data: { improvedPrompt: string } }`
- Story 7.1 added `AUTO_IMPROVE_SYSTEM_PROMPT` to `cloudflare-worker/prompts.js`
- Story 7.1 followed the ES6 module pattern for imports/exports
- Story 7.1 demonstrated the same endpoint validation pattern (POST method, body parsing, field validation, origin validation)
- **CRITICAL LEARNING:** Story 7.1 code review found that whitespace-only prompts were being accepted - this was fixed by adding regex validation (`!body.prompt || typeof body.prompt !== 'string' || !body.prompt.trim()`)
- **APPLY THIS LEARNING:** When implementing toggle, ensure validation logic in Story 7.3 properly checks for whitespace prompts before sending to auto-improve endpoint

**Architecture Compliance:**
This story MUST follow the modular file structure established in the 2026-01-04 refactoring:

**File Modification List:**
1. **js/components.js** - Add AutoImproveToggle component and update ChatInput
2. **styles/main.css** - Add toggle-specific CSS classes
3. **js/app.js** - No changes needed (AppContext is in components.js)

**Component Definition Order (CRITICAL - prevents ReferenceError):**
```
js/components.js structure:
1. CUSTOM HOOKS (useAppContext)
2. ERROR BOUNDARY (ErrorBoundary)
3. LEAF COMPONENTS (AutoImproveToggle, Button, Tooltip, etc.) ← ADD HERE
4. COMPOSITE COMPONENTS (MessageList, ChatInput, etc.)
5. LAYOUT COMPONENTS (ChatInterface, Modals)
6. CONTEXT PROVIDER (AppContext, AppProvider)
```

**Where to Place AutoImproveToggle:**
- AutoImproveToggle is a LEAF component (no dependencies on other components except props)
- Define it early in the LEAF COMPONENTS section, after Tooltip but before MessageList
- Do NOT define it after composite components (will cause "AutoImproveToggle is not defined" error)

**AppContext State Update:**
AppContext is in js/components.js around line 900-1000 (in CONTEXT PROVIDER section). Add to initial state:

```javascript
const AppContext = React.createContext();

export const useAppContext = () => React.useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [chatHistory, setChatHistory] = React.useState([]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const [chatError, setChatError] = React.useState(null);
  // ... other existing state ...

  // NEW: Add auto-improve toggle state
  const [isAutoImproveEnabled, setIsAutoImproveEnabled] = React.useState(false);

  // Ensure useAppContext returns the new state
  const value = {
    chatHistory,
    setChatHistory,
    isChatLoading,
    setIsChatLoading,
    chatError,
    setChatError,
    // ... other existing state ...
    isAutoImproveEnabled,
    setIsAutoImproveEnabled
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

**AutoImproveToggle Component Structure:**

```javascript
// LEAF COMPONENT - Define early in js/components.js

const AutoImproveToggle = ({ isEnabled, onToggle }) => {
  return (
    <div className={`auto-improve-toggle ${isEnabled ? 'auto-improve-toggle--active' : ''}`}>
      <label htmlFor="auto-improve-switch" className="auto-improve-toggle__label">
        Automatically Improve Prompt
      </label>
      <button
        id="auto-improve-switch"
        className="auto-improve-toggle__switch"
        role="switch"
        aria-checked={isEnabled}
        onClick={onToggle}
        type="button"
      >
        <span className="auto-improve-toggle__slider"></span>
      </button>
    </div>
  );
};
```

**ChatInput Integration:**
ChatInput is a COMPOSITE component (depends on leaf components). Update to use toggle:

```javascript
const ChatInput = ({ onSubmit, isLoading }) => {
  const { isAutoImproveEnabled, setIsAutoImproveEnabled } = useAppContext();

  const handleToggleAutoImprove = () => {
    setIsAutoImproveEnabled(prev => !prev);
  };

  return (
    <div className="chat-interface__input-area">
      <AutoImproveToggle
        isEnabled={isAutoImproveEnabled}
        onToggle={handleToggleAutoImprove}
      />
      {/* ... existing input field and send button ... */}
    </div>
  );
};
```

**CSS Styling (styles/main.css):**

Add to styles/main.css (BEM-lite convention):

```css
/* Toggle Container */
.auto-improve-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: var(--border-radius, 4px);
  background-color: #f5f5f5;
  transition: background-color 200ms ease-in-out;
}

.auto-improve-toggle--active {
  background-color: #e8f5e9; /* Light green background when active */
}

/* Toggle Label */
.auto-improve-toggle__label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
  user-select: none;
}

/* Toggle Switch Button */
.auto-improve-toggle__switch {
  position: relative;
  width: 44px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 12px;
  background-color: #ccc; /* Gray when OFF */
  cursor: pointer;
  transition: background-color 200ms ease-in-out;
}

.auto-improve-toggle--active .auto-improve-toggle__switch {
  background-color: var(--color-primary, #4caf50); /* Green when ON */
}

/* Toggle Slider (the moving circle) */
.auto-improve-toggle__slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: transform 200ms ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.auto-improve-toggle--active .auto-improve-toggle__slider {
  transform: translateX(20px); /* Move right when ON */
}

/* Hover State */
.auto-improve-toggle__switch:hover {
  opacity: 0.9;
}

/* Focus State for Accessibility */
.auto-improve-toggle__switch:focus {
  outline: 2px solid var(--color-primary, #4caf50);
  outline-offset: 2px;
}
```

**State Management Pattern:**
- Use `setIsAutoImproveEnabled(prev => !prev)` for toggle (immutable update)
- State is boolean: `false` = OFF, `true` = ON
- No localStorage (in-memory only, per Architecture requirement)
- State persists during browser session until page refresh

**Performance Requirements:**
- Click response: <100ms (NFR-P1)
- Visual transition: 200ms (NFR-P5)
- No layout shift: Use CSS transitions, not JS animations
- Smooth 60fps animation: Use `transform` and `opacity` only (GPU accelerated)

**Accessibility:**
- Use `<button>` with `role="switch"` and `aria-checked`
- Label connected to input via `htmlFor` and `id`
- Keyboard accessible (Enter and Space to toggle)
- Focus visible state for keyboard navigation
- Screen reader announces toggle state

**Browser Compatibility:**
- Chrome/Edge: ✅ CSS transitions supported
- Firefox: ✅ CSS transitions supported
- Safari: ✅ CSS transitions supported
- Use standard CSS (no vendor prefixes needed for modern browsers)

**Testing Checklist:**
1. Toggle renders in ChatInput
2. Toggle shows OFF (gray) by default
3. Clicking toggle changes to ON (green)
4. Clicking toggle again changes to OFF (gray)
5. Transition animation is smooth (200ms)
6. No console errors when toggling
7. State persists during session (not lost on navigation within app)
8. State resets on page refresh (expected, in-memory only)
9. Toggle works in Chrome/Firefox/Safari
10. No layout shift when toggling

### Project Structure Notes

**Modular Architecture Compliance:**
- ✅ AutoImproveToggle is a leaf component (defined early)
- ✅ Component follows BEM-lite naming convention
- ✅ State added to existing AppContext (in js/components.js)
- ✅ Styles added to styles/main.css (separate CSS file)
- ✅ No changes to index.html needed (React components manage UI)
- ✅ Component order: LEAF → COMPOSITE → LAYOUT (prevents ReferenceError)

**Component Definition Order:**
```
js/components.js (approximate line numbers):
- Lines 1-50: CUSTOM HOOKS (useAppContext)
- Lines 50-100: ERROR BOUNDARY (ErrorBoundary)
- Lines 100-300: LEAF COMPONENTS ← Add AutoImproveToggle here (after Tooltip, before MessageList)
- Lines 300-700: COMPOSITE COMPONENTS (ChatInput is here)
- Lines 700-900: LAYOUT COMPONENTS
- Lines 900-1200: CONTEXT PROVIDER (AppProvider with AppContext state)
```

**IMPORTANT:** Do NOT define AutoImproveToggle after ChatInput or MessageList - those components depend on leaf components being defined first. Violating this order causes "ReferenceError: AutoImproveToggle is not defined".

**Script Loading:**
No changes to index.html needed - all modifications are in existing loaded scripts:
- `js/components.js` - Already loads after config.js and utils.js
- `styles/main.css` - Already loads in HTML head

### References

**Source: epics.md** - Epic 7 overview and Story 7.2 acceptance criteria (lines 2088-2278)
**Source: _bmad-output/implementation-artifacts/7-1-auto-improvement-rules-worker-endpoint.md** - Previous story learnings and patterns
**Source: _bmad-output/project-context.md** - Project structure, component definition order, BEM-lite naming (lines 86-126)
**Source: _bmad-output/project-context.md** - State management patterns (lines 133-154)
**Source: _bmad-output/project-context.md** - CSS naming convention (lines 155-161)

**Related Stories:**
- Story 7.1: Auto-Improvement Rules & Worker Endpoint (backend API, already complete)
- Story 7.3: Auto-Improvement Chat Flow Integration (will use the toggle state to call `/api/auto-improve`)

**Dependencies:**
- Requires Story 7.1 to be complete (provides `/api/auto-improve` endpoint)
- Required by Story 7.3 (will read `isAutoImproveEnabled` state to implement two-phase submission flow)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - implementation completed successfully without issues.

### Completion Notes List

**Implementation Summary:**
- ✅ Added `isAutoImproveEnabled` state to AppContext with default value `false`
- ✅ Created AutoImproveToggle leaf component following BEM-lite naming convention
- ✅ Positioned component in LEAF COMPONENTS section (after HighlightedText, before Button) to prevent ReferenceError
- ✅ Added comprehensive CSS styles with 200ms smooth transitions
- ✅ Integrated toggle into ChatInput component with proper context usage
- ✅ Implemented toggle handler with useCallback for performance optimization
- ✅ Added ARIA attributes (role="switch", aria-checked) for accessibility
- ✅ Ensured keyboard accessibility (Enter/Space to toggle, focus styles)
- ✅ State persists during browser session (in-memory only, per requirements)

**Technical Decisions:**
- Component defined as leaf component to maintain proper definition order
- Used CSS transitions (not animations) for optimal performance (GPU-accelerated)
- Used `transform: translateX()` for slider movement (60fps capable)
- Followed immutable state update pattern: `setIsAutoImproveEnabled(prev => !prev)`
- Positioned toggle above input form for clear visual hierarchy
- Used var(--color-primary) for ON state to match app theme

**Testing Verification:**
- ✅ Component renders without console errors (verified via browser testing)
- ✅ Toggle state updates correctly on click
- ✅ Visual transitions are smooth (200ms)
- ✅ CSS properly loaded from styles/main.css
- ✅ JavaScript properly loaded from js/components.js
- ✅ No layout shifts or jank observed
- ✅ Component follows accessibility best practices
- ✅ Native button element provides keyboard accessibility (Enter/Space)

**Note:** Test HTML files were created for verification and deleted after testing completed.

---

## Code Review Fixes (2026-01-05)

**Fixed Issues:**
1. ✅ Removed `test-toggle.html` from File List (test files were deleted after testing)
2. ✅ Updated CSS comments to clarify actual color values (removed misleading #4caf50 fallback)
3. ✅ Enhanced component documentation to explicitly mention keyboard accessibility via native button behavior

**Story Status Updated:** review → done
**All ACs implemented and verified.**
- js/components.js (added state, component, integration)
- styles/main.css (added toggle styles)

### File List

**Modified Files:**
- js/components.js (added state, component, integration)
- styles/main.css (added toggle styles, improved color comments)

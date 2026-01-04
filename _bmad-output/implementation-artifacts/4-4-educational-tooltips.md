# Story 4.4: Educational Tooltips

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see contextual tooltips explaining WHY each improvement matters,
so that I can learn the R/T/E framework and understand the value of each section.

## Acceptance Criteria

**Given** the comparison modal is displaying the improved prompt,
**When** I interact with the R/T/E sections,
**Then** educational tooltips should appear (FR34, FR35, FR36, FR38):

**Tooltip component (Leaf component in SECTION 4):**
- `Tooltip` component with props: `children`, `content`
- Renders: Children wrapped with tooltip trigger
- Displays tooltip on hover or click
- Position: Above or below the target element
- BEM-lite class: `.tooltip`

**Tooltip triggers:**
- **Given** improved prompt with R/T/E sections
- **When** user hovers over section headers
- **Then** show tooltip explaining that section
- **And** use explanations from comparisonData.explanations array

**Framework education tooltips (FR36, FR38):**
- **Rules section tooltip:**
  - "Rules establish constraints and guidelines that guide the AI's creative direction. They help the AI understand your brand voice, positioning, and requirements."

- **Task section tooltip:**
  - "A clear task definition tells the AI exactly what to generate. Be specific about the output you want (e.g., 'Generate 10 product names' vs. 'Generate names')."

- **Examples section tooltip:**
  - "Examples anchor the AI's understanding of your desired style. Providing reference points helps the AI match your expectations."

**Contextual explanations (FR34, FR35):**
- **Given** tooltips are displayed
- **When** user reads tooltip content
- **Then** explanations should:
  - Use supportive coach tone (UX requirement 37)
  - Explain WHY the section matters
  - Connect to user's specific prompt context
  - Be concise (2-3 sentences, not paragraphs)

**Tooltip behavior:**
- **Given** tooltip trigger
- **When** user hovers over element
- **Then** display tooltip within 100ms (NFR-P7)
- **And** position tooltip to avoid clipping
- **And** keep tooltip visible while hovering

- **Given** tooltip is displayed
- **When** user moves mouse away
- **Then** hide tooltip smoothly
- **And** no abrupt disappearance

**Tooltip styling:**
- Background: Dark or distinct color
- Text: High contrast, readable
- Arrow pointer to target element
- Maximum width: 250px (prevents overly wide tooltips)
- Padding: Generous for readability

**Progressive disclosure (UX requirement 40):**
- Tooltips are hidden by default
- Only show on user interaction (hover/click)
- Don't overwhelm with all tooltips at once
- Let users explore at their own pace

**Accessibility:**
- Tooltips work on focus (keyboard navigation)
- Tooltips can be dismissed with ESC
- Screen reader can access tooltip content
- High contrast for text readability

**Tooltip content examples:**
- **Generic:** "This helps the AI understand your intent"
- **Context-specific:** "Adding 'premium positioning' as a Rule helps the AI create sophisticated names instead of generic ones"

**Given** I interact with the tooltips,
**When** I read the explanations,
**Then** I should feel:
- Educated about the R/T/E framework
- Empowered to apply it myself
- Clear on the value of each section

**Requirements fulfilled:** FR34, FR35, FR36, FR38, NFR-P7, UX requirements 37, 40

## Tasks / Subtasks

- [ ] Task 1: Create Tooltip leaf component (AC: Tooltip component)
  - [ ] 1.1: Add Tooltip component to SECTION 4 (LEAF component, define FIRST before any other components)
  - [ ] 1.2: Implement props: children (React element), content (string or React node)
  - [ ] 1.3: Add local state: isVisible (boolean) to track tooltip visibility
  - [ ] 1.4: Implement hover handlers: onMouseEnter, onMouseLeave
  - [ ] 1.5: Implement focus handlers for keyboard accessibility: onFocus, onBlur
  - [ ] 1.6: Render children with wrapper div that triggers tooltip
  - [ ] 1.7: Render tooltip content when isVisible is true
  - [ ] 1.8: Apply BEM-lite CSS classes: `.tooltip`, `.tooltip__content`, `.tooltip__arrow`
  - [ ] 1.9: Position tooltip above or below target element (CSS positioning)
  - [ ] 1.10: Test tooltip renders without errors

- [ ] Task 2: Implement tooltip positioning and arrow (AC: Tooltip behavior, Tooltip styling)
  - [ ] 2.1: Add CSS for tooltip positioning (relative parent, absolute tooltip)
  - [ ] 2.2: Position tooltip above target by default (bottom: 100%)
  - [ ] 2.3: Add fallback positioning logic if tooltip would clip at viewport edge
  - [ ] 2.4: Create arrow pointer using CSS borders (triangle)
  - [ ] 2.5: Position arrow at bottom center of tooltip (for above positioning)
  - [ ] 2.6: Add z-index to ensure tooltip appears above all content (z-index: 1001)
  - [ ] 2.7: Add smooth fade-in animation (opacity transition 0.2s ease)
  - [ ] 2.8: Test positioning doesn't clip at viewport edges
  - [ ] 2.9: Test arrow points correctly to target element

- [ ] Task 3: Add tooltip styling with BEM-lite CSS (AC: Tooltip styling)
  - [ ] 3.1: Add `.tooltip` class with position: relative (wrapper)
  - [ ] 3.2: Add `.tooltip__content` class with dark background (#333 or #2c3e50)
  - [ ] 3.3: Set maximum width: 250px for tooltip content
  - [ ] 3.4: Add generous padding (12px 16px) for readability
  - [ ] 3.5: Set text color to high contrast white (#fff or #f8f9fa)
  - [ ] 3.6: Add border-radius (4px or 6px) for polished appearance
  - [ ] 3.7: Add box-shadow for depth (0 4px 12px rgba(0,0,0,0.15))
  - [ ] 3.8: Add `.tooltip__arrow` class with CSS triangle (borders)
  - [ ] 3.9: Test text contrast meets WCAG AA standards
  - [ ] 3.10: Test tooltip looks polished and professional

- [ ] Task 4: Integrate Tooltip into ImprovedPromptWithBadges (AC: Tooltip triggers)
  - [ ] 4.1: Update ImprovedPromptWithBadges from Story 4.3
  - [ ] 4.2: Import Tooltip component (defined as LEAF, so available)
  - [ ] 4.3: Wrap each section header (Rules:, Task:, Examples:) with Tooltip component
  - [ ] 4.4: Pass tooltip content from comparisonData.explanations array
  - [ ] 4.5: Match explanation by section name (Rules, Task, Examples)
  - [ ] 4.6: Fallback to generic explanation if section-specific not found
  - [ ] 4.7: Test tooltips appear on hover over section headers
  - [ ] 4.8: Test tooltip content matches section context

- [ ] Task 5: Add explanation content from comparisonData (AC: Framework education tooltips, Contextual explanations)
  - [ ] 5.1: Access comparisonData.explanations from context
  - [ ] 5.2: Parse explanations array to create section → tooltip map
  - [ ] 5.3: Create helper function getTooltipContent(sectionName)
  - [ ] 5.4: Return section-specific tooltip if available
  - [ ] 5.5: Return generic tooltip if not available
  - [ ] 5.6: Use supportive coach tone in all explanations
  - [ ] 5.7: Keep explanations concise (2-3 sentences)
  - [ ] 5.8: Explain WHY section matters, not just WHAT it is
  - [ ] 5.9: Test with explanations from Story 3.3 response
  - [ ] 5.10: Test fallback to generic explanations if array empty

- [ ] Task 6: Implement hover and focus interactions (AC: Tooltip behavior)
  - [ ] 6.1: Add onMouseEnter handler to set isVisible = true
  - [ ] 6.2: Add onMouseLeave handler to set isVisible = false
  - [ ] 6.3: Add small delay (100ms) before showing tooltip (prevents accidental triggers)
  - [ ] 6.4: Add onFocus handler for keyboard accessibility (sets isVisible = true)
  - [ ] 6.5: Add onBlur handler for keyboard accessibility (sets isVisible = false)
  - [ ] 6.6: Make section headers keyboard focusable (tabIndex={0} if needed)
  - [ ] 6.7: Test tooltip appears within 100ms of hover (NFR-P7)
  - [ ] 6.8: Test tooltip disappears smoothly on mouse leave
  - [ ] 6.9: Test keyboard focus triggers tooltip
  - [ ] 6.10: Test ESC key dismisses active tooltips

- [ ] Task 7: Add accessibility features (AC: Accessibility)
  - [ ] 7.1: Add role="tooltip" to tooltip content div
  - [ ] 7.2: Add aria-describedby to trigger element linking to tooltip content
  - [ ] 7.3: Ensure tooltips are keyboard accessible (focus/blur handlers)
  - [ ] 7.4: Add ESC key handler to dismiss active tooltip
  - [ ] 7.5: Test with screen reader (tooltip content announced on focus)
  - [ ] 7.6: Verify high contrast for text readability (WCAG AA)
  - [ ] 7.7: Test keyboard navigation cycles through tooltips
  - [ ] 7.8: Verify focus indicator is visible on section headers

- [ ] Task 8: Add progressive disclosure behavior (AC: Progressive disclosure)
  - [ ] 8.1: Verify tooltips are hidden by default (isVisible starts as false)
  - [ ] 8.2: Verify tooltips only show on user hover/focus action
  - [ ] 8.3: Test multiple tooltips don't show simultaneously
  - [ ] 8.4: Test tooltips don't auto-open (user must interact)
  - [ ] 8.5: Verify users can explore at their own pace
  - [ ] 8.6: Test no overwhelming "wall of tooltips" on modal open
  - [ ] 8.7: Verify tooltips feel like on-demand help, not intrusive popups

- [ ] Task 9: Performance optimization for tooltips (AC: Tooltip behavior)
  - [ ] 9.1: Measure tooltip display time from hover to visible
  - [ ] 9.2: Optimize if display exceeds 100ms (NFR-P7)
  - [ ] 9.3: Use React.useCallback() for hover handlers
  - [ ] 9.4: Prevent tooltip re-renders during hover state
  - [ ] 9.5: Test tooltip doesn't cause laggy scrolling
  - [ ] 9.6: Test tooltip doesn't slow down modal rendering

- [ ] Task 10: Edge case testing (AC: Tooltip behavior, Accessibility)
  - [ ] 10.1: Test with very long tooltip content (exceeds 250px width)
  - [ ] 10.2: Test with tooltip at viewport edge (should reposition)
  - [ ] 10.3: Test with missing explanations array (use fallback)
  - [ ] 10.4: Test with empty tooltip content (graceful handling)
  - [ ] 10.5: Test rapid hover on/off (no flickering or glitches)
  - [ ] 10.6: Test with multiple section headers in quick succession

- [ ] Task 11: Integration testing with Stories 4.1, 4.2, 4.3 (AC: Tooltip triggers)
  - [ ] 11.1: Test complete flow from Epic 3 → modal open → tooltips work
  - [ ] 11.2: Verify tooltips don't break Story 4.2 highlighting
  - [ ] 11.3: Verify tooltips don't break Story 4.3 mapping badges
  - [ ] 11.4: Verify two-column layout still works with tooltips
  - [ ] 11.5: Verify modal still closes correctly (ESC, overlay, close button)
  - [ ] 11.6: Verify tooltips work alongside other Story 4 features

- [ ] Task 12: Visual design testing (AC: Tooltip styling, Requirements fulfilled)
  - [ ] 12.1: Verify tooltip background is dark and distinct
  - [ ] 12.2: Verify tooltip text has high contrast
  - [ ] 12.3: Verify arrow points correctly to target
  - [ ] 12.4: Verify tooltip looks polished and professional
  - [ ] 12.5: Test tooltip doesn't obscure important content
  - [ ] 12.6: Test tooltip fades in smoothly (not jarring)
  - [ ] 12.7: Verify generous whitespace in tooltip content
  - [ ] 12.8: Test celebratory reveal design maintained (UX requirement 35)

- [ ] Task 13: Browser compatibility testing (AC: Tooltip behavior, Tooltip styling)
  - [ ] 13.1: Test tooltips in Chrome (latest stable)
  - [ ] 13.2: Test tooltips in Firefox (latest stable)
  - [ ] 13.3: Test tooltips in Safari (latest stable)
  - [ ] 13.4: Verify CSS positioning works in all browsers
  - [ ] 13.5: Verify arrow renders correctly in all browsers
  - [ ] 13.6: Verify fade-in animation works in all browsers

- [ ] Task 14: Documentation and code quality (AC: Requirements fulfilled)
  - [ ] 14.1: Add JSDoc comments to Tooltip component
  - [ ] 14.2: Document props: children, content
  - [ ] 14.3: Document accessibility features in comments
  - [ ] 14.4: Follow BEM-lite CSS naming strictly
  - [ ] 14.5: Verify no inline styles (all CSS in `<style>` tag)
  - [ ] 14.6: Verify component definition order (Tooltip FIRST as LEAF)
  - [ ] 14.7: Add code comments explaining positioning logic
  - [ ] 14.8: Add code comments explaining accessibility features

## Dev Notes

### Architecture Compliance

**CRITICAL: Component Definition Order**

From project-context.md and Architecture.md:
- Define LEAF components FIRST (Tooltip is a LEAF component)
- Then COMPOSITE components
- Then LAYOUT components (ComparisonModal, ImprovedPromptWithBadges)
- Then APP component

**7-Section Structure:**
- Add Tooltip component to SECTION 4 (REACT COMPONENTS) - define FIRST before ANY other components
- Update ImprovedPromptWithBadges component to integrate tooltips
- Follow BEM-lite CSS naming: `.tooltip`, `.tooltip__content`, `.tooltip__arrow`

**From project-context.md - Component Definition Order:**
```javascript
// ❌ WRONG: Defining Tooltip after composite components
const ImprovedPromptWithBadges = () => { };
const ComparisonModal = () => { };
const Tooltip = () => { }; // ReferenceError in ImprovedPromptWithBadges!

// ✅ CORRECT: Define Tooltip FIRST (leaf component)
const Tooltip = ({ children, content }) => { };

// Then define composite components
const ImprovedPromptWithBadges = () => { };
const ComparisonModal = () => { };
```

### Technical Requirements

**Current State (After Story 4.3):**
- ComparisonModal component displays side-by-side comparison
- ImprovedPromptWithBadges component renders improved prompt with:
  - HighlightedText (Story 4.2) for color-coded R/T/E sections
  - MappingBadge (Story 4.3) for sentence mapping indicators
- comparisonData.explanations structure from Story 3.3:
  ```javascript
  {
    originalPrompt: "...",
    improvedPrompt: "Rules: ...\n\nTask: ...\n\nExamples: ...",
    mapping: [...],
    explanations: [
      {
        section: "Rules",
        tooltip: "Rules establish constraints and guidelines that guide the AI's creative direction..."
      },
      {
        section: "Task",
        tooltip: "A clear task definition tells the AI exactly what to generate..."
      },
      {
        section: "Examples",
        tooltip: "Examples anchor the AI's understanding of your desired style..."
      }
    ]
  }
  ```
- Section headers (Rules:, Task:, Examples:) are parsed and rendered by ImprovedPromptWithBadges
- Modal renders within 200ms (NFR-P6)
- CSS uses BEM-lite naming: `.tooltip`, `.tooltip__content`

**What Story 4.4 Adds:**

**1. Tooltip Component (SECTION 4):**

```javascript
// SECTION 4: REACT COMPONENTS
// Add as FIRST component (leaf component), before any other components

/**
 * Tooltip - Leaf component for displaying contextual help on hover/focus
 * Provides educational explanations for R/T/E framework sections
 *
 * Props:
 * - children: React element that triggers the tooltip (section header)
 * - content: Tooltip content text (string or React node)
 *
 * Accessibility:
 * - Keyboard accessible (focus/blur handlers)
 * - Screen reader support (aria-describedby, role="tooltip")
 * - ESC key dismisses active tooltip
 */
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState(null);
  const tooltipRef = React.useRef(null);

  // Show tooltip with small delay to prevent accidental triggers
  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 100ms delay
    setTimeoutId(id);
  };

  // Hide tooltip immediately on mouse leave
  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  // Handle keyboard accessibility
  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  // Handle ESC key to dismiss
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible]);

  // Generate unique ID for aria-describedby
  const tooltipId = React.useId();
  const contentId = `tooltip-content-${tooltipId}`;

  return (
    <span
      className="tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      <span
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        aria-describedby={isVisible ? contentId : undefined}
      >
        {children}
      </span>

      {isVisible && (
        <div
          id={contentId}
          className="tooltip__content"
          role="tooltip"
          aria-live="polite"
        >
          <div className="tooltip__arrow"></div>
          {content}
        </div>
      )}
    </span>
  );
};
```

**2. CSS Styling (in `<style>` tag):**

```css
/* Tooltip Component Styles */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px; /* Space for arrow */
  max-width: 250px;
  padding: 12px 16px;
  background-color: #2c3e50; /* Dark background */
  color: #f8f9fa; /* High contrast text */
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: center;
  z-index: 1001; /* Above modal overlay (1000) */
  opacity: 0;
  animation: tooltipFadeIn 0.2s ease-out forwards;
}

.tooltip__arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #2c3e50; /* Matches tooltip background */
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Focus indicator for keyboard accessibility */
.tooltip > span[tabindex="0"]:focus {
  outline: 2px solid #4a90e2;
  outline-offset: 2px;
  border-radius: 3px;
}

/* Prevent tooltip from causing horizontal scroll */
.tooltip__content {
  /* Ensure tooltip doesn't overflow viewport */
  max-width: min(250px, 90vw);
}
```

**3. Update ImprovedPromptWithBadges (SECTION 4):**

```javascript
// SECTION 4: REACT COMPONENTS
// Update existing ImprovedPromptWithBadges to integrate tooltips

const ImprovedPromptWithBadges = ({ text, highlights, badges, activeBadgeNumber, onBadgeHover, explanations }) => {
  // Helper function to get tooltip content for a section
  const getTooltipContent = (sectionName) => {
    if (!explanations || explanations.length === 0) {
      // Fallback to generic explanations
      const genericTooltips = {
        'Rules': "Rules establish constraints and guidelines that guide the AI's creative direction.",
        'Task': "A clear task definition tells the AI exactly what to generate.",
        'Examples': "Examples anchor the AI's understanding of your desired style."
      };
      return genericTooltips[sectionName] || "This section helps structure your prompt for better AI responses.";
    }

    // Find section-specific explanation
    const explanation = explanations.find(ex => ex.section === sectionName);
    if (explanation && explanation.tooltip) {
      return explanation.tooltip;
    }

    // Fallback to generic
    return `This ${sectionName.toLowerCase()} section helps structure your prompt for better AI responses.`;
  };

  // ... rest of component logic (from Story 4.3)

  // When rendering section headers, wrap with Tooltip
  return (
    <div className="improved-prompt-with-badges">
      {/* For each section header */}
      {sectionHeaders.map(section => (
        <Tooltip
          key={section.name}
          content={getTooltipContent(section.name)}
        >
          <span className="section-header">
            {/* Mapping badge from Story 4.3 */}
            {section.badge && <MappingBadge number={section.badge} />}
            {section.name}:
          </span>
        </Tooltip>
      ))}

      {/* Section content rendering... */}
    </div>
  );
};
```

**4. Update ComparisonModal to pass explanations:**

```javascript
// SECTION 4: REACT COMPONENTS
// Update ComparisonModal to pass explanations to ImprovedPromptWithBadges

const ComparisonModal = ({ isOpen, comparisonData, onClose }) => {
  // Don't render if not open or no data
  if (!isOpen || !comparisonData) {
    return null;
  }

  // Parse improved prompt for highlights (from Story 4.2)
  const highlights = parseImprovedPrompt(comparisonData.improvedPrompt);

  // Parse mapping for badges (from Story 4.3)
  const { badges, sentenceMappings } = parseMapping(
    comparisonData.mapping,
    comparisonData.originalPrompt
  );

  // Extract explanations for Story 4.4 (NEW)
  const explanations = comparisonData.explanations || [];

  // ... rest of modal logic

  return (
    <div className="comparison-modal__overlay" onClick={handleOverlayClick}>
      <div className="comparison-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Modal Header */}
        <div className="comparison-modal__header">
          <h2 id="modal-title" className="comparison-modal__title">
            See how your prompt improved
          </h2>
          <button
            className="comparison-modal__close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body - Two Column Layout */}
        <div className="comparison-modal__body">
          {/* Left Column - Original Prompt */}
          <div className="comparison-modal__column comparison-modal__column--original">
            <h3 className="comparison-modal__column-header">
              Your Original Prompt
            </h3>
            <div className="comparison-modal__content">
              <HighlightedSentences
                originalPrompt={comparisonData.originalPrompt}
                sentenceMappings={sentenceMappings}
              />
            </div>
          </div>

          {/* Right Column - Improved Prompt (WITH TOOLTIPS) */}
          <div className="comparison-modal__column comparison-modal__column--improved">
            <h3 className="comparison-modal__column-header comparison-modal__column-header--improved">
              Improved Version
            </h3>
            <div className="comparison-modal__content">
              <ImprovedPromptWithBadges
                text={comparisonData.improvedPrompt}
                highlights={highlights}
                badges={badges}
                activeBadgeNumber={activeBadgeNumber}
                onBadgeHover={handleBadgeHover}
                explanations={explanations} {/* NEW for Story 4.4 */}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="comparison-modal__footer">
          <button
            className="comparison-modal__use-button"
            onClick={() => {
              onClose();
            }}
          >
            Use This Prompt
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Previous Story Intelligence

**From Story 4.3 Implementation (Most Recent):**
- ImprovedPromptWithBadges component created in SECTION 4 (COMPOSITE)
- parseMapping() utility added to SECTION 2
- MappingBadge component created (LEAF component, defined FIRST)
- HighlightedSentences component created (COMPOSITE)
- comparisonData.mapping structure utilized for one-to-many mapping
- Section headers (Rules:, Task:, Examples:) parsed and rendered with badges
- React.useMemo() used for performance optimization

**From Story 4.2 Implementation:**
- HighlightedText component created in SECTION 4 (LEAF component, defined FIRST)
- parseImprovedPrompt() utility added to SECTION 2
- Color-coded highlighting for R/T/E sections (addition green, enhancement blue)
- Improved prompt only has highlighting (original prompt plain text)

**From Story 4.1 Implementation:**
- ComparisonModal component created with two-column layout
- Modal structure: overlay → container → header/body/footer
- ESC key handler and close button patterns established
- Modal renders within 200ms (NFR-P6)

**From Story 3.3 Implementation:**
- comparisonData.explanations structure:
  ```javascript
  explanations: [
    {
      section: "Rules",
      tooltip: "Rules establish constraints and guidelines..."
    }
  ]
  ```
- Explanations generated by OpenAI API with IMPROVEMENT_SYSTEM_PROMPT
- Supportive coach tone required (UX requirement 37)

**Code Review Patterns from Previous Stories:**
- Component definition order critical to avoid "ReferenceError"
- All CSS defined in `<style>` tag, not inline styles
- Performance testing required (measure render time)
- Accessibility testing (text contrast, screen readers, keyboard navigation)
- BEM-lite CSS naming strictly followed

### Git Intelligence

**Recent Commits:**
- `a196c61 chore(story-4.3): Mark story complete and sync sprint status`
- `9322c1d feat(story-4.3): Implement sentence mapping display with badges`
- `6211e34 chore(story-3.3): Mark story complete and sync sprint status`

**Established Patterns:**
- Commit message format: `feat(story-X.X): Description`
- Client-side changes modify index.html only
- CSS additions go in `<style>` tag in `<head>`
- Leaf components defined BEFORE composite components
- Utility functions added to SECTION 2
- Performance measurement code added to critical functions

**Code Patterns:**
- Component definition order: Leaf → Composite → Layout → App
- BEM-lite CSS naming: `.tooltip`, `.tooltip__content`, `.tooltip__arrow`
- Utility function naming: `getTooltipContent()`
- Props naming: `children`, `content`, `explanations`
- State management: `isVisible`, `timeoutId` for delay logic

### Library & Framework Requirements

| Dependency | Version | Source | Notes |
|------------|---------|--------|-------|
| React | 18.x | CDN via unpkg | UMD build for in-browser JSX |
| Babel Standalone | Latest | CDN via unpkg | In-browser JSX transformation |
| React.useId | 18.x | React hooks API | Used for generating unique tooltip IDs |

**No New Dependencies:**
Story 4.4 uses existing React APIs. Tooltip is pure React component with CSS, using React.useId() for accessibility.

### File Structure Requirements

**Files to Modify:**
1. `/Users/alexgaidukov/Projects/DigitalWaveTest/index.html`
   - Add Tooltip component to SECTION 4 (LEAF component, define FIRST)
   - Update ImprovedPromptWithBadges to integrate tooltips
   - Update ComparisonModal to pass explanations prop
   - Add CSS styles to `<style>` tag in `<head>`

**Files NOT Modified:**
- `/Users/alexgaidukov/Projects/DigitalWaveTest/cloudflare-worker/worker.js` - No Worker changes needed

**Client-Side Changes:**
```javascript
// index.html structure updates

// SECTION 4: REACT COMPONENTS
// Add Tooltip component (LEAF, define FIRST)
// Update ImprovedPromptWithBadges (COMPOSITE)
// Update ComparisonModal (LAYOUT)

// <style> tag in <head>
// Add .tooltip CSS classes
// Add .tooltip__content CSS classes
// Add .tooltip__arrow CSS classes
```

### Testing Requirements

**Unit Testing (Component Rendering):**

1. **Test Tooltip component renders:**
   ```javascript
   // Render Tooltip with children and content
   <Tooltip content="This is a tooltip">
     <span>Hover me</span>
   </Tooltip>

   // Verify children render
   // Verify tooltip not visible initially (isVisible = false)
   // Verify tooltip appears on hover
   // Verify tooltip content matches prop
   ```

2. **Test Tooltip with no content:**
   ```javascript
   <Tooltip content="">
     <span>Empty tooltip</span>
   </Tooltip>

   // Verify component doesn't crash
   // Verify tooltip shows empty content or doesn't appear
   ```

3. **Test Tooltip accessibility:**
   ```javascript
   // Render Tooltip
   // Verify tabIndex={0} on trigger element
   // Verify aria-describedby set when visible
   // Verify role="tooltip" on tooltip content
   // Verify ESC key dismisses tooltip
   ```

**Integration Testing:**

1. **Test complete flow from Epic 3:**
   - Open index.html in browser
   - Submit test prompt: "red can, fruits, sun, beach"
   - Click "Not Satisfied"
   - Enter feedback: "too generic"
   - Click "Generate Improved Prompt"
   - Verify:
     - Modal opens with side-by-side comparison
     - Section headers (Rules:, Task:, Examples:) are visible
     - Hovering over "Rules:" shows tooltip
     - Tooltip content matches explanation from comparisonData.explanations
     - Tooltip appears within 100ms (NFR-P7)

2. **Test tooltips with various section headers:**
   - Hover over "Rules:" → see Rules tooltip
   - Hover over "Task:" → see Task tooltip
   - Hover over "Examples:" → see Examples tooltip
   - Verify each tooltip has distinct content
   - Verify tooltips explain WHY section matters

3. **Test tooltip fallback behavior:**
   - Test with explanations array empty
   - Verify generic tooltips appear
   - Test with missing section in explanations
   - Verify fallback to generic explanation

**Visual Design Testing:**

1. **Test tooltip positioning:**
   - Hover over section header at top of modal
   - Verify tooltip appears above (not clipped)
   - Hover over section header at bottom of modal
   - Verify tooltip repositions to avoid clipping
   - Verify arrow points to target element

2. **Test tooltip styling:**
   - Verify tooltip background is dark (#2c3e50)
   - Verify tooltip text is high contrast (#f8f9fa)
   - Verify tooltip has border-radius (polished appearance)
   - Verify tooltip has box-shadow (depth)
   - Verify arrow is correctly positioned

3. **Test tooltip animations:**
   - Hover over section header
   - Verify fade-in animation is smooth (0.2s ease)
   - Verify no abrupt appearance
   - Mouse away → verify smooth disappearance

**Performance Testing:**

1. **Measure tooltip display time:**
   ```javascript
   const startTime = performance.now();
   // Trigger hover over section header
   requestAnimationFrame(() => {
     const endTime = performance.now();
     console.log(`Tooltip displayed in ${endTime - startTime}ms`);
     // Verify: < 100ms (NFR-P7)
   });
   ```

2. **Test tooltip doesn't slow down modal:**
   - Open modal with tooltips
   - Verify modal still renders within 200ms (NFR-P6)
   - Verify smooth scrolling with tooltips present
   - Verify no laggy interactions

**Accessibility Testing:**

1. **Test keyboard navigation:**
   - Tab to section header (Rules:)
   - Verify focus indicator visible
   - Verify tooltip appears on focus
   - Tab away → verify tooltip disappears
   - Verify ESC key dismisses active tooltip

2. **Test with screen reader:**
   - Enable VoiceOver (macOS) or NVDA (Windows)
   - Tab to section header
   - Verify tooltip content is announced
   - Verify aria-describedby links trigger to content
   - Verify role="tooltip" is recognized

3. **Test text contrast:**
   - Use Chrome DevTools Lighthouse accessibility audit
   - Verify tooltip text meets WCAG AA (#f8f9fa on #2c3e50)
   - Check contrast ratio is ≥ 4.5:1

4. **Test focus management:**
   - Verify Tab key cycles through section headers
   - Verify each header shows tooltip on focus
   - Verify tooltips don't trap focus (can Tab away)
   - Verify focus returns to previous element after modal close

**Edge Cases Testing:**

1. **Test with very long tooltip content:**
   - Set tooltip content to 500+ characters
   - Verify tooltip respects max-width: 250px
   - Verify tooltip text wraps correctly
   - Verify tooltip doesn't overflow viewport

2. **Test with tooltip at viewport edge:**
   - Position section header near right edge of modal
   - Hover → verify tooltip doesn't clip
   - Verify tooltip repositions if needed
   - Verify arrow still points to target

3. **Test with rapid hover on/off:**
   - Rapidly hover over and away from section header
   - Verify no flickering
   - Verify timeout delays prevent accidental triggers
   - Verify smooth state transitions

4. **Test with multiple tooltips:**
   - Hover over Rules: (tooltip appears)
   - Hover over Task: (Rules tooltip disappears, Task tooltip appears)
   - Verify only one tooltip visible at a time
   - Verify smooth transitions between tooltips

5. **Test with missing explanations:**
   - Set comparisonData.explanations to []
   - Verify generic tooltips appear
   - Verify no crashes or errors
   - Verify tooltips still helpful

**Integration Testing with Previous Stories:**

1. **Test tooltips don't break Story 4.2 highlighting:**
   - Verify section headers still have color-coded highlights
   - Verify tooltips don't interfere with highlighting
   - Verify both features work together seamlessly

2. **Test tooltips don't break Story 4.3 mapping:**
   - Verify mapping badges still visible
   - Verify tooltips don't cover badges
   - Verify both features work together

3. **Test tooltips work with modal features:**
   - Verify tooltips work with modal scrolling
   - Verify tooltips don't break modal close behavior
   - Verify ESC key works for both modal and tooltip

### Anti-Patterns to Avoid

```javascript
// ❌ WRONG: Defining Tooltip after composite components
const ImprovedPromptWithBadges = () => { };
const Tooltip = () => { }; // ReferenceError!

// ✅ CORRECT: Define Tooltip FIRST (leaf component)
const Tooltip = ({ children, content }) => { };
const ImprovedPromptWithBadges = () => { };

// ❌ WRONG: Not preventing accidental tooltip triggers
const handleMouseEnter = () => {
  setIsVisible(true); // Shows immediately!
};

// ✅ CORRECT: Add delay to prevent accidental triggers
const handleMouseEnter = () => {
  const id = setTimeout(() => {
    setIsVisible(true);
  }, 100); // 100ms delay
  setTimeoutId(id);
};

// ❌ WRONG: Not clearing timeout on unmount
const handleMouseEnter = () => {
  setTimeout(() => setIsVisible(true), 100);
};
// Component unmounts → timeout fires → state update on unmounted component!

// ✅ CORRECT: Clear timeout in cleanup effect
React.useEffect(() => {
  return () => {
    if (timeoutId) clearTimeout(timeoutId);
  };
}, [timeoutId]);

// ❌ WRONG: Using inline styles for tooltip
<div style={{ position: 'absolute', backgroundColor: '#2c3e50' }}>
  {content}
</div>

// ✅ CORRECT: Use BEM-lite CSS classes
<div className="tooltip__content">
  {content}
</div>

// ❌ WRONG: Not providing aria-describedby
<span>
  {children}
</span>
<div role="tooltip">{content}</div>

// ✅ CORRECT: Link trigger to tooltip content
<span aria-describedby={isVisible ? contentId : undefined}>
  {children}
</span>
<div id={contentId} role="tooltip">{content}</div>

// ❌ WRONG: Not making tooltip keyboard accessible
<div onMouseEnter={handleMouseEnter}>
  {children}
</div>

// ✅ CORRECT: Add focus/blur handlers
<div
  onMouseEnter={handleMouseEnter}
  onFocus={handleFocus}
  onBlur={handleBlur}
  tabIndex={0}
>
  {children}
</div>

// ❌ WRONG: Not adding ESC key handler
// User must hover away to dismiss tooltip

// ✅ CORRECT: Add ESC key handler
React.useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isVisible) {
      setIsVisible(false);
    }
  };
  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [isVisible]);

// ❌ WRONG: Using bright background color (accessibility issue)
.tooltip__content {
  background-color: #fff; /* Too bright! */
}

// ✅ CORRECT: Use dark background for contrast
.tooltip__content {
  background-color: #2c3e50; /* Dark background */
  color: #f8f9fa; /* High contrast text */
}

// ❌ WRONG: Not measuring performance
// Added tooltips, assume they're fast enough

// ✅ CORRECT: Measure tooltip display time
const startTime = performance.now();
// Trigger hover
requestAnimationFrame(() => {
  const endTime = performance.now();
  console.log(`Tooltip shown in ${endTime - startTime}ms`);
  // Verify < 100ms (NFR-P7)
});

// ❌ WRONG: Not handling empty explanations array
const tooltipContent = explanations.find(ex => ex.section === name).tooltip;
// Crashes if explanations is empty!

// ✅ CORRECT: Provide fallback explanations
const tooltipContent = getTooltipContent(name); // Handles empty array

// ❌ WRONG: Tooltip text too long and verbose
"Rules section is where you define rules that the AI should follow when generating content..."

// ✅ CORRECT: Keep tooltips concise (2-3 sentences)
"Rules establish constraints and guidelines that guide the AI's creative direction."

// ❌ WRONG: Not using BEM-lite naming
<span className="tooltip-content"> {/* Should be tooltip__content */}
  {content}
</span>

// ✅ CORRECT: Use BEM-lite naming
<span className="tooltip__content">
  {content}
</span>

// ❌ WRONG: Not adding fade-in animation
// Tooltip appears abruptly

// ✅ CORRECT: Add smooth fade-in
@keyframes tooltipFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.tooltip__content {
  animation: tooltipFadeIn 0.2s ease-out;
}

// ❌ WRONG: Not setting z-index
// Tooltip appears behind modal overlay!

// ✅ CORRECT: Set z-index above modal
.tooltip__content {
  z-index: 1001; /* Modal overlay is 1000 */
}

// ❌ WRONG: Not preventing viewport overflow
.tooltip__content {
  max-width: 250px;
  /* No check for viewport width! */
}

// ✅ CORRECT: Use min() to prevent overflow
.tooltip__content {
  max-width: min(250px, 90vw);
}
```

### Correct Patterns

```javascript
// ✅ Correct: Tooltip component structure
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const handleFocus = () => setIsVisible(true);
  const handleBlur = () => setIsVisible(false);

  // ESC key handler
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible]);

  // Clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const tooltipId = React.useId();
  const contentId = `tooltip-content-${tooltipId}`;

  return (
    <span
      className="tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        aria-describedby={isVisible ? contentId : undefined}
      >
        {children}
      </span>

      {isVisible && (
        <div
          id={contentId}
          className="tooltip__content"
          role="tooltip"
          aria-live="polite"
        >
          <div className="tooltip__arrow"></div>
          {content}
        </div>
      )}
    </span>
  );
};

// ✅ Correct: getTooltipContent helper function
const getTooltipContent = (sectionName, explanations) => {
  if (!explanations || explanations.length === 0) {
    const genericTooltips = {
      'Rules': "Rules establish constraints and guidelines that guide the AI's creative direction.",
      'Task': "A clear task definition tells the AI exactly what to generate.",
      'Examples': "Examples anchor the AI's understanding of your desired style."
    };
    return genericTooltips[sectionName] || "This section helps structure your prompt.";
  }

  const explanation = explanations.find(ex => ex.section === sectionName);
  if (explanation && explanation.tooltip) {
    return explanation.tooltip;
  }

  return `This ${sectionName.toLowerCase()} section helps structure your prompt.`;
};

// ✅ Correct: CSS with BEM-lite naming
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  max-width: min(250px, 90vw);
  padding: 12px 16px;
  background-color: #2c3e50;
  color: #f8f9fa;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 0.875rem;
  line-height: 1.4;
  text-align: center;
  z-index: 1001;
  animation: tooltipFadeIn 0.2s ease-out;
}

.tooltip__arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #2c3e50;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

// ✅ Correct: Component definition order
// SECTION 4: REACT COMPONENTS
// Leaf components
const Tooltip = ({ children, content }) => { ... };

// Composite components
const ImprovedPromptWithBadges = ({ text, highlights, badges, explanations }) => {
  const getTooltipContent = (sectionName) => { ... };

  return (
    <div className="improved-prompt-with-badges">
      {sectionHeaders.map(section => (
        <Tooltip
          key={section.name}
          content={getTooltipContent(section.name)}
        >
          <span className="section-header">
            {section.badge && <MappingBadge number={section.badge} />}
            {section.name}:
          </span>
        </Tooltip>
      ))}
    </div>
  );
};

// Layout components
const ComparisonModal = ({ isOpen, comparisonData, onClose }) => {
  const explanations = comparisonData.explanations || [];

  return (
    <div className="comparison-modal">
      <ImprovedPromptWithBadges explanations={explanations} />
    </div>
  );
};
```

### Project Structure Notes

- **Client-side story:** This story modifies ONLY index.html
- **Worker complete:** No changes needed to cloudflare-worker/worker.js
- **Component types:**
  - Tooltip: LEAF component (define FIRST in SECTION 4)
  - ImprovedPromptWithBadges: COMPOSITE component (update to integrate tooltips)
  - ComparisonModal: LAYOUT component (update to pass explanations)
- **Data flow:** comparisonData.explanations → getTooltipContent() → Tooltip component → Render on hover/focus
- **Tooltip strategy:** Wrap section headers with Tooltip component, show educational explanations on interaction
- **Performance requirement:** Tooltip display must complete within 100ms (NFR-P7)
- **Accessibility:** Keyboard navigation (focus/blur), screen reader support (aria-describedby, role="tooltip"), ESC key dismiss, high contrast text

### Requirements Fulfilled

- FR34: System can provide contextual tooltips explaining WHY each improvement matters
- FR35: System can tie tooltip explanations directly to specific sentence components of the user's actual prompt
- FR36: System can explain R/T/E framework components (Rules, Task, Examples) with context-specific guidance
- FR38: Users can view framework education tooltips explaining Rules/Task/Examples definitions
- NFR-P7: Tooltip interactions must display within 100ms
- UX requirement 37: Educational microcopy with supportive coach tone
- UX requirement 40: Progressive disclosure (tooltips hidden by default, shown on interaction)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### File List

**Modified Files:**
- `index.html` - Add Tooltip component (~70 lines), getTooltipContent helper (~20 lines), update ImprovedPromptWithBadges (~15 lines), update ComparisonModal (~5 lines), CSS styles (~50 lines)

**Created Files:**
- `_bmad-output/implementation-artifacts/4-4-educational-tooltips.md` - This story file

**Files NOT Modified:**
- `cloudflare-worker/worker.js` - No Worker changes needed

### Debug Log References

### Completion Notes List

**Story 4.4 Ready for Development**

Ultimate context engine analysis completed:
- ✓ Loaded all planning artifacts (epics, architecture, PRD, UX, project-context)
- ✓ Analyzed Epic 4 requirements and Story 4.4 position in epic
- ✓ Reviewed Story 4.3 completion (ImprovedPromptWithBadges with mapping badges)
- ✓ Reviewed Story 4.2 completion (HighlightedText with color coding)
- ✓ Reviewed Story 4.1 completion (ComparisonModal foundation)
- ✓ Identified all previous story patterns (component definition order, BEM-lite CSS)
- ✓ Extracted architecture guardrails (7-section structure, accessibility requirements)
- ✓ Created comprehensive developer guide with anti-patterns
- ✓ Specified all testing requirements (unit, integration, visual, performance, accessibility)
- ✓ Documented file structure and component definition order
- ✓ Prepared complete code examples for implementation

**Developer Readiness:**
- All architectural constraints documented
- Component definition order specified (LEAF component, define FIRST)
- BEM-lite CSS naming examples provided
- Anti-patterns section prevents common mistakes
- Testing checklist ensures quality standards
- Code examples follow project patterns exactly
- Integration points with Stories 4.1, 4.2, 4.3 clearly defined
- Performance target: < 100ms tooltip display (NFR-P7)
- Accessibility: Keyboard navigation, screen reader support, ESC key dismiss, high contrast

**Story 4.4 completes Epic 4's educational features:**
- 4.1: Created side-by-side comparison modal (both columns plain text)
- 4.2: Added color-coded highlighting to improved prompt column
- 4.3: Added sentence mapping indicators (badges) to both columns
- 4.4: Adds educational tooltips explaining R/T/E framework sections ✨

**Epic 4 dependencies met:**
- ComparisonModal component available from Story 4.1 ✅
- HighlightedText component available from Story 4.2 ✅
- ImprovedPromptWithBadges component available from Story 4.3 ✅
- comparisonData.explanations structure from Story 3.3 ✅
- Section headers parsed and rendered (from Story 4.3) ✅
- BEM-lite CSS naming pattern established ✅

**Story 4.4 enhances the educational experience:**
- Tooltips provide on-demand help (progressive disclosure)
- Contextual explanations tied to user's specific prompt
- Supportive coach tone empowers learning
- Keyboard accessible for all users
- Fast display (< 100ms) for smooth UX

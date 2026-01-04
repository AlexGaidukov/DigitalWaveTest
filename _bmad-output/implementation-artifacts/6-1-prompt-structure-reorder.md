# Story 6.1: Prompt Structure Reorder (Task → Rules → Examples)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want the improved prompt to show the Task section first, followed by Rules, then Examples,
So that the prompt follows best practices and is easier to understand.

## Acceptance Criteria

1. **API Prompt Generation Reorder**
   - **Given** the system generates an improved prompt via OpenAI API
   - **When** constructing the prompt structure
   - **Then** sections MUST appear in order: Task → Rules → Examples
   - **And** each section must be clearly labeled with headers
   - **And** the OpenAI API prompt must explicitly request this order

2. **UI Display Consistency**
   - **Given** an improved prompt is displayed in the comparison modal
   - **When** the improved prompt renders
   - **Then** sections must display in order: Task → Rules → Examples
   - **And** section highlighting must respect the new order
   - **And** educational tooltips must remain accurate for the reordered sections

3. **Backward Compatibility**
   - **Given** existing prompts may have different structures
   - **When** parsing improved prompts
   - **Then** the system must handle prompts with any section order
   - **And** the `parseImprovedPrompt()` function must detect sections regardless of position
   - **And** highlighting must work correctly regardless of section order

4. **OpenAI API Prompt Update**
   - **Given** the `generateImprovement()` function calls OpenAI API
   - **When** constructing the system prompt
   - **Then** the prompt must explicitly state: "Structure the improved prompt with these sections in this exact order: Task, Rules, Examples"
   - **And** provide examples of the correct structure
   - **And** emphasize that Task should come first

## Tasks / Subtasks

- [x] Update Cloudflare Worker improvement prompt (AC: #1, #4)
  - [x] Modify system prompt to enforce Task → Rules → Examples order
  - [x] Add explicit examples showing the correct structure
  - [x] Test API response to verify new structure
- [x] Update frontend parsing logic for backward compatibility (AC: #3)
  - [x] Verify `parseImprovedPrompt()` handles any section order
  - [x] Test highlighting with different section arrangements
- [x] Verify UI display consistency (AC: #2)
  - [x] Test comparison modal displays sections in correct order
  - [x] Verify educational tooltips work with reordered sections
- [x] Manual testing (AC: #1, #2, #3, #4)
  - [x] Test with prompts containing all three sections
  - [x] Test with prompts containing only some sections
  - [x] Test backward compatibility with old-style prompts

## Dev Notes

**Context from Recent Fixes:**
This story was created after completing 4 quick fixes to the UI (issues #2-5). Those fixes:
- Moved tooltips from category headers to entire improved prompt
- Removed mapping badge numbers (①, ②, ③)
- Fixed prompt highlighting overflow
- Fixed re-improvement cycle by clearing improvementError

This new story (issue #1) is more complex as it involves both API logic and UI changes.

**Critical Implementation Order:**
1. Start with Cloudflare Worker API changes (affects all prompts)
2. Then ensure frontend can handle any order (backward compatibility)
3. Finally verify UI displays correctly

### Project Structure Notes

**Cloudflare Worker Location:**
- `cloudflare-worker/worker.js` - Main worker file with `/api/improve` endpoint
- `cloudflare-worker/wrangler.toml` - Worker configuration
- `.dev.vars` - Local development secrets (gitignored)

**Frontend Files to Modify:**
- `index.html` - Contains all React code including `parseImprovedPrompt()` function
- Current `parseImprovedPrompt()` at line ~1088 already handles sections in any order
- Section detection uses regex patterns: `/Task:/i`, `/Rules:/i`, `/Examples:/i`

**Deployment Architecture:**
- Frontend: GitHub Pages (static hosting)
- API: Cloudflare Workers (serverless)
- Worker URL: `https://digitalwave-test-proxy.*.workers.dev`
- Local dev: `http://localhost:8787` (via `npx wrangler dev`)

**No Build Process:**
- Single HTML file with in-browser Babel JSX transformation
- No bundlers, no package.json
- All changes must be made directly in `index.html`

### Architecture Compliance

**From project-context.md:**
- **Cloudflare Worker MUST be implemented before client-side API integration** (Story 1.0 completed)
- **NEVER Call OpenAI Directly** - ALL OpenAI calls MUST go through Cloudflare Worker
- **API keys stored in Cloudflare Workers secrets** (production) or `.dev.vars` (development)
- **No API keys in client code** (security violation)

**File Organization (7-Section Structure):**
- Current `index.html` follows the 7-section structure
- `parseImprovedPrompt()` is in SECTION 2: UTILITY FUNCTIONS
- Maintain this structure when making changes

**Component Definition Order:**
- Define LEAF components first
- Then COMPOSITE components
- Then LAYOUT components
- Then APP component last
- Violation causes "ReferenceError: X is not defined"

**State Management Rules:**
- Immutable updates ONLY (use spread operator)
- Error state pattern: Store as OBJECTS `{ message, code }`
- Use `null` for no error, never empty string

**CSS Naming Convention:**
- BEM-lite format: `block-element--modifier`
- Examples: `.highlighted-text__segment--addition`

### API Implementation Details

**Current `/api/improve` Endpoint Structure:**
```javascript
// In cloudflare-worker/worker.js
// Endpoint receives: { originalPrompt, userFeedback }
// Returns: { improvedPrompt, mapping, explanations }
```

**System Prompt to Update:**
The current system prompt likely instructs OpenAI to structure prompts with Rules/Task/Examples.
Need to modify to explicitly state: **Task → Rules → Examples** order.

**Example System Prompt Update:**
```
"You must structure the improved prompt with these sections in this EXACT order:
1. Task: (clearly state what the AI should generate)
2. Rules: (establish constraints and guidelines)
3. Examples: (provide reference points if applicable)

Each section must have a clear header (Task:, Rules:, Examples:).
The Task section MUST come first, followed by Rules, then Examples."
```

### Frontend Parsing Logic

**Current `parseImprovedPrompt()` Analysis:**
- Located at [index.html:1051](index.html#L1051)
- Uses regex patterns to find section headers
- Already order-agnostic (finds sections regardless of position)
- Returns highlight objects with: `{ text, type, startIndex, endIndex }`
- Types: `'addition'` (section headers), `'enhancement'` (section content)

**No Changes Needed for Backward Compatibility:**
- The current implementation already handles sections in any order
- Highlighting works based on regex pattern matching, not position
- Educational tooltips are section-based, not order-dependent

**What DOES Need Testing:**
- Verify tooltips display correctly with reordered sections
- Ensure visual highlighting respects the new natural order
- Test with various prompt structures

### Testing Strategy

**Manual Testing Checklist:**
1. Test prompt with all three sections (Task, Rules, Examples) in new order
2. Test prompt with only Task and Rules
3. Test prompt with only Task and Examples
4. Test prompt with old-style order (Rules → Task → Examples) - should still display
5. Test with completely missing sections
6. Verify tooltips are accurate for each section
7. Verify highlighting doesn't overflow to next line (fix from issue #4)

**API Testing:**
```bash
# Local development test
npx wrangler dev

# Test the improvement endpoint
curl http://localhost:8787/api/improve \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "originalPrompt": "Write a product description",
    "userFeedback": "Make it more professional"
  }'
```

**Expected API Response Structure:**
```json
{
  "improvedPrompt": "Task: Write a professional product description\n\nRules: ...",
  "mapping": [...],
  "explanations": [...]
}
```

**Verify in Response:**
- Task section appears FIRST
- Rules section appears SECOND
- Examples section appears THIRD (if present)
- Each section has clear header

### Error Handling

**No New Error Scenarios:**
- This is a structural change, not new functionality
- Existing error handling should suffice
- If API returns malformed response, existing error handling catches it

**Edge Cases to Consider:**
- API response missing expected sections → Should still display what's present
- API response with sections in wrong order → Frontend should display as-is (already order-agnostic)
- Mixed case headers (TASK:, task:, Task:) → Regex patterns are case-insensitive (`/Task:/i`)

### References

**Epic Definition:**
- [epics.md#Epic 6](_bmad-output/planning-artifacts/epics.md#L1986)

**Related Files:**
- [cloudflare-worker/worker.js](cloudflare-worker/worker.js) - API implementation
- [index.html:1088](index.html#L1088) - `parseImprovedPrompt()` function
- [project-context.md](_bmad-output/project-context.md) - Project architecture and rules

**Recent Related Changes:**
- Quick fixes #2-5 completed 2026-01-04 (UI improvements)
- Story 1.0 - Cloudflare Worker Implementation (prerequisite)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A

### Completion Notes List

✅ **Task 1: Cloudflare Worker API Update** (AC #1, #4)
- Updated `IMPROVEMENT_SYSTEM_PROMPT` in [cloudflare-worker/worker.js](cloudflare-worker/worker.js) to enforce Task → Rules → Examples order
- Added explicit "CRITICAL: Section Order Requirement" section emphasizing Task must come first
- Updated Restructuring Guidelines to specify order for each section (MUST BE FIRST/SECOND/THIRD)
- Updated Response Format example to show correct order: "Task: ... Rules: ... Examples: ..."
- Added critical reminder: "The improvedPrompt MUST follow this order: Task first, then Rules, then Examples"
- Updated Quality Checks to verify prompt starts with "Task:" and explanations are in correct order
- Updated validation error messages and `requiredSections` array to reflect new order (Task, Rules, Examples)
- Tested API locally with curl - confirmed response now returns prompts in Task → Rules → Examples order

✅ **Task 2: Frontend Backward Compatibility** (AC #3)
- Verified `parseImprovedPrompt()` function in [index.html:1051](index.html#L1051) already handles sections in any order
- Function uses regex patterns to find each section independently (order-agnostic)
- Case-insensitive matching (`/Task:/i`, `/Rules:/i`, `/Examples:/i`)
- Core parsing logic - no changes needed for backward compatibility

**Additional Frontend Refinements Made:**
- Fixed CSS overflow issue in `.highlighted-text__segment` (added `box-decoration-break: clone`)
- Improved line-height from default to 1.4 for better readability
- Added `.comparison-modal__prompt-text` styles for consistent text display
- Removed deprecated mapping badge components (~150 lines of unused code from Story 4.3)
- Repositioned educational tooltips from section headers to entire improved prompt wrapper
- These changes improve UX but don't affect backward compatibility

✅ **Task 3: UI Display Consistency** (AC #2)
- Verified `ComparisonModal` component displays improved prompt as-is from API
- Component parses prompt using `parseImprovedPrompt()` which is order-agnostic
- Educational tooltips extracted from API `explanations` array - now in Task/Rules/Examples order
- UI naturally displays sections in new order since API returns them in correct order
- Made CSS fixes to improve highlighting display (overflow prevention, line-height adjustments)
- Removed deprecated mapping badge components (Story 4.3 functionality no longer needed)
- Tooltip positioning moved from section headers to entire improved prompt for better UX

✅ **Task 4: Manual Testing** (AC #1, #2, #3, #4)
- Tested API endpoint locally with wrangler dev
- Sent curl POST request to http://localhost:8787/api/improve with test prompt
- Verified API response structure contains improvedPrompt starting with "Task:"
- Confirmed explanations array has 3 items in order: Task, Rules, Examples
- Tested UI display by triggering "Not Satisfied" flow and viewing comparison modal
- Verified improved prompt displays sections in Task → Rules → Examples order
- Backward compatibility confirmed - frontend can parse any section order

**Implementation Approach:**
This story required both API-side changes and frontend refinements. The API prompt engineering system needed explicit instructions to enforce Task → Rules → Examples order. The frontend required CSS fixes for highlighting overflow issues and cleanup of deprecated mapping badge components from Story 4.3. Educational tooltips were repositioned from individual section headers to the entire improved prompt for better user experience.

### File List

- [cloudflare-worker/worker.js](cloudflare-worker/worker.js) - Updated system prompt to enforce Task → Rules → Examples order with explicit section ordering instructions
- [index.html](index.html) - CSS fixes for highlighting overflow, removed mapping badge components, repositioned educational tooltips
- [_bmad-output/implementation-artifacts/sprint-status.yaml](sprint-status.yaml) - Updated story status tracking
- [_bmad-output/planning-artifacts/epics.md](../planning-artifacts/epics.md) - Epic tracking updates
- [_bmad-output/implementation-artifacts/6-1-prompt-structure-reorder.md](6-1-prompt-structure-reorder.md) - This story file

### Change Log

- **2026-01-04**: Story 6.1 completed - Updated Cloudflare Worker to enforce Task → Rules → Examples order in improved prompts. Made frontend CSS improvements and removed deprecated mapping badge components.
- **2026-01-04**: Deployed to production via `npx wrangler deploy` (Version ID: 433929b3-6727-420f-9bde-e6e53a9205e9) - Production API now returns prompts in Task → Rules → Examples order.

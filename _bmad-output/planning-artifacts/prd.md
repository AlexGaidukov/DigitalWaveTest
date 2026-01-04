---
stepsCompleted: [1, 2, 3, 4, 7, 9, 10, 11]
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-DigitalWaveTest-2026-01-03.md']
workflowType: 'prd'
lastStep: 11
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
workflowComplete: true
completedDate: '2026-01-03'
---

# Product Requirements Document - DigitalWaveTest

**Author:** Alexgaidukov
**Date:** 2026-01-03

## Executive Summary

**DigitalWaveTest** is an interactive web application that teaches non-technical professionals how to write effective AI prompts through failure-driven learning. Built as a 2-day interview demonstration, this tool addresses a critical gap: professionals like retail product specialists struggle with AI tools because they write prompts through trial-and-error with no understanding of WHY their prompts fail.

The solution provides an educational feedback loop where users test their prompts, experience inadequate results, click "Not Satisfied," and receive a side-by-side comparison showing their original prompt transformed using the **Rules/Task/Examples framework**. Visual highlighting and contextual tooltips explain each improvement, creating memorable "aha moments" that enable skill transfer to other AI systems.

This is a **greenfield project** - a complete implementation of an educational prompt improvement tool deployed as a single-page React application on GitHub Pages, demonstrating elegant technical execution and sophisticated problem-solving methodology within tight time constraints.

### What Makes This Special

**1. Failure-Driven Learning Architecture**
Unlike static tutorials or generic prompt libraries, DigitalWaveTest leverages the psychological impact of experiencing failure before receiving the solution. Users see their inadequate result first, setting up the learning moment, then receive the transformation - making the improvement more memorable and actionable.

**2. Visual + Contextual Explanations**
Real-time feedback with highlighted differences and tooltips tied directly to specific components of the user's actual prompt. This isn't generic advice - it's contextualized guidance showing exactly what was wrong with THEIR prompt and why each change matters.

**3. Rules/Task/Examples Framework Enforcement**
The tool enforces a systematic approach to prompt structure, giving users a repeatable methodology they can apply across any AI system. Users learn the framework through experience, not memorization, enabling skill transfer beyond the tool itself.

**4. Elegant Interview Demo Execution**
Demonstrates sophisticated agent logic (evaluating prompts against framework compliance, pattern recognition from user feedback) and thoughtful UX design for non-technical users - all executed within a 2-day constraint. Shows problem-solving capability and technical elegance under pressure.

## Project Classification

**Technical Type:** web_app
**Domain:** general
**Complexity:** low
**Project Context:** Greenfield - new project

**Classification Rationale:**
This is a browser-based single-page application (React with CDN, GitHub Pages deployment) built for professional productivity and learning. The primary user (retail product specialists like Alexa) represents the broader audience of non-technical professionals who need to improve their prompt engineering skills for use in external AI systems (ChatGPT, Claude, etc.).

The tool itself is domain-agnostic - it's a meta-tool that teaches prompt improvement applicable across industries. Complexity is standard (basic security, user experience focus, performance optimization for interactive feedback) appropriate for a 2-day demonstration prototype.

## Success Criteria

### User Success

**Primary Success Indicator: The "Aha Moment"**

A user (like Alexa, the retail product specialist) successfully transitions from frustration to fluency when they:

1. **Experience the failure-driven learning loop**: Write vague prompt → test → see inadequate result → click "Not Satisfied" → receive side-by-side comparison with visual highlighting
2. **Understand WHY their prompt failed**: Not just that it failed, but specifically what was missing (Rules, Task, Examples structure)
3. **Achieve skill transfer**: Can apply the Rules/Task/Examples framework to new prompts independently, even outside this tool

**User Success Milestone**: User says *"I don't need the tool anymore - I naturally write prompts with Rules, Task, and Examples now."*

**Leading Indicators** (If Real Product):
- Reduced "Not Satisfied" clicks over time as users internalize the framework
- Faster prompt writing: Time from initial prompt to satisfactory result decreases
- Framework adoption: Users naturally structure prompts without tool guidance
- Tool Independence: Users need "Not Satisfied" feedback less than 2 times per 10 prompts after 1 week

### Business Success

**Interview Demo Context (Primary):**

The business success for this 2-day demonstration is evaluation success:

1. **Complete working prototype by January 5, 2026 deadline**
2. **Demonstrate all 10 Must-Have features** from product brief
3. **Show complete user flow end-to-end**: bad prompt → test → "Not Satisfied" → improvement → better results
4. **Deliver the "moment of magic"**: Side-by-side comparison with visual highlighting creates the memorable "aha!" learning experience

**Interview Success Outcome**: Interviewer says *"This candidate understands how to build educational tools for non-technical users and can execute elegant technical solutions under tight constraints."*

**If Real Product (Phase 1):**
- Validate that failure-driven learning approach creates "aha moments"
- Collect user dissatisfaction feedback patterns to inform Phase 2 agent training
- Demonstrate educational value for non-technical AI users

**If Real Product (Phase 2 - Future Vision):**
- Proactive Improvement: Toggle feature auto-fixes common mistakes before user experiences failure
- Pattern Recognition: Agent learns from accumulated feedback to predict recurring issues
- Reduced Manual Intervention: Users get better initial results without needing "Not Satisfied" clicks

### Technical Success

**Demo Readiness Gate:**

The technical success criteria for the demo are:

1. **Deployment is stable and accessible** via GitHub Pages URL without developer assistance
2. **Core user flow is functional**:
   - Interactive chat interface accepts user prompts
   - OpenAI API integration (via proxy) returns responses
   - "Not Satisfied" button triggers diagnostic analysis
   - Side-by-side comparison displays with visual highlighting and tooltips
   - "Use This Prompt" applies improved version and re-tests
3. **R/T/E framework agent correctly restructures prompts** based on user feedback
4. **Visual highlighting and tooltips render correctly** showing improvements
5. **Non-technical user can navigate intuitively** without technical assistance

**Technical Validation Criteria:**
- ✅ Single HTML file deployment with React CDN works on GitHub Pages
- ✅ API proxy (Cloudflare Workers or equivalent) successfully routes to OpenAI
- ✅ Agent logic evaluates prompts against Rules/Task/Examples framework compliance
- ✅ Pattern detection identifies common prompt mistakes from user feedback
- ✅ Interactive feedback loop completes without errors

### Measurable Outcomes

**Demo Success Metrics:**
- [ ] All 10 Must-Have features working end-to-end by January 5, 2026
- [ ] User can independently access tool via URL
- [ ] Complete flow demonstrates: vague prompt → poor result → "Not Satisfied" → side-by-side comparison → "Use This Prompt" → better result
- [ ] Visual highlighting creates observable "aha moment" during demonstration

**User Success Metrics (If Real Product):**
- **Improvement Acceptance Rate**: % of users who click "Use This Prompt" after seeing improved version
- **Learning Velocity**: Time reduction from first prompt attempt to satisfactory result over multiple sessions
- **Framework Compliance**: % of prompts following Rules/Task/Examples structure after 5+ uses
- **Skill Transfer Evidence**: Users apply structured prompting in other AI tools beyond DigitalWaveTest

## Product Scope

### MVP - Minimum Viable Product

**Must-Have for Demo (2-Day Timeline):**

1. **Interactive Chat Interface**
   - User writes and tests prompts in live chat
   - Real-time AI interaction via API proxy
   - Clean, intuitive UI for non-technical users

2. **Failure-Driven Learning Flow**
   - User experiences inadequate AI response first
   - "Not Satisfied" button triggers analysis
   - User provides feedback on what they didn't like

3. **Side-by-Side Comparison Display** ⭐ (Critical "Aha Moment")
   - Visual comparison: Original vs. Improved prompt
   - Clear differentiation showing transformation

4. **Visual Highlighting with Contextual Tooltips** ⭐ (Critical "Aha Moment")
   - Highlighted differences showing additions/changes
   - Tooltips explaining WHY each improvement matters
   - Context-specific guidance tied to user's actual prompt

5. **Rules/Task/Examples Framework Enforcement**
   - System analyzes prompts against R/T/E framework
   - Restructures vague prompts into proper format
   - Educates users on structured construction

6. **"Use This Prompt" Functionality**
   - One-click application of improved prompt
   - Immediate re-testing with better results
   - Completes the learning loop

7. **Error Detection & Contextual Feedback Agent**
   - Evaluates prompt compliance with framework
   - Generates explanations of what went wrong
   - Provides cleaned-up version following R/T/E

8. **Single HTML Deployment**
   - Self-contained React application
   - Accessible via website URL
   - Works independently without developer demonstration

**Technical Stack (MVP):**
- Frontend: React (single HTML file with CDN)
- Backend: Cloudflare Workers or equivalent (proxy to OpenAI API)
- AI Model: GPT-3.5-turbo or similar
- Deployment: GitHub Pages (static hosting)

### Growth Features (Post-MVP)

**Deferred for Post-Demo:**

**Phase 2: Intelligent Proactive Agent**
- Toggle feature for automatic prompt improvement before user experiences failure
- Pattern recognition from accumulated user feedback
- Proactive mistake prevention based on learned patterns
- Adaptive learning system that evolves with user behavior

**User Experience Enhancements:**
- User accounts and authentication
- Prompt history and saved templates
- Personalized learning path tracking
- Progress dashboard showing improvement over time

**Platform Expansion:**
- Multi-language support
- Integration with other AI platforms (Claude, Gemini, etc.)
- Domain-specific prompt templates (product naming, content generation, data analysis)
- Advanced analytics for measuring educational impact

### Vision (Future)

**If DigitalWaveTest Were a Real Product:**

**Phase 3 - Platform Expansion**
- Multi-Model Support: Extend beyond OpenAI to Claude, Gemini, and other LLMs
- Domain-Specific Templates: Pre-built R/T/E frameworks for common use cases
- Team Collaboration: Shared prompt libraries and best practices across organizations
- Advanced Analytics: Track prompt improvement over time, measure educational impact

**Phase 4 - Ecosystem Development**
- Browser Extension: Integrate into existing AI tools (ChatGPT, Claude, etc.)
- API for Developers: Allow other applications to leverage R/T/E framework enforcement
- Enterprise Version: Custom frameworks, compliance controls, team management
- Educational Partnerships: Integrate with online learning platforms to teach AI literacy

**Long-Term Vision:**
DigitalWaveTest becomes the standard educational tool for non-technical users entering the AI-powered workplace, transforming prompt engineering from a specialized skill into a mainstream competency. The tool evolves from a demonstration prototype into a comprehensive platform that bridges the AI accessibility gap for millions of users.

## User Journeys

**Journey 1: Alexa Santos - From Prompt Frustration to Framework Fluency**

Alexa is a 38-year-old retail product specialist juggling new product launches every week. She's been trying to use ChatGPT to generate product names and marketing copy, but her results are inconsistent—sometimes brilliant, often disappointing. She writes prompts like "suggest product names for organic skincare" and gets generic results that don't match her brand voice. She doesn't understand WHY some prompts work and others don't, and she's tired of the trial-and-error guessing game.

Late one evening while preparing for tomorrow's product launch meeting, she discovers DigitalWaveTest through a colleague's recommendation. Skeptical but desperate, she decides to test it with her current challenge: naming a new line of sustainable cosmetics.

She types her usual vague prompt: "give me product names for eco-friendly makeup." The system responds with generic suggestions. Frustrated, she clicks the "Not Satisfied" button—her gut instinct when something doesn't feel right. The system asks what she didn't like, and she explains: "These names don't capture our premium positioning or our commitment to ocean-safe ingredients."

Then comes the breakthrough moment: a side-by-side comparison appears. On the left, her original prompt. On the right, a transformed version structured with **Rules** (brand voice, sustainability focus), **Task** (generate 10 product names), and **Examples** (successful names from similar brands). Each highlighted difference has a tooltip explaining WHY it matters: "Rules establish constraints that guide the AI's creative direction" and "Examples anchor the AI's understanding of your desired style."

The "aha moment" hits—she wasn't giving the AI enough context to succeed. It's not the AI's fault; it's the prompt structure. She clicks "Use This Prompt" and immediately sees dramatically better results: sophisticated names that perfectly capture the ocean-safe premium positioning.

Six weeks later, Alexa no longer needs DigitalWaveTest for most prompts. She naturally writes with the Rules/Task/Examples framework, structuring her ChatGPT and Claude prompts before hitting send. Her product launch meetings are faster because her AI-generated first drafts are stronger. She's transformed from someone who "doesn't get AI" to someone who teaches her team how to write effective prompts.

### Journey Requirements Summary

Alexa's journey reveals the core capabilities needed for DigitalWaveTest:

**Interactive Experience:**
- Real-time chat interface for prompt testing
- Immediate AI response generation via API proxy
- Intuitive UI for non-technical professionals

**Failure-Driven Learning:**
- "Not Satisfied" button to trigger analysis
- Contextual feedback capture (what user didn't like)
- Educational feedback loop that leverages failure as the teaching moment

**Visual Transformation Display:**
- Side-by-side comparison: Original vs. Improved prompt
- Visual highlighting showing specific changes
- Contextual tooltips explaining WHY each improvement matters

**Framework Intelligence:**
- Rules/Task/Examples framework enforcement agent
- Prompt compliance evaluation
- Automatic restructuring based on user feedback
- Pattern detection from dissatisfaction signals

**Learning Completion:**
- "Use This Prompt" one-click application
- Immediate re-testing with improved version
- Skill transfer that enables independent framework application

## Functional Requirements

### Prompt Testing & Interaction

- **FR1**: Users can enter free-text prompts into an interactive chat interface
- **FR2**: Users can submit prompts for AI response generation via OpenAI API
- **FR3**: Users can view AI-generated responses to their prompts in real-time
- **FR4**: Users can test multiple prompts sequentially within a single session
- **FR5**: Users can indicate dissatisfaction with AI responses by clicking "Not Satisfied" (applies to most recent response only)
- **FR6**: Users can clear prompt input field before submitting
- **FR7**: Users can view visual focus indication on active input field
- **FR8**: System can prevent submission of empty prompts with validation message
- **FR9**: System can validate maximum prompt length before submission

### Failure-Driven Learning Flow

- **FR10**: System can capture user feedback on what they didn't like about the most recent AI response
- **FR11**: System can trigger diagnostic analysis when user expresses dissatisfaction with specific response
- **FR12**: System can evaluate prompts for compliance with Rules/Task/Examples framework
- **FR13**: System can identify specific deficiencies in user prompts (missing rules, unclear task, no examples)
- **FR14**: System can generate explanations of why prompts failed to produce desired results

### Feedback Modal Workflow

- **FR15**: Users can open feedback modal by clicking "Not Satisfied" button
- **FR16**: Users can enter free-text feedback describing what they didn't like about the result
- **FR17**: Users can submit feedback via "Generate Improved Prompt" button to trigger improvement generation
- **FR18**: Users can cancel feedback modal and return to chat without submitting

### Prompt Improvement & Transformation

- **FR19**: System can restructure vague prompts into Rules/Task/Examples framework format
- **FR20**: System can generate improved versions of user prompts based on dissatisfaction feedback
- **FR21**: System can preserve user intent while adding framework structure to prompts
- **FR22**: System can detect common prompt mistakes from user feedback patterns
- **FR23**: System can parse original prompts into sentences (delimited by periods)
- **FR24**: System can map original sentences to improved prompt sections in one-to-many relationship
- **FR25**: Users can apply improved prompts by clicking "Use This Prompt" button (inserts into chat input, does not auto-submit)
- **FR26**: System can insert improved prompt text into main chat input field without automatic submission
- **FR27**: Users must manually submit the improved prompt after it's inserted into chat input

### Visual Comparison & Educational Feedback

- **FR28**: System can display side-by-side comparison of original vs. improved prompts
- **FR29**: System can highlight specific differences between original and improved prompts
- **FR30**: System can show visual indicators for additions, changes, and enhancements
- **FR31**: System can segment original prompt by sentences (period-delimited)
- **FR32**: System can display mapping between original sentences and corresponding improved sections
- **FR33**: System can show one-to-many relationships where one original sentence maps to multiple improved sections
- **FR34**: System can provide contextual tooltips explaining WHY each improvement matters
- **FR35**: System can tie tooltip explanations directly to specific sentence components of the user's actual prompt
- **FR36**: System can explain R/T/E framework components (Rules, Task, Examples) with context-specific guidance
- **FR37**: Users can close side-by-side comparison modal via close button or ESC key
- **FR38**: Users can view framework education tooltips explaining Rules/Task/Examples definitions

### Framework Education & Skill Transfer

- **FR39**: System can educate users on Rules/Task/Examples structured prompt construction
- **FR40**: System can demonstrate how framework structure improves AI response quality through before/after comparison
- **FR41**: System can create memorable "aha moments" through failure-then-transformation experience
- **FR42**: System can enable skill transfer by teaching repeatable methodology applicable beyond the tool

### Session Management & State

- **FR43**: System can maintain conversation state within a single browser session
- **FR44**: System can track prompt testing history during active session
- **FR45**: Users can clear chat history and start fresh session via reset button
- **FR46**: Users can copy AI responses to clipboard via copy button
- **FR47**: Users can copy improved prompts to clipboard via copy button
- **FR48**: System can preserve chat history context after user applies improved prompt

### Loading & Processing States

- **FR49**: System can display loading spinner during OpenAI API calls
- **FR50**: System can disable submit buttons during API processing to prevent duplicate requests
- **FR51**: System can show "Generating improvement..." indicator during feedback processing
- **FR52**: System can provide visual feedback for all asynchronous operations

### Error Handling & Resilience

- **FR53**: System can handle API errors gracefully with user-friendly error messages
- **FR54**: System can display specific error message when OpenAI API fails (rate limit, authentication, etc.)
- **FR55**: System can display specific error message when Cloudflare Workers proxy is unavailable
- **FR56**: System can provide retry mechanism for failed API calls
- **FR57**: System can handle timeout scenarios for long-running API calls
- **FR58**: System can provide loading states during API calls to indicate processing

## Web App Specific Requirements

### Project-Type Overview

DigitalWaveTest is a **single-page application (SPA)** built with React (CDN-based) and deployed as a single HTML file on GitHub Pages. The architecture prioritizes simplicity and rapid deployment for a 2-day demonstration timeline.

### Technical Architecture Considerations

**Single-Page Application Architecture:**
- Self-contained single HTML file with React CDN imports
- Client-side rendering and state management
- No server-side routing or page reloads
- Component-based UI architecture for chat interface, comparison display, and tooltip system

**API Integration Pattern:**
- Cloudflare Workers (or equivalent) proxy for OpenAI API calls
- Standard request/response pattern (no streaming or WebSockets)
- Asynchronous API calls with loading states
- Error handling for API failures

### Browser Compatibility Matrix

**Supported Browsers:**
- Chrome (latest stable)
- Firefox (latest stable)
- Safari (latest stable)

**Browser Requirements:**
- Modern JavaScript (ES6+) support
- CSS Grid and Flexbox for layouts
- Fetch API for HTTP requests
- LocalStorage for client-side state persistence (if needed)

**Not Required:**
- Legacy browser support (IE11, older Safari versions)
- Polyfills for older browsers
- Progressive enhancement strategies

### Responsive Design Requirements

**Target Devices:**
- Desktop/laptop primary target (demo presentation context)
- Tablet support (secondary)
- Mobile support not required for MVP demo

**Viewport Considerations:**
- Minimum viewport width: 1024px (standard laptop)
- Side-by-side comparison layout optimized for desktop viewing
- Chat interface and tooltip interactions designed for mouse/trackpad

### SEO Strategy

**SEO Approach: Not Required**
- Tool accessed via direct GitHub Pages URL
- No discoverability or search ranking needed
- Meta tags for link preview only (when sharing demo URL)
- No sitemap, structured data, or search optimization

### Accessibility Level

**Accessibility Approach: Minimal (MVP Demo)**
- No WCAG compliance required for 2-day demo
- No screen reader support
- No keyboard navigation requirements
- Focus on visual clarity and intuitive mouse-based interactions for non-technical users

**Post-Demo Considerations:**
- If tool becomes real product, accessibility would be critical for professional users
- Keyboard navigation, screen reader support, and WCAG 2.1 AA compliance would be future requirements

### Performance Targets

**Load Time Goals:**
- Initial page load: < 3 seconds on standard broadband
- API response time: < 5 seconds for OpenAI calls (acceptable for demo)
- UI state transitions: < 100ms for interactive elements

**Performance Optimizations:**
- Single HTML file reduces HTTP requests
- CDN-loaded React for browser caching benefits
- Minimal third-party dependencies
- Lightweight CSS (no heavy frameworks)

### Implementation Considerations

**Deployment:**
- GitHub Pages static hosting
- Single HTML file deployment (no build process)
- Direct URL access for demo presentation

**Development Constraints:**
- 2-day timeline limits polish and edge case handling
- Focus on happy path demonstration flow
- Error states must be functional but can be simple

## Non-Functional Requirements

### Performance

**Response Time Requirements:**
- **NFR-P1**: User interface interactions (button clicks, modal open/close) must respond within 100ms
- **NFR-P2**: Initial page load must complete within 3 seconds on standard broadband connection
- **NFR-P3**: OpenAI API calls must complete within 10 seconds or display timeout message
- **NFR-P4**: Prompt improvement generation must complete within 15 seconds or display timeout message
- **NFR-P5**: UI state transitions (loading spinners, disabled buttons) must activate within 50ms of user action

**Rendering Performance:**
- **NFR-P6**: Side-by-side comparison modal must render within 200ms of improvement generation completion
- **NFR-P7**: Tooltip interactions must display within 100ms of hover/click
- **NFR-P8**: Chat history with up to 20 messages must render without noticeable lag (<500ms)

### Security

**API Security:**
- **NFR-S1**: OpenAI API keys must never be exposed in client-side code
- **NFR-S2**: API calls must be proxied through Cloudflare Workers (or equivalent) to protect credentials
- **NFR-S3**: API proxy must validate request origin to prevent unauthorized usage

**Input Sanitization:**
- **NFR-S4**: All user input must be sanitized to prevent XSS attacks before rendering in UI
- **NFR-S5**: Prompt text must be validated for maximum length to prevent API abuse

**Data Privacy:**
- **NFR-S6**: No user data may be stored on external servers without user consent
- **NFR-S7**: Session data in localStorage must be clearable by user via reset functionality

### Integration

**OpenAI API Integration:**
- **NFR-I1**: System must integrate with OpenAI API (GPT-3.5-turbo or similar model)
- **NFR-I2**: API requests must use proper message format as specified by OpenAI API documentation
- **NFR-I3**: API responses must be parsed correctly to extract message content
- **NFR-I4**: System must handle OpenAI API error codes (429 rate limit, 401 authentication, 500 server errors) with specific error messages

**Cloudflare Workers Proxy:**
- **NFR-I5**: Proxy must route requests to OpenAI API without introducing >500ms latency
- **NFR-I6**: Proxy must return standardized error responses for failure scenarios
- **NFR-I7**: Proxy must handle CORS headers for cross-origin requests from GitHub Pages domain

### Reliability & Availability

**Demo Reliability:**
- **NFR-R1**: System must remain functional when displayed offline during demo presentation
- **NFR-R2**: System must gracefully degrade if OpenAI API is unavailable (display error, allow retry)
- **NFR-R3**: UI must remain responsive even when API calls fail or timeout
- **NFR-R4**: System must recover from errors without requiring page refresh

**Error Handling:**
- **NFR-R5**: All API failures must display user-friendly error messages (not technical stack traces)
- **NFR-R6**: System must provide retry mechanism for transient API failures
- **NFR-R7**: System must handle network interruptions gracefully without breaking UI state

**Browser Compatibility:**
- **NFR-R8**: System must function correctly in Chrome, Firefox, and Safari (latest stable versions)
- **NFR-R9**: System must detect and warn users if browser lacks required ES6 support

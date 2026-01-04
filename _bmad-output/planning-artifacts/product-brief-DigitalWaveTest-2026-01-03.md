---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: ['_bmad-output/analysis/brainstorming-session-2026-01-03.md']
date: 2026-01-03
author: Alexgaidukov
---

# Product Brief: DigitalWaveTest

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

**DigitalWaveTest** is an educational prompt improvement tool designed to help non-technical users understand and fix their AI prompts in real-time. As AI tools become mainstream, non-technical users struggle with prompt engineering through frustrating trial-and-error, often receiving unexpected results with no understanding of why their prompts fail. DigitalWaveTest solves this by providing an interactive feedback loop where users test their prompts, experience failures, and receive visual side-by-side comparisons with highlighted improvements and contextual explanations.

The tool teaches users the **Rules/Task/Examples framework** - a structured best practice for prompt construction - and demonstrates what went wrong, how to improve it, and provides a cleaned-up version they can use immediately. By combining real-time feedback, visual differentiation, and context-specific explanations, DigitalWaveTest transforms prompt writing from blind trial-and-error into an "aha moment" learning experience.

Built as a demonstration of problem-solving capability for non-technical user accessibility, this tool showcases elegant agent logic that evaluates prompts against the framework and common mistake patterns gathered from user feedback.

---

## Core Vision

### Problem Statement

Non-technical users attempting to work with AI tools face a critical knowledge gap: they write prompts using trial-and-error, receive unsatisfactory or unexpected results, but **have no understanding of why their prompts fail**. Their only current recourse is to seek out prompt engineering experts for guidance - an inefficient, non-scalable solution that creates friction in AI adoption.

### Problem Impact

This lack of understanding creates three major pain points:

1. **Wasted Time**: Users iterate blindly without knowing what to fix
2. **Poor Results**: Inadequate prompts lead to suboptimal AI outputs, eroding trust in AI tools
3. **Learning Barrier**: Without feedback on *why* prompts fail, users cannot develop prompt engineering skills independently

As AI tools become mainstream, this educational gap becomes a critical barrier to effective AI adoption for non-technical audiences.

### Why Existing Solutions Fall Short

Current prompt engineering resources fail to address the "why prompts fail" problem because they:

- Provide static examples without interactive feedback
- Don't connect failure moments to specific improvements
- Lack real-time, contextual explanations tied to the user's actual prompt
- Miss the critical "experience the failure → understand the fix" learning loop

Users need more than templates - they need **diagnostic feedback in the moment of failure** with clear explanations of how to improve.

### Proposed Solution

**DigitalWaveTest** is an interactive educational tool that transforms prompt writing through a structured feedback loop:

1. **User writes and tests their prompt** in a live chat interface
2. **Experiences the inadequate result** (setting up the learning moment)
3. **Clicks "Not Satisfied"** to trigger diagnostic analysis
4. **Receives side-by-side comparison**: Original vs. Improved prompt with visual highlighting
5. **Learns through contextual tooltips** explaining each improvement
6. **Applies the improved prompt** immediately to continue the learning cycle

The tool enforces the **Rules/Task/Examples framework** - a best practice prompt structure - and provides three critical elements:
- **What went wrong** (diagnostic)
- **How to improve it** (educational)
- **A cleaned-up version** (actionable model)

**Phase 2 Enhancement**: An intelligent agent that evaluates prompts against the framework and learns from accumulated user feedback patterns to predict and prevent common mistakes proactively.

### Key Differentiators

**1. Failure-Driven Learning Architecture**
Unlike static tutorials, DigitalWaveTest leverages the psychological impact of experiencing failure before receiving the solution, making the "aha moment" more memorable and actionable.

**2. Visual + Contextual Explanations**
Real-time feedback with highlighted differences and tooltips tied directly to specific prompt components - not generic advice, but contextualized guidance.

**3. Rules/Task/Examples Framework Enforcement**
Systematic approach to prompt structure that gives users a repeatable methodology, not just one-off fixes.

**4. Intelligent Agent Logic**
Pattern recognition based on accumulated user dissatisfaction feedback, enabling the system to evolve and predict common mistakes - demonstrating sophisticated problem-solving capability.

**5. Non-Technical Accessibility Focus**
Built specifically for users without technical backgrounds, proving that AI tools can be made accessible through thoughtful UX and educational design.

---

## Target Users

### Primary User: Alexa - The Retail Product Specialist

**Profile:**
- **Name:** Alexa
- **Age:** 38
- **Role:** Retail product specialist (merchandising coordinator, catalog manager, or e-commerce specialist)
- **Industry:** Retail
- **Tech Comfort:** Familiar with ChatGPT and comfortable using chat interfaces, but has no formal training in prompt engineering or context engineering

**Current Challenge:**

Alexa's job involves generating creative, catchy product names from package descriptions. When she tries to use AI tools, she writes prompts the way she would chat naturally: "red can, images of fruits, sun, beach." The AI responds with something generic like "Generic Soda" - far from the creative, brand-aligned names she needs like "SunSplash Citrus Fizz" or "Beach Breeze Berry."

**Pain Points:**

- **Frustration:** She knows what she wants but can't get the AI to understand her vision
- **Time Pressure:** Has dozens of products to name with tight deadlines
- **Knowledge Gap:** Doesn't understand WHY her prompts fail - she's describing the product, so why isn't the AI giving her what she needs?
- **Trial-and-Error Fatigue:** Wastes time rewording prompts blindly, hoping for better results

**The "Aha!" Moment:**

When Alexa uses DigitalWaveTest and sees her vague description transformed into a properly structured Rules/Task/Examples prompt, she realizes: **"I was missing the structure! I described what I was looking at, but I never told the AI what to DO with that information or HOW to format it. I needed to give it rules, define the task clearly, and show examples of what 'good' looks like."**

**Success Vision:**

After learning the Rules/Task/Examples framework through DigitalWaveTest:
- Alexa confidently generates 3-5 creative product naming options per description
- She structures prompts that consistently produce brand-aligned, catchy names
- She understands the "why" behind prompt structure and can adapt it to different tasks
- She feels empowered as an AI user, not frustrated by it

**Quote:** *"I thought I just had to describe the product, but I was missing the whole framework! Now I know I need to tell the AI the rules to follow, define the exact task, and give examples. It's like the difference between saying 'make me dinner' versus giving someone a recipe."*

### Secondary Users

**N/A** - For this demonstration-focused product, the primary user (non-technical professionals like Alexa) represents the core audience. Future iterations might include team leads or managers who review outputs, but the MVP focuses on the individual user's educational journey.

### User Journey: Alexa's Path to AI Fluency

**1. Discovery (Pre-Tool)**
- Alexa hears about AI tools for content generation from colleagues
- Tries ChatGPT for product naming but gets disappointing results
- Searches online for "how to write better AI prompts" but finds tutorials too technical or generic

**2. First Encounter with DigitalWaveTest**
- Discovers the tool (via colleague recommendation, online search, or demo)
- Recognizes her problem immediately: "helping non-technical users write better prompts"
- Intrigued by the promise of understanding *why* prompts fail

**3. The Learning Moment**
- Enters her typical prompt: "red can, images of fruits, sun, beach"
- Tests it in the chat interface
- Gets "Generic Soda" - the same frustrating result as always
- Clicks **"Not Satisfied"** and provides feedback: "Too generic, I need something creative and catchy"

**4. The "Aha!" Experience**
- Sees side-by-side comparison: her original vs. the improved prompt
- The improved version shows:
  - **Rules:** "Generate creative, 2-4 word product names. Must be catchy, memorable, and evoke the product's essence."
  - **Task:** "Based on this package description, create a product name that captures the vibrant, summery feeling."
  - **Examples:** "SunSplash Citrus → Tropical Paradise Punch → Golden Coast Cola"
- Visual highlighting shows what was added with tooltips explaining WHY each element matters
- **Realization:** "Oh! I never told it WHAT to generate or HOW. I just described the can!"

**5. Immediate Application**
- Clicks "Use This Prompt" to apply the improved version
- Gets results like "SunSplash Citrus Fizz" and "Beach Breeze Berry"
- Success! This is exactly what she needed

**6. Skill Development**
- Continues using the tool for different products
- Starts internalizing the Rules/Task/Examples pattern
- Notices herself naturally structuring prompts better even without the tool
- Feels confident adapting the framework to other AI tasks (writing product descriptions, generating marketing copy)

**7. Long-term Impact**
- Alexa becomes the "AI-savvy" person on her team
- Uses structured prompts as her default approach
- No longer fears AI tools - sees them as reliable assistants
- Advocates for AI adoption among colleagues who share her previous frustrations

---

## Success Metrics

### Demo Success Criteria (Interview Context)

**Primary Goal**: Demonstrate problem-solving methodology and elegant technical execution within a 2-day constraint.

**Success Indicators for Interview Evaluation**:

1. **Problem-Solving Methodology Demonstration**
   - Clear articulation of the failure-driven learning approach
   - Systematic application of the Rules/Task/Examples framework
   - Evidence of thoughtful UX design for non-technical users

2. **Technical Elegance**
   - Agent logic that evaluates prompts against framework compliance
   - Pattern recognition system that learns from user dissatisfaction feedback
   - Clean implementation of the improvement workflow

3. **"Nailed It" Moments**:
   - Successfully demonstrating the **failure → improvement → learning loop**
   - Showing the Rules/Task/Examples framework transforming a vague prompt into a structured, effective one
   - Side-by-side comparison reveal with visual highlighting and contextual tooltips
   - "Use This Prompt" → immediate better results flow

**Interview Success Outcome**: Interviewer says *"This candidate understands how to build educational tools for non-technical users and can execute elegant technical solutions under tight constraints."*

---

### Product Success Metrics (If Real Product)

**User Success - Alexa's Perspective**:

**Leading Indicators** (Short-term):
- **Reduced "Not Satisfied" clicks over time**: Alexa uses the feedback button less frequently as she learns
- **Faster prompt writing**: Time from initial prompt to satisfactory result decreases
- **Framework adoption**: Alexa naturally structures prompts with Rules/Task/Examples without the tool

**Success Behaviors**:
1. **Initial Learning Cycle**: Alexa clicks "Not Satisfied" → sees side-by-side comparison → clicks "Use This Prompt" → gets better results
2. **Skill Development**: Alexa starts writing structured prompts from the start, reducing need for improvement suggestions
3. **Independent Fluency**: Alexa applies the framework to new AI tasks beyond product naming

**User Success Milestone**: Alexa says *"I don't need the tool anymore - I naturally write prompts with Rules, Task, and Examples now."*

---

### Business Objectives

**Phase 1 (Manual Feedback)**:
- Validate that the failure-driven learning approach creates "aha moments"
- Collect user dissatisfaction feedback patterns to inform Phase 2 agent training
- Demonstrate educational value for non-technical AI users

**Phase 2 (Intelligent Agent)**:
- **Proactive Improvement**: Toggle feature that analyzes prompts and auto-fixes common mistakes before user experiences failure
- **Pattern Recognition**: Agent learns from accumulated "Not Satisfied" feedback to predict and prevent recurring issues
- **Reduced Manual Intervention**: Users get better initial results without needing to click "Not Satisfied"

---

### Key Performance Indicators

**Demo KPIs** (Interview Context):
- ✅ Complete working prototype within 2-day deadline (by January 5, 2026)
- ✅ Demonstrate all 10 Must-Have features from brainstorming session
- ✅ Show the complete user flow: bad prompt → test → "Not Satisfied" → improvement → better results
- ✅ Highlight the "moment of magic": side-by-side comparison with visual highlighting and tooltips

**Product KPIs** (If Real):

**Engagement Metrics**:
- **Improvement Acceptance Rate**: % of users who click "Use This Prompt" after seeing the improved version
- **Learning Velocity**: Time reduction from first prompt attempt to satisfactory result over multiple sessions
- **Framework Compliance**: % of prompts that follow Rules/Task/Examples structure after 5+ uses

**Educational Impact**:
- **Tool Independence**: % of users who need "Not Satisfied" feedback less than 2 times per 10 prompts after 1 week
- **Skill Transfer**: Evidence that users apply structured prompting in other AI tools beyond DigitalWaveTest

**Phase 2 Agent Performance**:
- **Proactive Fix Success Rate**: % of auto-improved prompts (via toggle) that satisfy users without manual feedback
- **Pattern Recognition Accuracy**: % of common mistakes correctly identified and prevented by the agent

---

## MVP Scope

### Core Features (Must-Have for Demo)

**1. Interactive Chat Interface**
- User can write and test prompts in a live chat interface
- Real-time interaction with AI (via Cloudflare Workers proxy)
- Clean, intuitive UI for non-technical users

**2. Failure-Driven Learning Flow**
- User experiences inadequate AI response first (setting up the learning moment)
- "Not Satisfied" button triggers diagnostic analysis
- User can provide feedback on what they didn't like about the result

**3. Side-by-Side Comparison Display** ⭐ (Critical "Aha Moment")
- Visual comparison: Original prompt vs. Improved prompt
- Clear differentiation showing transformation
- Demonstrates the before/after impact

**4. Visual Highlighting with Contextual Tooltips** ⭐ (Critical "Aha Moment")
- Highlighted differences showing what was added/changed
- Tooltips explaining WHY each improvement matters
- Context-specific guidance tied to the user's actual prompt

**5. Rules/Task/Examples Framework Enforcement**
- System analyzes prompts against the R/T/E framework
- Restructures vague prompts into proper framework format
- Educates users on structured prompt construction

**6. "Use This Prompt" Functionality**
- One-click application of improved prompt
- Immediate re-testing with better results
- Completes the learning loop

**7. Error Detection & Contextual Feedback Agent**
- Agent evaluates prompt compliance with framework
- Generates explanations of what went wrong
- Provides cleaned-up version following R/T/E structure

**8. Single HTML Deployment**
- Self-contained React application
- Hosted on accessible website
- Works independently without developer demonstration

**Technical Stack:**
- **Frontend**: React (single HTML file)
- **Backend**: Cloudflare Workers (proxy to OpenAI)
- **AI Model**: GPT-3.5-turbo
- **Deployment**: Static hosting (user-accessible URL)

---

### Out of Scope for MVP

**Phase 2: Intelligent Proactive Agent** (Deferred Post-Demo)
- Toggle feature for automatic prompt improvement
- Pattern recognition from accumulated user feedback
- Proactive mistake prevention before user experiences failure

**Rationale**: While the Phase 2 agent is part of the long-term vision, the MVP focuses on demonstrating the educational feedback loop. The current scope includes **data collection** (capturing what users "don't like" about results) to inform future Phase 2 development, but the auto-improvement toggle itself is deferred to protect the 2-day timeline.

**Other Deferred Features:**
- User accounts and authentication
- Prompt history and saved templates
- Advanced analytics dashboard
- Multi-language support
- Integration with other AI platforms beyond OpenAI

---

### MVP Success Criteria

**Demo Readiness Gate:**
The MVP is ready for interview demonstration when:

1. **All 10 Must-Have features are working end-to-end**
2. **User can independently access and use the tool** via website URL without developer assistance
3. **Complete user flow is functional**:
   - User writes vague prompt → tests it → gets poor result → clicks "Not Satisfied" → sees side-by-side comparison with highlighting → clicks "Use This Prompt" → gets better result
4. **The "moment of magic" delivers**: Side-by-side comparison with visual highlighting creates the "aha!" learning experience

**Technical Validation:**
- ✅ Deployment is stable and accessible
- ✅ Cloudflare Workers proxy successfully routes to GPT-3.5
- ✅ R/T/E framework agent correctly restructures prompts
- ✅ Visual highlighting and tooltips render correctly

**User Experience Validation:**
- ✅ Non-technical user can navigate the interface intuitively
- ✅ Feedback loop is clear and educational
- ✅ "Use This Prompt" produces demonstrably better results

**Timeline Success:**
- ✅ Completed by January 5, 2026 deadline
- ✅ All core functionality tested and working

---

### Future Vision

**If DigitalWaveTest Were a Real Product:**

**Phase 2 - Intelligent Agent Enhancement (Post-MVP)**
- **Proactive Improvement Toggle**: Automatic prompt analysis and fixing before user experiences failure
- **Pattern Recognition Engine**: Learns from accumulated "Not Satisfied" feedback to predict common mistakes
- **Adaptive Learning**: System evolves based on real user behavior patterns

**Phase 3 - Platform Expansion**
- **Multi-Model Support**: Extend beyond GPT-3.5 to Claude, Gemini, and other LLMs
- **Domain-Specific Templates**: Pre-built R/T/E frameworks for common use cases (product naming, content generation, data analysis)
- **Team Collaboration**: Shared prompt libraries and best practices across organizations
- **Advanced Analytics**: Track prompt improvement over time, measure educational impact

**Phase 4 - Ecosystem Development**
- **Browser Extension**: Integrate DigitalWaveTest into existing AI tools (ChatGPT, Claude, etc.)
- **API for Developers**: Allow other applications to leverage the R/T/E framework enforcement
- **Enterprise Version**: Custom frameworks, compliance controls, team management
- **Educational Partnerships**: Integrate with online learning platforms to teach AI literacy

**Long-Term Vision:**
DigitalWaveTest becomes the standard educational tool for non-technical users entering the AI-powered workplace, transforming prompt engineering from a specialized skill into a mainstream competency. The tool evolves from a demonstration prototype into a comprehensive platform that bridges the AI accessibility gap for millions of users.

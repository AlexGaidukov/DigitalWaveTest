// ============================================================
// MAIN APP COMPONENT
// ============================================================

const App = () => {
  const {
    isFeedbackModalOpen,
    setIsFeedbackModalOpen,
    isComparisonModalOpen,
    setIsComparisonModalOpen,
    comparisonData,
    setComparisonData,
    handleCloseComparisonModal,
    chatHistory,
    setRecentFeedback,
    setIsGeneratingImprovement,
    improvementError,
    setImprovementError,
    setChatHistory,
    setChatError,
    setIsChatLoading,
    addMessage
  } = useAppContext();

  // Story 5.1: State for controlled chat input value
  const [chatInputValue, setChatInputValue] = React.useState('');

  // Story 5.1: Ref for ChatInput component (to call focus method)
  const chatInputRef = React.useRef(null);

  // Story 5.1: State for visual highlight animation
  const [isInputHighlighted, setIsInputHighlighted] = React.useState(false);

  // Code Review Fix: Refs for timeout cleanup
  const highlightTimeoutRef = React.useRef(null);
  const focusTimeoutRef = React.useRef(null);
  const announcementTimeoutRef = React.useRef(null);
  const resetAnnouncementTimeoutRef = React.useRef(null);

  // Code Review Fix: Named constants for magic numbers
  const FOCUS_DELAY_MS = 100;
  const ANNOUNCEMENT_DURATION_MS = 1000;

  const handleFeedbackClose = () => {
    setIsFeedbackModalOpen(false);
  };

  // Story 5.3: Handle session reset
  // Clears all application state to initial values
  const handleSessionReset = React.useCallback(() => {
    const resetStartTime = performance.now();

    // Clear chat history
    setChatHistory([]);

    // Clear input field
    setChatInputValue('');

    // Clear all modal states
    setIsFeedbackModalOpen(false);
    setIsComparisonModalOpen(false);
    setComparisonData(null);

    // Clear error states
    setChatError(null);
    setImprovementError(null);

    // Clear loading states (should already be false, but ensure)
    setIsChatLoading(false);

    // Clear feedback context
    setRecentFeedback(null);

    // Focus input field after reset
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      try {
        if (chatInputRef.current && chatInputRef.current.focus) {
          chatInputRef.current.focus();
        }
      } catch (error) {
        console.warn('Failed to focus input after reset:', error);
      }
      focusTimeoutRef.current = null;
    }, FOCUS_DELAY_MS);

    // Screen reader announcement
    if (resetAnnouncementTimeoutRef.current) {
      clearTimeout(resetAnnouncementTimeoutRef.current);
    }
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = 'Chat history cleared';
    document.body.appendChild(announcement);

    resetAnnouncementTimeoutRef.current = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
      resetAnnouncementTimeoutRef.current = null;
    }, ANNOUNCEMENT_DURATION_MS);

    // Performance logging (verify <100ms per NFR-P1)
    const resetEndTime = performance.now();
    const resetTime = resetEndTime - resetStartTime;
    if (resetTime > 100) {
      console.warn(`Session reset took ${resetTime.toFixed(2)}ms (target: <100ms per NFR-P1)`);
    }
  }, [
    setChatHistory,
    setChatInputValue,
    setIsFeedbackModalOpen,
    setIsComparisonModalOpen,
    setComparisonData,
    setChatError,
    setImprovementError,
    setIsChatLoading,
    setRecentFeedback,
    chatInputRef
  ]);

  // Story 5.4: State for storing last improvement parameters for retry
  const [lastImprovementParams, setLastImprovementParams] = React.useState(null);

  const handleFeedbackSubmit = async (feedbackText) => {
    // Extract most recent messages from chat history
    // Find last user message
    const userMessages = chatHistory.filter(msg => msg.role === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Find last assistant message
    const assistantMessages = chatHistory.filter(msg => msg.role === 'assistant');
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];

    // Edge case: No messages (shouldn't happen, but defensive)
    if (!lastUserMessage || !lastAssistantMessage) {
      console.error('No messages found in chat history');
      return;
    }

    // Create feedback object
    const feedback = {
      userPrompt: lastUserMessage.content,
      aiResponse: lastAssistantMessage.content,
      feedbackText: feedbackText,
      timestamp: Date.now()
    };

    // Store feedback in context
    setRecentFeedback(feedback);

    // Story 5.4: Store parameters for retry
    setLastImprovementParams({
      originalPrompt: feedback.userPrompt,
      userFeedback: feedback.feedbackText
    });

    // Clear any previous improvement errors
    setImprovementError(null);

    // Trigger improvement generation state
    setIsGeneratingImprovement(true);

    // Close feedback modal
    setIsFeedbackModalOpen(false);

    try {
      // Call improvement API (Story 3.1 implementation)
      const { improvedPrompt, mapping, explanations } = await generateImprovement(
        feedback.userPrompt,
        feedback.feedbackText
      );

      // Store improvement data in context (for Epic 4 comparison modal)
      setComparisonData({
        originalPrompt: feedback.userPrompt,
        improvedPrompt: improvedPrompt,
        mapping: mapping,
        explanations: explanations
      });

      // Clear loading state
      setIsGeneratingImprovement(false);

      // Open comparison modal (Epic 4 will implement the modal)
      setIsComparisonModalOpen(true);

    } catch (error) {
      // Story 5.4: Format error for user-friendly display
      const formattedError = formatError(error);
      console.error('Improvement generation failed:', formattedError);

      // Clear loading state
      setIsGeneratingImprovement(false);

      // Show error in UI (reopen modal for retry)
      setImprovementError(formattedError);
      setIsFeedbackModalOpen(true); // Reopen modal to show error
    }
  };

  // Story 5.4: Handle improvement generation retry
  const handleRetryImprovement = React.useCallback(async () => {
    if (lastImprovementParams) {
      setImprovementError(null); // Clear error before retry
      setIsGeneratingImprovement(true);

      try {
        const { improvedPrompt, mapping, explanations } = await generateImprovement(
          lastImprovementParams.originalPrompt,
          lastImprovementParams.userFeedback
        );

        setComparisonData({
          originalPrompt: lastImprovementParams.originalPrompt,
          improvedPrompt: improvedPrompt,
          mapping: mapping,
          explanations: explanations
        });

        setIsGeneratingImprovement(false);
        setIsFeedbackModalOpen(false); // Close modal on success
        setIsComparisonModalOpen(true);
      } catch (error) {
        const formattedError = formatError(error);
        console.error('Improvement retry failed:', formattedError);
        setIsGeneratingImprovement(false);
        setImprovementError(formattedError);
        // Modal stays open for another retry
      }
    }
  }, [lastImprovementParams, setImprovementError, setIsGeneratingImprovement, setIsFeedbackModalOpen, setIsComparisonModalOpen, setComparisonData]);

  // Story 5.1: Handle "Use This Prompt" button click
  // Pastes improved prompt into input field for user to review and send
  const handleUseImprovedPrompt = React.useCallback((improvedPrompt) => {
    // Format improved prompt: replace multiple newlines with "; " for single-line display
    const formattedPrompt = improvedPrompt.replace(/\n\n+/g, '; ');

    // Insert improved prompt into chat input field
    setChatInputValue(formattedPrompt);

    // Close comparison modal
    setIsComparisonModalOpen(false);

    // Clear ALL improvement-related state to allow fresh re-improvement cycle
    // Use setTimeout to ensure state updates are flushed before modal can open
    setTimeout(() => {
      setImprovementError(null);
      setComparisonData(null);
      setIsGeneratingImprovement(false);
      setRecentFeedback(null); // Clear old feedback data
      setLastImprovementParams(null); // Clear old improvement parameters
    }, 0);

    // Code Review Fix: Clear existing highlight timeout before setting new one
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    // Add visual highlight flash to input field
    setIsInputHighlighted(true);
    highlightTimeoutRef.current = setTimeout(() => {
      setIsInputHighlighted(false);
      highlightTimeoutRef.current = null;
    }, 600); // Remove after animation

    // Code Review Fix: Clear existing focus timeout before setting new one
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }

    // Focus input field after modal closes
    focusTimeoutRef.current = setTimeout(() => {
      try {
        if (chatInputRef.current && chatInputRef.current.focus) {
          chatInputRef.current.focus();
        }
      } catch (error) {
        console.warn('Failed to focus input:', error);
      }
      focusTimeoutRef.current = null;
    }, 150); // Small delay to allow modal close animation

    // Code Review Fix: Clear existing announcement timeout before creating new one
    if (announcementTimeoutRef.current) {
      clearTimeout(announcementTimeoutRef.current);
    }

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = 'Improved prompt inserted into input field';
    document.body.appendChild(announcement);

    announcementTimeoutRef.current = setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
      announcementTimeoutRef.current = null;
    }, 1000);
  }, [setIsComparisonModalOpen, setChatInputValue, setImprovementError, setComparisonData, setIsGeneratingImprovement, setRecentFeedback, setLastImprovementParams, setIsInputHighlighted, chatInputRef]);

  return (
    <div className="app-container">
      <ChatInterface
        chatInputValue={chatInputValue}
        setChatInputValue={setChatInputValue}
        chatInputRef={chatInputRef}
        isInputHighlighted={isInputHighlighted}
        onReset={handleSessionReset}
      />

      {/* Feedback Modal - Story 5.4: Added error and retry handling */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
        error={improvementError}
        onRetry={handleRetryImprovement}
      />

      {/* Story 4.1: Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        comparisonData={comparisonData}
        onClose={handleCloseComparisonModal}
        onUsePrompt={handleUseImprovedPrompt}
      />
    </div>
  );
};

// ============================================================
// APPLICATION RENDER
// ============================================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </AppProvider>
);

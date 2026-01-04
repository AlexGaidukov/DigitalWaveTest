// ============================================================
// REACT COMPONENTS
// ============================================================

// ============================================================
// CUSTOM HOOKS
// ============================================================

// AC #7: useAppContext custom hook with null safety check
// Note: This hook references AppContext defined later in this file.
// This works due to JavaScript hoisting and is intentional pattern for hooks.
const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === null) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// ============================================================
// ERROR BOUNDARY
// ============================================================

// ErrorBoundary - Class component for catching React errors (must be first)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2 className="error-boundary__title">Something went wrong</h2>
          <p className="error-boundary__message">
            The application encountered an unexpected error.
          </p>
          <button className="error-boundary__button" onClick={this.handleRetry}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================
// LEAF COMPONENTS
// ============================================================

// Tooltip - Leaf component for displaying contextual help on hover/focus (Story 4.4)
// Provides educational explanations for R/T/E framework sections
// Props: children (React element) - Element that triggers the tooltip
//        content (string or React node) - Tooltip content text
// Accessibility: Keyboard accessible (focus/blur), screen reader support (aria-describedby), ESC key dismiss
const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState(null);
  const tooltipRef = React.useRef(null);

  // Show tooltip with small delay to prevent accidental triggers
  const handleMouseEnter = React.useCallback(() => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, 100); // 100ms delay
    setTimeoutId(id);
  }, []);

  // Hide tooltip immediately on mouse leave
  const handleMouseLeave = React.useCallback(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  }, [timeoutId]);

  // Handle keyboard accessibility
  const handleFocus = React.useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleBlur = React.useCallback(() => {
    setIsVisible(false);
  }, []);

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

  // Clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

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

// HighlightedText - Leaf component for rendering text with highlighted segments (Story 4.2)
// Used to display improved prompt with color-coded R/T/E sections
// Props: text (string) - The full text to render
//        highlights (array) - Array of highlight objects: [{ text, type, startIndex, endIndex }]
//        type: 'addition' | 'change' | 'enhancement'
// Story 4.2 Performance: Measures rendering time to verify <200ms target (NFR-P6)
const HighlightedText = ({ text, highlights }) => {
  const renderStartTime = React.useRef(null);

  // Measure render performance (using useEffect to capture after render)
  React.useEffect(() => {
    if (renderStartTime.current) {
      const renderEndTime = performance.now();
      const renderTime = renderEndTime - renderStartTime.current;

      // Log performance in development (verify <200ms target per NFR-P6)
      if (renderTime > 100) {
        console.warn(`HighlightedText render took ${renderTime.toFixed(2)}ms (target: <200ms)`);
      }
    }
  });

  // Start render timer
  renderStartTime.current = performance.now();

  // Guard clause - handle empty highlights gracefully
  if (!text || !highlights || highlights.length === 0) {
    return <span>{text}</span>;
  }

  // Sort highlights by startIndex to ensure correct order
  const sortedHighlights = [...highlights].sort((a, b) => a.startIndex - b.startIndex);

  // Build array of text segments (highlighted and non-highlighted)
  const segments = [];
  let lastIndex = 0;

  sortedHighlights.forEach(highlight => {
    // Add non-highlighted text before this highlight
    if (highlight.startIndex > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, highlight.startIndex),
        type: null
      });
    }

    // Add highlighted segment
    segments.push({
      text: text.substring(highlight.startIndex, highlight.endIndex),
      type: highlight.type
    });

    lastIndex = highlight.endIndex;
  });

  // Add remaining text after last highlight
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      type: null
    });
  }

  return (
    <span className="highlighted-text">
      {segments.map((segment, index) => {
        if (segment.type) {
          return (
            <span
              key={index}
              className={`highlighted-text__segment highlighted-text__segment--${segment.type}`}
            >
              {segment.text}
            </span>
          );
        }
        return <span key={index}>{segment.text}</span>;
      })}
    </span>
  );
};

// Button - Reusable button component with disabled state
// AC #1: Button component with children, onClick, disabled, className props
const Button = ({ children, onClick, disabled = false, className = '' }) => {
  const baseClass = 'chat-interface__button';
  const modifierClass = disabled ? 'chat-interface__button--disabled' : '';
  const combinedClassName = `${baseClass} ${modifierClass} ${className}`.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// LoadingIndicator - Display loading state with spinner (Story 2.4)
// Leaf component for showing feedback processing state
// Props: message (string) - Display text for loading indicator
const LoadingIndicator = ({ message = "Generating improvement..." }) => {
  return (
    <div className="chat-interface__loading-indicator">
      <div className="chat-interface__loading-spinner"></div>
      <span className="chat-interface__loading-text">{message}</span>
    </div>
  );
};

// ValidationError - Display validation error messages (Story 1.5)
// Leaf component for inline validation feedback
// Memoized to prevent unnecessary re-renders
const ValidationError = React.memo(({ error }) => {
  if (!error) return null;

  return (
    <div className="chat-interface__validation-error">
      <p className="chat-interface__validation-message">{error.message}</p>
    </div>
  );
});

// ErrorDisplay - Display API error messages with retry button (Story 1.5)
// Leaf component for API error feedback
// Memoized to prevent unnecessary re-renders
const ErrorDisplay = React.memo(({ error, onRetry }) => {
  if (!error) return null;

  const isRetriable = ['API_TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMIT_EXCEEDED'].includes(error.code);

  return (
    <div className="chat-interface__error-display">
      <p className="chat-interface__error-message">{error.message}</p>
      {isRetriable && onRetry && (
        <Button onClick={onRetry} className="chat-interface__retry-button">
          Try Again
        </Button>
      )}
    </div>
  );
});

// MessageBubble - Display individual chat message with role-based styling
// AC #2: MessageBubble component with message object and type prop
// Story 2.1: Added showNotSatisfiedButton, onNotSatisfied, disabled props for "Not Satisfied" button
// Story 2.4: Button disabled when isGeneratingImprovement is true
const MessageBubble = ({ message, type, showNotSatisfiedButton, onNotSatisfied, disabled }) => {
  const typeClass = type === 'sent' ? 'chat-interface__message--sent' : 'chat-interface__message--received';
  const isAI = message.role === 'assistant';

  return (
    <div className={`chat-interface__message ${typeClass}`}>
      <div className="chat-interface__message-content">
        {message.content}
      </div>
      {/* Story 2.1: Conditionally render "Not Satisfied" button on AI messages (outside content div for proper spacing) */}
      {/* Story 2.4: Button disabled during improvement generation */}
      {showNotSatisfiedButton && isAI && (
        <button
          className="message-bubble__not-satisfied"
          onClick={onNotSatisfied}
          disabled={disabled}
        >
          Not Satisfied
        </button>
      )}
    </div>
  );
};

// ============================================================
// COMPOSITE COMPONENTS
// ============================================================

// ImprovedPromptWithBadges - Renders improved prompt with highlights and educational tooltips (Story 4.2, 4.4)
// Story 4.4: Adds educational tooltips on the improved prompt explaining the R/T/E framework
// Props: text (string) - Improved prompt text, highlights (array) - From parseImprovedPrompt()
//        explanations (array) - Section explanations from comparisonData.explanations (Story 4.4)
const ImprovedPromptWithBadges = ({ text, highlights, explanations }) => {

  // Story 4.4: Helper function to get educational tooltip content for a section
  // Now used for tooltip on the entire improved prompt
  const getTooltipContent = React.useCallback(() => {
    if (!explanations || explanations.length === 0) {
      // Fallback to generic framework education tooltip
      return "This improved prompt follows the R/T/E framework: Rules establish constraints, Task defines what to generate, and Examples provide reference points for better AI responses.";
    }

    // Combine all explanations for comprehensive tooltip
    return explanations.map(ex => ex.tooltip || `This ${ex.section.toLowerCase()} section helps structure your prompt.`).join(' ');
  }, [explanations]);

  // Parse highlights and create segments
  const segmentsWithBadges = React.useMemo(() => {
    if (!highlights || highlights.length === 0) {
      return [{ text, type: null }];
    }

    const segments = [];
    let lastIndex = 0;

    highlights.forEach(highlight => {
      // Add non-highlighted text before this highlight
      if (highlight.startIndex > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, highlight.startIndex),
          type: null
        });
      }

      // Add highlighted segment
      segments.push({
        text: text.substring(highlight.startIndex, highlight.endIndex),
        type: highlight.type
      });

      lastIndex = highlight.endIndex;
    });

    // Add remaining text after last highlight
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        type: null
      });
    }

    return segments;
  }, [text, highlights]);

  return (
    <Tooltip content={getTooltipContent()}>
      <span className="improved-prompt-with-badges">
        {segmentsWithBadges.map((segment, index) => {
          if (segment.type) {
            return (
              <span
                key={index}
                className={`highlighted-text__segment highlighted-text__segment--${segment.type}`}
              >
                {segment.text}
              </span>
            );
          }
          return <span key={index}>{segment.text}</span>;
        })}
      </span>
    </Tooltip>
  );
};

// MessageList - Display list of chat messages with auto-scroll
// AC #3: MessageList component with auto-scroll and empty state
// Story 2.1: Added mostRecentAIMessage, onNotSatisfied, isFeedbackModalOpen props for "Not Satisfied" button
// Story 2.4: Added isGeneratingImprovement to disable button during loading
const MessageList = ({ messages, mostRecentAIMessage, onNotSatisfied, isFeedbackModalOpen, isGeneratingImprovement }) => {
  const messagesEndRef = React.useRef(null);

  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="chat-interface__message-list">
        <div className="message-list__empty-state">
          <p className="message-list__empty-text" role="status">
            No messages yet. Start by entering a prompt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-interface__message-list">
      {messages.map((message, index) => {
        const isMostRecentAI = mostRecentAIMessage && message === mostRecentAIMessage;
        const isDisabled = isFeedbackModalOpen || isGeneratingImprovement;

        return (
          <MessageBubble
            key={index}
            message={message}
            type={message.role === 'user' ? 'sent' : 'received'}
            showNotSatisfiedButton={isMostRecentAI}
            onNotSatisfied={onNotSatisfied}
            disabled={isDisabled}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

// RetryButton - Leaf component for error display with retry functionality
// Story 5.4: Retry mechanism for failed API calls
// Props: onRetry (function), error (object with { message, code }), isRetrying (boolean)
const RetryButton = ({ onRetry, error, isRetrying }) => {
  // Don't render if no error
  if (!error) return null;

  // Check if error is retryable
  const retryableErrorCodes = ['API_TIMEOUT', 'NETWORK_ERROR', 'RATE_LIMIT_EXCEEDED'];
  const isRetryable = retryableErrorCodes.includes(error.code);

  const handleRetry = () => {
    if (onRetry && typeof onRetry === 'function' && !isRetrying) {
      onRetry();
    }
  };

  return (
    React.createElement('div', { className: 'error-message', role: 'alert', 'aria-live': 'polite' },
      React.createElement('p', { className: 'error-message__text' }, error.message),
      isRetryable && React.createElement('button', {
        className: 'retry-button',
        onClick: handleRetry,
        disabled: isRetrying,
        type: 'button'
      }, isRetrying ? 'Retrying...' : 'Try Again')
    )
  );
};

// ChatInput - Input field with send button
// AC #4: ChatInput component with onSubmit and isLoading props
// Story 2.4: Added optional disable during improvement generation
// Story 5.4: Added error, onRetry, and isRetrying props for error display with retry
const ChatInput = React.forwardRef(({ onSubmit, isLoading = false, value, onChange, isHighlighted = false, error, onRetry, isRetrying }, ref) => {
  const { validationError, setValidationError, isGeneratingImprovement } = useAppContext();
  const inputRef = React.useRef(null);

  // Story 5.1: Expose focus method via useImperativeHandle
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      if (inputRef.current) {
        inputRef.current.focus();
        // Move cursor to end of text
        inputRef.current.setSelectionRange(value.length, value.length);
      }
    }
  }), [value]);

  // Optimize handleChange with useCallback to prevent unnecessary re-renders
  const handleChange = React.useCallback((e) => {
    onChange(e.target.value);
    // Clear validation error when user starts typing
    if (validationError && e.target.value.trim()) {
      setValidationError(null);
    }
  }, [validationError, setValidationError, onChange]);

  // Optimize handleSubmit with useCallback
  const handleSubmit = React.useCallback((e) => {
    e.preventDefault();

    // Validation: Empty input
    if (!value.trim()) {
      setValidationError({ message: 'Please enter a prompt', code: 'EMPTY_INPUT' });
      inputRef.current?.focus();
      return;
    }

    // Validation: Maximum length
    if (value.length > MAX_PROMPT_LENGTH) {
      setValidationError({ message: 'Prompt is too long. Maximum 2000 characters.', code: 'MAX_LENGTH_EXCEEDED' });
      return;
    }

    const userPrompt = value.trim();

    // Call parent's onSubmit handler with the prompt (parent will clear value)
    onSubmit(userPrompt);
  }, [value, setValidationError, onSubmit]);

  // Story 2.4: Disable input during chat loading OR improvement generation
  const isDisabled = isLoading || isGeneratingImprovement;

  return (
    <>
      {error && <RetryButton error={error} onRetry={onRetry} isRetrying={isRetrying} />}
      <form className="chat-interface__input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className={`chat-interface__input-field${isHighlighted ? ' chat-interface__input-field--highlighted' : ''}`}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={isGeneratingImprovement ? "Please wait while we generate your improvement..." : "Enter your prompt..."}
          disabled={isDisabled}
        />
        <Button
          onClick={handleSubmit}
          disabled={isDisabled || !value.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
      {validationError && <ValidationError error={validationError} />}
    </>
  );
});

// ResetConfirmationModal - Layout component (Story 5.3)
// Optional modal for confirming destructive reset action
// Props: isOpen (boolean), onConfirm (callback), onCancel (callback)
// Accessibility: Focus trap, ESC key, keyboard navigation, screen reader support
const ResetConfirmationModal = React.memo(({ isOpen, onConfirm, onCancel }) => {
  const modalRef = React.useRef(null);

  // ESC key handler and keyboard focus trap
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Focus trap: Tab key cycles within modal only
    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: Focus moving backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Focus moving forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      // Add event listeners
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);

      // Set initial focus to first focusable element
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }

    return () => {
      // Cleanup: remove event listeners
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onCancel]);

  // Guard clause - don't render if closed
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close only if overlay is clicked, not modal container
    if (e.target.classList.contains('reset-modal__overlay')) {
      onCancel();
    }
  };

  return (
    <div className="reset-modal__overlay" onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className="reset-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
        aria-describedby="reset-modal-description"
      >
        {/* Modal Header */}
        <div className="reset-modal__header">
          <h2 id="reset-modal-title" className="reset-modal__title">
            Clear Chat History?
          </h2>
        </div>

        {/* Modal Body */}
        <div className="reset-modal__body">
          <p id="reset-modal-description" className="reset-modal__message">
            This will clear all chat history and you'll start fresh. This action cannot be undone.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="reset-modal__footer">
          <button
            className="reset-modal__button reset-modal__button--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="reset-modal__button reset-modal__button--confirm"
            onClick={onConfirm}
          >
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// LAYOUT COMPONENTS
// ============================================================

// ChatInterface - Main chat layout with message list and input
// AC #5: ChatInterface component using useAppContext
// Story 2.1: Added logic to find most recent AI message and handle "Not Satisfied" button
// Story 2.4: Added LoadingIndicator for feedback processing state
// Story 5.1: Accept controlled input props from App
// Story 5.3: Add header with reset button and confirmation modal
// Story 5.4: Added isRetrying state for retry debouncing
const ChatInterface = ({ chatInputValue, setChatInputValue, chatInputRef, isInputHighlighted, onReset }) => {
  const { chatHistory, isChatLoading, chatError, addMessage, setChatError, setIsChatLoading, setValidationError, isFeedbackModalOpen, setIsFeedbackModalOpen, setIsComparisonModalOpen, setRecentFeedback, isGeneratingImprovement } = useAppContext();
  const [pendingPrompt, setPendingPrompt] = React.useState(null);
  const [isRetrying, setIsRetrying] = React.useState(false);

  // Story 5.3: Local state for reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  // Story 2.1: Find most recent AI response for "Not Satisfied" button
  const getMostRecentAIMessage = React.useCallback(() => {
    const aiMessages = chatHistory.filter(msg => msg.role === 'assistant');
    return aiMessages.length > 0 ? aiMessages[aiMessages.length - 1] : null;
  }, [chatHistory]);

  const mostRecentAIMessage = getMostRecentAIMessage();

  // Story 2.1: Handle "Not Satisfied" button click
  // Opens feedback modal - Story 2.3 will capture feedback data on submit
  const handleNotSatisfied = React.useCallback(() => {
    // Close comparison modal if open (it shouldn't be, but defensive)
    setIsComparisonModalOpen(false);
    // Open feedback modal
    setIsFeedbackModalOpen(true);
  }, [setIsFeedbackModalOpen, setIsComparisonModalOpen]);

  // Story 5.3: Handle reset button click
  // Show confirmation if there are messages, otherwise reset immediately
  const handleResetClick = React.useCallback(() => {
    if (chatHistory && chatHistory.length > 0) {
      setShowResetConfirm(true);
    } else {
      // No messages, reset immediately
      onReset();
    }
  }, [chatHistory, onReset]);

  // Story 5.3: Confirm reset action
  const handleConfirmReset = React.useCallback(() => {
    setShowResetConfirm(false);
    onReset();
  }, [onReset]);

  // Story 5.3: Cancel reset action
  const handleCancelReset = React.useCallback(() => {
    setShowResetConfirm(false);
  }, []);

  // API integration submit handler - Story 1.4 implementation with retry support
  // Story 5.4: Enhanced with formatError for comprehensive error handling
  // Optimized with useCallback to prevent unnecessary re-renders
  const handleSubmit = React.useCallback(async (userPrompt) => {
    try {
      // Store prompt for potential retry
      setPendingPrompt(userPrompt);

      // Add user message to chat history
      addMessage({ role: 'user', content: userPrompt });

      // Story 5.1: Clear input after submission
      setChatInputValue('');

      // Clear validation and error on new submission
      setValidationError(null);
      setChatError(null);

      // Set loading state
      setIsChatLoading(true);

      // Call API
      const aiResponse = await callChatAPI(userPrompt);

      // Add AI response to chat history
      addMessage({ role: 'assistant', content: aiResponse });

      // Clear error on success
      setChatError(null);
      setPendingPrompt(null);
    } catch (error) {
      // Story 5.4: Format error for user-friendly display
      const formattedError = formatError(error);
      setChatError(formattedError);
      console.error('Chat API error:', formattedError);
    } finally {
      // Always clear loading state
      setIsChatLoading(false);
    }
  }, [addMessage, setChatError, setIsChatLoading, setValidationError, setChatInputValue]);

  // Story 5.4: Retry handler with debouncing to prevent race conditions
  const handleRetry = React.useCallback(async () => {
    if (pendingPrompt && !isRetrying && !isChatLoading) {
      setIsRetrying(true);
      setChatError(null); // Clear error before retry
      try {
        await handleSubmit(pendingPrompt);
      } finally {
        setIsRetrying(false);
      }
    }
  }, [pendingPrompt, isRetrying, isChatLoading, setChatError, handleSubmit]);

  return (
    <div className="chat-interface">
      {/* Story 5.3: Header with title and reset button */}
      <div className="chat-interface__header">
        <h1 className="chat-interface__title">DigitalWave Test</h1>
        <button
          className="chat-interface__reset-button"
          onClick={handleResetClick}
          aria-label="Clear chat history and start fresh"
        >
          Start Fresh
        </button>
      </div>

      <MessageList
        messages={chatHistory}
        mostRecentAIMessage={mostRecentAIMessage}
        onNotSatisfied={handleNotSatisfied}
        isFeedbackModalOpen={isFeedbackModalOpen}
        isGeneratingImprovement={isGeneratingImprovement}
      />

      {/* Story 2.4: Loading Indicator - Shows when improvement is being generated */}
      {isGeneratingImprovement && (
        <LoadingIndicator message="Generating improvement..." />
      )}

      <div className="chat-interface__input-container">
        <ChatInput
          ref={chatInputRef}
          onSubmit={handleSubmit}
          isLoading={isChatLoading}
          value={chatInputValue}
          onChange={setChatInputValue}
          isHighlighted={isInputHighlighted}
          error={chatError}
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      </div>

      {/* Story 5.3: Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={showResetConfirm}
        onConfirm={handleConfirmReset}
        onCancel={handleCancelReset}
      />
    </div>
  );
};

// FeedbackModal - Layout component (Story 2.2)
// Modal dialog for collecting user feedback about AI responses
// Props: isOpen (boolean), onClose (callback), onSubmit (callback with feedbackText)
// Story 5.4: Added error and onRetry props for error display with retry
// Architecture: feedbackText stored in LOCAL state (not context) - form data should be
// ephemeral and component-scoped, not polluting global state
const FeedbackModal = ({ isOpen, onClose, onSubmit, error, onRetry }) => {
  const [feedbackText, setFeedbackText] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const textareaRef = React.useRef(null);

  // Define handleClose with useCallback to prevent ESC effect from re-running unnecessarily
  const handleClose = React.useCallback(() => {
    setFeedbackText(''); // Clear feedback text
    setIsSubmitting(false); // Reset submitting state
    onClose(); // Call parent callback
  }, [onClose]);

  // Auto-focus textarea when modal opens
  // Clear feedback text when modal opens for fresh input
  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
      setFeedbackText(''); // Clear old feedback when modal opens
      setIsSubmitting(false); // Reset submitting state when modal reopens
    }
  }, [isOpen]);

  // ESC key handler - now safe with handleClose memoized
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  const handleSubmit = () => {
    // Guard against double submission
    if (isSubmitting) return;

    // Validate feedback text
    if (!feedbackText.trim()) {
      return; // Button should be disabled, but defensive check
    }

    // Set submitting state
    setIsSubmitting(true);

    // Call parent submit handler
    onSubmit(feedbackText);

    // Note: Modal will close via parent's setIsFeedbackModalOpen(false)
    // State will be reset when modal closes via handleClose
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
      <div
        className="feedback-modal"
        role="dialog"
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-description"
      >
        {/* Header */}
        <div className="feedback-modal__header">
          <h2 id="feedback-modal-title">Let's improve this result</h2>
        </div>

        {/* Body */}
        <div className="feedback-modal__body">
          <textarea
            ref={textareaRef}
            id="feedback-modal-description"
            className="feedback-modal__textarea"
            placeholder="What didn't you like about this result?"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            rows={3}
            maxLength={500}
            aria-label="Feedback input"
            disabled={isSubmitting}
          />
          {error && <RetryButton error={error} onRetry={onRetry} />}
          <p
            className={`feedback-modal__char-counter ${
              feedbackText.length > 450 ? 'feedback-modal__char-counter--danger' :
              feedbackText.length > 400 ? 'feedback-modal__char-counter--warning' : ''
            }`}
          >
            {feedbackText.length} / 500 characters
          </p>
        </div>

        {/* Footer */}
        <div className="feedback-modal__footer">
          <button
            className="feedback-modal__cancel-button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="feedback-modal__submit-button"
            onClick={handleSubmit}
            disabled={!feedbackText.trim() || isSubmitting}
          >
            {isSubmitting ? 'Generating...' : 'Generate Improved Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ComparisonModal - Layout component (Story 4.1)
// Modal for side-by-side comparison of original vs improved prompts
// Props: isOpen (boolean), comparisonData (object with originalPrompt, improvedPrompt), onClose (callback)
// Story 4.2: Enhanced with HighlightedText component for improved prompt highlighting
// Story 4.4: Enhanced with educational tooltips on improved prompt
const ComparisonModal = ({ isOpen, comparisonData, onClose, onUsePrompt }) => {
  const modalRef = React.useRef(null);
  const triggerElementRef = React.useRef(null);

  // Story 5.1: State for button loading
  const [isInserting, setIsInserting] = React.useState(false);

  // Story 5.1: Handle "Use This Prompt" button click
  // Code Review Fix: Added null check and increased timeout to match modal animation
  const handleUsePrompt = React.useCallback(() => {
    // Code Review Fix: Null check for comparisonData
    if (!comparisonData || !comparisonData.improvedPrompt) {
      console.error('No improved prompt available');
      return;
    }

    setIsInserting(true);

    // Extract improved prompt from comparison data
    const { improvedPrompt } = comparisonData;

    // Call parent callback to insert prompt into chat input
    if (onUsePrompt) {
      onUsePrompt(improvedPrompt);
    }

    // Close modal
    onClose();

    // Code Review Fix: Increased timeout to 300ms to match modal close animation duration
    setTimeout(() => setIsInserting(false), 300);
  }, [comparisonData, onUsePrompt, onClose]);

  // ESC key handler and keyboard focus trap
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Focus trap: Tab key cycles within modal only
    const handleTab = (e) => {
      if (e.key === 'Tab') {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: Focus moving backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: Focus moving forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      // Store trigger element for focus restoration
      triggerElementRef.current = document.activeElement;

      // Add event listeners
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);

      // Set initial focus to first focusable element
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(
          'button, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    }

    return () => {
      // Cleanup: remove event listeners
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);

      // Return focus to trigger element when modal closes
      if (triggerElementRef.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Guard clause - don't render if closed or no data
  if (!isOpen || !comparisonData) {
    return null;
  }

  // Story 4.2: Parse improved prompt for highlights (after guard clause, safe to access comparisonData)
  const highlights = parseImprovedPrompt(comparisonData.improvedPrompt);

  // Story 4.4: Extract explanations for tooltips (after guard clause, safe to access comparisonData)
  const explanations = comparisonData.explanations || [];

  // Overlay click handler
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('comparison-modal__overlay')) {
      onClose();
    }
  };

  return (
    <div className="comparison-modal__overlay" onClick={handleOverlayClick}>
      <div ref={modalRef} className="comparison-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
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
              <p className="comparison-modal__prompt-text">
                {comparisonData.originalPrompt}
              </p>
            </div>
          </div>

          {/* Right Column - Improved Prompt (Story 4.2: WITH HIGHLIGHTING, Story 4.4: WITH EDUCATIONAL TOOLTIPS) */}
          <div className="comparison-modal__column comparison-modal__column--improved">
            <h3 className="comparison-modal__column-header comparison-modal__column-header--improved">
              Improved Version
            </h3>
            <div className="comparison-modal__content">
              {/* Story 4.4: Pass explanations prop for educational tooltips on improved prompt */}
              <ImprovedPromptWithBadges
                text={comparisonData.improvedPrompt}
                highlights={highlights}
                explanations={explanations}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer - Use This Prompt Button */}
        <div className="comparison-modal__footer">
          <button
            className="comparison-modal__use-button"
            onClick={handleUsePrompt}
            disabled={isInserting}
            aria-label="Use this improved prompt"
          >
            {isInserting ? 'Inserting...' : 'Use This Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CONTEXT PROVIDER
// ============================================================

// AppContext - Global application state
const AppContext = React.createContext(null);

// AC #2: AppProvider component with useState hooks and context value
const AppProvider = ({ children }) => {
  // AC #1: Complete state structure
  // Chat state
  const [chatHistory, setChatHistory] = React.useState([]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const [chatError, setChatError] = React.useState(null);

  // Story 1.5: Validation state
  const [validationError, setValidationError] = React.useState(null);

  // Modal states
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = React.useState(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = React.useState(false);
  const [comparisonData, setComparisonData] = React.useState(null);

  // Improvement state
  const [isGeneratingImprovement, setIsGeneratingImprovement] = React.useState(false);
  const [improvementError, setImprovementError] = React.useState(null);

  // Feedback context
  const [recentFeedback, setRecentFeedback] = React.useState(null);

  // Story 4.1: Close comparison modal handler
  const handleCloseComparisonModal = () => {
    setIsComparisonModalOpen(false);
    // Optionally clear comparisonData
    // setComparisonData(null);
  };

  // AC #3: Immutable state update helpers
  const addMessage = (message) => {
    setChatHistory(prev => [...prev, message]);
  };

  const clearChat = () => {
    setChatHistory([]);
    setChatError(null);
    setRecentFeedback(null);
    setComparisonData(null);
  };

  // Memoize context value to prevent unnecessary re-renders
  const value = React.useMemo(() => ({
    // State values
    chatHistory,
    isChatLoading,
    chatError,
    validationError,
    isFeedbackModalOpen,
    isComparisonModalOpen,
    comparisonData,
    isGeneratingImprovement,
    improvementError,
    recentFeedback,
    // State updaters
    setChatHistory,
    setIsChatLoading,
    setChatError,
    setValidationError,
    setIsFeedbackModalOpen,
    setIsComparisonModalOpen,
    setComparisonData,
    setIsGeneratingImprovement,
    setImprovementError,
    setRecentFeedback,
    // Helper functions
    addMessage,
    clearChat,
    handleCloseComparisonModal
  }), [
    chatHistory,
    isChatLoading,
    chatError,
    validationError,
    isFeedbackModalOpen,
    isComparisonModalOpen,
    comparisonData,
    isGeneratingImprovement,
    improvementError,
    recentFeedback
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

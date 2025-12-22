import React, { useEffect, useState } from 'react'
import { useFlightPlans } from '../../context/FlightPlansContext'
import { useOnboarding } from '../../context/OnboardingContext'
import './FlightPlansWidget.css'

const HIDDEN_STORAGE_KEY = 'flightPlansHidden'

interface FlightPlansWidgetProps {
  transitionMode?: boolean
  justCompletedTaskId?: string
  nextTaskId?: string
  onContinue?: () => void
  onExit?: () => void
}

export const FlightPlansWidget: React.FC<FlightPlansWidgetProps> = ({
  transitionMode = false,
  justCompletedTaskId,
  nextTaskId,
  onContinue,
  onExit,
}) => {
  const { visibleTasks, progress } = useFlightPlans()
  const { currentStep, setCurrentStep } = useOnboarding()
  const MINIMIZED_STORAGE_KEY = 'flightPlansMinimized'
  
  // Initialize minimized state from localStorage, default to true (minimized) on launcher
  const [minimized, setMinimized] = useState(() => {
    const stored = localStorage.getItem(MINIMIZED_STORAGE_KEY)
    if (stored !== null) {
      return stored === 'true'
    }
    // Default to minimized on launcher (complete step)
    return currentStep === 'complete'
  })
  
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [isHidden, setIsHidden] = useState(() => {
    const stored = localStorage.getItem(HIDDEN_STORAGE_KEY)
    return stored === 'true'
  })
  const [showHideConfirm, setShowHideConfirm] = useState(false)
  
  const isIntroStep = currentStep === 'flight-plans-intro'

  // Persist minimized state to localStorage
  useEffect(() => {
    localStorage.setItem(MINIMIZED_STORAGE_KEY, String(minimized))
  }, [minimized])

  // Keep widget collapsed/highlighted during intro
  useEffect(() => {
    if (isIntroStep) {
      setMinimized(true)
    }
  }, [isIntroStep])
  
  // Minimize during welcome step 2 and when on launcher (complete step)
  useEffect(() => {
    if (currentStep === 'welcome' || currentStep === 'complete') {
      setMinimized(true)
    }
  }, [currentStep])
  
  // In transition mode, always show expanded and expand the just-completed task
  useEffect(() => {
    if (transitionMode) {
      setMinimized(false)
      if (justCompletedTaskId) {
        setExpandedTasks(new Set([justCompletedTaskId]))
      }
    }
  }, [transitionMode, justCompletedTaskId])

  const handleHideClick = () => {
    setShowHideConfirm(true)
  }

  const handleHideConfirm = () => {
    localStorage.setItem(HIDDEN_STORAGE_KEY, 'true')
    setIsHidden(true)
    setShowHideConfirm(false)
  }

  const handleHideCancel = () => {
    setShowHideConfirm(false)
  }

  const handleShow = () => {
    localStorage.setItem(HIDDEN_STORAGE_KEY, 'false')
    setIsHidden(false)
  }

  // If hidden and not in transition mode, show a small "Show Flight Plans" button
  if (isHidden && !transitionMode) {
    return (
      <button className="fp-widget__show-btn" onClick={handleShow}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Flight Plans
      </button>
    )
  }

  return (
    <>
      {(!minimized || transitionMode) && (
        <div 
          className={`fp-widget__backdrop ${isIntroStep ? 'fp-widget__backdrop--highlighted' : ''} ${transitionMode ? 'fp-widget__backdrop--transition' : ''}`}
          onClick={transitionMode ? undefined : () => setMinimized(true)}
        />
      )}
    <div 
        className={`fp-widget ${minimized && !transitionMode ? 'fp-widget--minimized' : ''} ${isIntroStep ? 'fp-widget--highlighted' : ''} ${transitionMode ? 'fp-widget--transition' : ''}`}
      onClick={minimized && !transitionMode ? () => setMinimized(false) : undefined}
      style={minimized && !transitionMode ? { cursor: 'pointer' } : undefined}
    >
      {transitionMode && onExit && (
        <button className="fp-widget__exit" onClick={onExit} aria-label="Exit">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      <div className="fp-widget__header">
        <div className="fp-widget__header-left">
          <div>
            <p className="fp-widget__eyebrow">Flight Plans</p>
            {/* <h3 className="fp-widget__title">Onboarding Checklist</h3> */}
            {(!minimized || transitionMode) && (
              <p className="fp-widget__subtitle">
                {transitionMode ? 'Flight plan complete! Here\'s what\'s next.' : 'Complete quests to master the SuperApp. Jump in any order.'}
              </p>
            )}
          </div>
        </div>
        <div className="fp-widget__header-right">
          <div className="fp-widget__progress">
            <div className="fp-widget__progress-bar">
              <div className="fp-widget__progress-fill" style={{ width: `${progress.percent}%` }} />
            </div>
            <span className="fp-widget__progress-text">
              {progress.completed} / {progress.total} complete
            </span>
          </div>
          {!minimized && !transitionMode && (
            <button
              className="fp-widget__toggle"
              onClick={(e) => {
                e.stopPropagation()
                setMinimized(true)
              }}
              aria-label="Minimize Flight Plans"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fp-widget__toggle-icon"
              >
                <line
                  x1="3"
                  y1="8"
                  x2="13"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {(!minimized || transitionMode) && (
        <div className="fp-widget__tasks">
          {visibleTasks.map((task) => {
            const isCompleted = task.status === 'completed'
            const isExpanded = expandedTasks.has(task.id)
            const isCollapsed = isCompleted && !isExpanded
            
            // In transition mode, determine if this task should be highlighted or dimmed
            const isJustCompleted = transitionMode && task.id === justCompletedTaskId
            const isNextTask = transitionMode && task.id === nextTaskId
            const isDimmed = transitionMode && !isJustCompleted && !isNextTask

            const toggleExpanded = () => {
              setExpandedTasks((prev) => {
                const next = new Set(prev)
                if (next.has(task.id)) {
                  next.delete(task.id)
                } else {
                  next.add(task.id)
                }
                return next
              })
            }

            return (
            <div
              key={task.id}
                className={`fp-task fp-task--${task.status} ${isCollapsed && !isJustCompleted ? 'fp-task--collapsed' : ''} ${isCompleted ? 'fp-task--clickable' : ''} ${isJustCompleted ? 'fp-task--just-completed' : ''} ${isNextTask ? 'fp-task--next' : ''} ${isDimmed ? 'fp-task--dimmed' : ''}`}
              aria-disabled={task.status === 'locked'}
                onClick={isCompleted && !transitionMode ? toggleExpanded : undefined}
            >
                <div className="fp-task__header">
                  <div className="fp-task__header-left">
                    {isCompleted && !transitionMode && (
                      <div
                        className="fp-task__expand-toggle"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`fp-task__expand-icon ${isExpanded ? 'fp-task__expand-icon--expanded' : ''}`}
                        >
                          <path
                            d="M4 6 L8 10 L12 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </div>
                    )}
              <div className="fp-task__meta">
                      {(!isCollapsed || isJustCompleted) && (
                <div className="fp-task__category">
                  {isJustCompleted && <span className="fp-task__complete-badge">Complete</span>}
                  {isNextTask && <span className="fp-task__next-badge">Up Next</span>}
                  {!isJustCompleted && !isNextTask && task.category.replace('-', ' ')}
                </div>
                      )}
                <h4 className="fp-task__title">{task.title}</h4>
                      {(!isCollapsed || isJustCompleted) && (
                        <>
                <p className="fp-task__description">{task.description}</p>
                <p className="fp-task__feature">Focus: {task.feature}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="fp-task__header-right">
                    {isCompleted || isJustCompleted ? (
                      <div className={`fp-task__completed-indicator ${isJustCompleted ? 'fp-task__completed-indicator--animated' : ''}`}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="10"
                            cy="10"
                            r="9"
                            stroke="#30d158"
                            strokeWidth="2"
                            fill="none"
                          />
                          <path
                            d="M6 10 L9 13 L14 7"
                            stroke="#30d158"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
              </div>
                    ) : (
                <button
                  className="fp-task__cta"
                  disabled={task.status === 'locked' || isDimmed}
                  onClick={(e) => {
                    e.stopPropagation()
                    // In transition mode, clicking "Start" on the next task should trigger onContinue
                    if (transitionMode && isNextTask && onContinue) {
                      onContinue()
                    } else if (task.onboardingStep) {
                      // If task has an onboardingStep, navigate to it
                      setCurrentStep(task.onboardingStep)
                    }
                  }}
                >
                        {task.inProgress ? 'Resume' : 'Start'}
                </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {transitionMode && onContinue && (
        <div className="fp-widget__transition-footer">
          <p className="fp-widget__transition-message">Pebble Beach awaits.</p>
          <button className="fp-widget__continue-btn" onClick={onContinue}>
            Continue to Pebble Beach
          </button>
        </div>
      )}
      
      {!minimized && !transitionMode && (
        <div className="fp-widget__footer">
          <button className="fp-widget__hide-btn" onClick={handleHideClick}>
            Hide Flight Plans
          </button>
        </div>
      )}
      
      {showHideConfirm && (
        <div className="fp-widget__confirm-overlay">
          <div className="fp-widget__confirm-dialog">
            <p className="fp-widget__confirm-message">
              Are you sure you want to hide Flight Plans?
            </p>
            <p className="fp-widget__confirm-note">
              You can re-enable this anytime from Settings.
            </p>
            <div className="fp-widget__confirm-actions">
              <button className="fp-widget__confirm-cancel" onClick={handleHideCancel}>
                Cancel
              </button>
              <button className="fp-widget__confirm-hide" onClick={handleHideConfirm}>
                Hide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}


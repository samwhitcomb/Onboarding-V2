import React, { useState } from 'react'
import { Modal, Button } from '../components'
import './SettingsModal.css'

interface SettingsModalProps {
  onClose: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  // Accordion state - only one section open at a time
  const [expandedSection, setExpandedSection] = useState<string | null>('gameplay')
  
  // Gameplay Settings
  const [targetDistance, setTargetDistance] = useState(150)
  const [targetType, setTargetType] = useState('circle')
  const [shotTrackingMode, setShotTrackingMode] = useState('auto')
  const [ballStatusDisplay, setBallStatusDisplay] = useState(true)

  // Visual Settings
  const [displayView, setDisplayView] = useState('gameplay')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['ball-speed', 'carry', 'total'])
  const [colorScheme, setColorScheme] = useState('default')
  const [gridOverlay, setGridOverlay] = useState(false)
  
  // Camera Replay Settings
  const [autoReplay, setAutoReplay] = useState(true)
  const [replaySpeed, setReplaySpeed] = useState('normal')
  const [replayQuality, setReplayQuality] = useState('high')
  const [showSlowMotion, setShowSlowMotion] = useState(true)
  
  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  const handleSave = () => {
    // Save settings (not persisted yet)
    onClose()
  }

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    )
  }

  const availableMetrics = [
    { id: 'ball-speed', label: 'Ball Speed' },
    { id: 'carry', label: 'Carry' },
    { id: 'total', label: 'Total' },
    { id: 'apex', label: 'Apex' },
    { id: 'launch-angle', label: 'Launch Angle' },
    { id: 'spin-rate', label: 'Spin Rate' },
    { id: 'club-speed', label: 'Club Speed' },
  ]

  const displayViews = [
    { id: 'gameplay', label: 'Gameplay' },
    { id: 'dispersion', label: 'Dispersion' },
    { id: 'topside', label: 'Topside View' },
    { id: 'club-data', label: 'Club Data' },
    { id: 'metrics', label: 'Metrics' },
  ]

  return (
    <Modal className="settings-modal-full">
      <div className="settings-modal-content">
        <h2 className="settings-modal-content__title">Settings</h2>

        <div className="settings-accordion">
          {/* Gameplay Settings Section */}
          <div className="settings-accordion-item">
            <button
              className="settings-accordion-header"
              onClick={() => toggleSection('gameplay')}
            >
              <h3 className="settings-section__title">Gameplay Settings</h3>
              <svg
                className={`settings-accordion-icon ${expandedSection === 'gameplay' ? 'settings-accordion-icon--expanded' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {expandedSection === 'gameplay' && (
              <div className="settings-accordion-content">
                <div className="settings-group">
                  <label className="settings-label">Target Distance</label>
                  <div className="settings-input-group">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={targetDistance}
                      onChange={(e) => setTargetDistance(Number(e.target.value))}
                      className="settings-slider"
                    />
                    <span className="settings-value">{targetDistance} yards</span>
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Target Type</label>
                  <div className="settings-options">
                    {['circle', 'flag', 'custom'].map((type) => (
                      <button
                        key={type}
                        className={`settings-option ${targetType === type ? 'settings-option--active' : ''}`}
                        onClick={() => setTargetType(type)}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Shot Tracking Mode</label>
                  <div className="settings-options">
                    {['auto', 'manual'].map((mode) => (
                      <button
                        key={mode}
                        className={`settings-option ${shotTrackingMode === mode ? 'settings-option--active' : ''}`}
                        onClick={() => setShotTrackingMode(mode)}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Ball Status Display</label>
                  <button
                    className={`settings-toggle ${ballStatusDisplay ? 'settings-toggle--active' : ''}`}
                    onClick={() => setBallStatusDisplay(!ballStatusDisplay)}
                  >
                    {ballStatusDisplay ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Visual Settings Section */}
          <div className="settings-accordion-item">
            <button
              className="settings-accordion-header"
              onClick={() => toggleSection('visual')}
            >
              <h3 className="settings-section__title">Visual Settings</h3>
              <svg
                className={`settings-accordion-icon ${expandedSection === 'visual' ? 'settings-accordion-icon--expanded' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {expandedSection === 'visual' && (
              <div className="settings-accordion-content">
                <div className="settings-group">
                  <label className="settings-label">Display View</label>
                  <div className="settings-tabs">
                    {displayViews.map((view) => (
                      <button
                        key={view.id}
                        className={`settings-tab ${displayView === view.id ? 'settings-tab--active' : ''}`}
                        onClick={() => setDisplayView(view.id)}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Metrics Display</label>
                  <div className="settings-checkboxes">
                    {availableMetrics.map((metric) => (
                      <label key={metric.id} className="settings-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric.id)}
                          onChange={() => toggleMetric(metric.id)}
                        />
                        <span>{metric.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Color Scheme</label>
                  <div className="settings-options">
                    {['default', 'high-contrast', 'custom'].map((scheme) => (
                      <button
                        key={scheme}
                        className={`settings-option ${colorScheme === scheme ? 'settings-option--active' : ''}`}
                        onClick={() => setColorScheme(scheme)}
                      >
                        {scheme.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Grid Overlay</label>
                  <button
                    className={`settings-toggle ${gridOverlay ? 'settings-toggle--active' : ''}`}
                    onClick={() => setGridOverlay(!gridOverlay)}
                  >
                    {gridOverlay ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Camera Replay Settings Section */}
          <div className="settings-accordion-item">
            <button
              className="settings-accordion-header"
              onClick={() => toggleSection('camera-replay')}
            >
              <h3 className="settings-section__title">Camera Replay</h3>
              <svg
                className={`settings-accordion-icon ${expandedSection === 'camera-replay' ? 'settings-accordion-icon--expanded' : ''}`}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {expandedSection === 'camera-replay' && (
              <div className="settings-accordion-content">
                <div className="settings-group">
                  <label className="settings-label">Auto Replay</label>
                  <button
                    className={`settings-toggle ${autoReplay ? 'settings-toggle--active' : ''}`}
                    onClick={() => setAutoReplay(!autoReplay)}
                  >
                    {autoReplay ? 'On' : 'Off'}
                  </button>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Replay Speed</label>
                  <div className="settings-options">
                    {['slow', 'normal', 'fast'].map((speed) => (
                      <button
                        key={speed}
                        className={`settings-option ${replaySpeed === speed ? 'settings-option--active' : ''}`}
                        onClick={() => setReplaySpeed(speed)}
                      >
                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Replay Quality</label>
                  <div className="settings-options">
                    {['low', 'medium', 'high'].map((quality) => (
                      <button
                        key={quality}
                        className={`settings-option ${replayQuality === quality ? 'settings-option--active' : ''}`}
                        onClick={() => setReplayQuality(quality)}
                      >
                        {quality.charAt(0).toUpperCase() + quality.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label">Show Slow Motion</label>
                  <button
                    className={`settings-toggle ${showSlowMotion ? 'settings-toggle--active' : ''}`}
                    onClick={() => setShowSlowMotion(!showSlowMotion)}
                  >
                    {showSlowMotion ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="settings-modal-content__actions">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  )
}


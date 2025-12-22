import React from 'react'
import './CombineRadarChart.css'

interface CombineData {
  accuracy: number
  distance: number
  consistency: number
  shotShape: number
  trajectoryControl: number
}

interface CombineRadarChartProps {
  data: CombineData
  totalScore: number
  maxScore: number
}

export const CombineRadarChart: React.FC<CombineRadarChartProps> = ({
  data,
  totalScore,
  maxScore,
}) => {
  const metrics = [
    { label: 'Accuracy', value: data.accuracy, angle: 0 },
    { label: 'Distance', value: data.distance, angle: 72 },
    { label: 'Consistency', value: data.consistency, angle: 144 },
    { label: 'Shot Shape', value: data.shotShape, angle: 216 },
    { label: 'Trajectory', value: data.trajectoryControl, angle: 288 },
  ]

  const size = 280
  const center = size / 2
  const maxRadius = (size / 2) - 60
  const levels = 5

  // Generate points for the data polygon
  const getPoint = (value: number, angle: number) => {
    const radius = (value / 100) * maxRadius
    const angleRad = (angle - 90) * (Math.PI / 180)
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad),
    }
  }

  const dataPoints = metrics.map((m) => getPoint(m.value, m.angle))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  // Generate grid circles
  const gridCircles = Array.from({ length: levels }, (_, i) => {
    const radius = ((i + 1) / levels) * maxRadius
    return radius
  })

  // Generate axis lines
  const axisLines = metrics.map((m) => {
    const endPoint = getPoint(100, m.angle)
    return { start: { x: center, y: center }, end: endPoint }
  })

  // Label positions
  const labels = metrics.map((m) => {
    const labelRadius = maxRadius + 30
    const angleRad = (m.angle - 90) * (Math.PI / 180)
    return {
      ...m,
      x: center + labelRadius * Math.cos(angleRad),
      y: center + labelRadius * Math.sin(angleRad),
    }
  })

  return (
    <div className="radar-chart">
      <div className="radar-chart__header">
        <h3 className="radar-chart__title">Combine Performance</h3>
        <div className="radar-chart__score">
          <span className="radar-chart__score-value">{totalScore}</span>
          <span className="radar-chart__score-max">/{maxScore}</span>
        </div>
      </div>

      <svg
        className="radar-chart__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Grid circles */}
        {gridCircles.map((radius, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Data polygon */}
        <path
          d={dataPath}
          fill="rgba(48, 209, 88, 0.2)"
          stroke="rgba(48, 209, 88, 0.8)"
          strokeWidth="2"
        />

        {/* Data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--accent-green)"
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="radar-chart__labels">
        {labels.map((label, i) => (
          <div
            key={i}
            className="radar-chart__label"
            style={{
              left: `${label.x}px`,
              top: `${label.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="radar-chart__label-text">{label.label}</div>
            <div className="radar-chart__label-value">{label.value}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}



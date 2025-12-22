import React from 'react'
import { getCourseImage } from '../../utils/courseImages'
import './GPSHeatmap.css'

interface GPSHeatmapProps {
  courseImage: string
  courseName: string
  shotCount?: number
}

export const GPSHeatmap: React.FC<GPSHeatmapProps> = ({
  courseImage,
  courseName,
  shotCount = 18,
}) => {
  // Generate mock shot positions (in a real app, this would be actual GPS data)
  const generateMockShots = () => {
    const shots = []
    for (let i = 0; i < shotCount; i++) {
      shots.push({
        id: i,
        x: 20 + Math.random() * 60,  // Random X position (20-80%)
        y: 20 + Math.random() * 60,  // Random Y position (20-80%)
        accuracy: Math.random() > 0.7 ? 'good' : Math.random() > 0.4 ? 'ok' : 'miss',
      })
    }
    return shots
  }

  const shots = generateMockShots()

  return (
    <div className="gps-heatmap">
      <div className="gps-heatmap__header">
        <h3 className="gps-heatmap__title">Shot Tracking Map</h3>
        <div className="gps-heatmap__legend">
          <div className="gps-heatmap__legend-item">
            <div className="gps-heatmap__legend-dot gps-heatmap__legend-dot--good" />
            <span>On Target</span>
          </div>
          <div className="gps-heatmap__legend-item">
            <div className="gps-heatmap__legend-dot gps-heatmap__legend-dot--ok" />
            <span>Near Miss</span>
          </div>
          <div className="gps-heatmap__legend-item">
            <div className="gps-heatmap__legend-dot gps-heatmap__legend-dot--miss" />
            <span>Off Target</span>
          </div>
        </div>
      </div>

      <div className="gps-heatmap__map-container">
        <img
          src={courseImage}
          alt={courseName}
          className="gps-heatmap__course-image"
        />
        <div className="gps-heatmap__overlay">
          {shots.map((shot) => (
            <div
              key={shot.id}
              className={`gps-heatmap__shot gps-heatmap__shot--${shot.accuracy}`}
              style={{
                left: `${shot.x}%`,
                top: `${shot.y}%`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="gps-heatmap__stats">
        <div className="gps-heatmap__stat">
          <span className="gps-heatmap__stat-label">Total Shots</span>
          <span className="gps-heatmap__stat-value">{shotCount}</span>
        </div>
        <div className="gps-heatmap__stat">
          <span className="gps-heatmap__stat-label">Dispersion</span>
          <span className="gps-heatmap__stat-value">
            {(Math.random() * 20 + 15).toFixed(1)} yds
          </span>
        </div>
      </div>
    </div>
  )
}


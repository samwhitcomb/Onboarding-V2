import React, { useState } from 'react'
import './ScorecardPreview.css'

interface ScorecardPreviewProps {
  course: any
}

export const ScorecardPreview: React.FC<ScorecardPreviewProps> = ({ course }) => {
  // Generate a simple scorecard - in a real app, this would come from course data
  const par = course.par || 72
  const yardage = course.yardage || 7000
  
  // Generate 18 holes with default values
  const holes = Array.from({ length: 18 }, (_, i) => ({
    number: i + 1,
    par: i < 4 ? 4 : i < 10 ? 4 : i < 13 ? 3 : i < 16 ? 4 : 5,
    yardage: Math.floor(yardage / 18) + (Math.random() * 100 - 50),
    handicap: i + 1
  }))
  
  const front9 = holes.slice(0, 9)
  const back9 = holes.slice(9, 18)
  const front9Par = front9.reduce((sum, hole) => sum + hole.par, 0)
  const back9Par = back9.reduce((sum, hole) => sum + hole.par, 0)
  const front9Yardage = front9.reduce((sum, hole) => sum + hole.yardage, 0)
  const back9Yardage = back9.reduce((sum, hole) => sum + hole.yardage, 0)
  const totalYardage = front9Yardage + back9Yardage

  const getParColor = (par: number) => {
    if (par === 3) return 'par-3'
    if (par === 4) return 'par-4'
    return 'par-5'
  }

  return (
    <div className="scorecard-preview">
      <div className="scorecard-header">
        <h2 className="scorecard-title">{course.name}</h2>
        <div className="scorecard-summary">
          <span>Par {par}</span>
          <span>•</span>
          <span>{totalYardage.toLocaleString()} yds</span>
        </div>
      </div>

      <div className="scorecard-table">
        <div className="scorecard-row scorecard-header-row">
          <div className="scorecard-cell header">Hole</div>
          <div className="scorecard-cell header">Par</div>
          <div className="scorecard-cell header">Yards</div>
          <div className="scorecard-cell header">HCP</div>
          <div className="scorecard-divider"></div>
          <div className="scorecard-cell header">Hole</div>
          <div className="scorecard-cell header">Par</div>
          <div className="scorecard-cell header">Yards</div>
          <div className="scorecard-cell header">HCP</div>
        </div>

        {front9.map((hole, index) => {
          const backHole = back9[index]
          return (
            <div key={hole.number} className="scorecard-row">
              <div className="scorecard-cell hole-number">
                {hole.number}
              </div>
              <div className={`scorecard-cell par ${getParColor(hole.par)}`}>
                {hole.par}
              </div>
              <div className="scorecard-cell yardage">
                <span className="yardage-number">
                  {Math.round(hole.yardage)}
                </span>
              </div>
              <div className="scorecard-cell handicap">{hole.handicap}</div>
              <div className="scorecard-divider"></div>
              <div className="scorecard-cell hole-number">
                {backHole.number}
              </div>
              <div className={`scorecard-cell par ${getParColor(backHole.par)}`}>
                {backHole.par}
              </div>
              <div className="scorecard-cell yardage">
                <span className="yardage-number">
                  {Math.round(backHole.yardage)}
                </span>
              </div>
              <div className="scorecard-cell handicap">{backHole.handicap}</div>
            </div>
          )
        })}

        <div className="scorecard-row scorecard-totals-row">
          <div className="scorecard-cell total-label">Out</div>
          <div className="scorecard-cell total-value">{front9Par}</div>
          <div className="scorecard-cell total-value">
            <span className="yardage-number">
              {Math.round(front9Yardage)}
            </span>
          </div>
          <div className="scorecard-cell"></div>
          <div className="scorecard-divider"></div>
          <div className="scorecard-cell total-label">In</div>
          <div className="scorecard-cell total-value">{back9Par}</div>
          <div className="scorecard-cell total-value">
            <span className="yardage-number">
              {Math.round(back9Yardage)}
            </span>
          </div>
          <div className="scorecard-cell"></div>
        </div>

        <div className="scorecard-row scorecard-totals-row final-total">
          <div className="scorecard-cell total-label">Total</div>
          <div className="scorecard-cell total-value">{par}</div>
          <div className="scorecard-cell total-value">
            <span className="yardage-number">
              {Math.round(totalYardage)}
            </span>
          </div>
          <div className="scorecard-cell"></div>
          <div className="scorecard-divider"></div>
          <div className="scorecard-cell"></div>
          <div className="scorecard-cell"></div>
          <div className="scorecard-cell"></div>
          <div className="scorecard-cell"></div>
        </div>
      </div>
    </div>
  )
}



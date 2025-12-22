import React from 'react'
import './Scorecard.css'

interface ScorecardProps {
  holeScores: number[]
  holePars: number[]
  frontNineTotal?: number
  backNineTotal?: number
  totalScore?: number
  totalPar?: number
}

export const Scorecard: React.FC<ScorecardProps> = ({
  holeScores,
  holePars,
  frontNineTotal,
  backNineTotal,
  totalScore,
  totalPar,
}) => {
  // Calculate totals if not provided
  const front9 = frontNineTotal ?? holeScores.slice(0, 9).reduce((sum, score) => sum + score, 0)
  const back9 = backNineTotal ?? holeScores.slice(9, 18).reduce((sum, score) => sum + score, 0)
  const total = totalScore ?? holeScores.reduce((sum, score) => sum + score, 0)
  const parTotal = totalPar ?? holePars.reduce((sum, par) => sum + par, 0)
  const toPar = total - parTotal

  const getScoreColor = (score: number, par: number): string => {
    const diff = score - par
    if (diff <= -2) return 'scorecard__score--eagle' // Double eagle or better
    if (diff === -1) return 'scorecard__score--birdie'
    if (diff === 0) return 'scorecard__score--par'
    if (diff === 1) return 'scorecard__score--bogey'
    return 'scorecard__score--double' // Double bogey or worse
  }

  return (
    <div className="scorecard scorecard--stacked">
      {/* Front 9 */}
      <div className="scorecard__header">
        <div className="scorecard__header-cell">Hole</div>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="scorecard__header-cell">
            {i + 1}
          </div>
        ))}
        <div className="scorecard__header-cell scorecard__header-cell--total">Out</div>
      </div>

      <div className="scorecard__row">
        <div className="scorecard__label">Par</div>
        {holePars.slice(0, 9).map((par, i) => (
          <div key={i} className="scorecard__par">{par}</div>
        ))}
        <div className="scorecard__total">{holePars.slice(0, 9).reduce((sum, par) => sum + par, 0)}</div>
      </div>

      <div className="scorecard__row">
        <div className="scorecard__label">Score</div>
        {holeScores.slice(0, 9).map((score, i) => (
          <div key={i} className={`scorecard__score ${getScoreColor(score, holePars[i])}`}>
            {score}
          </div>
        ))}
        <div className="scorecard__total">{front9}</div>
      </div>

      {/* Back 9 */}
      <div className="scorecard__header">
        <div className="scorecard__header-cell">Hole</div>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="scorecard__header-cell">
            {i + 10}
          </div>
        ))}
        <div className="scorecard__header-cell scorecard__header-cell--total">In</div>
      </div>

      <div className="scorecard__row">
        <div className="scorecard__label">Par</div>
        {holePars.slice(9, 18).map((par, i) => (
          <div key={i} className="scorecard__par">{par}</div>
        ))}
        <div className="scorecard__total">{holePars.slice(9, 18).reduce((sum, par) => sum + par, 0)}</div>
      </div>

      <div className="scorecard__row">
        <div className="scorecard__label">Score</div>
        {holeScores.slice(9, 18).map((score, i) => (
          <div key={i} className={`scorecard__score ${getScoreColor(score, holePars[i + 9])}`}>
            {score}
          </div>
        ))}
        <div className="scorecard__total">{back9}</div>
      </div>

      <div className="scorecard__footer">
        <div className="scorecard__footer-label">Total</div>
        <div className="scorecard__footer-value">
          {total} {toPar !== 0 && (
            <span className={`scorecard__to-par ${toPar > 0 ? 'scorecard__to-par--over' : 'scorecard__to-par--under'}`}>
              ({toPar > 0 ? '+' : ''}{toPar})
            </span>
          )}
        </div>
      </div>
    </div>
  )
}


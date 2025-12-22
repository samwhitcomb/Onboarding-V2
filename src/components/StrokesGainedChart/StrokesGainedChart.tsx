import React from 'react'
import './StrokesGainedChart.css'

interface StrokesGainedData {
  driver: number
  irons: number
  shortGame: number
}

interface StrokesGainedChartProps {
  data: StrokesGainedData
  total: number
}

export const StrokesGainedChart: React.FC<StrokesGainedChartProps> = ({ data, total }) => {
  const maxValue = Math.max(Math.abs(data.driver), Math.abs(data.irons), Math.abs(data.shortGame), 2)
  
  const getBarHeight = (value: number): number => {
    return (Math.abs(value) / maxValue) * 100
  }

  const getBarColor = (value: number): string => {
    return value >= 0 ? 'var(--accent-green)' : 'var(--accent-red)'
  }

  const formatValue = (value: number): string => {
    return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1)
  }

  return (
    <div className="sg-chart">
      <div className="sg-chart__header">
        <h3 className="sg-chart__title">Strokes Gained Breakdown</h3>
        <div className="sg-chart__total">
          <span className="sg-chart__total-label">Total SG</span>
          <span 
            className="sg-chart__total-value"
            style={{ color: getBarColor(total) }}
          >
            {formatValue(total)}
          </span>
        </div>
      </div>

      <div className="sg-chart__bars">
        <div className="sg-chart__bar-container">
          <div className="sg-chart__bar-label">Driver</div>
          <div className="sg-chart__bar-wrapper">
            <div className="sg-chart__bar-track">
              <div
                className="sg-chart__bar"
                style={{
                  height: `${getBarHeight(data.driver)}%`,
                  backgroundColor: getBarColor(data.driver),
                }}
              />
            </div>
          </div>
          <div 
            className="sg-chart__bar-value"
            style={{ color: getBarColor(data.driver) }}
          >
            {formatValue(data.driver)}
          </div>
        </div>

        <div className="sg-chart__bar-container">
          <div className="sg-chart__bar-label">Irons</div>
          <div className="sg-chart__bar-wrapper">
            <div className="sg-chart__bar-track">
              <div
                className="sg-chart__bar"
                style={{
                  height: `${getBarHeight(data.irons)}%`,
                  backgroundColor: getBarColor(data.irons),
                }}
              />
            </div>
          </div>
          <div 
            className="sg-chart__bar-value"
            style={{ color: getBarColor(data.irons) }}
          >
            {formatValue(data.irons)}
          </div>
        </div>

        <div className="sg-chart__bar-container">
          <div className="sg-chart__bar-label">Short Game</div>
          <div className="sg-chart__bar-wrapper">
            <div className="sg-chart__bar-track">
              <div
                className="sg-chart__bar"
                style={{
                  height: `${getBarHeight(data.shortGame)}%`,
                  backgroundColor: getBarColor(data.shortGame),
                }}
              />
            </div>
          </div>
          <div 
            className="sg-chart__bar-value"
            style={{ color: getBarColor(data.shortGame) }}
          >
            {formatValue(data.shortGame)}
          </div>
        </div>
      </div>
    </div>
  )
}



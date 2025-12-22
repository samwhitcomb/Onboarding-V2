import React, { useState, useRef, useEffect } from 'react'
import './CalendarFilter.css'

interface CalendarFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void
}

export const CalendarFilter: React.FC<CalendarFilterProps> = ({ onDateRangeChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [viewMonth, setViewMonth] = useState(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date)
      setEndDate(null)
      onDateRangeChange(date, null)
    } else if (startDate && !endDate) {
      // Complete selection
      if (date < startDate) {
        // If clicked date is before start, swap them
        setEndDate(startDate)
        setStartDate(date)
        onDateRangeChange(date, startDate)
      } else {
        setEndDate(date)
        onDateRangeChange(startDate, date)
      }
    }
  }

  const clearFilter = () => {
    setStartDate(null)
    setEndDate(null)
    onDateRangeChange(null, null)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const isDateInRange = (date: Date): boolean => {
    if (!startDate) return false
    if (startDate && !endDate) {
      return date.getTime() === startDate.getTime()
    }
    if (startDate && endDate) {
      return date >= startDate && date <= endDate
    }
    return false
  }

  const isDateSelected = (date: Date): boolean => {
    if (startDate && date.getTime() === startDate.getTime()) return true
    if (endDate && date.getTime() === endDate.getTime()) return true
    return false
  }

  const formatDateRange = (): string => {
    if (!startDate) return 'Select Date Range'
    if (startDate && !endDate) {
      return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    }
    return 'Select Date Range'
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(viewMonth)

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const navigateMonth = (direction: 'prev' | 'next') => {
    setViewMonth(new Date(year, month + (direction === 'next' ? 1 : -1), 1))
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <div className="calendar-filter" ref={calendarRef}>
      <button
        className={`calendar-filter__button ${startDate || endDate ? 'calendar-filter__button--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="calendar-filter__icon">📅</span>
        <span className="calendar-filter__label">{formatDateRange()}</span>
        {(startDate || endDate) && (
          <button
            className="calendar-filter__clear"
            onClick={(e) => {
              e.stopPropagation()
              clearFilter()
            }}
          >
            ✕
          </button>
        )}
      </button>

      {isOpen && (
        <div className="calendar-filter__dropdown">
          <div className="calendar-filter__header">
            <button
              className="calendar-filter__nav-button"
              onClick={() => navigateMonth('prev')}
            >
              ‹
            </button>
            <div className="calendar-filter__month-year">
              {monthNames[month]} {year}
            </div>
            <button
              className="calendar-filter__nav-button"
              onClick={() => navigateMonth('next')}
            >
              ›
            </button>
          </div>

          <div className="calendar-filter__days-header">
            {dayNames.map((day) => (
              <div key={day} className="calendar-filter__day-name">{day}</div>
            ))}
          </div>

          <div className="calendar-filter__days-grid">
            {Array.from({ length: startingDayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} className="calendar-filter__day calendar-filter__day--empty" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1
              const date = new Date(year, month, day)
              date.setHours(0, 0, 0, 0)
              const isPast = date < today
              const inRange = isDateInRange(date)
              const isSelected = isDateSelected(date)

              return (
                <button
                  key={day}
                  className={`calendar-filter__day ${
                    inRange ? 'calendar-filter__day--in-range' : ''
                  } ${isSelected ? 'calendar-filter__day--selected' : ''} ${
                    isPast ? 'calendar-filter__day--past' : ''
                  }`}
                  onClick={() => handleDateClick(date)}
                  disabled={isPast}
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="calendar-filter__footer">
            <button
              className="calendar-filter__clear-button"
              onClick={clearFilter}
            >
              Clear Filter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}



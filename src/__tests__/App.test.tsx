import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

const mockRandomSequence = (values: number[]) => {
  const randomSpy = vi.spyOn(Math, 'random')
  values.forEach((value) => {
    randomSpy.mockReturnValueOnce(value)
  })
  return randomSpy
}

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders the initial UI elements', () => {
    mockRandomSequence([0.1, 0.9])
    render(<App />)

    expect(
      screen.getByText('Current Status Query: Is Ben Working?')
    ).toBeInTheDocument()
    expect(screen.getByText('LIVE TELEMETRY')).toBeInTheDocument()
    expect(screen.getByText('CONFIDENCE:')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Check Again/i })
    ).toBeInTheDocument()
  })

  it('displays a YES status with green styling', () => {
    mockRandomSequence([0.1, 0.9])
    render(<App />)

    const statusElement = screen.getByText('YES')
    expect(statusElement).toBeInTheDocument()
    expect(statusElement).toHaveClass('text-green-500')
  })

  it('displays a NO status with red styling', () => {
    mockRandomSequence([0.95, 0.9])
    render(<App />)

    const statusElement = screen.getByText('NO')
    expect(statusElement).toBeInTheDocument()
    expect(statusElement).toHaveClass('text-red-500')
  })

  it('shows a green confidence value above 80', () => {
    mockRandomSequence([0.1, 0.9])
    render(<App />)

    const confidenceHigh = screen.getByText(/%/)
    expect(confidenceHigh).toHaveClass('text-green-500')
  })

  it('shows a yellow confidence value between 51 and 80', () => {
    mockRandomSequence([0.1, 0.6])
    render(<App />)

    const confidenceMedium = screen.getByText(/%/)
    expect(confidenceMedium).toHaveClass('text-yellow-500')
  })

  it('shows a red confidence value at or below 50', () => {
    mockRandomSequence([0.1, 0.1])
    render(<App />)

    const confidenceLow = screen.getByText(/%/)
    expect(confidenceLow).toHaveClass('text-red-500')
  })

  it('shows and hides loading state when refreshing', () => {
    mockRandomSequence([0.1, 0.9, 0.1, 0.9])
    render(<App />)

    const button = screen.getByRole('button', { name: /Check Again/i })
    fireEvent.click(button)

    expect(screen.getByText('Querying Satellite...')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(
      screen.getByRole('button', { name: /Check Again/i })
    ).toBeInTheDocument()
    expect(screen.queryByText('Querying Satellite...')).not.toBeInTheDocument()
  })
})

import { Line, Bar, Doughnut } from 'react-chartjs-2'
import type { ChartData, ChartOptions } from 'chart.js'
import { ensureCharts } from '../../lib/chartSetup'

ensureCharts()

interface BaseProps {
  data: ChartData<'line'>
  options?: ChartOptions<'line'>
  height?: number
}

export function LineChart({ data, options, height = 240 }: BaseProps) {
  const opts: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
    ...options,
  }
  return (
    <div style={{ height }}>
      <Line data={data} options={opts} />
    </div>
  )
}

export function BarChart({
  data,
  options,
  height = 240,
}: {
  data: ChartData<'bar'>
  options?: ChartOptions<'bar'>
  height?: number
}) {
  const opts: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
    ...options,
  }
  return (
    <div style={{ height }}>
      <Bar data={data} options={opts} />
    </div>
  )
}

export function DoughnutChart({
  data,
  options,
  height = 240,
}: {
  data: ChartData<'doughnut'>
  options?: ChartOptions<'doughnut'>
  height?: number
}) {
  const opts: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    ...options,
  }
  return (
    <div style={{ height }}>
      <Doughnut data={data} options={opts} />
    </div>
  )
}

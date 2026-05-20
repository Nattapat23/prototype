'use client'

// Admin Dashboard — overview stats, charts, KPI, sport ranking, user activity, flagged sessions
// Charts are built with pure SVG — no external chart library

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MOCK_SESSIONS,
  ADMIN_USERS,
  FLAGGED_SESSIONS,
  SPORTS,
  WEEKLY_STATS,
  MONTHLY_STATS,
  AdminUser,
  DailyStat,
  WeeklyStat,
} from '@/lib/mockData'

// ===== Derived stats from mock data =====

const allUserIds = new Set<string>()
MOCK_SESSIONS.forEach((s) => {
  allUserIds.add(s.host.id)
  s.members.forEach((m) => allUserIds.add(m.id))
})
const TOTAL_USERS = allUserIds.size
const TOTAL_SESSIONS = MOCK_SESSIONS.length
const AVG_CHECKIN_RATE = Math.round(
  ADMIN_USERS.reduce((sum, u) => sum + u.checkinRate, 0) / ADMIN_USERS.length
)
const FLAGGED_COUNT = FLAGGED_SESSIONS.length

const sportCounts = Object.keys(SPORTS).map((sport) => {
  const key = sport as keyof typeof SPORTS
  const count = MOCK_SESSIONS.filter((s) => s.sport === key).length
  return { sport: key, count }
})
sportCounts.sort((a, b) => b.count - a.count)
const maxSportCount = sportCounts[0]?.count ?? 1

// ===== Sub-components =====

/** Single overview stat card */
function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string | number
  sub?: string
  accent?: 'green' | 'blue' | 'yellow' | 'red'
}) {
  const accentMap = {
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }
  const cls = accent ? accentMap[accent] : 'bg-white border-gray-200 text-gray-700'

  return (
    <div className={`rounded-2xl border p-6 flex flex-col gap-2 shadow-sm ${cls}`}>
      <span className="text-base font-medium opacity-70">{label}</span>
      <span className="text-5xl font-bold">{value}</span>
      {sub && <span className="text-sm opacity-60">{sub}</span>}
    </div>
  )
}

/** KPI stat card — smaller secondary stats */
function KpiCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-6 flex flex-col gap-2 shadow-sm ${
        highlight
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-gray-700 border-black/5'
      }`}
    >
      <span className={`text-sm font-medium ${highlight ? 'opacity-80' : 'opacity-60'}`}>
        {label}
      </span>
      <span className={`text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}

/** Toast notification */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
      <span className="text-emerald-400">✓</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-xs">
        ✕
      </button>
    </div>
  )
}

// ===== Chart: Activity Bar Chart (pure SVG) =====
// How it works:
// - Renders a fixed-size SVG (viewBox scales responsively)
// - Bars = <rect> elements, height proportional to session count
// - Max-value bar gets primary color; rest get muted green
// - Hover tooltip uses SVG <text> + <rect> shown via onMouseEnter/Leave on each bar group

type BarDatum = { label: string; sessions: number }

function ActivityBarChart({ data }: { data: BarDatum[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // SVG coordinate system constants
  const SVG_W = 560
  const SVG_H = 260
  const PADDING_TOP = 20
  const PADDING_BOTTOM = 36   // space for X-axis labels
  const PADDING_LEFT = 40     // space for Y-axis labels
  const PADDING_RIGHT = 16

  // Chart area dimensions
  const chartW = SVG_W - PADDING_LEFT - PADDING_RIGHT
  const chartH = SVG_H - PADDING_TOP - PADDING_BOTTOM

  const maxVal = Math.max(...data.map((d) => d.sessions), 1)
  const barCount = data.length
  const totalGap = chartW * 0.3   // 30% of width is gaps
  const barW = (chartW - totalGap) / barCount
  const gap = totalGap / (barCount - 1 || 1)

  // Find the index of the tallest bar to highlight it
  const peakIndex = data.reduce(
    (best, d, i) => (d.sessions > data[best].sessions ? i : best),
    0
  )

  // Y-axis: generate 4 horizontal grid lines evenly spaced
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((ratio) => ({
    value: Math.round(maxVal * ratio),
    y: PADDING_TOP + chartH - ratio * chartH,
  }))

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="w-full"
      style={{ minHeight: 220 }}
    >
      {/* Y-axis grid lines + labels */}
      {yTicks.map((tick) => (
        <g key={tick.value}>
          <line
            x1={PADDING_LEFT}
            y1={tick.y}
            x2={SVG_W - PADDING_RIGHT}
            y2={tick.y}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <text
            x={PADDING_LEFT - 6}
            y={tick.y + 4}
            textAnchor="end"
            fontSize={10}
            fill="#9ca3af"
          >
            {tick.value}
          </text>
        </g>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const barH = (d.sessions / maxVal) * chartH
        const x = PADDING_LEFT + i * (barW + gap)
        const y = PADDING_TOP + chartH - barH
        const isPeak = i === peakIndex
        const isHovered = i === hoveredIndex

        return (
          <g
            key={d.label}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Bar rectangle */}
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={5}
              fill={isPeak ? '#10b981' : isHovered ? '#34d399' : '#a7f3d0'}
            />

            {/* X-axis label */}
            <text
              x={x + barW / 2}
              y={PADDING_TOP + chartH + 18}
              textAnchor="middle"
              fontSize={11}
              fill={isPeak ? '#10b981' : '#6b7280'}
              fontWeight={isPeak ? 700 : 400}
            >
              {d.label}
            </text>

            {/* Tooltip: show on hover */}
            {isHovered && (
              <g>
                <rect
                  x={x + barW / 2 - 22}
                  y={y - 28}
                  width={44}
                  height={22}
                  rx={5}
                  fill="#111827"
                  opacity={0.9}
                />
                <text
                  x={x + barW / 2}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize={11}
                  fill="white"
                  fontWeight={600}
                >
                  {d.sessions}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ===== Chart: Sport Donut Chart (pure SVG) =====
// How it works:
// - Uses SVG <circle> with stroke-dasharray / stroke-dashoffset to draw arc segments
// - Each sport = one <circle> with stroke representing that arc
// - strokeDashoffset shifts where the arc starts on the circle perimeter
// - Legend on the right shows sport name, count, and percent

const SPORT_COLORS: Record<string, string> = {
  football:   '#10b981',  // emerald
  basketball: '#f59e0b',  // amber
  badminton:  '#3b82f6',  // blue
  running:    '#8b5cf6',  // violet
  gym:        '#ec4899',  // pink
}

function SportDonutChart({
  data,
}: {
  data: { sport: string; sessions: number; label: string; emoji: string }[]
}) {
  const total = data.reduce((s, d) => s + d.sessions, 0) || 1
  const RADIUS = 70
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS  // ~439.8
  const CENTER = 100

  // Build arc segments: each item gets a dasharray equal to its slice length,
  // and a dashoffset that positions its start after all previous slices
  let offset = 0
  const arcs = data.map((d) => {
    const sliceLen = (d.sessions / total) * CIRCUMFERENCE
    const dashOffset = CIRCUMFERENCE - offset
    offset += sliceLen
    return { ...d, sliceLen, dashOffset }
  })

  return (
    <div className="flex items-center gap-8 flex-wrap">
      {/* Donut SVG */}
      <svg viewBox="0 0 200 200" className="w-48 h-48 shrink-0">
        {/* Grey track */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={28}
        />
        {/* Color arcs — each arc starts at top (rotate -90 deg) */}
        {arcs.map((arc) => (
          <circle
            key={arc.sport}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={SPORT_COLORS[arc.sport] ?? '#9ca3af'}
            strokeWidth={28}
            strokeDasharray={`${arc.sliceLen} ${CIRCUMFERENCE}`}
            strokeDashoffset={arc.dashOffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        ))}
        {/* Center label */}
        <text x={CENTER} y={CENTER - 8} textAnchor="middle" fontSize={13} fill="#6b7280">
          ทั้งหมด
        </text>
        <text x={CENTER} y={CENTER + 14} textAnchor="middle" fontSize={20} fill="#111827" fontWeight={700}>
          {total}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.sessions / total) * 100) : 0
          return (
            <div key={d.sport} className="flex items-center gap-3">
              {/* Color dot */}
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: SPORT_COLORS[d.sport] ?? '#9ca3af' }}
              />
              <span className="text-base text-gray-700 w-28 truncate">
                {d.emoji} {d.label}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: SPORT_COLORS[d.sport] ?? '#9ca3af',
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-10 text-right">
                {pct}%
              </span>
              <span className="text-sm text-gray-400 w-16 text-right">
                {d.sessions} sessions
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===== Main Page =====

const PAGE_SIZE = 10

export default function AdminPage() {
  // Toggle: weekly vs monthly view for charts
  const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly')

  // Sort state for user table
  const [sortBy, setSortBy] = useState<'created' | 'joined'>('created')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  // Derive bar chart data from the active mode
  const barData: BarDatum[] = useMemo(
    () =>
      chartMode === 'weekly'
        ? WEEKLY_STATS.map((d) => ({ label: d.day, sessions: d.sessions }))
        : MONTHLY_STATS.map((d) => ({ label: d.week, sessions: d.sessions })),
    [chartMode]
  )

  // Derive donut chart data — aggregate sport sessions across the visible window
  const donutData = useMemo(() => {
    const raw: Record<string, number> =
      chartMode === 'weekly'
        ? WEEKLY_STATS.reduce<Record<string, number>>((acc, d) => {
            Object.entries(d.sport).forEach(([k, v]) => {
              acc[k] = (acc[k] ?? 0) + v
            })
            return acc
          }, {})
        : MONTHLY_STATS.reduce<Record<string, number>>((acc, d) => {
            Object.entries(d.sport).forEach(([k, v]) => {
              acc[k] = (acc[k] ?? 0) + v
            })
            return acc
          }, {})

    return Object.entries(raw)
      .map(([sport, sessions]) => ({
        sport,
        sessions,
        label: SPORTS[sport as keyof typeof SPORTS]?.label ?? sport,
        emoji: SPORTS[sport as keyof typeof SPORTS]?.emoji ?? '',
      }))
      .sort((a, b) => b.sessions - a.sessions)
  }, [chartMode])

  // KPI metrics derived from the active window
  const kpiMetrics = useMemo(() => {
    const windowData: (DailyStat | WeeklyStat)[] =
      chartMode === 'weekly' ? WEEKLY_STATS : MONTHLY_STATS

    const totalSessions = windowData.reduce((s, d) => s + d.sessions, 0)
    const count = windowData.length

    // Average sessions per day (weekly) or per week (monthly)
    const avgSessions = (totalSessions / count).toFixed(1)

    // Peak label
    const peak = windowData.reduce(
      (best, d, i) => (d.sessions > windowData[best].sessions ? i : best),
      0
    )
    const peakLabel = 'day' in windowData[peak]
      ? (windowData[peak] as DailyStat).day
      : (windowData[peak] as WeeklyStat).week

    // Top sport
    const sportTotals = donutData[0]?.label ?? '—'

    // Active users: those with checkinRate >= threshold (weekly = 50%, monthly = 25%)
    const threshold = chartMode === 'weekly' ? 50 : 25
    const activeCount = ADMIN_USERS.filter((u) => u.checkinRate >= threshold).length
    const activePct = Math.round((activeCount / ADMIN_USERS.length) * 100)

    return { avgSessions, peakLabel, sportTotals, activePct }
  }, [chartMode, donutData])

  const sortedUsers: AdminUser[] = [...ADMIN_USERS].sort((a, b) =>
    sortBy === 'created'
      ? b.sessionsCreated - a.sessionsCreated
      : b.sessionsJoined - a.sessionsJoined
  )
  const totalPages = Math.ceil(sortedUsers.length / PAGE_SIZE)
  const pageUsers = sortedUsers.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function handleSortChange(newSort: 'created' | 'joined') {
    setSortBy(newSort)
    setPage(0)
  }

  function handleContact(sessionTitle: string) {
    setToastMsg(`ส่งการแจ้งเตือนแล้ว — ${sessionTitle}`)
    setTimeout(() => setToastMsg(null), 3000)
  }

  return (
    <div className="space-y-10">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-3 transition-colors"
          >
            ← กลับหน้าแรก
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <span className="text-sm font-semibold bg-primary text-white px-3 py-1 rounded-full">
              CMU Sport
            </span>
          </div>
          <p className="text-base text-gray-500 mt-1">ภาพรวมการใช้งานระบบจองกีฬา</p>
        </div>
      </div>

      {/* ── Section 1: Overview Stats ── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ภาพรวม</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="ผู้ใช้ทั้งหมด" value={TOTAL_USERS} sub="unique users" accent="blue" />
          <StatCard label="Sessions ทั้งหมด" value={TOTAL_SESSIONS} sub="sessions ในระบบ" accent="green" />
          <StatCard label="Check-in Rate" value={`${AVG_CHECKIN_RATE}%`} sub="เฉลี่ยทุก user" accent="yellow" />
          <StatCard label="Flagged Sessions" value={FLAGGED_COUNT} sub="เกินเวลา ยังไม่เช็คอิน" accent="red" />
        </div>
      </section>

      {/* ── Charts section — toggle weekly / monthly ── */}
      <section>
        {/* Section header + toggle */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-gray-800">สถิติการใช้งาน</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartMode('weekly')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                chartMode === 'weekly'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              รายสัปดาห์
            </button>
            <button
              onClick={() => setChartMode('monthly')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                chartMode === 'monthly'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              รายเดือน
            </button>
          </div>
        </div>

        {/* Charts grid: bar + donut side by side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Activity Bar Chart */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <p className="text-base font-semibold text-gray-700 mb-1">
              จำนวน Sessions {chartMode === 'weekly' ? 'แต่ละวัน' : 'แต่ละสัปดาห์'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              {chartMode === 'weekly' ? '7 วัน (จ–อา)' : '4 สัปดาห์ในเดือนนี้'}
            </p>
            <ActivityBarChart data={barData} />
            <p className="text-xs text-gray-400 mt-2 text-center">
              แถบสีเข้ม = วันที่มี sessions มากที่สุด
            </p>
          </div>

          {/* Sport Donut Chart */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6">
            <p className="text-base font-semibold text-gray-700 mb-1">
              สัดส่วนกีฬา{chartMode === 'weekly' ? 'สัปดาห์นี้' : 'เดือนนี้'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              แสดงเป็น % จาก sessions ทั้งหมด
            </p>
            <SportDonutChart data={donutData} />
          </div>
        </div>
      </section>

      {/* ── KPI Cards ── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">ตัวชี้วัดหลัก</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            label="Active Users"
            value={`${kpiMetrics.activePct}%`}
            highlight
          />
          <KpiCard
            label={`Sessions เฉลี่ย/${chartMode === 'weekly' ? 'วัน' : 'สัปดาห์'}`}
            value={kpiMetrics.avgSessions}
          />
          <KpiCard
            label={`Peak ${chartMode === 'weekly' ? 'Day' : 'Week'}`}
            value={kpiMetrics.peakLabel}
          />
          <KpiCard
            label="กีฬาป้อปสุด"
            value={kpiMetrics.sportTotals}
          />
        </div>
      </section>

      {/* ── Section 2: Popular Sports ── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">กีฬายอดนิยม</h2>
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 space-y-5">
          {sportCounts.map(({ sport, count }, index) => {
            const meta = SPORTS[sport]
            const pct = Math.round((count / maxSportCount) * 100)
            const totalPct = Math.round((count / TOTAL_SESSIONS) * 100)

            return (
              <div key={sport} className="flex items-center gap-4">
                <span className="w-7 text-center text-sm font-bold text-gray-400">
                  #{index + 1}
                </span>
                <div className="w-36 shrink-0 flex items-center gap-2">
                  <span className="text-xl">{meta.emoji}</span>
                  <span className="text-base font-medium text-gray-700">{meta.label}</span>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-32 text-right shrink-0">
                  <span className="text-base font-semibold text-gray-800">{count} sessions</span>
                  <span className="text-sm text-gray-400 ml-1">({totalPct}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Section 3: User Activity Table ── */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-gray-800">กิจกรรมผู้ใช้</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('created')}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                sortBy === 'created'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              เรียงตาม Sessions สร้าง
            </button>
            <button
              onClick={() => handleSortChange('joined')}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                sortBy === 'joined'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              เรียงตาม Sessions Join
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-3">
          แสดง {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedUsers.length)} จาก {sortedUsers.length} คน
        </p>

        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-500">ผู้ใช้</th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-gray-500">สร้าง</th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-gray-500">Join</th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-gray-500">Check-in</th>
                <th className="text-center px-5 py-4 text-sm font-semibold text-gray-500">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pageUsers.map((user) => {
                const isLowCheckin = user.checkinRate < 50
                const rowCls = isLowCheckin ? 'bg-yellow-50' : 'bg-white hover:bg-gray-50'

                return (
                  <tr key={user.id} className={`transition-colors ${rowCls}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center shrink-0">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-base">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.faculty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-semibold text-gray-700 text-base">{user.sessionsCreated}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="font-semibold text-gray-700 text-base">{user.sessionsJoined}</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`font-semibold text-base ${
                          user.checkinRate >= 70
                            ? 'text-emerald-600'
                            : user.checkinRate >= 50
                            ? 'text-yellow-600'
                            : 'text-red-500'
                        }`}
                      >
                        {user.checkinRate}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {isLowCheckin ? (
                        <span className="text-sm bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full">
                          ถูก Flag
                        </span>
                      ) : (
                        <span className="text-sm bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full">
                          ปกติ
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← ก่อนหน้า
            </button>
            <span className="text-sm text-gray-500">
              หน้า {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ถัดไป →
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 4: Flagged Sessions ── */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Flagged Sessions — เกินเวลาแต่ยังไม่เช็คอิน
        </h2>

        {FLAGGED_SESSIONS.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
            <p className="text-3xl mb-2">✓</p>
            <p className="font-semibold text-emerald-700 text-lg">ไม่มี flagged sessions</p>
            <p className="text-base text-emerald-600 mt-1">ทุก session เช็คอินครบแล้ว</p>
          </div>
        ) : (
          <div className="space-y-4">
            {FLAGGED_SESSIONS.map((fs) => {
              const meta = SPORTS[fs.sport]
              const allMissing = fs.uncheckedCount === fs.totalMembers

              return (
                <div
                  key={fs.id}
                  className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${meta.color}`}>
                        {meta.emoji} {meta.label}
                      </span>
                      <span className="text-sm bg-red-100 text-red-600 font-semibold px-3 py-1 rounded-full">
                        เกินเวลา
                      </span>
                    </div>
                    <p className="mt-2 font-semibold text-gray-900 text-base">{fs.title}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{fs.datetime}</p>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">ยังไม่เช็คอิน</p>
                      <p className={`text-2xl font-bold ${allMissing ? 'text-red-600' : 'text-orange-500'}`}>
                        {fs.uncheckedCount}/{fs.totalMembers} คน
                      </p>
                    </div>
                    <button
                      onClick={() => handleContact(fs.title)}
                      className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
                    >
                      ติดต่อผู้ใช้
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Toast notification */}
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
    </div>
  )
}

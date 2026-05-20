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
  FREQUENT_PAIRS,
  AdminUser,
  DailyStat,
  WeeklyStat,
  SportType,
  getUserProfile,
  UserProfile,
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
    green:  'bg-violet-50 border-violet-200 text-violet-700',
    blue:   'bg-blue-50 border-blue-200 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red:    'bg-red-50 border-red-200 text-red-700',
  }
  const cls = accent ? accentMap[accent] : 'bg-white border-gray-200 text-gray-700'

  return (
    <div className={`rounded-2xl border p-4 sm:p-6 flex flex-col gap-2 shadow-sm ${cls}`}>
      <span className="text-sm sm:text-base font-medium opacity-70">{label}</span>
      <span className="text-3xl sm:text-5xl font-bold">{value}</span>
      {sub && <span className="text-xs sm:text-sm opacity-60">{sub}</span>}
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
      className={`rounded-2xl border p-4 sm:p-6 flex flex-col gap-2 shadow-sm ${
        highlight
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-gray-700 border-black/5'
      }`}
    >
      <span className={`text-xs sm:text-sm font-medium ${highlight ? 'opacity-80' : 'opacity-60'}`}>
        {label}
      </span>
      <span className={`text-2xl sm:text-3xl font-bold ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  )
}

/** Toast notification */
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 max-w-[90vw]">
      <span className="text-violet-400">✓</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-xs">
        ✕
      </button>
    </div>
  )
}

// ===== User Profile Modal =====
function UserProfileModal({
  profile,
  onClose,
}: {
  profile: UserProfile
  onClose: () => void
}) {
  const { user, sports, sessions, checkinRate } = profile

  // Badge based on check-in rate
  const badge =
    checkinRate >= 80 ? { label: 'ดาวรุ่ง', color: 'bg-violet-100 text-violet-700' }
    : checkinRate >= 50 ? { label: 'สม่ำเสมอ', color: 'bg-blue-100 text-blue-700' }
    : { label: 'ต้องปรับปรุง', color: 'bg-red-100 text-red-600' }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      {/* Modal panel — stop propagation so clicking inside doesn't close */}
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg leading-none"
        >
          ✕
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-primary-light text-primary font-bold text-lg flex items-center justify-center shrink-0">
            {user.avatar}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-lg leading-tight">{user.name}</p>
            <p className="text-sm text-gray-500">{user.faculty} · ปี {user.year}</p>
            {user.bio && <p className="text-xs text-gray-400 mt-0.5 italic">&ldquo;{user.bio}&rdquo;</p>}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">sessions</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
            <p className={`text-2xl font-bold ${checkinRate >= 70 ? 'text-violet-600' : checkinRate >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
              {checkinRate}%
            </p>
            <p className="text-xs text-gray-500 mt-0.5">check-in</p>
          </div>
          <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center flex flex-col items-center justify-center">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Sports played */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">กีฬาที่ชอบ</p>
          <div className="flex flex-wrap gap-1.5">
            {sports.length > 0 ? sports.map((s) => (
              <span
                key={s}
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${SPORTS[s].color}`}
              >
                {SPORTS[s].emoji} {SPORTS[s].label}
              </span>
            )) : <span className="text-xs text-gray-400">ยังไม่มีข้อมูล</span>}
          </div>
        </div>

        {/* Sessions joined */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">sessions ที่เข้าร่วม</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {sessions.length > 0 ? sessions.map((sess) => (
              <div key={sess.id} className="flex items-center gap-2 text-xs text-gray-600">
                <span>{SPORTS[sess.sport].emoji}</span>
                <span className="truncate flex-1">{sess.title}</span>
                <span className="text-gray-400 shrink-0">{sess.startTime}</span>
              </div>
            )) : <span className="text-xs text-gray-400">ยังไม่มีข้อมูล</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Chart: Activity Bar Chart (pure SVG) =====
type BarDatum = { label: string; sessions: number }

function ActivityBarChart({ data }: { data: BarDatum[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const SVG_W = 560
  const SVG_H = 260
  const PADDING_TOP = 20
  const PADDING_BOTTOM = 36
  const PADDING_LEFT = 40
  const PADDING_RIGHT = 16

  const chartW = SVG_W - PADDING_LEFT - PADDING_RIGHT
  const chartH = SVG_H - PADDING_TOP - PADDING_BOTTOM

  const maxVal = Math.max(...data.map((d) => d.sessions), 1)
  const barCount = data.length
  const totalGap = chartW * 0.3
  const barW = (chartW - totalGap) / barCount
  const gap = totalGap / (barCount - 1 || 1)

  const peakIndex = data.reduce(
    (best, d, i) => (d.sessions > data[best].sessions ? i : best),
    0
  )

  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((ratio) => ({
    value: Math.round(maxVal * ratio),
    y: PADDING_TOP + chartH - ratio * chartH,
  }))

  return (
    <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ minHeight: 180 }}>
      {yTicks.map((tick) => (
        <g key={tick.value}>
          <line x1={PADDING_LEFT} y1={tick.y} x2={SVG_W - PADDING_RIGHT} y2={tick.y} stroke="#e5e7eb" strokeWidth={1} />
          <text x={PADDING_LEFT - 6} y={tick.y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{tick.value}</text>
        </g>
      ))}

      {data.map((d, i) => {
        const barH = (d.sessions / maxVal) * chartH
        const x = PADDING_LEFT + i * (barW + gap)
        const y = PADDING_TOP + chartH - barH
        const isPeak = i === peakIndex
        const isHovered = i === hoveredIndex

        return (
          <g key={d.label} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
            <rect x={x} y={y} width={barW} height={barH} rx={5} fill={isPeak ? '#7C3AED' : isHovered ? '#8B5CF6' : '#C4B5FD'} />
            <text x={x + barW / 2} y={PADDING_TOP + chartH + 18} textAnchor="middle" fontSize={11} fill={isPeak ? '#7C3AED' : '#6b7280'} fontWeight={isPeak ? 700 : 400}>
              {d.label}
            </text>
            {isHovered && (
              <g>
                <rect x={x + barW / 2 - 22} y={y - 28} width={44} height={22} rx={5} fill="#111827" opacity={0.9} />
                <text x={x + barW / 2} y={y - 12} textAnchor="middle" fontSize={11} fill="white" fontWeight={600}>{d.sessions}</text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ===== Chart: Sport Donut Chart (pure SVG) =====
const SPORT_COLORS: Record<string, string> = {
  football:   '#7C3AED',
  basketball: '#f59e0b',
  badminton:  '#3b82f6',
  running:    '#a855f7',
  gym:        '#ec4899',
}

function SportDonutChart({ data }: { data: { sport: string; sessions: number; label: string; emoji: string }[] }) {
  const total = data.reduce((s, d) => s + d.sessions, 0) || 1
  const RADIUS = 70
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const CENTER = 100

  let offset = 0
  const arcs = data.map((d) => {
    const sliceLen = (d.sessions / total) * CIRCUMFERENCE
    const dashOffset = CIRCUMFERENCE - offset
    offset += sliceLen
    return { ...d, sliceLen, dashOffset }
  })

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg viewBox="0 0 200 200" className="w-40 h-40 sm:w-48 sm:h-48 shrink-0">
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#f3f4f6" strokeWidth={28} />
        {arcs.map((arc) => (
          <circle
            key={arc.sport}
            cx={CENTER} cy={CENTER} r={RADIUS}
            fill="none"
            stroke={SPORT_COLORS[arc.sport] ?? '#9ca3af'}
            strokeWidth={28}
            strokeDasharray={`${arc.sliceLen} ${CIRCUMFERENCE}`}
            strokeDashoffset={arc.dashOffset}
            transform={`rotate(-90 ${CENTER} ${CENTER})`}
          />
        ))}
        <text x={CENTER} y={CENTER - 8} textAnchor="middle" fontSize={13} fill="#6b7280">ทั้งหมด</text>
        <text x={CENTER} y={CENTER + 14} textAnchor="middle" fontSize={20} fill="#111827" fontWeight={700}>{total}</text>
      </svg>

      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.sessions / total) * 100) : 0
          return (
            <div key={d.sport} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SPORT_COLORS[d.sport] ?? '#9ca3af' }} />
              <span className="text-sm text-gray-700 w-24 truncate">{d.emoji} {d.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 min-w-0">
                <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: SPORT_COLORS[d.sport] ?? '#9ca3af' }} />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-8 text-right shrink-0">{pct}%</span>
              <span className="text-xs text-gray-400 w-14 text-right shrink-0 hidden sm:block">{d.sessions} sessions</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===== Frequent Partners Section =====
function FrequentPartnersSection() {
  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">คู่หูที่เจอกันบ่อย</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {FREQUENT_PAIRS.map((pair, index) => {
          // Pick the most common sport for the badge
          const mainSport = pair.sports[0] as SportType | undefined
          const sportMeta = mainSport ? SPORTS[mainSport] : null

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 shrink-0 w-52 snap-start flex flex-col gap-3"
            >
              {/* Avatars overlapping */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center border-2 border-white z-10">
                  {pair.userA.avatar}
                </div>
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold text-sm flex items-center justify-center border-2 border-white -ml-3">
                  {pair.userB.avatar}
                </div>
                {/* Shared count badge */}
                <span className="ml-auto text-xs font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                  {pair.sharedCount}x
                </span>
              </div>

              {/* Names */}
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{pair.userA.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">& {pair.userB.name}</p>
              </div>

              {/* Footer: shared count + top sport */}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs text-gray-500">เจอกัน {pair.sharedCount} ครั้ง</span>
                {sportMeta && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sportMeta.color}`}>
                    {sportMeta.emoji} {sportMeta.label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ===== Main Page =====

const PAGE_SIZE = 10

export default function AdminPage() {
  const [chartMode, setChartMode] = useState<'weekly' | 'monthly'>('weekly')
  const [sortBy, setSortBy] = useState<'created' | 'joined'>('created')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  // User profile modal state — null means closed
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

  const barData: BarDatum[] = useMemo(
    () =>
      chartMode === 'weekly'
        ? WEEKLY_STATS.map((d) => ({ label: d.day, sessions: d.sessions }))
        : MONTHLY_STATS.map((d) => ({ label: d.week, sessions: d.sessions })),
    [chartMode]
  )

  const donutData = useMemo(() => {
    const raw: Record<string, number> =
      chartMode === 'weekly'
        ? WEEKLY_STATS.reduce<Record<string, number>>((acc, d) => {
            Object.entries(d.sport).forEach(([k, v]) => { acc[k] = (acc[k] ?? 0) + v })
            return acc
          }, {})
        : MONTHLY_STATS.reduce<Record<string, number>>((acc, d) => {
            Object.entries(d.sport).forEach(([k, v]) => { acc[k] = (acc[k] ?? 0) + v })
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

  const kpiMetrics = useMemo(() => {
    const windowData: (DailyStat | WeeklyStat)[] = chartMode === 'weekly' ? WEEKLY_STATS : MONTHLY_STATS
    const totalSessions = windowData.reduce((s, d) => s + d.sessions, 0)
    const count = windowData.length
    const avgSessions = (totalSessions / count).toFixed(1)

    const peak = windowData.reduce((best, d, i) => (d.sessions > windowData[best].sessions ? i : best), 0)
    const peakLabel = 'day' in windowData[peak]
      ? (windowData[peak] as DailyStat).day
      : (windowData[peak] as WeeklyStat).week

    const sportTotals = donutData[0]?.label ?? '—'
    const threshold = chartMode === 'weekly' ? 50 : 25
    const activeCount = ADMIN_USERS.filter((u) => u.checkinRate >= threshold).length
    const activePct = Math.round((activeCount / ADMIN_USERS.length) * 100)

    return { avgSessions, peakLabel, sportTotals, activePct }
  }, [chartMode, donutData])

  const sortedUsers: AdminUser[] = [...ADMIN_USERS].sort((a, b) =>
    sortBy === 'created' ? b.sessionsCreated - a.sessionsCreated : b.sessionsJoined - a.sessionsJoined
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

  // Open profile modal for a user by id
  function openProfile(userId: string) {
    const profile = getUserProfile(userId)
    if (profile) setSelectedProfile(profile)
  }

  return (
    <div className="space-y-10">

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link href="/" className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 mb-3 transition-colors">
            ← กลับหน้าแรก
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <span className="text-sm font-semibold bg-primary text-white px-3 py-1 rounded-full">CMU Sport</span>
          </div>
          <p className="text-sm sm:text-base text-gray-500 mt-1">ภาพรวมการใช้งานระบบจองกีฬา</p>
        </div>
      </div>

      {/* Section 1: Overview Stats */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">ภาพรวม</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <StatCard label="ผู้ใช้ทั้งหมด"     value={TOTAL_USERS}          sub="unique users"          accent="blue" />
          <StatCard label="Sessions ทั้งหมด"  value={TOTAL_SESSIONS}       sub="sessions ในระบบ"       accent="green" />
          <StatCard label="Check-in Rate"      value={`${AVG_CHECKIN_RATE}%`} sub="เฉลี่ยทุก user"     accent="yellow" />
          <StatCard label="Flagged Sessions"   value={FLAGGED_COUNT}        sub="เกินเวลา ยังไม่เช็คอิน" accent="red" />
        </div>
      </section>

      {/* Section: Frequent Partners */}
      <FrequentPartnersSection />

      {/* Charts section */}
      <section>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">สถิติการใช้งาน</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartMode('weekly')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                chartMode === 'weekly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              รายสัปดาห์
            </button>
            <button
              onClick={() => setChartMode('monthly')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                chartMode === 'monthly' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              รายเดือน
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6">
            <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
              จำนวน Sessions {chartMode === 'weekly' ? 'แต่ละวัน' : 'แต่ละสัปดาห์'}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              {chartMode === 'weekly' ? '7 วัน (จ–อา)' : '4 สัปดาห์ในเดือนนี้'}
            </p>
            <ActivityBarChart data={barData} />
            <p className="text-xs text-gray-400 mt-2 text-center">แถบสีเข้ม = วันที่มี sessions มากที่สุด</p>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6">
            <p className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
              สัดส่วนกีฬา{chartMode === 'weekly' ? 'สัปดาห์นี้' : 'เดือนนี้'}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">แสดงเป็น % จาก sessions ทั้งหมด</p>
            <SportDonutChart data={donutData} />
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">ตัวชี้วัดหลัก</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <KpiCard label="Active Users" value={`${kpiMetrics.activePct}%`} highlight />
          <KpiCard label={`Sessions เฉลี่ย/${chartMode === 'weekly' ? 'วัน' : 'สัปดาห์'}`} value={kpiMetrics.avgSessions} />
          <KpiCard label={`Peak ${chartMode === 'weekly' ? 'Day' : 'Week'}`} value={kpiMetrics.peakLabel} />
          <KpiCard label="กีฬาป้อปสุด" value={kpiMetrics.sportTotals} />
        </div>
      </section>

      {/* Section 2: Popular Sports */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">กีฬายอดนิยม</h2>
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6 space-y-4">
          {sportCounts.map(({ sport, count }, index) => {
            const meta = SPORTS[sport]
            const pct = Math.round((count / maxSportCount) * 100)
            const totalPct = Math.round((count / TOTAL_SESSIONS) * 100)

            return (
              <div key={sport} className="flex items-center gap-2 sm:gap-4">
                <span className="w-6 text-center text-sm font-bold text-gray-400">#{index + 1}</span>
                <div className="w-24 sm:w-36 shrink-0 flex items-center gap-1 sm:gap-2">
                  <span className="text-lg sm:text-xl">{meta.emoji}</span>
                  <span className="text-sm sm:text-base font-medium text-gray-700">{meta.label}</span>
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2.5 sm:h-3">
                  <div className="h-2.5 sm:h-3 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-20 sm:w-32 text-right shrink-0">
                  <span className="text-sm sm:text-base font-semibold text-gray-800">{count}</span>
                  <span className="text-xs text-gray-400 ml-1 hidden sm:inline">sessions</span>
                  <span className="text-xs text-gray-400 ml-1">({totalPct}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 3: User Activity Table */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">กิจกรรมผู้ใช้</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleSortChange('created')}
              className={`px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                sortBy === 'created' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              สร้าง
            </button>
            <button
              onClick={() => handleSortChange('joined')}
              className={`px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                sortBy === 'joined' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-primary'
              }`}
            >
              Join
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-3">
          แสดง {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sortedUsers.length)} จาก {sortedUsers.length} คน
        </p>

        {/* Scrollable table on mobile */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-gray-500">ผู้ใช้</th>
                  <th className="text-center px-3 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-500">สร้าง</th>
                  <th className="text-center px-3 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-500">Join</th>
                  <th className="text-center px-3 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-500">Check-in</th>
                  <th className="text-center px-3 sm:px-5 py-3 sm:py-4 text-sm font-semibold text-gray-500">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageUsers.map((user) => {
                  const isLowCheckin = user.checkinRate < 50
                  const rowCls = isLowCheckin ? 'bg-yellow-50' : 'bg-white hover:bg-gray-50'
                  // Only users in the USERS pool (u1–u18) have a clickable profile
                  const hasProfile = user.id.startsWith('u')

                  return (
                    <tr key={user.id} className={`transition-colors ${rowCls}`}>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary-light text-primary font-bold text-sm flex items-center justify-center shrink-0">
                            {user.avatar}
                          </div>
                          <div>
                            {/* Clickable name opens profile modal */}
                            {hasProfile ? (
                              <button
                                onClick={() => openProfile(user.id)}
                                className="font-semibold text-gray-800 text-sm sm:text-base hover:text-primary transition-colors text-left"
                              >
                                {user.name}
                              </button>
                            ) : (
                              <p className="font-semibold text-gray-800 text-sm sm:text-base">{user.name}</p>
                            )}
                            <p className="text-xs text-gray-400">{user.faculty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-center">
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">{user.sessionsCreated}</span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-center">
                        <span className="font-semibold text-gray-700 text-sm sm:text-base">{user.sessionsJoined}</span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-center">
                        <span className={`font-semibold text-sm sm:text-base ${
                          user.checkinRate >= 70 ? 'text-violet-600' : user.checkinRate >= 50 ? 'text-yellow-600' : 'text-red-500'
                        }`}>
                          {user.checkinRate}%
                        </span>
                      </td>
                      <td className="px-3 sm:px-5 py-3 sm:py-4 text-center">
                        {isLowCheckin ? (
                          <span className="text-xs bg-yellow-100 text-yellow-700 font-semibold px-2 sm:px-3 py-1 rounded-full">ถูก Flag</span>
                        ) : (
                          <span className="text-xs bg-violet-100 text-violet-700 font-semibold px-2 sm:px-3 py-1 rounded-full">ปกติ</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← ก่อนหน้า
            </button>
            <span className="text-xs sm:text-sm text-gray-500">หน้า {page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-3 sm:px-4 py-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ถัดไป →
            </button>
          </div>
        </div>
      </section>

      {/* Section 4: Flagged Sessions */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Flagged Sessions — เกินเวลาแต่ยังไม่เช็คอิน</h2>

        {FLAGGED_SESSIONS.length === 0 ? (
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-8 sm:p-10 text-center">
            <p className="text-3xl mb-2">✓</p>
            <p className="font-semibold text-violet-700 text-lg">ไม่มี flagged sessions</p>
            <p className="text-base text-violet-600 mt-1">ทุก session เช็คอินครบแล้ว</p>
          </div>
        ) : (
          <div className="space-y-4">
            {FLAGGED_SESSIONS.map((fs) => {
              const meta = SPORTS[fs.sport]
              const allMissing = fs.uncheckedCount === fs.totalMembers

              return (
                <div key={fs.id} className="bg-white rounded-2xl border border-black/5 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-xs sm:text-sm font-semibold px-2 sm:px-3 py-1 rounded-full ${meta.color}`}>
                        {meta.emoji} {meta.label}
                      </span>
                      <span className="text-xs sm:text-sm bg-red-100 text-red-600 font-semibold px-2 sm:px-3 py-1 rounded-full">เกินเวลา</span>
                    </div>
                    <p className="mt-2 font-semibold text-gray-900 text-sm sm:text-base">{fs.title}</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{fs.datetime}</p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-400">ยังไม่เช็คอิน</p>
                      <p className={`text-xl sm:text-2xl font-bold ${allMissing ? 'text-red-600' : 'text-orange-500'}`}>
                        {fs.uncheckedCount}/{fs.totalMembers} คน
                      </p>
                    </div>
                    <button
                      onClick={() => handleContact(fs.title)}
                      className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors whitespace-nowrap"
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

      {/* User Profile Modal */}
      {selectedProfile && (
        <UserProfileModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
      )}
    </div>
  )
}

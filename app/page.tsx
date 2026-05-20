'use client'

// Home / Browse — list of sport sessions with filter bar
import { useState } from 'react'
import Link from 'next/link'
import { MOCK_SESSIONS, SPORTS, SportType } from '@/lib/mockData'

type Filter = 'all' | SportType

// Filter tabs config
const FILTERS: { value: Filter; label: string; emoji: string }[] = [
  { value: 'all', label: 'ทั้งหมด', emoji: '🏅' },
  { value: 'football', label: 'ฟุตบอล', emoji: '⚽' },
  { value: 'basketball', label: 'บาสเกตบอล', emoji: '🏀' },
  { value: 'badminton', label: 'แบดมินตัน', emoji: '🏸' },
  { value: 'running', label: 'วิ่ง', emoji: '🏃' },
  { value: 'gym', label: 'ยิม', emoji: '💪' },
]

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  // Filter sessions based on selected sport
  const filteredSessions =
    activeFilter === 'all'
      ? MOCK_SESSIONS
      : MOCK_SESSIONS.filter((s) => s.sport === activeFilter)

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">หา session กีฬา</h1>
        <p className="text-gray-500 text-sm mt-1">เลือก session ที่สนใจแล้วเข้าร่วมได้เลย</p>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeFilter === f.value
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            <span>{f.emoji}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Session count */}
      <p className="text-sm text-gray-500 mb-4">
        พบ <span className="font-semibold text-gray-800">{filteredSessions.length}</span> session
      </p>

      {/* Session cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSessions.map((session) => {
          const sport = SPORTS[session.sport]
          const filled = session.members.length
          const fillPercent = Math.round((filled / session.maxMembers) * 100)
          const isFull = filled >= session.maxMembers

          return (
            <div
              key={session.id}
              className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              {/* Sport badge + title */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${sport.color}`}>
                    {sport.emoji} {sport.label}
                  </span>
                  <h2 className="mt-1.5 font-semibold text-gray-900 text-sm leading-snug">{session.title}</h2>
                </div>
                {isFull && (
                  <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">เต็มแล้ว</span>
                )}
              </div>

              {/* Date, time, location */}
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span>📅</span>
                  <span>{formatDate(session.date)}</span>
                  <span>·</span>
                  <span>{session.startTime} – {session.endTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{session.location}</span>
                </div>
              </div>

              {/* Members progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>สมาชิก</span>
                  <span className="font-medium text-gray-700">{filled}/{session.maxMembers} คน</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${isFull ? 'bg-red-400' : 'bg-primary'}`}
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>

              {/* CTA button */}
              <Link
                href={`/session/${session.id}`}
                className="mt-1 w-full text-center py-2 rounded-xl text-sm font-semibold bg-primary-light text-primary hover:bg-primary hover:text-white transition-colors border border-primary/20"
              >
                ดูรายละเอียด →
              </Link>
            </div>
          )
        })}
      </div>

      {/* Floating create button — visible on mobile */}
      <Link
        href="/create"
        className="fixed bottom-6 right-6 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-2xl hover:bg-primary-dark transition-colors sm:hidden"
        title="สร้าง session ใหม่"
      >
        +
      </Link>
    </div>
  )
}

// Format ISO date to Thai display: "พ. 21 พ.ค. 2026"
function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('th-TH', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

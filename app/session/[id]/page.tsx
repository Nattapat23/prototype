'use client'

// Session Detail — shows full info for one session, join/chat buttons
import { useState, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_SESSIONS, SPORTS, CURRENT_USER, Member } from '@/lib/mockData'

// Next.js 16: params is a Promise — must use React.use() in client components
export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const sessionData = MOCK_SESSIONS.find((s) => s.id === id)
  if (!sessionData) notFound()

  // TypeScript assertion — notFound() never returns, but TS doesn't know that in all paths
  // Using non-null assertion here is safe because notFound() throws above
  const session = sessionData!

  const sport = SPORTS[session.sport]

  // Track whether current user has joined (mock state)
  const [joined, setJoined] = useState(false)
  const [members, setMembers] = useState<Member[]>(session.members)

  // Countdown to session start
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    function calc() {
      const target = new Date(`${session.date}T${session.startTime}:00`)
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        setCountdown('เริ่มแล้ว!')
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const d = Math.floor(h / 24)
      if (d > 0) setCountdown(`อีก ${d} วัน ${h % 24} ชม.`)
      else setCountdown(`อีก ${h} ชม. ${m} นาที`)
    }
    calc()
    const interval = setInterval(calc, 60000)
    return () => clearInterval(interval)
  }, [session.date, session.startTime])

  const isFull = members.length >= session.maxMembers
  const fillPercent = Math.round((members.length / session.maxMembers) * 100)

  function handleJoin() {
    if (!joined && !isFull) {
      setJoined(true)
      setMembers((prev) => [...prev, CURRENT_USER])
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
        ← กลับหน้าแรก
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${sport.color}`}>
            {sport.emoji} {sport.label}
          </span>
          {isFull && (
            <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">เต็มแล้ว</span>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-3">{session.title}</h1>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{formatDate(session.date)} · {session.startTime} – {session.endTime} น.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{session.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>host: <strong>{session.host.name}</strong> ({session.host.faculty})</span>
          </div>
        </div>

        {session.description && (
          <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
            {session.description}
          </p>
        )}
      </div>

      {/* Countdown card */}
      <div className="bg-primary rounded-2xl p-4 text-white flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">เวลาเริ่ม session</p>
          <p className="text-2xl font-bold">{countdown}</p>
        </div>
        <span className="text-4xl">⏰</span>
      </div>

      {/* Members card */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-900">สมาชิก</h2>
          <span className="text-sm font-medium text-gray-600">{members.length}/{session.maxMembers} คน</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all ${isFull ? 'bg-red-400' : 'bg-primary'}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        {/* Member list */}
        <div className="space-y-2.5">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.name}
                  {member.id === session.host.id && (
                    <span className="ml-1.5 text-xs text-primary font-semibold">(host)</span>
                  )}
                  {member.id === CURRENT_USER.id && (
                    <span className="ml-1.5 text-xs text-blue-500 font-semibold">(คุณ)</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">{member.faculty}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        {!joined ? (
          <button
            onClick={handleJoin}
            disabled={isFull}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isFull ? 'session เต็มแล้ว' : 'เข้าร่วม session'}
          </button>
        ) : (
          <Link
            href={`/chat/${session.id}`}
            className="flex-1 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors text-center"
          >
            เข้าแชท
          </Link>
        )}
        {joined && (
          <Link
            href={`/checkin/${session.id}`}
            className="px-5 py-3 rounded-xl font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors text-center text-sm"
          >
            เช็คอิน
          </Link>
        )}
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

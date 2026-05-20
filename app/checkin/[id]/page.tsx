'use client'

// Check-in page — upload mock photo, confirm attendance for session members
import { useState } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_SESSIONS, MOCK_CHECKIN, CURRENT_USER, CheckInStatus, SPORTS } from '@/lib/mockData'

export default function CheckInPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const session = MOCK_SESSIONS.find((s) => s.id === id)
  if (!session) notFound()

  const sport = SPORTS[session.sport]

  // Mock check-in statuses — pre-populated for session s1, empty for others
  const initialStatuses: CheckInStatus[] = session.members.map((m) => {
    const existing = MOCK_CHECKIN.find((c) => c.memberId === m.id)
    return existing ?? { memberId: m.id, confirmed: false }
  })

  const [statuses, setStatuses] = useState<CheckInStatus[]>(initialStatuses)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [selfConfirmed, setSelfConfirmed] = useState(false)

  // Toggle a member's check-in confirmed state
  function toggleConfirm(memberId: string) {
    setStatuses((prev) =>
      prev.map((s) =>
        s.memberId === memberId ? { ...s, confirmed: !s.confirmed } : s
      )
    )
  }

  // Mock photo upload — no real file handling, just toggle state
  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoUploaded(true)
    }
  }

  // Self check-in
  function handleSelfCheckIn() {
    setSelfConfirmed(true)
  }

  const confirmedCount = statuses.filter((s) => s.confirmed).length

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back link */}
      <Link href={`/session/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors">
        ← กลับหน้า session
      </Link>

      {/* Page header */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{sport.emoji}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sport.color}`}>{sport.label}</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">เช็คอิน</h1>
        <p className="text-sm text-gray-500 mt-0.5">{session.title} · {session.location}</p>
      </div>

      {/* Photo upload section */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        <h2 className="font-semibold text-gray-800 mb-3">ถ่ายรูปยืนยัน</h2>

        {!photoUploaded ? (
          <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary-light transition-all">
            <span className="text-4xl">📷</span>
            <p className="text-sm text-gray-500 text-center">กดเพื่ออัปโหลดรูปถ่ายตอนเล่นกีฬา</p>
            <span className="text-xs text-gray-400">(mock — ไฟล์จะไม่ถูกส่งไปไหน)</span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        ) : (
          <div className="relative">
            {/* Mock uploaded photo placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex flex-col items-center justify-center gap-2">
              <span className="text-5xl">🏟️</span>
              <p className="text-sm text-emerald-700 font-medium">รูปอัปโหลดสำเร็จ!</p>
            </div>
            {/* Remove / re-upload */}
            <button
              onClick={() => setPhotoUploaded(false)}
              className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 shadow border border-gray-100 text-sm"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Self check-in */}
      {!selfConfirmed ? (
        <button
          onClick={handleSelfCheckIn}
          className="w-full py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          ✅ ยืนยันการเข้าร่วม (ตัวคุณเอง)
        </button>
      ) : (
        <div className="w-full py-3 rounded-xl font-semibold text-center bg-emerald-50 text-emerald-700 border border-emerald-200">
          ✅ คุณได้ยืนยันการเข้าร่วมแล้ว
        </div>
      )}

      {/* Members check-in status */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">สถานะสมาชิก</h2>
          <span className="text-sm text-gray-500">
            {confirmedCount}/{session.members.length} ยืนยันแล้ว
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
          <div
            className="h-1.5 rounded-full bg-primary transition-all"
            style={{ width: `${Math.round((confirmedCount / session.members.length) * 100)}%` }}
          />
        </div>

        {/* Member list with confirm toggles */}
        <div className="space-y-3">
          {session.members.map((member) => {
            const status = statuses.find((s) => s.memberId === member.id)
            const confirmed = status?.confirmed ?? false

            return (
              <div key={member.id} className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                    confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {member.avatar}
                </div>

                {/* Name + faculty */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                    {member.id === CURRENT_USER.id && (
                      <span className="ml-1.5 text-xs text-blue-500">(คุณ)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{member.faculty}</p>
                </div>

                {/* Status badge + toggle button */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium ${confirmed ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {confirmed ? '✅ ยืนยันแล้ว' : '⏳ รอยืนยัน'}
                  </span>
                  {/* Only allow confirming others (not self — self uses the button above) */}
                  {member.id !== CURRENT_USER.id && (
                    <button
                      onClick={() => toggleConfirm(member.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        confirmed
                          ? 'bg-red-100 text-red-600 hover:bg-red-200'
                          : 'bg-primary-light text-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {confirmed ? 'ยกเลิก' : 'ยืนยัน'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat shortcut */}
      <Link
        href={`/chat/${id}`}
        className="block w-full text-center py-3 rounded-xl font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
      >
        กลับไปห้องแชท
      </Link>
    </div>
  )
}

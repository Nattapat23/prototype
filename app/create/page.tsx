'use client'

// Create Session — form to create a new sport session (mock only, no backend)
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SPORTS, CMU_LOCATIONS, SportType } from '@/lib/mockData'

interface FormState {
  sport: SportType | ''
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  maxMembers: string
  description: string
}

const INITIAL_FORM: FormState = {
  sport: '',
  title: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
  maxMembers: '10',
  description: '',
}

export default function CreatePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  // Update a single field
  const update = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // Mock submit — no real API call, just navigate to home
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    // Simulate loading then redirect
    setTimeout(() => {
      router.push('/')
    }, 1500)
  }

  // If submitted, show success state
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-6xl">🎉</div>
        <h2 className="text-xl font-bold text-gray-900">สร้าง session สำเร็จ!</h2>
        <p className="text-gray-500">กำลังพาคุณกลับไปหน้าแรก...</p>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mt-2" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">สร้าง session ใหม่</h1>
        <p className="text-gray-500 text-sm mt-1">กรอกข้อมูล แล้วรอเพื่อนมาร่วมด้วยกัน</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Sport picker — icon grid */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">กีฬา *</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {(Object.entries(SPORTS) as [SportType, typeof SPORTS[SportType]][]).map(([key, sport]) => (
              <button
                key={key}
                type="button"
                onClick={() => update('sport', key)}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.sport === key
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">{sport.emoji}</span>
                <span className="text-xs">{sport.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Session title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ชื่อ session *
          </label>
          <input
            type="text"
            required
            placeholder="เช่น ฟุตบอล 5v5 ยามเย็น"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">วันที่ *</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>

        {/* Time range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">เวลาเริ่ม *</label>
            <input
              type="time"
              required
              value={form.startTime}
              onChange={(e) => update('startTime', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">เวลาจบ *</label>
            <input
              type="time"
              required
              value={form.endTime}
              onChange={(e) => update('endTime', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">สถานที่ *</label>
          <select
            required
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
          >
            <option value="">เลือกสถานที่ใน CMU</option>
            {CMU_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Max members */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            จำนวนสมาชิกสูงสุด *
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={2}
              max={30}
              value={form.maxMembers}
              onChange={(e) => update('maxMembers', e.target.value)}
              className="flex-1 accent-primary"
            />
            <span className="w-12 text-center font-bold text-primary text-lg">{form.maxMembers}</span>
            <span className="text-sm text-gray-500">คน</span>
          </div>
        </div>

        {/* Description (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            รายละเอียด <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="บอกเพื่อนๆ ว่าจะเล่นแบบไหน ระดับไหน..."
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!form.sport || !form.title || !form.date || !form.location}
          className="w-full py-3 rounded-xl font-semibold text-white bg-primary hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          สร้าง session
        </button>
      </form>
    </div>
  )
}

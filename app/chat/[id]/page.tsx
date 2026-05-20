'use client'

// Group Chat — mock chat for a session group
import { useState, useRef, useEffect } from 'react'
import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_SESSIONS, MOCK_MESSAGES, CURRENT_USER, ChatMessage, SPORTS } from '@/lib/mockData'

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const session = MOCK_SESSIONS.find((s) => s.id === id)
  if (!session) notFound()

  const sport = SPORTS[session.sport]

  // Initialize with mock messages — fallback to empty array if no mock messages for this session
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES[id] ?? [])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mock send — adds message to local state only
  function handleSend() {
    const text = input.trim()
    if (!text) return

    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sessionId: id,
      sender: CURRENT_USER,
      text,
      timestamp: `${hh}:${mm}`,
    }

    setMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  // Send on Enter key (Shift+Enter = newline — but since input is single-line, just Enter = send)
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    // Full-height flex column — on mobile stretches to fill viewport below the navbar
    <div className="max-w-xl mx-auto flex flex-col" style={{ height: 'calc(100dvh - 56px)' }}>

      {/* Chat header */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/session/${id}`} className="text-gray-400 hover:text-primary transition-colors text-sm">←</Link>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{sport.emoji}</span>
              <span className="font-semibold text-gray-900 text-sm">{session.title}</span>
            </div>
            <p className="text-xs text-gray-400">{session.members.length} สมาชิก · {session.location}</p>
          </div>
        </div>

        {/* Check-in shortcut button */}
        <Link
          href={`/checkin/${id}`}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold hover:bg-amber-200 transition-colors"
        >
          ✅ เช็คอิน
        </Link>
      </div>

      {/* Messages area — scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-2 px-1">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-12">
            ยังไม่มีข้อความ — เป็นคนแรกที่พูดก่อนเลย!
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender.id === CURRENT_USER.id
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {msg.sender.avatar}
                </div>
              )}

              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {/* Sender name — only for others */}
                {!isMe && (
                  <span className="text-xs text-gray-400 ml-1">{msg.sender.name}</span>
                )}

                {/* Bubble */}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Timestamp */}
                <span className="text-xs text-gray-400 px-1">{msg.timestamp}</span>
              </div>
            </div>
          )
        })}
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-3 flex gap-2 mt-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 text-sm px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-4 py-2 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ส่ง
        </button>
      </div>
    </div>
  )
}

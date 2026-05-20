// ===== MOCK DATA — all data is fake, no backend =====

// ===== STATS TYPES — for admin dashboard charts =====

/** One data point in the weekly activity chart (Mon–Sun) */
export interface DailyStat {
  day: string   // short label: "จ" "อ" "พ" "พฤ" "ศ" "ส" "อา"
  sessions: number
  sport: Record<string, number>  // e.g. { football: 3, basketball: 2, ... }
}

/** One data point in the monthly activity chart (Week 1–4) */
export interface WeeklyStat {
  week: string  // "สัปดาห์ 1" "สัปดาห์ 2" "สัปดาห์ 3" "สัปดาห์ 4"
  sessions: number
  sport: Record<string, number>
}

// Realistic pattern: weekends (ส, อา) are higher than weekdays
export const WEEKLY_STATS: DailyStat[] = [
  { day: 'จ',  sessions: 5,  sport: { football: 1, basketball: 2, badminton: 1, running: 1, gym: 0 } },
  { day: 'อ',  sessions: 4,  sport: { football: 1, basketball: 1, badminton: 1, running: 0, gym: 1 } },
  { day: 'พ',  sessions: 6,  sport: { football: 2, basketball: 1, badminton: 1, running: 1, gym: 1 } },
  { day: 'พฤ', sessions: 5,  sport: { football: 1, basketball: 2, badminton: 0, running: 1, gym: 1 } },
  { day: 'ศ',  sessions: 8,  sport: { football: 2, basketball: 2, badminton: 2, running: 1, gym: 1 } },
  { day: 'ส',  sessions: 14, sport: { football: 4, basketball: 3, badminton: 3, running: 2, gym: 2 } },
  { day: 'อา', sessions: 12, sport: { football: 3, basketball: 3, badminton: 2, running: 3, gym: 1 } },
]

// Monthly: 4 weeks with realistic variation
export const MONTHLY_STATS: WeeklyStat[] = [
  { week: 'สัปดาห์ 1', sessions: 38, sport: { football: 10, basketball: 10, badminton: 8, running: 5, gym: 5 } },
  { week: 'สัปดาห์ 2', sessions: 45, sport: { football: 12, basketball: 11, badminton: 9, running: 7, gym: 6 } },
  { week: 'สัปดาห์ 3', sessions: 41, sport: { football: 11, basketball: 10, badminton: 9, running: 6, gym: 5 } },
  { week: 'สัปดาห์ 4', sessions: 54, sport: { football: 14, basketball: 13, badminton: 12, running: 8, gym: 7 } },
]

export type SportType = 'football' | 'basketball' | 'badminton' | 'running' | 'gym'

// ===== USER — single source of truth for all people in the app =====
export interface User {
  id: string
  name: string
  avatar: string   // 2-letter initials
  faculty: string
  year: number     // 1–4
  bio: string
}

// Legacy alias — kept so existing components compile without changes
export type Member = User

// Sport metadata
export const SPORTS: Record<SportType, { label: string; emoji: string; color: string }> = {
  football:   { label: 'ฟุตบอล',     emoji: '⚽', color: 'bg-violet-100 text-violet-700' },
  basketball: { label: 'บาสเกตบอล', emoji: '🏀', color: 'bg-orange-100 text-orange-700' },
  badminton:  { label: 'แบดมินตัน', emoji: '🏸', color: 'bg-blue-100 text-blue-700' },
  running:    { label: 'วิ่ง',        emoji: '🏃', color: 'bg-yellow-100 text-yellow-700' },
  gym:        { label: 'ยิม',         emoji: '💪', color: 'bg-purple-100 text-purple-700' },
}

// CMU locations
export const CMU_LOCATIONS = [
  'สนามกีฬากลาง CMU',
  'โรงยิมนาสติก CMU',
  'สนามบาสเกตบอล อาคาร ICT',
  'สนามฟุตบอลหญ้าเทียม',
  'ลู่วิ่ง รอบสนามกีฬา CMU',
  'ฟิตเนส อาคารกีฬา',
  'สนามแบดมินตัน หอพัก',
  'สนามบาสในร่ม CMU',
]

// ===== USERS — 18 students, realistic Thai names across CMU faculties =====
export const USERS: User[] = [
  { id: 'u1',  name: 'โอ๊ต นัฏฐพัฒน์',  avatar: 'ON', faculty: 'วิศวกรรมซอฟต์แวร์', year: 3, bio: 'ชอบวิ่งตอนเช้าและบาสยามเย็น' },
  { id: 'u2',  name: 'กิตติ วงศ์สวัสดิ์', avatar: 'KW', faculty: 'วิศวกรรมศาสตร์',   year: 3, bio: 'ฟุตบอลทุกสัปดาห์ บาสตามฤดู' },
  { id: 'u3',  name: 'พิม สุดาพร',        avatar: 'PS', faculty: 'วิทยาศาสตร์',       year: 2, bio: 'วิ่งรอบมอทุกเช้า บาสเกตบอลก็ชอบ' },
  { id: 'u4',  name: 'แบม บุณยานุช',      avatar: 'BB', faculty: 'วิศวกรรมซอฟต์แวร์', year: 3, bio: 'แบดมินตันทุกอาทิตย์ ชอบดับเบิ้ลส์' },
  { id: 'u5',  name: 'เต้ วีรภัทร',       avatar: 'TW', faculty: 'แพทยศาสตร์',       year: 4, bio: 'ยิมทุกวัน Push-Pull-Legs' },
  { id: 'u6',  name: 'นิว นภัทร',          avatar: 'NN', faculty: 'บริหารธุรกิจ',     year: 2, bio: 'บาสเกตบอลและวิ่งคลายเครียด' },
  { id: 'u7',  name: 'มิ้น ปาณิสรา',      avatar: 'MP', faculty: 'มนุษยศาสตร์',      year: 1, bio: 'แบดมินตันมือใหม่ กำลังหัดจริงๆ' },
  { id: 'u8',  name: 'ตู่ ธีรศักดิ์',      avatar: 'TT', faculty: 'วิศวกรรมศาสตร์',  year: 4, bio: 'ฟุตบอลและยิม ชอบ Push Day' },
  { id: 'u9',  name: 'ต้น ธนธรณ์',        avatar: 'TD', faculty: 'วิศวกรรมศาสตร์',  year: 3, bio: 'ฟุตบอลทีมคณะ เล่นมา 10 ปี' },
  { id: 'u10', name: 'ฝน ธัญชนก',         avatar: 'FC', faculty: 'วิทยาศาสตร์',       year: 2, bio: 'วิ่งทุกเช้า เป้าหมาย half-marathon' },
  { id: 'u11', name: 'เก่ง วรวิทย์',       avatar: 'WW', faculty: 'บริหารธุรกิจ',     year: 3, bio: 'บาสเกตบอลและฟุตบอล สลับกันไป' },
  { id: 'u12', name: 'บิ๊ก ปรัชญา',        avatar: 'BP', faculty: 'วิศวกรรมซอฟต์แวร์', year: 4, bio: 'ยิมและวิ่ง คาร์ดิโอก็ชอบ' },
  { id: 'u13', name: 'แพร ปิยะนุช',       avatar: 'PP', faculty: 'มนุษยศาสตร์',      year: 2, bio: 'แบดมินตันดับเบิ้ลส์ทุกอาทิตย์' },
  { id: 'u14', name: 'ออม อรอนงค์',       avatar: 'OA', faculty: 'แพทยศาสตร์',       year: 3, bio: 'วิ่งเพื่อสุขภาพ pace สบายๆ' },
  { id: 'u15', name: 'เจ ชัยวัฒน์',        avatar: 'JC', faculty: 'วิศวกรรมศาสตร์',  year: 4, bio: 'ฟุตบอล 7v7 ทุกสุดสัปดาห์' },
  { id: 'u16', name: 'ใหม่ กุลนิดา',      avatar: 'MK', faculty: 'วิจิตรศิลป์',      year: 1, bio: 'เพิ่งเริ่มออกกำลังกาย ชอบวิ่ง' },
  { id: 'u17', name: 'บอล ณัฐพล',         avatar: 'BN', faculty: 'วิทยาศาสตร์',       year: 3, bio: 'บาสเกตบอลและฟุตบอลตามเพื่อน' },
  { id: 'u18', name: 'เนย อรุณรัตน์',     avatar: 'NA', faculty: 'วิศวกรรมซอฟต์แวร์', year: 2, bio: 'แบดมินตันและวิ่ง ชอบกีฬาเดี่ยว' },
]

// Helper: look up a User by id (returns undefined if not found)
export function getUserById(id: string): User | undefined {
  return USERS.find((u) => u.id === id)
}

// Current mock user (the logged-in user for prototype)
export const CURRENT_USER: User = USERS[0]  // โอ๊ต

// ===== SESSION =====
export interface Session {
  id: string
  sport: SportType
  title: string
  date: string         // ISO date string
  startTime: string    // "HH:MM"
  endTime: string      // "HH:MM"
  location: string
  maxMembers: number
  members: User[]      // users who joined (uses USERS pool)
  description?: string
  host: User
}

export interface ChatMessage {
  id: string
  sessionId: string
  sender: User
  text: string
  timestamp: string // "HH:MM"
}

// ===== SESSIONS — members are drawn from USERS pool so they overlap across sessions =====
// This creates the "frequent partners" relationship the admin section computes.
export const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    sport: 'football',
    title: 'ฟุตบอล 5v5 ยามเย็น',
    date: '2026-05-21',
    startTime: '17:00',
    endTime: '19:00',
    location: 'สนามฟุตบอลหญ้าเทียม',
    maxMembers: 10,
    members: [USERS[1], USERS[4], USERS[7], USERS[8], USERS[14]],   // u2, u5, u8, u9, u15
    description: 'เล่นแบบสบายๆ ใครมาก็ได้ ไม่ต้องเก่งมาก',
    host: USERS[1],
  },
  {
    id: 's2',
    sport: 'basketball',
    title: 'บาสช่วงกลางวัน — ใครว่าง?',
    date: '2026-05-21',
    startTime: '12:00',
    endTime: '13:30',
    location: 'สนามบาสเกตบอล อาคาร ICT',
    maxMembers: 8,
    members: [USERS[2], USERS[5], USERS[3], USERS[6], USERS[10], USERS[16]],  // u3, u6, u4, u7, u11, u17
    description: 'ช่วงพักเที่ยง มาซ้อมบาสด้วยกัน',
    host: USERS[2],
  },
  {
    id: 's3',
    sport: 'badminton',
    title: 'แบดมินตัน ดับเบิ้ลส์ ประจำสัปดาห์',
    date: '2026-05-22',
    startTime: '18:00',
    endTime: '20:00',
    location: 'สนามแบดมินตัน หอพัก',
    maxMembers: 4,
    members: [USERS[3], USERS[6], USERS[12], USERS[17]],   // u4, u7, u13, u18
    host: USERS[3],
  },
  {
    id: 's4',
    sport: 'running',
    title: 'วิ่งรอบมอ ตี 5 เช้าๆ',
    date: '2026-05-22',
    startTime: '05:30',
    endTime: '06:30',
    location: 'ลู่วิ่ง รอบสนามกีฬา CMU',
    maxMembers: 20,
    members: [USERS[0], USERS[2], USERS[4], USERS[7], USERS[9], USERS[13], USERS[15]],  // u1, u3, u5, u8, u10, u14, u16
    description: 'วิ่งรอบมอยาม 5 โมงเช้า อากาศดีมาก ใครอยากมาชวนกันได้เลย',
    host: USERS[0],
  },
  {
    id: 's5',
    sport: 'gym',
    title: 'เข้ายิม Push Day',
    date: '2026-05-21',
    startTime: '20:00',
    endTime: '21:30',
    location: 'ฟิตเนส อาคารกีฬา',
    maxMembers: 5,
    members: [USERS[7], USERS[4], USERS[11]],   // u8, u5, u12
    description: 'Push day: Bench, OHP, Tricep — มาด้วยกันปลอดภัยกว่า',
    host: USERS[7],
  },
  {
    id: 's6',
    sport: 'basketball',
    title: 'บาสยามค่ำ CAMT vs Engineering',
    date: '2026-05-23',
    startTime: '19:00',
    endTime: '21:00',
    location: 'สนามบาสในร่ม CMU',
    maxMembers: 10,
    members: [USERS[0], USERS[2], USERS[5], USERS[10], USERS[16]],   // u1, u3, u6, u11, u17
    description: 'มาเตะกันแบบ friendly match ไม่จริงจังมาก',
    host: USERS[0],
  },
  {
    id: 's7',
    sport: 'football',
    title: 'ฟุตบอล 7v7 สุดสัปดาห์',
    date: '2026-05-24',
    startTime: '09:00',
    endTime: '11:00',
    location: 'สนามกีฬากลาง CMU',
    maxMembers: 14,
    members: [USERS[1], USERS[3], USERS[8], USERS[14], USERS[16]],   // u2, u4, u9, u15, u17
    host: USERS[1],
  },
  {
    id: 's8',
    sport: 'running',
    title: 'วิ่งเพื่อสุขภาพ Beginner Friendly',
    date: '2026-05-23',
    startTime: '06:00',
    endTime: '07:00',
    location: 'ลู่วิ่ง รอบสนามกีฬา CMU',
    maxMembers: 15,
    members: [USERS[2], USERS[5], USERS[9], USERS[13], USERS[15]],   // u3, u6, u10, u14, u16
    description: 'สำหรับคนเริ่มต้น pace ไม่เร็ว ไม่มีคนทิ้ง',
    host: USERS[2],
  },
]

// Mock chat messages for each session
export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  s1: [
    { id: 'c1', sessionId: 's1', sender: USERS[1], text: 'ยืนยัน 17:00 นะครับ มาได้เลย 🙌', timestamp: '14:32' },
    { id: 'c2', sessionId: 's1', sender: USERS[4], text: 'โอเค ผมมาด้วยคนครับ', timestamp: '14:35' },
    { id: 'c3', sessionId: 's1', sender: USERS[7], text: 'เอาด้วย! เอารองเท้ามาด้วยไหมครับ?', timestamp: '14:40' },
    { id: 'c4', sessionId: 's1', sender: USERS[1], text: 'เอามาเลยครับ สนามหญ้าเทียมต้องใช้รองเท้าฟุตบอล', timestamp: '14:41' },
    { id: 'c5', sessionId: 's1', sender: USERS[0], text: 'เพิ่งเห็น เข้าร่วมได้เลยใช่ไหมครับ?', timestamp: '15:10' },
  ],
  s2: [
    { id: 'c6', sessionId: 's2', sender: USERS[2], text: 'จองสนามไว้แล้วครับ มาได้เลย', timestamp: '09:00' },
    { id: 'c7', sessionId: 's2', sender: USERS[5], text: 'โอเค เตรียมน้ำมาด้วยนะ อากาศร้อน', timestamp: '09:15' },
    { id: 'c8', sessionId: 's2', sender: USERS[3], text: 'โอเค ไป!', timestamp: '10:30' },
    { id: 'c9', sessionId: 's2', sender: USERS[6], text: 'รอด้วยนะ 5 นาที', timestamp: '11:55' },
  ],
  s4: [
    { id: 'c10', sessionId: 's4', sender: USERS[0], text: 'วิ่งรอบมอตอนเช้าดีมาก อากาศสดชื่น 🌿', timestamp: '04:50' },
    { id: 'c11', sessionId: 's4', sender: USERS[4], text: 'กำลังตื่นอยู่ รอหน่อยนะครับ', timestamp: '05:20' },
    { id: 'c12', sessionId: 's4', sender: USERS[9], text: 'ออกจากหอแล้ว ไปเจอกันที่จุดนัด', timestamp: '05:25' },
    { id: 'c13', sessionId: 's4', sender: USERS[7], text: 'ไปด้วย! นัดที่ประตูหน้าสนามเลยไหม', timestamp: '05:28' },
  ],
}

// Check-in status for members in a session
export interface CheckInStatus {
  memberId: string
  confirmed: boolean
  photo?: string  // mock — always undefined in prototype
}

// Default check-in state for session s1
export const MOCK_CHECKIN: CheckInStatus[] = [
  { memberId: 'u2', confirmed: true },
  { memberId: 'u5', confirmed: false },
  { memberId: 'u8', confirmed: true },
]

// ===== ADMIN DASHBOARD DATA =====

// Per-user stats for the admin user activity table
export interface AdminUser {
  id: string
  name: string
  avatar: string
  faculty: string
  year?: number
  bio?: string
  sessionsCreated: number  // how many sessions this user hosted
  sessionsJoined: number   // how many sessions this user joined (as member)
  checkinRate: number      // 0–100 percentage of sessions actually checked in
}

// Build ADMIN_USERS by merging USERS with stats so data is consistent
// Users from the USERS pool get their real name/faculty/avatar; the rest are standalone entries
export const ADMIN_USERS: AdminUser[] = [
  // --- users from the USERS pool ---
  { id: 'u1',  name: 'โอ๊ต นัฏฐพัฒน์',  avatar: 'ON', faculty: 'วิศวกรรมซอฟต์แวร์', year: 3, bio: 'ชอบวิ่งตอนเช้าและบาสยามเย็น',      sessionsCreated: 3,  sessionsJoined: 7,  checkinRate: 71 },
  { id: 'u2',  name: 'กิตติ วงศ์สวัสดิ์', avatar: 'KW', faculty: 'วิศวกรรมศาสตร์',   year: 3, bio: 'ฟุตบอลทุกสัปดาห์ บาสตามฤดู',     sessionsCreated: 5,  sessionsJoined: 8,  checkinRate: 87 },
  { id: 'u3',  name: 'พิม สุดาพร',        avatar: 'PS', faculty: 'วิทยาศาสตร์',       year: 2, bio: 'วิ่งรอบมอทุกเช้า บาสเกตบอลก็ชอบ', sessionsCreated: 4,  sessionsJoined: 10, checkinRate: 90 },
  { id: 'u4',  name: 'แบม บุณยานุช',      avatar: 'BB', faculty: 'วิศวกรรมซอฟต์แวร์', year: 3, bio: 'แบดมินตันทุกอาทิตย์ ชอบดับเบิ้ลส์', sessionsCreated: 2,  sessionsJoined: 9,  checkinRate: 44 },
  { id: 'u5',  name: 'เต้ วีรภัทร',       avatar: 'TW', faculty: 'แพทยศาสตร์',       year: 4, bio: 'ยิมทุกวัน Push-Pull-Legs',           sessionsCreated: 4,  sessionsJoined: 11, checkinRate: 63 },
  { id: 'u6',  name: 'นิว นภัทร',          avatar: 'NN', faculty: 'บริหารธุรกิจ',     year: 2, bio: 'บาสเกตบอลและวิ่งคลายเครียด',      sessionsCreated: 1,  sessionsJoined: 6,  checkinRate: 33 },
  { id: 'u7',  name: 'มิ้น ปาณิสรา',      avatar: 'MP', faculty: 'มนุษยศาสตร์',      year: 1, bio: 'แบดมินตันมือใหม่ กำลังหัดจริงๆ',   sessionsCreated: 2,  sessionsJoined: 4,  checkinRate: 50 },
  { id: 'u8',  name: 'ตู่ ธีรศักดิ์',      avatar: 'TT', faculty: 'วิศวกรรมศาสตร์',  year: 4, bio: 'ฟุตบอลและยิม ชอบ Push Day',         sessionsCreated: 6,  sessionsJoined: 13, checkinRate: 69 },
  { id: 'u9',  name: 'ต้น ธนธรณ์',        avatar: 'TD', faculty: 'วิศวกรรมศาสตร์',  year: 3, bio: 'ฟุตบอลทีมคณะ เล่นมา 10 ปี',        sessionsCreated: 8,  sessionsJoined: 15, checkinRate: 100 },
  { id: 'u10', name: 'ฝน ธัญชนก',         avatar: 'FC', faculty: 'วิทยาศาสตร์',       year: 2, bio: 'วิ่งทุกเช้า เป้าหมาย half-marathon', sessionsCreated: 6,  sessionsJoined: 20, checkinRate: 95 },
  { id: 'u11', name: 'เก่ง วรวิทย์',       avatar: 'WW', faculty: 'บริหารธุรกิจ',     year: 3, bio: 'บาสเกตบอลและฟุตบอล สลับกันไป',    sessionsCreated: 7,  sessionsJoined: 18, checkinRate: 83 },
  { id: 'u12', name: 'บิ๊ก ปรัชญา',        avatar: 'BP', faculty: 'วิศวกรรมซอฟต์แวร์', year: 4, bio: 'ยิมและวิ่ง คาร์ดิโอก็ชอบ',        sessionsCreated: 10, sessionsJoined: 22, checkinRate: 77 },
  { id: 'u13', name: 'แพร ปิยะนุช',       avatar: 'PP', faculty: 'มนุษยศาสตร์',      year: 2, bio: 'แบดมินตันดับเบิ้ลส์ทุกอาทิตย์',   sessionsCreated: 3,  sessionsJoined: 12, checkinRate: 91 },
  { id: 'u14', name: 'ออม อรอนงค์',       avatar: 'OA', faculty: 'แพทยศาสตร์',       year: 3, bio: 'วิ่งเพื่อสุขภาพ pace สบายๆ',       sessionsCreated: 2,  sessionsJoined: 9,  checkinRate: 88 },
  { id: 'u15', name: 'เจ ชัยวัฒน์',        avatar: 'JC', faculty: 'วิศวกรรมศาสตร์',  year: 4, bio: 'ฟุตบอล 7v7 ทุกสุดสัปดาห์',        sessionsCreated: 12, sessionsJoined: 25, checkinRate: 76 },
  { id: 'u16', name: 'ใหม่ กุลนิดา',      avatar: 'MK', faculty: 'วิจิตรศิลป์',      year: 1, bio: 'เพิ่งเริ่มออกกำลังกาย ชอบวิ่ง',    sessionsCreated: 1,  sessionsJoined: 5,  checkinRate: 80 },
  { id: 'u17', name: 'บอล ณัฐพล',         avatar: 'BN', faculty: 'วิทยาศาสตร์',       year: 3, bio: 'บาสเกตบอลและฟุตบอลตามเพื่อน',    sessionsCreated: 4,  sessionsJoined: 11, checkinRate: 63 },
  { id: 'u18', name: 'เนย อรุณรัตน์',     avatar: 'NA', faculty: 'วิศวกรรมซอฟต์แวร์', year: 2, bio: 'แบดมินตันและวิ่ง ชอบกีฬาเดี่ยว',  sessionsCreated: 3,  sessionsJoined: 8,  checkinRate: 57 },
  // --- additional users not in main USERS pool (to keep table size realistic) ---
  { id: 'x1',  name: 'โน้ต ณัฐวุฒิ',      avatar: 'NW', faculty: 'วิศวกรรมศาสตร์',   sessionsCreated: 2,  sessionsJoined: 8,  checkinRate: 12 },
  { id: 'x2',  name: 'ลูกตาล สุภาพร',    avatar: 'LS', faculty: 'วิทยาศาสตร์',       sessionsCreated: 1,  sessionsJoined: 5,  checkinRate: 20 },
  { id: 'x3',  name: 'ปอ พีรณัฐ',         avatar: 'PP', faculty: 'บริหารธุรกิจ',       sessionsCreated: 3,  sessionsJoined: 12, checkinRate: 0  },
  { id: 'x4',  name: 'ปิ๊ก ภาวิดา',       avatar: 'PW', faculty: 'มนุษยศาสตร์',       sessionsCreated: 1,  sessionsJoined: 3,  checkinRate: 33 },
  { id: 'x5',  name: 'โฟม พรรณพัชร',     avatar: 'FP', faculty: 'วิศวกรรมซอฟต์แวร์', sessionsCreated: 2,  sessionsJoined: 7,  checkinRate: 28 },
  { id: 'x6',  name: 'มาย รมย์นลิน',     avatar: 'MR', faculty: 'แพทยศาสตร์',         sessionsCreated: 1,  sessionsJoined: 4,  checkinRate: 25 },
  { id: 'x7',  name: 'กาย กานต์ชนก',    avatar: 'GK', faculty: 'วิจิตรศิลป์',         sessionsCreated: 15, sessionsJoined: 23, checkinRate: 39 },
  { id: 'x8',  name: 'เอ็ม อภิชาติ',      avatar: 'MA', faculty: 'วิศวกรรมศาสตร์',   sessionsCreated: 9,  sessionsJoined: 21, checkinRate: 14 },
  { id: 'x9',  name: 'นิ้ง นิชาภา',       avatar: 'NN', faculty: 'วิทยาศาสตร์',       sessionsCreated: 4,  sessionsJoined: 16, checkinRate: 18 },
  { id: 'x10', name: 'บอล วรากร',         avatar: 'BV', faculty: 'บริหารธุรกิจ',       sessionsCreated: 4,  sessionsJoined: 11, checkinRate: 63 },
  { id: 'x11', name: 'ตาล ธีราพร',        avatar: 'TC', faculty: 'มนุษยศาสตร์',       sessionsCreated: 2,  sessionsJoined: 7,  checkinRate: 57 },
  { id: 'x12', name: 'หมู ศุภวิชญ์',      avatar: 'MS', faculty: 'วิจิตรศิลป์',         sessionsCreated: 3,  sessionsJoined: 10, checkinRate: 40 },
]

// ===== FREQUENT PARTNERS — computed from MOCK_SESSIONS =====
// A "pair" is two users who appear together in the same session members list.
// Count how many sessions each pair shares, then return the top 5.

export interface FrequentPair {
  userA: User
  userB: User
  sharedCount: number
  sports: SportType[]   // unique sports they played together
}

function computeFrequentPairs(): FrequentPair[] {
  // Map: "uid_a|uid_b" (sorted) → { count, sports }
  const pairMap = new Map<string, { count: number; sports: Set<SportType> }>()

  for (const session of MOCK_SESSIONS) {
    const ids = session.members.map((m) => m.id)
    // Generate all pairs from this session's member list
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const key = [ids[i], ids[j]].sort().join('|')
        if (!pairMap.has(key)) {
          pairMap.set(key, { count: 0, sports: new Set() })
        }
        const entry = pairMap.get(key)!
        entry.count += 1
        entry.sports.add(session.sport)
      }
    }
  }

  // Convert map → array, resolve User objects, sort by count desc
  const pairs: FrequentPair[] = []
  for (const [key, { count, sports }] of pairMap.entries()) {
    const [idA, idB] = key.split('|')
    const userA = getUserById(idA)
    const userB = getUserById(idB)
    if (userA && userB) {
      pairs.push({ userA, userB, sharedCount: count, sports: Array.from(sports) })
    }
  }

  pairs.sort((a, b) => b.sharedCount - a.sharedCount)
  return pairs.slice(0, 5)
}

// Top-5 frequent pairs — computed once at module load time
export const FREQUENT_PAIRS: FrequentPair[] = computeFrequentPairs()

// ===== USER PROFILE HELPER =====
// Aggregates a user's sport activity and sessions from MOCK_SESSIONS

export interface UserProfile {
  user: User
  sports: SportType[]    // unique sports this user has joined
  sessions: Session[]    // sessions the user was a member of
  checkinRate: number    // from ADMIN_USERS if available, else 0
}

export function getUserProfile(userId: string): UserProfile | null {
  const user = getUserById(userId)
  if (!user) return null

  const sessions = MOCK_SESSIONS.filter((s) =>
    s.members.some((m) => m.id === userId) || s.host.id === userId
  )
  const sports = Array.from(new Set(sessions.map((s) => s.sport)))
  const adminEntry = ADMIN_USERS.find((u) => u.id === userId)

  return {
    user,
    sports,
    sessions,
    checkinRate: adminEntry?.checkinRate ?? 0,
  }
}

// A session that has already passed its end time but some members never checked in
export interface FlaggedSession {
  id: string
  sport: SportType
  title: string
  datetime: string         // display string e.g. "21 พ.ค. 2026 · 17:00–19:00"
  totalMembers: number
  uncheckedCount: number   // members who did NOT check in
}

// Mock flagged sessions — 3 past sessions with missing check-ins
export const FLAGGED_SESSIONS: FlaggedSession[] = [
  {
    id: 'f1',
    sport: 'football',
    title: 'ฟุตบอล 5v5 ยามเย็น',
    datetime: '21 พ.ค. 2026 · 17:00–19:00',
    totalMembers: 3,
    uncheckedCount: 1,
  },
  {
    id: 'f2',
    sport: 'basketball',
    title: 'บาสช่วงกลางวัน — ใครว่าง?',
    datetime: '21 พ.ค. 2026 · 12:00–13:30',
    totalMembers: 4,
    uncheckedCount: 3,
  },
  {
    id: 'f3',
    sport: 'gym',
    title: 'เข้ายิม Push Day',
    datetime: '21 พ.ค. 2026 · 20:00–21:30',
    totalMembers: 2,
    uncheckedCount: 2,
  },
]

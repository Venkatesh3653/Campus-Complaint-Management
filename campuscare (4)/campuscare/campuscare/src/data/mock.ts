// DEMO DATA ONLY — fictional people and complaints. Nothing here is sent to a server.
import { Complaint, AppNotification, STATUSES, User, Status } from '../types'
export const DEMO_USERS: User[] = [
  { id: 'u1', name: 'Aria Menon', email: 'aria@demo.campuscare', role: 'student', department: 'B.Tech CSE' },
  { id: 'u2', name: 'Dev Sharma', email: 'dev@demo.campuscare', role: 'student', department: 'B.Sc Physics' },
  { id: 's1', name: 'Rohan Iyer', email: 'rohan@demo.campuscare', role: 'staff', department: 'Facilities' },
  { id: 's2', name: 'Meera Das', email: 'meera@demo.campuscare', role: 'staff', department: 'IT Services' },
  { id: 'a1', name: 'Dr. Kavita Rao', email: 'kavita@demo.campuscare', role: 'admin', department: 'Student Affairs' },
]
const ago = (d: number, h = 0) => new Date(Date.now() - d * 864e5 - h * 36e5).toISOString()
type Row = [string, string, string, 'Low' | 'Medium' | 'High' | 'Urgent', string, Status, string, string, number]
const rows: Row[] = [
  ['Wi-Fi drops every evening in Block A', 'Connection fails between 7 and 11 PM on floors 2 and 3, which blocks online lab submissions.', 'IT & Wi-Fi', 'High', 'Block A Hostel', 'In Progress', 'u1', 's2', 3],
  ['Water cooler leaking near library entrance', 'The cooler leaves a puddle on the floor and is a slipping risk.', 'Infrastructure', 'Medium', 'Main Library', 'Assigned', 'u1', 's1', 2],
  ['Broken tube light in Lecture Hall 4', 'Half the hall is dark during evening classes.', 'Infrastructure', 'Low', 'Lecture Hall Complex', 'Resolved', 'u1', 's1', 9],
  ['Canteen hygiene concerns', 'Tables are not cleaned between lunch batches.', 'Canteen', 'Medium', 'Central Canteen', 'Open', 'u1', '', 1],
  ['Streetlight out near the main gate', 'The footpath is unlit after 8 PM, which feels unsafe.', 'Safety', 'Urgent', 'Main Gate', 'Assigned', 'u2', 's1', 1],
  ['Projector not working in Lab 2', 'No display output; the HDMI port looks damaged.', 'IT & Wi-Fi', 'High', 'Computer Lab 2', 'In Progress', 'u2', 's2', 4],
  ['Reference books missing from shelf', 'Three books on the syllabus list are unavailable for weeks.', 'Library', 'Low', 'Main Library', 'Open', 'u2', '', 5],
  ['Bus route 4 is always late', 'Arrives 20 minutes after the posted time.', 'Transport', 'Medium', 'Main Gate', 'Closed', 'u1', 's1', 14],
  ['Mess food quality dropped', 'Repeated undercooked rice this week.', 'Hostel', 'High', 'Block B Hostel', 'Open', 'u2', '', 0],
  ['Damaged basketball net', 'The net on court 1 has torn.', 'Infrastructure', 'Low', 'Sports Ground', 'Resolved', 'u2', 's1', 11],
  ['Exam timetable clash notice', 'Two papers are scheduled at the same time for electives.', 'Academics', 'Urgent', 'Lecture Hall Complex', 'Assigned', 'u1', 's2', 2],
  ['Hot water unavailable on floor 3', 'The geyser has not worked for four days.', 'Hostel', 'High', 'Block A Hostel', 'In Progress', 'u2', 's1', 6],
]
const nameOf = (id: string) => DEMO_USERS.find(u => u.id === id)?.name
export function seedComplaints(): Complaint[] {
  return rows.map((r, i) => {
    const [title, description, category, priority, location, status, sid, aid, days] = r
    const idx = STATUSES.indexOf(status)
    const history = STATUSES.slice(0, idx + 1).map((s, k) => ({ status: s as Status, at: ago(days, -k * 6), by: k === 0 ? nameOf(sid)! : nameOf(aid) || 'Admin', note: s === 'Resolved' ? 'Issue fixed and verified on site.' : undefined }))
    return { id: `CC-${1001 + i}`, title, description, category, priority, location, status, studentId: sid, studentName: nameOf(sid)!, assigneeId: aid || undefined, assigneeName: aid ? nameOf(aid) : undefined, createdAt: ago(days), updatedAt: history[history.length - 1].at, resolutionNote: idx >= 3 ? 'Issue fixed and verified on site.' : undefined, history }
  })
}
export const seedNotifications = (): AppNotification[] => [
  { id: 'n1', userId: 'u1', title: 'Complaint in progress', body: 'CC-1001 is now being worked on by Meera Das.', read: false, at: ago(0, 3), complaintId: 'CC-1001' },
  { id: 'n2', userId: 'u1', title: 'Complaint resolved', body: 'CC-1003 was resolved. Check the resolution note.', read: true, at: ago(5), complaintId: 'CC-1003' },
  { id: 'n3', userId: 's1', title: 'New assignment', body: 'CC-1005 (Urgent) was assigned to you.', read: false, at: ago(1), complaintId: 'CC-1005' },
  { id: 'n4', userId: 'a1', title: 'Unassigned complaints', body: '3 complaints are waiting for an assignee.', read: false, at: ago(0, 1) },
]

import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLoad } from '../hooks/useLoad'
import { api } from '../services'
import { Badge, Confirm, Empty, Skeleton } from '../components/ui'
import { STATUSES, Status } from '../types'
import { fmtDate, timeAgo } from '../utils/format'
export default function ComplaintDetail() {
  const { id } = useParams(); const { user, toast } = useApp(); const u = user!
  const { data: c, loading, error, reload } = useLoad(() => api.complaints.get(id!), [id])
  const { data: staff } = useLoad(() => (u.role === 'admin' ? api.complaints.staff() : Promise.resolve([])), [u.id])
  const [status, setStatus] = useState<Status | ''>(''), [note, setNote] = useState(''), [ask, setAsk] = useState(false)
  if (loading) return <Skeleton className="h-96" />
  if (error || !c) return <Empty title="Complaint not found" hint={error} action={<Link to="/app/complaints" className="btn-outline">Back to complaints</Link>} />
  const next = status || c.status, canEdit = u.role !== 'student'
  const apply = async () => { try { await api.complaints.updateStatus(c.id, next, note || undefined); toast(`Status updated to ${next}`); setNote(''); setStatus(''); reload() } catch (e: any) { toast(e.message, 'err') } }
  const assign = async (aid: string) => { try { await api.complaints.assign(c.id, aid); toast('Complaint assigned'); reload() } catch (e: any) { toast(e.message, 'err') } }
  return <div className="space-y-4"><Link to="/app/complaints" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"><ArrowLeft size={14} />Back</Link>
    <div className="grid gap-4 lg:grid-cols-3"><div className="space-y-4 lg:col-span-2">
      <div className="card p-5"><div className="flex flex-wrap items-center gap-2"><span className="text-xs text-slate-500">{c.id}</span><Badge v={c.status} /><Badge v={c.priority} /></div><h1 className="mt-2 text-2xl font-bold">{c.title}</h1><p className="mt-3 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{c.description}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">{[['Category', c.category], ['Location', c.location], ['Raised by', c.studentName], ['Created', fmtDate(c.createdAt)]].map(([k, v]) => <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl></div>
      {c.resolutionNote && <div className="card border-emerald-300 bg-emerald-50 p-5 dark:border-emerald-500/30 dark:bg-emerald-500/10"><h2 className="text-sm font-semibold">Resolution note</h2><p className="mt-1 text-sm">{c.resolutionNote}</p></div>}
      <div className="card p-5"><h2 className="font-semibold">Status history</h2><ol className="mt-4 space-y-4 border-l border-slate-200 pl-5 dark:border-slate-700">{[...c.history].reverse().map((h, i) => <li key={i} className="relative"><span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-600" /><div className="flex items-center gap-2 text-sm"><Badge v={h.status} /><span className="text-slate-500">{h.by} · {timeAgo(h.at)}</span></div>{h.note && <p className="mt-1 text-sm text-slate-500">{h.note}</p>}</li>)}</ol></div></div>
      <div className="space-y-4"><div className="card p-5 text-sm"><h2 className="font-semibold">Assignment</h2><p className="mt-1 text-slate-500">{c.assigneeName ?? 'Not assigned yet'}</p>
        {u.role === 'admin' && <select className="input mt-3" aria-label="Assign to" value={c.assigneeId ?? ''} onChange={e => e.target.value && assign(e.target.value)}><option value="">Assign to staff…</option>{staff?.map(s => <option key={s.id} value={s.id}>{s.name} ({s.department})</option>)}</select>}</div>
        {canEdit && <div className="card space-y-3 p-5 text-sm"><h2 className="font-semibold">Update status</h2><select className="input" aria-label="Status" value={next} onChange={e => setStatus(e.target.value as Status)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
          <textarea className="input min-h-20" placeholder="Resolution or progress note" value={note} onChange={e => setNote(e.target.value)} /><button className="btn-primary w-full" disabled={next === c.status && !note} onClick={() => setAsk(true)}>Save update</button></div>}</div></div>
    <Confirm open={ask} onClose={() => setAsk(false)} title="Update this complaint?" text={`Status will change to ${next}. The student will be notified.`} label="Confirm update" onYes={apply} /></div>
}

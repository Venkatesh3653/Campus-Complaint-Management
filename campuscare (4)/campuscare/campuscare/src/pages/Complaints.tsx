import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLoad } from '../hooks/useLoad'
import { api } from '../services'
import { Skeleton } from '../components/ui'
import ComplaintTable from '../components/complaints/ComplaintTable'
export default function Complaints() {
  const { user } = useApp(); const u = user!; const { data, loading, error } = useLoad(() => api.complaints.list(), [u.id])
  const title = u.role === 'student' ? 'My complaints' : u.role === 'staff' ? 'Assigned to me' : 'All complaints'
  return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">{title}</h1>{u.role === 'student' && <Link to="/app/complaints/new" className="btn-primary">New complaint</Link>}</div>
    {error && <p className="text-sm text-rose-500">Could not load complaints: {error}</p>}
    {loading ? <Skeleton className="h-80" /> : <ComplaintTable items={data ?? []} showStudent={u.role !== 'student'} cta={u.role === 'student' ? <Link to="/app/complaints/new" className="btn-primary">Submit a complaint</Link> : undefined} />}</div>
}

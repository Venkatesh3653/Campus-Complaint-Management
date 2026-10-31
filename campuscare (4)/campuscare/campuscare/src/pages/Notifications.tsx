import { Link } from 'react-router-dom'
import { useLoad } from '../hooks/useLoad'
import { api } from '../services'
import { Empty, Skeleton } from '../components/ui'
import { timeAgo } from '../utils/format'
export default function Notifications() {
  const { data, loading, reload } = useLoad(() => api.notifications.list())
  const read = async (id: string) => { await api.notifications.markRead(id); reload() }
  return <div className="mx-auto max-w-2xl space-y-4"><div className="flex items-center justify-between"><h1 className="text-2xl font-bold">Notifications</h1>
    <button className="btn-outline" disabled={!data?.some(n => !n.read)} onClick={async () => { await api.notifications.markAll(); reload() }}>Mark all as read</button></div>
    {loading ? <Skeleton className="h-48" /> : !data?.length ? <div className="card"><Empty title="You are all caught up" hint="Updates about your complaints will appear here." /></div> :
      <ul className="card divide-y divide-slate-100 dark:divide-slate-800">{data.map(n => <li key={n.id} className="flex items-start gap-3 p-4"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-transparent' : 'bg-indigo-600'}`} aria-label={n.read ? 'Read' : 'Unread'} />
        <div className="flex-1 text-sm"><div className="font-medium">{n.title}</div><p className="text-slate-500">{n.body}</p><div className="mt-1 flex gap-3 text-xs text-slate-400">{timeAgo(n.at)}{n.complaintId && <Link className="text-indigo-600 hover:underline" onClick={() => read(n.id)} to={`/app/complaints/${n.complaintId}`}>View complaint</Link>}</div></div>
        {!n.read && <button className="btn-ghost text-xs" onClick={() => read(n.id)}>Mark read</button>}</li>)}</ul>}</div>
}

import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Confirm } from '../components/ui'
import { DEMO } from '../services'
import { BASE } from '../services/http'
import { resetDemo } from '../services/mock'
export default function Profile() {
  const { user: u, dark, toggleTheme, toast } = useApp(); const [ask, setAsk] = useState(false)
  return <div className="mx-auto max-w-2xl space-y-4"><h1 className="text-2xl font-bold">Profile & settings</h1>
    <div className="card p-5"><div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-full bg-indigo-600 text-lg font-bold text-white">{u!.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
      <div><div className="font-semibold">{u!.name}</div><div className="text-sm text-slate-500">{u!.email}</div><div className="text-xs capitalize text-slate-500">{u!.role}{u!.department && ` · ${u!.department}`}</div></div></div></div>
    <div className="card flex items-center justify-between p-5"><div><div className="font-medium">Dark mode</div><div className="text-sm text-slate-500">Saved on this device.</div></div>
      <button role="switch" aria-checked={dark} onClick={toggleTheme} className={`h-6 w-11 rounded-full p-0.5 transition ${dark ? 'bg-indigo-600' : 'bg-slate-300'}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${dark ? 'translate-x-5' : ''}`} /></button></div>
    <div className="card p-5 text-sm"><div className="font-medium">Data source</div><p className="mt-1 text-slate-500">{DEMO ? 'Demo mode: fictional sample data stored in this browser only. Nothing is sent to a server.' : `Connected to ${BASE}`}</p>
      {DEMO && <button className="btn-outline mt-3" onClick={() => setAsk(true)}>Reset demo data</button>}</div>
    <Confirm open={ask} onClose={() => setAsk(false)} title="Reset demo data?" text="This restores the original sample complaints and removes anything you added." label="Reset" onYes={() => { resetDemo(); toast('Demo data reset'); setTimeout(() => location.assign('/app'), 600) }} /></div>
}

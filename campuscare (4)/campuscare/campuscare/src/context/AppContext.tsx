import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'
import { api } from '../services'
import type { User } from '../types'
interface Ctx { user: User | null; ready: boolean; setUser(u: User | null): void; logout(): void; dark: boolean; toggleTheme(): void; toast(msg: string, kind?: 'ok' | 'err'): void }
const C = createContext<Ctx>(null!)
export const useApp = () => useContext(C)
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false)
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'))
  const [toasts, setToasts] = useState<{ id: number; msg: string; kind: string }[]>([])
  useEffect(() => { api.auth.me().then(setUser).finally(() => setReady(true)) }, [])
  const toggleTheme = () => { const d = !dark; setDark(d); document.documentElement.classList.toggle('dark', d); localStorage.setItem('cc-theme', d ? 'dark' : 'light') }
  const toast = useCallback((msg: string, kind: 'ok' | 'err' = 'ok') => { const id = Date.now() + Math.random(); setToasts(t => [...t, { id, msg, kind }]); setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500) }, [])
  const logout = () => { api.auth.logout(); setUser(null) }
  return <C.Provider value={{ user, ready, setUser, logout, dark, toggleTheme, toast }}>{children}
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2" role="status" aria-live="polite"><AnimatePresence>{toasts.map(t => (
      <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card flex items-center gap-2 px-4 py-3 text-sm shadow-lg">
        {t.kind === 'ok' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-rose-500" />}{t.msg}</motion.div>))}</AnimatePresence></div>
  </C.Provider>
}

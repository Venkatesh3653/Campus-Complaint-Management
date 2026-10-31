import { httpApi } from './http'
import { mockApi } from './mock'
export const DEMO = import.meta.env.VITE_DEMO_MODE !== 'false'
export const api = DEMO ? mockApi : httpApi

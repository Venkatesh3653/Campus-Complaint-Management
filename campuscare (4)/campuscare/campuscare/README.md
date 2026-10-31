# CampusCare

Campus complaint management frontend: React 18, Vite, TypeScript, Tailwind 3, React Router, Recharts, Framer Motion, Lucide.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```
Demo mode is on by default (`VITE_DEMO_MODE=true` in `.env`). On the login page choose a fictional student, staff or admin account. Ctrl/Cmd+K opens the command palette.

## Connect the Spring Boot API
1. Set `VITE_DEMO_MODE=false` and `VITE_API_BASE_URL=http://localhost:8080/api` in `.env`.
2. Adjust paths in `src/services/http.ts` (`endpoints`) and the `Api` contract in `src/services/types.ts` to match the backend.
3. Enable CORS for `http://localhost:5173` on the backend. Auth and authorization must be enforced server-side.

`src/services/index.ts` picks `mockApi` or `httpApi`; UI code only imports `api`. Mock data lives in `src/data/mock.ts` and `src/services/mock.ts`.

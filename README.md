# Google Form List Clone (Test Task)

Monorepo project with:
- **Backend**: Apollo Server (GraphQL) + TypeScript  
- **Frontend**: React + Vite + TypeScript + RTK Query  
- **Shared package**: common types in `packages/shared`

## Requirements

- Node.js **18+** (recommended)
- npm **10+**
- Git

## Repo structure

```
.
├─ server/         # GraphQL API (Apollo Server)
├─ client/         # React app (Vite)
├─ packages/
│  └─ shared/       # Shared TS types used by API and Web
├─ package.json     # npm workspaces + root scripts
└─ README.md
```

## Installation

From the repository root:

```bash
npm install
```

## Running in development

### Run API + Web together

```bash
npm run dev
```

This script:
1) Builds shared package (`packages/shared`)
2) Starts backend (`server`)
3) Starts frontend (`client`)

### Run only backend

```bash
npm run dev:api
```

Backend URL:
- GraphQL endpoint: `http://localhost:4000/`
- Apollo Sandbox UI is available at the same URL.

Health check query:

```graphql
query {
  health
}
```

### Run only frontend

```bash
npm run dev:web
```

### Alternative names

```bash
npm run dev:server
npm run dev:client
```

Frontend URL:
- `http://localhost:5173/` (Vite default)

## Useful scripts

### Build all workspaces

```bash
npm run build
```

### Typecheck all workspaces

```bash
npm run typecheck
```

### Rebuild shared package manually

If you change `packages/shared`, rebuild it:

```bash
npm run build -w packages/shared
```

> API and Web consume the compiled output from `packages/shared/dist`.

## Notes

- No database is used in this test task. API uses in-memory storage (`Map`) for forms and responses.
- Shared types are defined in `packages/shared` and used by both client and server to keep consistency.
- RTK Query is used for server state (GraphQL fetch + caching). Local UI state (like form filler input values) is kept in React state/hooks.

## Troubleshooting

### Port 4000 already in use
Stop the process running on port 4000 and restart API.

**Windows (PowerShell):**
```powershell
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -i :4000
kill -9 <PID>
```

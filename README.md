# Family Credit Card Expense Tracker (Frontend)

React SPA built with **Vite**, **Chakra UI**, and **React Router**.

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` and set your backend URL:

```
VITE_API_URL=http://localhost:6060/api/
```

## Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm run preview
```

Output is in `dist/`. For static hosts (Netlify, Vercel, etc.), configure SPA fallback so all routes serve `index.html` (see `vercel.json`).

## Project structure

```
src/
  App.jsx           # Routes
  main.jsx          # Entry
  pages/            # Screen components
  layouts/          # MainLayout (auth + nav)
  components/       # Shared UI
  lib/              # API client
  theme/            # Chakra + colors
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (must end with `/api/`) |

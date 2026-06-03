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

Output is in `dist/`.

### Deploy on Netlify

The repo includes `netlify.toml` and `public/_redirects` so refreshing `/dashboard`, `/expenses`, etc. does not 404.

In the Netlify UI, confirm:

| Setting | Value |
|---------|--------|
| Base directory | `todo-app-ui` (if deploying from monorepo root) or leave empty if this repo is the site root |
| Build command | `npm run build` |
| Publish directory | `dist` |

Set `VITE_API_URL` under **Site settings → Environment variables**, then redeploy.

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

# TapeWatch

A read-only X Layer wallet intelligence and on-chain monitoring workspace.

## Stack
- Next.js 15 / React 19 / TypeScript
- Vercel deployment
- Existing Supabase project (to be reconnected securely)
- OKX API integration (server-side credentials only)

## Local development
```bash
npm install
npm run dev
```

## Environment variables
Add secrets only through the hosting provider's environment-variable settings. Never commit API keys or Supabase service-role keys.

## Build
```bash
npm run build
```

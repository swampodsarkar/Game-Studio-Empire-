# Game Studio Empire

A AAA-quality **game development company simulator** built with React 19, TypeScript, Vite, Tailwind CSS, Firebase and Framer Motion. Start as a bedroom indie dev and grow into a global gaming empire.

## Features

- **Core loop**: create games (genre, theme, platform, engine, budget, marketing, dev time), run development phases, get scored by a review system, and earn sales/fans.
- **Studio management**: hire/train/promote/fire 8 employee roles, buy 10 studio upgrades, build custom engines.
- **Research tree**: 8 tech nodes (3D, multiplayer, ray tracing, cloud, AI NPCs, VR, AR, physics).
- **Market simulation**: 240 AI competitors, yearly genre trends, live global ranking.
- **Analytics**: Chart.js dashboards for studio value, fans, top games and revenue by genre.
- **Progression**: levels/XP, 20+ achievements (incl. hidden), daily login rewards, weekly missions.
- **Multiplayer-ready**: Firebase Auth + Realtime Database leaderboard, notifications, and an admin panel.
- **Persistence**: auto-save to Firebase (or localStorage in offline mode) with debounced writes.

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Firebase project values
npm run dev
```

If you skip Firebase config the game runs in **offline mode** (local anonymous account + localStorage save).

## Firebase setup

1. Create a Firebase project.
2. Enable **Authentication** (Email/Password + Anonymous), **Realtime Database**, and **Storage**.
3. Fill in `.env` with your config.
4. (Optional) Add admin UIDs to `VITE_ADMIN_UIDS` to unlock the admin panel.

## Database structure

```
users/{uid}            -> PlayerState (profile, games, employees, research, upgrades, history)
leaderboards/{uid}     -> LeaderboardEntry (studio value, fans, level, country)
notifications/global   -> broadcast notifications from the admin panel
```

## Architecture

```
src/
  config/      game balance & content (genres, upgrades, research tree)
  types/       shared TypeScript domain models
  firebase/    Firebase init + config
  context/     AuthContext + GameContext (state, actions, persistence)
  lib/         pure game logic (reviews, sales, AI market, achievements, missions)
  repository/  persistence layer (Firebase + offline fallback)
  components/  reusable UI + charts + layout
  screens/     feature screens
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — type-check + production build
- `npm run typecheck` — TypeScript only

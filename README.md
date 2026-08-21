<div align="center">

# FeastIQ — Web Frontend

**The Next.js web app for FeastIQ, an AI-powered food ordering marketplace — customer landing page, authentication, restaurant owner dashboard, and admin console, all in one app.**

[![Next.js](https://img.shields.io/badge/Framework-Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-8884d8)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

[Backend API →](https://github.com/Samuel-Gaston/feastIQ-backend) · [AI/ML Service →](https://github.com/Samuel-Gaston/feastIQ-AI_ML) · [Mobile App →](https://github.com/Samuel-Gaston/feastIQ-mobile-frontend)

</div>

---

## About This Repository

This is the **web frontend** for [FeastIQ](https://github.com/Samuel-Gaston/feastIQ-backend), a multi-restaurant food ordering marketplace enhanced with applied AI (personalized recommendations, a food image classifier, and a Groq-powered support assistant). Built with Next.js and Tailwind CSS, this app serves the public-facing marketing site and authentication flows today, with the restaurant owner dashboard and admin console being built out alongside it.

Fully bilingual (English/French) and theme-aware (light/dark) throughout, following a consistent context-provider pattern (`LanguageContext`, `ThemeContext`) used across the whole app.

---

## What's Built So Far

- **Landing Page** — bold, food-forward marketing page: animated live order-status demo, feature highlights (AI recommendations, visual dish search, AI ordering assistant, live tracking), a "how it works" walkthrough, and a restaurant-partner call to action
- **Login** — split-panel authentication screen with email/password sign-in
- **Register** — split-panel sign-up screen with name/email/password sign-up
- **forgot-password** — split-panel screen with email
- **reset-password** — split-panel screen with new-password/confirmed-password 
- **Admin dashboard** — collapsible sidebar, Topbar (search, notifications, theme + language switcher, user menu), and a Dashboard with stat cards, a revenue chart, recent activity feed
- **Custom Logo** — an original FeastIQ mark (flame-in-gradient badge + two-tone wordmark), used consistently across the app

---

## Design System

- **Consumer-facing pages** (landing, auth): warm, energetic orange/red/yellow gradients — built to evoke food, heat, and appetite
- **Admin console**: a distinct "Kitchen Ticket Rail" identity — a dark charcoal sidebar, perforated ticket-style cards, and warm saffron/basil/chili accents, styled after a kitchen order rail
- **Typography**: Fraunces (display/headings), Inter (UI/body), JetBrains Mono (data, tickets, timestamps)
- **i18n**: English/French via a shared `LanguageContext`, JSON translation files per locale
- **Theming**: light/dark mode via a shared `ThemeContext`, class-based Tailwind dark mode

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | react-icons, lucide-react |
| Flags | country-flag-icons |
| i18n | Custom React Context + JSON translation files |
| Theming | Custom React Context, class-based dark mode |

---


## Getting Started

### Prerequisites
- Node.js ≥ 18
- The [`feastIQ-backend`](https://github.com/Samuel-Gaston/feastIQ-backend) API running locally or deployed (for pages beyond mock-data screens)

### Installation

```bash
git clone https://github.com/Samuel-Gaston/feastIQ-web-frontend.git
cd feastIQ-web-frontend
npm install
npm run dev
```

## Related Repositories

| Repo | Description |
|---|---|
| [`feastIQ-backend`](https://github.com/Samuel-Gaston/feastIQ-backend) | NestJS REST API + WebSocket gateway |
| [`feastIQ-mobile-frontend`](https://github.com/Samuel-Gaston/feastIQ-mobile-frontend) | React Native (Expo) customer mobile app |
| [`feastIQ-AI_ML`](https://github.com/Samuel-Gaston/feastIQ-AI_ML) | Python/FastAPI AI microservice — recommendation engine, food image classifier |

---

## Author

**Samuel Gaston** — Software Engineer


</div>

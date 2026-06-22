# Expense Tracker (SmartTracker)

Lightweight React + Vite expense tracker built with Firebase (Auth + Firestore).

Getting started

Prerequisites:
- Node.js 18+ and npm

Local setup:

1. Copy environment variables:

```bash
cp .env.example .env
# then open .env and fill values from your Firebase project
```

2. Install and run dev server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Linting:

```bash
npm run lint
```

Firebase configuration
- The app reads Firebase config from Vite env vars prefixed with `VITE_FIREBASE_` (see `.env.example`).
- For local development, set these in a `.env` file in the project root or configure them in your hosting provider.

Deployment

Vercel (recommended):

1. Import your Git repository in Vercel.
2. Set the same `VITE_FIREBASE_*` environment variables in the Vercel project settings.
3. Set the build command to `npm run build` and the output directory to `dist`.

Firebase Hosting:

1. Install Firebase CLI: `npm i -g firebase-tools` and run `firebase login`.
2. Initialize hosting with `firebase init hosting` and set the public directory to `dist`.
3. Build and deploy:

```bash
npm run build
npx firebase deploy --only hosting
```

Notes / next recommended steps
- Add unit/integration tests (Jest/React Testing Library) and a CI workflow to run `npm run lint` and `npm run build` on pull requests.
- Verify Firebase security rules for Firestore to protect user data.
- Add a small GitHub Actions workflow to run lint/build on pushes to `main`.
- Consider setting up a staging environment in your hosting provider.

If you want, I can:
- Create a basic GitHub Actions CI workflow.
- Add tests starter (Jest + React Testing Library) and a few example tests.
- Deploy the app to Vercel and configure environment variables.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Expense Tracker (SmartTracker)

A lightweight expense tracker built with React, Vite, and Firebase (Auth + Firestore).

Features
- User authentication (Firebase Auth)
- Income & expense tracking (Firestore)
- Monthly budgeting and analytics
- Export to PDF and CSV

Tech stack
- React + Vite
- Firebase (Auth, Firestore)
- Chart.js for charts
- jsPDF for PDF export

Prerequisites
- Node.js 18+ and npm

Local setup
1. Copy environment variables and fill with your Firebase config:

```bash
cp .env.example .env
# edit .env and set the VITE_FIREBASE_* values
```

2. Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Build

```bash
npm run build
```

Lint

```bash
npm run lint
```

Firebase configuration
- The app reads Firebase config from Vite env vars prefixed with `VITE_FIREBASE_*` (see `.env.example`).

Deployment

Vercel (recommended):

1. Import your Git repository into Vercel.
2. Add the `VITE_FIREBASE_*` environment variables in the Vercel project settings.
3. Use `npm run build` as the build command and `dist` as the output directory.

Firebase Hosting:

```bash
npm i -g firebase-tools
firebase login
firebase init hosting
npm run build
npx firebase deploy --only hosting
```

Contributing
- Open an issue or submit a pull request for fixes and enhancements.
- Add tests and CI as needed; a basic GitHub Actions workflow is a good starting point.

License
- MIT

File references
- Main app: [src/App.jsx](src/App.jsx)
- Firebase config: [src/services/firebase.js](src/services/firebase.js)
- Environment template: [.env.example](.env.example)

If you'd like, I can also create a simple GitHub Actions workflow to run `npm run lint` and `npm run build` on push or pull requests.

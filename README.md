# Code Manager

A simple Next.js application for managing laboratory experiment entries, source code snippets, and metadata such as subject, experiment number, title, and language.

## Features

- Create new experiment entries
- View saved experiment details
- Edit existing experiments
- Delete experiments
- Search saved experiments in the sidebar
- Copy, select all, download, and preview code
- Duplicate prevention for subject + experiment number combinations
- MongoDB-backed persistence

## Tech Stack

- Next.js 16
- React 19
- MongoDB + Mongoose
- Monaco Editor
- Tailwind CSS
- React Hook Form
- React Toastify

## Project Structure

```bash
.
├── app/
│   ├── api/
│   │   └── experiment/
│   │       ├── route.js
│   │       └── [id]/
│   │           └── route.js
│   ├── edit/
│   │   └── [id]/
│   │       └── page.js
│   ├── view/
│   │   └── [id]/
│   │       └── page.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ExperimentCard.jsx
│   └── LeftMenu.jsx
├── models/
│   └── experiment.js
├── utils/
│   └── database.js
├── .env.local
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB database
- A valid `DB_URL` or `MONGODB_URI` environment variable

## Environment Setup

Create a `.env.local` file in the project root:

```bash
DB_URL=mongodb://localhost:27017/code-manager
```

You can also use:

```bash
MONGODB_URI=mongodb://localhost:27017/code-manager
```

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## Notes

- Each experiment is uniquely identified by the combination of `subject` and `experimentNumber`.
- The app expects a MongoDB instance to be available before running the app.
- The left panel supports search by subject, title, or experiment number.

## License

This project is for educational and internal laboratory use.

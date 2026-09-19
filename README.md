# YouTube Video to Text

This project is a React + Vite web app for extracting transcript text from YouTube videos and turning that content into cleaner rewritten output. The frontend communicates with n8n webhooks for AI processing and also includes a user authentication flow, protected pages, and saved content support.

## Overview

The application allows users to:

- paste a YouTube video URL
- send the URL to an n8n workflow for transcript extraction
- view the returned transcript in the UI
- copy or clear the extracted text
- open a rewrite/news generation flow
- sign in to protected pages and save generated content

## Features

- Modern dark UI with cyan/blue styling
- YouTube transcript extraction
- n8n webhook integration for AI-powered processing
- User login and protected routes
- Rewrite/news generation page
- Save transcript content through the backend API

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- n8n webhooks
- Backend API for auth and saved content

## Project Structure

- `src/pages/Home.jsx` — main transcript extraction page
- `src/pages/Rewrite.jsx` — rewrite/news generation page
- `src/pages/LoginForm.jsx` — login UI
- `src/pages/RegisterForm.jsx` — registration form
- `src/App.jsx` — route setup and protected routing
- `src/utills/ProtectedRoute.jsx` — access protection for logged-in users

## Quick Start

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open the app in the browser at:

```bash
http://localhost:5173
```

### Production build

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## n8n Workflow Integration

This project uses n8n as the processing layer for AI workflows.

### Current webhook URLs used by the app

- Transcript extraction: `https://n8nflow.online/webhook/summarize-video`
- Rewrite/news generation: `https://n8nflow.online/webhook/youtube-to-news`

These are called from the frontend pages:

- `src/pages/Home.jsx` sends the YouTube URL to the transcript workflow.
- `src/pages/Rewrite.jsx` sends text or transcript content to the rewrite/news workflow.

Example request body for transcript extraction:

```json
{
  "url": "https://www.youtube.com/watch?v=example"
}
```

Expected response shape:

```json
{
  "transcript": "Extracted transcript text here"
}
```

### Important

If you want to use your own n8n workflow, replace the webhook URLs in the relevant component files with your own endpoint URLs. For production, it is recommended to move these values into environment variables such as:

```bash
VITE_N8N_SUMMARIZE_URL=
VITE_N8N_REWRITE_URL=
```

and then use `import.meta.env` in the frontend.

## Authentication and Demo Login

The app includes a sign-in flow and protected routes. For demo/testing purposes, the login page provides this sample account:

- Email: `test@gmail.com`
- Password: `test123`

## Backend API

The frontend also communicates with a backend API for user authentication and saved content:

- Sign in: `https://pressai.info/api/signin`
- Save transcript/news: `https://pressai.info/api/user/news`

## Notes

- This repository is the frontend client for the workflow-based product.
- Transcript extraction and rewriting are handled by the connected n8n workflow/service.
- For production deployment, external service URLs should be stored in environment variables instead of hardcoded values.

---

This README reflects the actual project flow, including the n8n workflow integration and demo login setup.

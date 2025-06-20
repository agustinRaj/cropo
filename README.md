# Next.js Passport Photo App

This project is a Next.js app with:

- User authentication (login/register) using Firebase
- User data storage and retrieval in Firebase
- Passport-size photo upload and cropping for logged-in users
- Modern UI with Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your Firebase project and add your config to `.env.local` (instructions below).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

- Go to [Firebase Console](https://console.firebase.google.com/), create a project, and enable Email/Password authentication.
- Create a Firestore database for user data.
- In your project root, create a `.env.local` file and add your Firebase config:
  ```env
  NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  ```

## Features

- Register and login with email/password
- Store and retrieve user profile data
- Upload and crop passport-size photos (2x2 inches or 600x600px)

## Tech Stack

- Next.js (App Router, TypeScript)
- Firebase Auth, Firestore, Storage
- Tailwind CSS
- React Image Cropper (for cropping)

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run lint` — Lint code

---

Replace this README with your own project details as you build!

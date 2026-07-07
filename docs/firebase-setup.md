# Firebase Setup

SajuPop uses Firebase for login and member management while Vercel remains the web/API host.

## Required Firebase Products

- Authentication
- Firestore Database

## Enabled Login Methods

The app UI supports:

- Google
- Facebook
- Apple
- Email and password

Google and email can usually be enabled directly in Firebase Authentication. Facebook and Apple require provider credentials from Meta and Apple Developer before they can work in production.

## Vercel Environment Variables

Set these after creating the Firebase web app:

```txt
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

The client reads them through `/api/firebase-config`; these are public Firebase web config values, not admin secrets.

## Firestore Member Document

Path:

```txt
members/{uid}
```

Fields:

- `uid`
- `email`
- `displayName`
- `photoURL`
- `providers`
- `plan`
- `starCredits`
- `moonCredits`
- `savedReadings`
- `createdAt`
- `lastLoginAt`
- `updatedAt`

## CLI Steps

The local Firebase CLI must be logged in before project creation:

```bash
firebase login
firebase projects:create <unique-project-id> --display-name "SajuPop"
firebase use --add <unique-project-id>
firebase deploy --only firestore:rules
```

Then create a Firebase Web App in the console or with the Firebase CLI, copy its config into Vercel env vars, and redeploy Vercel.


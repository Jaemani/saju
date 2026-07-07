# Firebase Setup

SajuPop uses Firebase for login and member management while Vercel remains the web and API host.

## Required Firebase Products

- Authentication
- Firestore Database

## Enabled Login Methods

The app UI supports:

- Google
- Email/password

Enable both methods in Firebase Console -> Authentication -> Sign-in method.

Important:

- The service-account bootstrap can create the Firebase web app, sync Vercel env vars, and deploy Firestore rules.
- Firebase Authentication itself may still need one manual console step on Spark/free projects: open Firebase Console -> Authentication -> Get started.
- Google sign-in also requires the deployed Vercel domain to be authorized in Firebase Authentication settings.

## Vercel Environment Variables

These are public Firebase web config values, not admin secrets:

```txt
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

The client reads them through `/api/firebase-config`.

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

If a service account JSON is available in the project root:

```bash
node scripts/bootstrap-firebase-service-account.mjs sajupop-1-xxxx.json
vercel --prod --yes
```

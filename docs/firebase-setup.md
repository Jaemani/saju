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

Important:

- The service-account bootstrap can create the Firebase web app and sync Vercel env vars.
- Firebase Authentication itself may still need one manual console step on Spark/free projects: open Firebase Console -> Authentication -> Get started.
- Enable Email/Password and Google in the Sign-in method tab.
- Facebook needs Meta App ID/App Secret.
- Apple needs Apple Developer Team ID, Key ID, Service ID, and private key.

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

If a service account JSON is available in the project root:

```bash
node scripts/bootstrap-firebase-service-account.mjs sajupop-1-xxxx.json
vercel --prod --yes
```

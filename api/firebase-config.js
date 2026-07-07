const REQUIRED = [
  "FIREBASE_API_KEY",
  "FIREBASE_AUTH_DOMAIN",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_STORAGE_BUCKET",
  "FIREBASE_MESSAGING_SENDER_ID",
  "FIREBASE_APP_ID"
];

module.exports = function handler(req, res) {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    res.status(200).json({ configured: false, missing });
    return;
  }

  res.status(200).json({
    configured: true,
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID || undefined
    }
  });
};


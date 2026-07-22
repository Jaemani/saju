import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const state = {
  configured: false,
  auth: null,
  db: null,
  user: null,
  member: null,
  afterLogin: null
};

function t(key, variables) {
  return window.SajuPopI18n?.t(key, variables) || key;
}

function authTemplate() {
  return `
    <div class="auth-modal hidden" id="authModal" role="dialog" aria-modal="true" aria-labelledby="authTitle">
      <div class="auth-backdrop" data-auth-action="close"></div>
      <section class="auth-card">
        <button class="auth-close" type="button" data-auth-action="close" aria-label="${t("auth.close")}">×</button>
        <p class="eyebrow" data-i18n="auth.eyebrow">Member login</p>
        <h2 id="authTitle" data-i18n="auth.title">Sign in when you want to keep this reading.</h2>
        <p class="auth-note" id="authStatus" data-i18n="auth.note">Continue with Google or email.</p>
        <div class="provider-grid">
          <button type="button" data-provider="google"><span class="provider-icon google"></span><span data-i18n="auth.google">Continue with Google</span></button>
        </div>
        <div class="email-auth">
          <label><span data-i18n="auth.email">Email</span><input id="authEmail" type="email" autocomplete="email" placeholder="you@example.com" /></label>
          <label><span data-i18n="auth.password">Password</span><input id="authPassword" type="password" autocomplete="current-password" placeholder="8+ characters" /></label>
          <div class="email-actions">
            <button type="button" data-email-action="signin" data-i18n="auth.signIn">Sign in</button>
            <button type="button" data-email-action="signup" data-i18n="auth.create">Create account</button>
            <button type="button" data-email-action="reset" data-i18n="auth.reset">Reset password</button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return [...document.querySelectorAll(selector)];
}

function setStatus(message, isError = false) {
  const node = qs("#authStatus");
  if (!node) return;
  node.textContent = message;
  node.classList.toggle("error", isError);
}

function friendlyAuthError(error) {
  const code = error?.code || "";
  const message = error?.message || String(error || "");
  if (code.includes("configuration-not-found") || message.includes("CONFIGURATION_NOT_FOUND")) {
    return t("errors.config");
  }
  if (code.includes("operation-not-allowed")) {
    return t("errors.method");
  }
  if (code.includes("popup-blocked")) {
    return t("errors.popup");
  }
  if (code.includes("unauthorized-domain")) {
    return t("errors.domain");
  }
  if (code.includes("wrong-password") || code.includes("invalid-credential")) {
    return t("errors.credentials");
  }
  if (code.includes("email-already-in-use")) {
    return t("errors.exists");
  }
  return message;
}

function openAuth(options = {}) {
  state.afterLogin = options.afterLogin || null;
  qs("#authModal")?.classList.remove("hidden");
  setStatus(state.configured ? t("auth.note") : t("errors.config"), !state.configured);
}

function closeAuth() {
  qs("#authModal")?.classList.add("hidden");
}

async function upsertMember(user) {
  if (!state.db || !user) return null;
  try {
    const ref = doc(state.db, "members", user.uid);
    const existing = await getDoc(ref);
    const providers = user.providerData.map((provider) => provider.providerId);
    const payload = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      providers,
      lastLoginAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    if (!existing.exists()) {
      payload.createdAt = serverTimestamp();
      payload.plan = "free";
      payload.starCredits = 0;
      payload.moonCredits = 0;
      payload.savedReadings = 0;
    }
    await setDoc(ref, payload, { merge: true });
    const updated = await getDoc(ref);
    state.member = updated.data();
    return state.member;
  } catch (error) {
    console.warn("Member profile sync skipped:", error.message);
    state.member = {
      plan: "free",
      starCredits: 0,
      moonCredits: 0,
      savedReadings: 0,
      syncError: error.message
    };
    return state.member;
  }
}

function userLabel(user) {
  if (!user) return t("auth.login");
  return user.displayName || user.email || "Account";
}

function updateAuthUI(user) {
  qsa("[data-auth-label]").forEach((node) => {
    node.textContent = userLabel(user);
  });
  qsa("[data-auth-action='login']").forEach((button) => {
    button.textContent = user ? t("auth.account") : t("auth.login");
  });
  qsa("[data-member-only]").forEach((node) => {
    node.classList.toggle("hidden", !user);
  });
  qsa("[data-guest-only]").forEach((node) => {
    node.classList.toggle("hidden", !!user);
  });
}

async function signInGoogle() {
  if (!state.auth) throw new Error("Firebase is not configured yet.");
  setStatus(t("auth.opening"));
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(state.auth, provider);
  await upsertMember(result.user);
  closeAuth();
  if (state.afterLogin) state.afterLogin(result.user);
  return result.user;
}

async function emailAction(action) {
  if (!state.auth) throw new Error("Firebase is not configured yet.");
  const email = qs("#authEmail")?.value.trim();
  const password = qs("#authPassword")?.value;
  if (!email) throw new Error(t("auth.emailFirst"));
  if (action !== "reset" && !password) throw new Error(t("auth.passwordFirst"));
  if (action === "reset") {
    await sendPasswordResetEmail(state.auth, email);
    setStatus(t("auth.resetSent"));
    return null;
  }
  const result =
    action === "signup"
      ? await createUserWithEmailAndPassword(state.auth, email, password)
      : await signInWithEmailAndPassword(state.auth, email, password);
  await upsertMember(result.user);
  closeAuth();
  if (state.afterLogin) state.afterLogin(result.user);
  return result.user;
}

async function initFirebase() {
  const response = await fetch("/api/firebase-config");
  const payload = await response.json();
  if (!payload.configured) {
    state.configured = false;
    updateAuthUI(null);
    return;
  }
  const app = initializeApp(payload.config);
  state.auth = getAuth(app);
  state.db = getFirestore(app);
  state.configured = true;
  await setPersistence(state.auth, browserLocalPersistence);
  onAuthStateChanged(state.auth, async (user) => {
    state.user = user;
    if (user) await upsertMember(user);
    updateAuthUI(user);
    window.dispatchEvent(new CustomEvent("sajupop-auth-changed", { detail: { user, member: state.member } }));
  });
}

function bindAuthUI() {
  if (!qs("#authModal")) {
    document.body.insertAdjacentHTML("beforeend", authTemplate());
    window.SajuPopI18n?.applyTranslations(qs("#authModal"));
  }
  document.addEventListener("click", async (event) => {
    const authAction = event.target.closest("[data-auth-action]");
    if (authAction) {
      const action = authAction.dataset.authAction;
      if (action === "login") {
        if (state.user) window.location.href = "account.html";
        else openAuth();
      }
      if (action === "logout" && state.auth) await signOut(state.auth);
      if (action === "close") closeAuth();
    }

    const provider = event.target.closest("[data-provider]");
    if (provider?.dataset.provider === "google") {
      try {
        await signInGoogle();
      } catch (error) {
        setStatus(friendlyAuthError(error), true);
      }
    }

    const emailButton = event.target.closest("[data-email-action]");
    if (emailButton) {
      try {
        await emailAction(emailButton.dataset.emailAction);
      } catch (error) {
        setStatus(friendlyAuthError(error), true);
      }
    }
  });
}

window.SajuPopAuth = {
  openAuth,
  closeAuth,
  getCurrentUser: () => state.user,
  getMember: () => state.member,
  isConfigured: () => state.configured,
  signOut: () => signOut(state.auth)
};

bindAuthUI();
window.addEventListener("sajupop-locale-changed", () => updateAuthUI(state.user));
initFirebase().finally(() => {
  window.dispatchEvent(new CustomEvent("sajupop-auth-ready", { detail: { configured: state.configured } }));
});

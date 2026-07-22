function qs(selector) {
  return document.querySelector(selector);
}

function t(key, variables) {
  return window.SajuPopI18n?.t(key, variables) || key;
}

function refreshIcons() {
  window.lucide?.createIcons({ attrs: { "stroke-width": 1.8 } });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderGuestAccount(root) {
  root.innerHTML = `
    <article class="account-card login-card">
      <span class="account-mini-icon"><i data-lucide="bookmark"></i></span>
      <h2>${escapeHtml(t("account.loginTitle"))}</h2>
      <p>${escapeHtml(t("account.loginBody"))}</p>
      <button class="primary-btn" type="button" data-auth-action="login">${escapeHtml(t("auth.login"))}</button>
    </article>
    <article class="account-card account-preview-card vault-preview">
      <span class="account-mini-icon"><i data-lucide="archive"></i></span>
      <h2>${escapeHtml(t("account.vault"))}</h2>
      <p>${escapeHtml(t("account.vaultBody"))}</p>
    </article>
    <article class="account-card account-preview-card credit-preview">
      <span class="account-mini-icon"><i data-lucide="wallet-cards"></i></span>
      <h2>${escapeHtml(t("account.wallet"))}</h2>
      <p>${escapeHtml(t("account.walletBody"))}</p>
    </article>
    <article class="account-card account-preview-card privacy-preview">
      <span class="account-mini-icon"><i data-lucide="shield-check"></i></span>
      <h2>${escapeHtml(t("account.privacy"))}</h2>
      <p>${escapeHtml(t("account.privacyBody"))}</p>
    </article>
  `;
  refreshIcons();
}

function renderAccount(user, member) {
  const root = qs("#accountContent");
  if (!root) return;
  if (!user) {
    renderGuestAccount(root);
    return;
  }

  const providers = user.providerData.map((provider) => provider.providerId.replace(".com", "")).join(", ") || "email";
  const displayName = escapeHtml(user.displayName || "SajuPop Member");
  const email = escapeHtml(user.email || "No email connected");
  const initial = escapeHtml((user.displayName || user.email || "S").slice(0, 1).toUpperCase());
  const photoURL = user.photoURL ? escapeHtml(user.photoURL) : "";

  root.innerHTML = `
    <article class="account-card profile-card">
      <div class="avatar">${photoURL ? `<img src="${photoURL}" alt="" />` : `<span>${initial}</span>`}</div>
      <h2>${displayName}</h2>
      <p>${email}</p>
      <button class="primary-btn" type="button" data-auth-action="logout">${escapeHtml(t("account.signOut"))}</button>
    </article>
    <article class="account-card">
      <h2>${escapeHtml(t("account.credits"))}</h2>
      <div class="credit-row"><span>${escapeHtml(t("account.starCredits"))}</span><strong>${member?.starCredits ?? 0}</strong></div>
      <div class="credit-row"><span>${escapeHtml(t("account.moonCredits"))}</span><strong>${member?.moonCredits ?? 0}</strong></div>
      <p>${escapeHtml(t("account.creditsBody"))}</p>
    </article>
    <article class="account-card">
      <h2>${escapeHtml(t("account.membership"))}</h2>
      <div class="credit-row"><span>${escapeHtml(t("account.plan"))}</span><strong>${member?.plan || "free"}</strong></div>
      <div class="credit-row"><span>${escapeHtml(t("account.providers"))}</span><strong>${escapeHtml(providers)}</strong></div>
      <p>${escapeHtml(t("account.membershipBody"))}</p>
    </article>
    <article class="account-card">
      <h2>${escapeHtml(t("account.vault"))}</h2>
      <div class="credit-row"><span>${escapeHtml(t("account.saved"))}</span><strong>${member?.savedReadings ?? 0}</strong></div>
      <p>${escapeHtml(t("account.vaultEmpty"))}</p>
    </article>
  `;
  refreshIcons();
}

window.addEventListener("sajupop-auth-changed", (event) => {
  renderAccount(event.detail.user, event.detail.member);
});

window.addEventListener("sajupop-auth-ready", () => {
  renderAccount(window.SajuPopAuth?.getCurrentUser(), window.SajuPopAuth?.getMember());
});

window.addEventListener("sajupop-locale-changed", () => {
  renderAccount(window.SajuPopAuth?.getCurrentUser(), window.SajuPopAuth?.getMember());
});

function renderCurrentAccount() {
  renderAccount(window.SajuPopAuth?.getCurrentUser(), window.SajuPopAuth?.getMember());
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderCurrentAccount);
else renderCurrentAccount();

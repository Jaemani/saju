function qs(selector) {
  return document.querySelector(selector);
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
      <span class="account-mini-icon">四</span>
      <h2>Login when you want to keep it.</h2>
      <p>Generate a chart first. Use Google or email when you are ready to save readings, unlock checkout, or manage credits.</p>
      <button class="primary-btn" type="button" data-auth-action="login">Login</button>
    </article>
    <article class="account-card account-preview-card vault-preview">
      <span class="account-mini-icon">V</span>
      <h2>Reading Vault</h2>
      <p>Saved charts and paid reports will live here, separated from the public birth setup page.</p>
    </article>
    <article class="account-card account-preview-card credit-preview">
      <span class="account-mini-icon">C</span>
      <h2>Credit Wallet</h2>
      <p>Star Credits and Moon Credits are ready for checkout integration after payment is connected.</p>
    </article>
    <article class="account-card account-preview-card privacy-preview">
      <span class="account-mini-icon">P</span>
      <h2>Private Profile</h2>
      <p>Member records are scoped to your Firebase user id, so each account sees only its own saved data.</p>
    </article>
  `;
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
      <button class="primary-btn" type="button" data-auth-action="logout">Sign out</button>
    </article>
    <article class="account-card">
      <h2>Credits</h2>
      <div class="credit-row"><span>Star Credits</span><strong>${member?.starCredits ?? 0}</strong></div>
      <div class="credit-row"><span>Moon Credits</span><strong>${member?.moonCredits ?? 0}</strong></div>
      <p>Checkout integration will add credits after payment succeeds.</p>
    </article>
    <article class="account-card">
      <h2>Membership</h2>
      <div class="credit-row"><span>Plan</span><strong>${member?.plan || "free"}</strong></div>
      <div class="credit-row"><span>Providers</span><strong>${escapeHtml(providers)}</strong></div>
      <p>Provider linking and paid tiers can be added after checkout is wired.</p>
    </article>
    <article class="account-card">
      <h2>Vault</h2>
      <div class="credit-row"><span>Saved Readings</span><strong>${member?.savedReadings ?? 0}</strong></div>
      <p>Saved readings will appear here after report persistence is added.</p>
    </article>
  `;
}

window.addEventListener("sajupop-auth-changed", (event) => {
  renderAccount(event.detail.user, event.detail.member);
});

window.addEventListener("sajupop-auth-ready", () => {
  renderAccount(window.SajuPopAuth?.getCurrentUser(), window.SajuPopAuth?.getMember());
});

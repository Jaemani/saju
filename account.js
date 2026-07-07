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

function renderAccount(user, member) {
  const root = qs("#accountContent");
  if (!root) return;
  if (!user) {
    root.innerHTML = `
      <article class="account-card">
        <h2>Login required</h2>
        <p>Sign in with Google, Facebook, Apple, or email to manage your SajuPop account.</p>
        <button class="primary-btn" type="button" data-auth-action="login">Login</button>
      </article>
    `;
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
      <p>Checkout integration can add credits here after payment succeeds.</p>
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
      <p>Saved readings will appear here after the report persistence flow is added.</p>
    </article>
  `;
}

window.addEventListener("sajupop-auth-changed", (event) => {
  renderAccount(event.detail.user, event.detail.member);
});

window.addEventListener("sajupop-auth-ready", () => {
  renderAccount(window.SajuPopAuth?.getCurrentUser(), window.SajuPopAuth?.getMember());
});

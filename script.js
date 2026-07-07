const termCopy = {
  "Day Master":
    "The Day Master is the heavenly stem of the day pillar. It is the reference point for identity and all Ten Gods.",
  "Hidden Stems":
    "Hidden Stems are inner energies stored inside each Earthly Branch. They explain what is not obvious at first glance.",
  "Ten Gods":
    "Ten Gods are relationship labels between the Day Master and other stems: peers, talent, wealth, pressure, and resources.",
  "Symbolic Stars":
    "Symbolic Stars, or Shinsal, are traditional interpretive accents. They add texture but should not be treated as fixed fate.",
  "Zi-Wei Harm":
    "Zi-Wei Harm, or Rat-Goat Harm, points to subtle mismatch, emotional friction, or practical tension that needs care.",
  "Ghost Gate":
    "Ghost Gate suggests hyper-intuition, obsessive thought loops, and unusual perception. It is best used as creative insight."
};

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll(".mode-pill").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".mode-pill").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const mode = button.dataset.mode;
    const title = document.querySelector("#workspace-title");
    if (mode === "technical") {
      title.textContent = "A Korean Saju chart with stems, branches, Ten Gods, Shinsal, and timing explained.";
    } else if (mode === "poetic") {
      title.textContent = "A glossy little mirror for your timing, temperament, and lucky direction.";
    } else {
      title.textContent = "A Korean Saju reading that explains the chart while it reads you.";
    }
  });
});

document.querySelectorAll(".category-tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category-tab").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".product-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.category !== filter);
    });
  });
});

document.querySelectorAll(".chart-tags button").forEach((button) => {
  button.addEventListener("click", () => {
    const pop = document.querySelector("#termPop");
    pop.textContent = termCopy[button.dataset.term] || "This marker adds interpretive texture to the chart.";
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".reading-item");
    item.classList.toggle("open");
    trigger.querySelector("span").textContent = item.classList.contains("open") ? "-" : "+";
  });
});

document.querySelectorAll(".glossary-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".glossary-filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.glossary;
    document.querySelectorAll(".glossary-card").forEach((card) => {
      card.classList.toggle("is-hidden", filter !== "all" && card.dataset.group !== filter);
    });
  });
});

document.querySelector("#nameInput")?.addEventListener("input", (event) => {
  const value = event.target.value.trim() || "Your";
  document.querySelector("#readerName").textContent = value;
});


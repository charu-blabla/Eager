// js/render.js — All DOM creation/update functions, one per screen/component.
// Day 8: XSS-safe rendering (escape all dynamic text, including AI output),
// double-click guards handled in main.js, minor a11y/robustness cleanup.

import { STACK_OPTIONS } from "../data/stacks.js";
import { isFavorited, getFavorites } from "./favorites.js";

const DOMAIN_LABELS = { Web: "WEB", Mobile: "MOBILE", AI: "AI", DSA: "DSA" };

// Escapes text before inserting into innerHTML — applied to ALL dynamic
// content, including AI-generated text, which isn't 100% predictable.
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function topBar() {
  const favCount = getFavorites().length;
  return `
    <div class="topbar">
      <button class="logo-btn" id="logo-btn" aria-label="Back to Eager home">Eager</button>
      <button class="favorites-nav-btn" id="favorites-nav-btn" aria-label="View saved favorites, ${favCount} saved">
        <span class="star-icon-sm" aria-hidden="true">&#9733;</span> Saved${favCount > 0 ? ` <span class="fav-count">${favCount}</span>` : ""}
      </button>
    </div>
  `;
}

function wireTopBar(container, onLogoClick, onFavoritesClick) {
  container.querySelector("#logo-btn").addEventListener("click", onLogoClick);
  container.querySelector("#favorites-nav-btn").addEventListener("click", onFavoritesClick);
}

export function renderInputForm(container, onSubmit, onFavoritesClick) {
  container.innerHTML = `
    ${topBar()}
    <div class="screen">
      <h1 class="app-title">Eager</h1>
      <p class="app-subtitle">Know what to build, in one click.</p>

      <form id="input-form" class="input-form" novalidate>
        <fieldset class="form-group">
          <legend>Skill Level</legend>
          <div class="radio-row">
            <label class="radio-option">
              <input type="radio" name="skillLevel" value="Beginner" required />
              <span class="option-label">Beginner</span>
              <span class="check-icon" aria-hidden="true">&#10003;</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="skillLevel" value="Intermediate" />
              <span class="option-label">Intermediate</span>
              <span class="check-icon" aria-hidden="true">&#10003;</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="skillLevel" value="Advanced" />
              <span class="option-label">Advanced</span>
              <span class="check-icon" aria-hidden="true">&#10003;</span>
            </label>
          </div>
          <p class="field-error" id="skill-error" hidden role="alert">Select a skill level.</p>
        </fieldset>

        <fieldset class="form-group">
          <legend>Tech Stack (select all that apply)</legend>
          <div class="checkbox-grid">
            ${STACK_OPTIONS.map(
              (stack) => `
              <label class="checkbox-option">
                <input type="checkbox" name="stack" value="${escapeHTML(stack)}" />
                <span class="option-label">${escapeHTML(stack)}</span>
                <span class="check-icon" aria-hidden="true">&#10003;</span>
              </label>
            `
            ).join("")}
          </div>
          <p class="field-error" id="stack-error" hidden role="alert">Select at least one stack.</p>
        </fieldset>

        <fieldset class="form-group">
          <legend>Time Available</legend>
          <div class="time-row">
            <label class="number-field">
              Hours/week
              <input type="number" name="hoursPerWeek" min="1" max="80" value="5" required />
            </label>
            <label class="number-field">
              Total weeks
              <input type="number" name="totalWeeks" min="1" max="52" value="2" required />
            </label>
          </div>
          <p class="field-error" id="time-error" hidden role="alert">Enter valid hours/week (1-80) and weeks (1-52).</p>
        </fieldset>

        <button type="submit" class="btn-primary" id="submit-btn">
          <span>Find My Project</span>
          <span class="btn-arrow" aria-hidden="true">&#8594;</span>
        </button>
      </form>
    </div>
  `;

  wireTopBar(container, () => {}, onFavoritesClick);

  const form = container.querySelector("#input-form");
  const skillError = container.querySelector("#skill-error");
  const stackError = container.querySelector("#stack-error");
  const timeError = container.querySelector("#time-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const skillLevel = formData.get("skillLevel");
    const selectedStacks = formData.getAll("stack");
    const hoursPerWeek = Number(formData.get("hoursPerWeek"));
    const totalWeeks = Number(formData.get("totalWeeks"));

    let hasError = false;

    skillError.hidden = !!skillLevel;
    if (!skillLevel) hasError = true;

    stackError.hidden = selectedStacks.length > 0;
    if (selectedStacks.length === 0) hasError = true;

    const timeValid =
      Number.isFinite(hoursPerWeek) && hoursPerWeek >= 1 && hoursPerWeek <= 80 &&
      Number.isFinite(totalWeeks) && totalWeeks >= 1 && totalWeeks <= 52;
    timeError.hidden = timeValid;
    if (!timeValid) hasError = true;

    if (hasError) {
      const firstVisibleError = container.querySelector(".field-error:not([hidden])");
      if (firstVisibleError) firstVisibleError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    onSubmit({ skillLevel, selectedStacks, hoursPerWeek, totalWeeks });
  });
}

function ideaCardHTML(idea) {
  const favorited = isFavorited(idea.id);
  return `
    <div class="idea-card-wrap">
      <button class="idea-card" data-idea-id="${escapeHTML(idea.id)}">
        <span class="domain-tag domain-${idea.domain.toLowerCase()}">${DOMAIN_LABELS[idea.domain]}</span>
        <h3 class="idea-title">${escapeHTML(idea.title)}</h3>
        <p class="idea-hook">${escapeHTML(idea.hook)}</p>
        <p class="idea-meta">~${idea.estimatedWeeks} week${idea.estimatedWeeks === 1 ? "" : "s"}</p>
      </button>
      <button class="star-btn ${favorited ? "favorited" : ""}" data-star-idea-id="${escapeHTML(idea.id)}" aria-label="${favorited ? "Remove from favorites" : "Save to favorites"}" aria-pressed="${favorited}">
        <span aria-hidden="true">${favorited ? "&#9733;" : "&#9734;"}</span>
      </button>
    </div>
  `;
}

export function renderIdeaList(container, ideas, note, onCardClick, onEditInputs, onFavoritesClick, onToggleStar) {
  container.innerHTML = `
    ${topBar()}
    <div class="screen">
      <button class="btn-link back-link" id="edit-inputs-btn">&larr; Edit inputs</button>

      <p class="results-count">${ideas.length} idea${ideas.length === 1 ? "" : "s"} match your inputs</p>
      ${note ? `<p class="results-note">${escapeHTML(note)}</p>` : ""}

      ${
        ideas.length === 0
          ? `<div class="empty-state">
              <p class="empty-state-title">No ideas to show</p>
              <p class="empty-state-text">Try adjusting your inputs and searching again.</p>
            </div>`
          : `<div class="idea-list">${ideas.map((idea) => ideaCardHTML(idea)).join("")}</div>`
      }
    </div>
  `;

  wireTopBar(container, () => {}, onFavoritesClick);
  container.querySelector("#edit-inputs-btn").addEventListener("click", onEditInputs);

  container.querySelectorAll(".idea-card").forEach((card) => {
    card.addEventListener("click", () => onCardClick(card.dataset.ideaId));
  });

  container.querySelectorAll(".star-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onToggleStar(btn.dataset.starIdeaId, btn);
    });
  });
}

export function renderLoading(container, onCancel) {
  container.innerHTML = `
    <div class="screen loading-screen">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text" role="status">Personalizing your project brief…</p>
      <button class="btn-link" id="cancel-loading-btn">&larr; Back to results</button>
    </div>
  `;
  container.querySelector("#cancel-loading-btn").addEventListener("click", onCancel);
}

export function renderError(container, message, onRetry, onBack) {
  container.innerHTML = `
    <div class="screen error-screen">
      <h2 class="app-title-sm">Something went wrong</h2>
      <p class="error-text" role="alert">${escapeHTML(message)}</p>
      <div class="error-actions">
        <button class="btn-primary" id="retry-btn"><span>Try Again</span></button>
        <button class="btn-link" id="back-from-error-btn">&larr; Back to results</button>
      </div>
    </div>
  `;
  container.querySelector("#retry-btn").addEventListener("click", onRetry);
  container.querySelector("#back-from-error-btn").addEventListener("click", onBack);
}

export function renderIdeaDetail(container, idea, brief, onBack, onFavoritesClick, onToggleStar, onShare) {
  const mustHave = (brief.features && brief.features.mustHave) || [];
  const stretch = (brief.features && brief.features.stretch) || [];
  const roadmap = brief.roadmap || [];
  const folderStructure = brief.folderStructure || "";
  const resumeDescription = brief.resumeDescription || "";
  const favorited = isFavorited(idea.id);

  container.innerHTML = `
    ${topBar()}
    <div class="screen">
      <button class="btn-link back-link" id="back-to-list-btn">&larr; Back to results</button>

      <div class="detail-header">
        <div>
          <span class="domain-tag domain-${idea.domain.toLowerCase()}">${DOMAIN_LABELS[idea.domain]}</span>
          <h1 class="detail-title">${escapeHTML(idea.title)}</h1>
          <p class="detail-hook">${escapeHTML(idea.hook)}</p>
        </div>
        <div class="detail-actions">
          <button class="icon-btn star-btn-lg ${favorited ? "favorited" : ""}" id="detail-star-btn" aria-label="${favorited ? "Remove from favorites" : "Save to favorites"}" aria-pressed="${favorited}">
            <span aria-hidden="true">${favorited ? "&#9733;" : "&#9734;"}</span>
          </button>
          <button class="icon-btn" id="detail-share-btn" aria-label="Copy share link">
            <span aria-hidden="true">&#8599;</span> Share
          </button>
        </div>
      </div>

      <section class="detail-section">
        <h3 class="detail-section-title">Features</h3>
        ${mustHave.length > 0 ? `<p class="detail-subheading">Must-Have</p><ul class="feature-list">${mustHave.map((f) => `<li>${escapeHTML(f)}</li>`).join("")}</ul>` : `<p class="empty-state-text">No features generated.</p>`}
        ${
          stretch.length > 0
            ? `<p class="detail-subheading">Stretch Goals</p><ul class="feature-list">${stretch.map((f) => `<li>${escapeHTML(f)}</li>`).join("")}</ul>`
            : ""
        }
      </section>

      <section class="detail-section">
        <h3 class="detail-section-title">Folder Structure</h3>
        <pre class="folder-structure">${escapeHTML(folderStructure) || "Not available."}</pre>
      </section>

      <section class="detail-section">
        <h3 class="detail-section-title">Learning Roadmap</h3>
        ${
          roadmap.length > 0
            ? `<ol class="roadmap-list">${roadmap.map((r) => `<li><strong>Week ${escapeHTML(r.week)}:</strong> ${escapeHTML(r.focus)}</li>`).join("")}</ol>`
            : `<p class="empty-state-text">No roadmap generated.</p>`
        }
      </section>

      <section class="detail-section">
        <h3 class="detail-section-title">Resume Description</h3>
        <div class="resume-box">
          <p id="resume-text">${escapeHTML(resumeDescription) || "Not available."}</p>
          <button class="btn-link" id="copy-resume-btn" ${resumeDescription ? "" : "disabled"}>Copy</button>
        </div>
      </section>

      <div class="toast" id="toast" hidden role="status"></div>
    </div>
  `;

  wireTopBar(container, () => {}, onFavoritesClick);
  container.querySelector("#back-to-list-btn").addEventListener("click", onBack);

  const toast = container.querySelector("#toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.hidden = false;
    toast.classList.add("toast-visible");
    setTimeout(() => {
      toast.classList.remove("toast-visible");
      setTimeout(() => (toast.hidden = true), 200);
    }, 2000);
  }

  const copyBtn = container.querySelector("#copy-resume-btn");
  if (resumeDescription) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resumeDescription).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
      }).catch(() => showToast("Could not copy — select the text manually."));
    });
  }

  container.querySelector("#detail-star-btn").addEventListener("click", (e) => {
    onToggleStar(idea.id, e.currentTarget, { idea, brief });
  });

  container.querySelector("#detail-share-btn").addEventListener("click", () => {
    onShare(idea.id, showToast);
  });
}

export function renderFavorites(container, favorites, ideasById, onOpen, onRemove, onBack, onFavoritesClick) {
  const validFavorites = favorites.filter((fav) => ideasById[fav.ideaId]);

  container.innerHTML = `
    ${topBar()}
    <div class="screen">
      <button class="btn-link back-link" id="back-to-home-btn">&larr; Back to Eager</button>
      <h2 class="app-title-sm">Saved Ideas</h2>

      ${
        validFavorites.length === 0
          ? `<div class="empty-state">
              <p class="empty-state-title">Nothing saved yet</p>
              <p class="empty-state-text">Star an idea from your results to keep it here.</p>
            </div>`
          : `<div class="idea-list">
              ${validFavorites
                .map((fav) => {
                  const idea = ideasById[fav.ideaId];
                  const savedDate = new Date(fav.favoritedAt);
                  const savedDateText = isNaN(savedDate.getTime()) ? "" : savedDate.toLocaleDateString();
                  return `
                    <div class="idea-card-wrap">
                      <button class="idea-card" data-open-idea-id="${escapeHTML(fav.ideaId)}">
                        <span class="domain-tag domain-${idea.domain.toLowerCase()}">${DOMAIN_LABELS[idea.domain]}</span>
                        <h3 class="idea-title">${escapeHTML(idea.title)}</h3>
                        <p class="idea-hook">${escapeHTML(idea.hook)}</p>
                        ${savedDateText ? `<p class="idea-meta">Saved ${savedDateText}</p>` : ""}
                      </button>
                      <button class="star-btn favorited" data-remove-idea-id="${escapeHTML(fav.ideaId)}" aria-label="Remove from favorites">
                        <span aria-hidden="true">&#9733;</span>
                      </button>
                    </div>
                  `;
                })
                .join("")}
            </div>`
      }
    </div>
  `;

  wireTopBar(container, () => {}, onFavoritesClick);
  container.querySelector("#back-to-home-btn").addEventListener("click", onBack);

  container.querySelectorAll("[data-open-idea-id]").forEach((btn) => {
    btn.addEventListener("click", () => onOpen(btn.dataset.openIdeaId));
  });
  container.querySelectorAll("[data-remove-idea-id]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onRemove(btn.dataset.removeIdeaId);
    });
  });
}

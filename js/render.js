// js/render.js — All DOM creation/update functions, one per screen/component.
// Day 6: adds Project Roadmap & Tools (idea detail), loading, and error states.

import { STACK_OPTIONS } from "../data/stacks.js";

const DOMAIN_LABELS = {
  Web: "WEB",
  Mobile: "MOBILE",
  AI: "AI",
  DSA: "DSA",
};

export function renderInputForm(container, onSubmit) {
  container.innerHTML = `
    <div class="screen">
      <h1 class="app-title">Eager</h1>
      <p class="app-subtitle">Know what to build, in one click.</p>

      <form id="input-form" class="input-form">
        <fieldset class="form-group">
          <legend>Skill Level</legend>
          <div class="radio-row">
            <label class="radio-option">
              <input type="radio" name="skillLevel" value="Beginner" required />
              <span class="option-label">Beginner</span>
              <span class="check-icon">&#10003;</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="skillLevel" value="Intermediate" />
              <span class="option-label">Intermediate</span>
              <span class="check-icon">&#10003;</span>
            </label>
            <label class="radio-option">
              <input type="radio" name="skillLevel" value="Advanced" />
              <span class="option-label">Advanced</span>
              <span class="check-icon">&#10003;</span>
            </label>
          </div>
        </fieldset>

        <fieldset class="form-group">
          <legend>Tech Stack (select all that apply)</legend>
          <div class="checkbox-grid">
            ${STACK_OPTIONS.map(
              (stack) => `
              <label class="checkbox-option">
                <input type="checkbox" name="stack" value="${stack}" />
                <span class="option-label">${stack}</span>
                <span class="check-icon">&#10003;</span>
              </label>
            `
            ).join("")}
          </div>
          <p class="field-error" id="stack-error" hidden>Select at least one stack.</p>
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
        </fieldset>

        <button type="submit" class="btn-primary">
          <span>Find My Project</span>
          <span class="btn-arrow">&#8594;</span>
        </button>
      </form>
    </div>
  `;

  const form = container.querySelector("#input-form");
  const stackError = container.querySelector("#stack-error");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const selectedStacks = formData.getAll("stack");

    if (selectedStacks.length === 0) {
      stackError.hidden = false;
      return;
    }
    stackError.hidden = true;

    const userInputs = {
      skillLevel: formData.get("skillLevel"),
      selectedStacks,
      hoursPerWeek: Number(formData.get("hoursPerWeek")),
      totalWeeks: Number(formData.get("totalWeeks")),
    };

    onSubmit(userInputs);
  });
}

export function renderIdeaList(container, ideas, note, onCardClick, onEditInputs) {
  container.innerHTML = `
    <div class="screen">
      <div class="list-header">
        <button class="btn-link" id="edit-inputs-btn">&larr; Edit inputs</button>
        <h2 class="app-title-sm">Eager</h2>
      </div>

      <p class="results-count">${ideas.length} idea${ideas.length === 1 ? "" : "s"} match your inputs</p>
      ${note ? `<p class="results-note">${note}</p>` : ""}

      <div class="idea-list">
        ${ideas
          .map(
            (idea) => `
          <button class="idea-card" data-idea-id="${idea.id}">
            <span class="domain-tag domain-${idea.domain.toLowerCase()}">${DOMAIN_LABELS[idea.domain]}</span>
            <h3 class="idea-title">${idea.title}</h3>
            <p class="idea-hook">${idea.hook}</p>
            <p class="idea-meta">~${idea.estimatedWeeks} week${idea.estimatedWeeks === 1 ? "" : "s"}</p>
          </button>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  container.querySelector("#edit-inputs-btn").addEventListener("click", onEditInputs);

  container.querySelectorAll(".idea-card").forEach((card) => {
    card.addEventListener("click", () => {
      const ideaId = card.dataset.ideaId;
      onCardClick(ideaId);
    });
  });
}

export function renderLoading(container, onCancel) {
  container.innerHTML = `
    <div class="screen loading-screen">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">Personalizing your project brief…</p>
      <button class="btn-link" id="cancel-loading-btn">&larr; Back to results</button>
    </div>
  `;
  container.querySelector("#cancel-loading-btn").addEventListener("click", onCancel);
}

export function renderError(container, message, onRetry, onBack) {
  container.innerHTML = `
    <div class="screen error-screen">
      <h2 class="app-title-sm">Something went wrong</h2>
      <p class="error-text">${message}</p>
      <div class="error-actions">
        <button class="btn-primary" id="retry-btn">
          <span>Try Again</span>
        </button>
        <button class="btn-link" id="back-from-error-btn">&larr; Back to results</button>
      </div>
    </div>
  `;
  container.querySelector("#retry-btn").addEventListener("click", onRetry);
  container.querySelector("#back-from-error-btn").addEventListener("click", onBack);
}

export function renderIdeaDetail(container, idea, brief, onBack) {
  const mustHave = (brief.features && brief.features.mustHave) || [];
  const stretch = (brief.features && brief.features.stretch) || [];
  const roadmap = brief.roadmap || [];
  const folderStructure = brief.folderStructure || "";
  const resumeDescription = brief.resumeDescription || "";

  container.innerHTML = `
    <div class="screen">
      <button class="btn-link" id="back-to-list-btn">&larr; Back to results</button>

      <span class="domain-tag domain-${idea.domain.toLowerCase()}">${DOMAIN_LABELS[idea.domain]}</span>
      <h1 class="detail-title">${idea.title}</h1>
      <p class="detail-hook">${idea.hook}</p>

      <section class="detail-section">
        <h3 class="detail-section-title">Features</h3>
        <p class="detail-subheading">Must-Have</p>
        <ul class="feature-list">
          ${mustHave.map((f) => `<li>${f}</li>`).join("")}
        </ul>
        ${
          stretch.length > 0
            ? `<p class="detail-subheading">Stretch Goals</p>
               <ul class="feature-list">${stretch.map((f) => `<li>${f}</li>`).join("")}</ul>`
            : ""
        }
      </section>

      <section class="detail-section">
        <h3 class="detail-section-title">Folder Structure</h3>
        <pre class="folder-structure">${folderStructure}</pre>
      </section>

      <section class="detail-section">
        <h3 class="detail-section-title">Learning Roadmap</h3>
        <ol class="roadmap-list">
          ${roadmap.map((r) => `<li><strong>Week ${r.week}:</strong> ${r.focus}</li>`).join("")}
        </ol>
      </section>

      <section class="detail-section">
        <h3 class="detail-section-title">Resume Description</h3>
        <div class="resume-box">
          <p id="resume-text">${resumeDescription}</p>
          <button class="btn-link" id="copy-resume-btn">Copy</button>
        </div>
      </section>
    </div>
  `;

  container.querySelector("#back-to-list-btn").addEventListener("click", onBack);

  const copyBtn = container.querySelector("#copy-resume-btn");
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(resumeDescription).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
    });
  });
}

export function renderFavorites(container, favorites) {
  // Implemented Day 7.
}

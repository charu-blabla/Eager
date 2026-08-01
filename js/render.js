// js/render.js — All DOM creation/update functions, one per screen/component.
// Day 5: Skill Selection (input form) + Discover Project Ideas (idea list).
// Day 6/7 add Project Roadmap & Tools and My Saved Roadmaps.

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

export function renderIdeaDetail(container, personalizedBrief) {
  // Implemented Day 6.
}

export function renderFavorites(container, favorites) {
  // Implemented Day 7.
}

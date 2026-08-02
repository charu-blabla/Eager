// js/main.js — Entry point. Owns top-level app state and screen routing.
// Day 6: wires idea card clicks -> AI personalization -> detail view.

import { ideas } from "../data/ideas.js";
import { filterIdeas } from "./matching.js";
import { personalizeIdea } from "./ai.js";
import {
  renderInputForm,
  renderIdeaList,
  renderIdeaDetail,
  renderLoading,
  renderError,
} from "./render.js";

const appEl = document.getElementById("app");

let lastUserInputs = null;
let lastMatchedIdeas = [];
let lastNote = null;

function showInputForm() {
  renderInputForm(appEl, handleFormSubmit);
}

function handleFormSubmit(userInputs) {
  lastUserInputs = userInputs;
  const { ideas: matched, note } = filterIdeas(userInputs, ideas);
  lastMatchedIdeas = matched;
  lastNote = note;
  showIdeaList();
}

function showIdeaList() {
  renderIdeaList(appEl, lastMatchedIdeas, lastNote, handleCardClick, showInputForm);
}

async function handleCardClick(ideaId) {
  const idea = ideas.find((i) => i.id === ideaId);
  if (!idea) return;

  renderLoading(appEl, showIdeaList);

  try {
    const brief = await personalizeIdea(idea, lastUserInputs);
    renderIdeaDetail(appEl, idea, brief, showIdeaList);
  } catch (err) {
    renderError(
      appEl,
      err.message || "Something went wrong.",
      () => handleCardClick(ideaId),
      showIdeaList
    );
  }
}

showInputForm();

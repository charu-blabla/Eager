// js/main.js — Entry point. Owns top-level app state and screen routing.
// Day 7: adds Favorites view, Share (deep-link via URL param), and wires the
// star toggle used from both the idea list and the detail view.

import { ideas } from "../data/ideas.js";
import { filterIdeas } from "./matching.js";
import { personalizeIdea } from "./ai.js";
import { getFavorites, addFavorite, removeFavorite, isFavorited } from "./favorites.js";
import {
  renderInputForm,
  renderIdeaList,
  renderIdeaDetail,
  renderLoading,
  renderError,
  renderFavorites,
} from "./render.js";

const appEl = document.getElementById("app");
const ideasById = Object.fromEntries(ideas.map((i) => [i.id, i]));

let lastUserInputs = null;
let lastMatchedIdeas = [];
let lastNote = null;

function showInputForm() {
  renderInputForm(appEl, handleFormSubmit, showFavorites);
}

function handleFormSubmit(userInputs) {
  lastUserInputs = userInputs;
  const { ideas: matched, note } = filterIdeas(userInputs, ideas);
  lastMatchedIdeas = matched;
  lastNote = note;
  showIdeaList();
}

function showIdeaList() {
  renderIdeaList(appEl, lastMatchedIdeas, lastNote, handleCardClick, showInputForm, showFavorites, handleToggleStar);
}

function showFavorites() {
  const favorites = getFavorites();
  renderFavorites(appEl, favorites, ideasById, handleOpenFavorite, handleRemoveFavorite, showInputForm, showFavorites);
}

function handleOpenFavorite(ideaId) {
  const favorites = getFavorites();
  const fav = favorites.find((f) => f.ideaId === ideaId);
  const idea = ideasById[ideaId];
  if (!fav || !idea) return;

  // If this was starred straight from the list (before personalizing), the
  // cached snapshot only has a placeholder — generate the real brief now.
  const hasRealBrief = fav.personalizedSnapshot && fav.personalizedSnapshot.features;
  if (hasRealBrief) {
    renderIdeaDetail(appEl, idea, fav.personalizedSnapshot, showFavorites, showFavorites, handleToggleStar, handleShare);
    return;
  }

  generateAndCacheFavoriteBrief(idea);
}

async function generateAndCacheFavoriteBrief(idea) {
  const inputsForPersonalization = lastUserInputs || {
    skillLevel: idea.difficulty,
    selectedStacks: idea.suggestedStacks,
    hoursPerWeek: 5,
    totalWeeks: idea.estimatedWeeks,
  };

  renderLoading(appEl, showFavorites);
  try {
    const brief = await personalizeIdea(idea, inputsForPersonalization);
    addFavorite(idea.id, brief); // overwrites the placeholder with the real brief
    renderIdeaDetail(appEl, idea, brief, showFavorites, showFavorites, handleToggleStar, handleShare);
  } catch (err) {
    renderError(appEl, err.message || "Something went wrong.", () => generateAndCacheFavoriteBrief(idea), showFavorites);
  }
}

function handleRemoveFavorite(ideaId) {
  removeFavorite(ideaId);
  showFavorites();
}

function handleToggleStar(ideaId, btnEl, context) {
  if (isFavorited(ideaId)) {
    removeFavorite(ideaId);
  } else {
    const idea = ideasById[ideaId];
    const snapshot = (context && context.brief) || null;
    if (snapshot) {
      addFavorite(ideaId, snapshot);
    } else {
      // Favorited straight from the list, before personalizing — store idea
      // basics only; opening it later from Favorites will show what we have.
      addFavorite(ideaId, { resumeDescription: idea ? idea.hook : "" });
    }
  }

  // Re-render the current screen's star button state without a full reload.
  if (btnEl) {
    const nowFav = isFavorited(ideaId);
    btnEl.classList.toggle("favorited", nowFav);
    btnEl.setAttribute("aria-pressed", String(nowFav));
    btnEl.querySelector("span") &&
      (btnEl.querySelector("span").innerHTML = nowFav ? "&#9733;" : "&#9734;");
  }
}

async function handleCardClick(ideaId) {
  const idea = ideasById[ideaId];
  if (!idea) return;

  renderLoading(appEl, showIdeaList);

  try {
    const brief = await personalizeIdea(idea, lastUserInputs);
    renderIdeaDetail(appEl, idea, brief, showIdeaList, showFavorites, handleToggleStar, handleShare);
  } catch (err) {
    renderError(appEl, err.message || "Something went wrong.", () => handleCardClick(ideaId), showIdeaList);
  }
}

function handleShare(ideaId, showToast) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("idea", ideaId);

  navigator.clipboard
    .writeText(url.toString())
    .then(() => showToast("Link copied!"))
    .catch(() => showToast("Could not copy — copy the URL bar manually."));
}

async function tryOpenSharedIdea() {
  const params = new URLSearchParams(window.location.search);
  const sharedIdeaId = params.get("idea");
  if (!sharedIdeaId) return false;

  const idea = ideasById[sharedIdeaId];
  if (!idea) return false;

  // If it's already favorited, we have a cached brief — use it instantly.
  const favorites = getFavorites();
  const fav = favorites.find((f) => f.ideaId === sharedIdeaId);
  if (fav && fav.personalizedSnapshot && fav.personalizedSnapshot.features) {
    renderIdeaDetail(appEl, idea, fav.personalizedSnapshot, showInputForm, showFavorites, handleToggleStar, handleShare);
    return true;
  }

  // Otherwise personalize it fresh, using neutral default inputs since the
  // sharer's original inputs aren't part of the link (kept simple for v1.0).
  lastUserInputs = {
    skillLevel: idea.difficulty,
    selectedStacks: idea.suggestedStacks,
    hoursPerWeek: 5,
    totalWeeks: idea.estimatedWeeks,
  };
  renderLoading(appEl, showInputForm);
  try {
    const brief = await personalizeIdea(idea, lastUserInputs);
    renderIdeaDetail(appEl, idea, brief, showInputForm, showFavorites, handleToggleStar, handleShare);
  } catch (err) {
    renderError(appEl, err.message || "Something went wrong.", () => tryOpenSharedIdea(), showInputForm);
  }
  return true;
}

async function init() {
  const openedSharedIdea = await tryOpenSharedIdea();
  if (!openedSharedIdea) {
    showInputForm();
  }
}

init();

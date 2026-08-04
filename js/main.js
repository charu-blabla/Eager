// js/main.js — Entry point. Owns top-level app state and screen routing.
// Day 8: guards against double-click races on personalization requests,
// otherwise unchanged from Day 7's wiring.

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
let isPersonalizing = false; // guards against double-click firing concurrent requests

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

  const hasRealBrief = fav.personalizedSnapshot && fav.personalizedSnapshot.features;
  if (hasRealBrief) {
    renderIdeaDetail(appEl, idea, fav.personalizedSnapshot, showFavorites, showFavorites, handleToggleStar, handleShare);
    return;
  }

  generateAndCacheFavoriteBrief(idea);
}

async function generateAndCacheFavoriteBrief(idea) {
  if (isPersonalizing) return;
  isPersonalizing = true;

  const inputsForPersonalization = lastUserInputs || {
    skillLevel: idea.difficulty,
    selectedStacks: idea.suggestedStacks,
    hoursPerWeek: 5,
    totalWeeks: idea.estimatedWeeks,
  };

  renderLoading(appEl, showFavorites);
  try {
    const brief = await personalizeIdea(idea, inputsForPersonalization);
    addFavorite(idea.id, brief);
    renderIdeaDetail(appEl, idea, brief, showFavorites, showFavorites, handleToggleStar, handleShare);
  } catch (err) {
    renderError(appEl, err.message || "Something went wrong.", () => generateAndCacheFavoriteBrief(idea), showFavorites);
  } finally {
    isPersonalizing = false;
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
      addFavorite(ideaId, { resumeDescription: idea ? idea.hook : "" });
    }
  }

  if (btnEl) {
    const nowFav = isFavorited(ideaId);
    btnEl.classList.toggle("favorited", nowFav);
    btnEl.setAttribute("aria-pressed", String(nowFav));
    const span = btnEl.querySelector("span");
    if (span) span.innerHTML = nowFav ? "&#9733;" : "&#9734;";
  }
}

async function handleCardClick(ideaId) {
  if (isPersonalizing) return; // ignore rapid double-clicks on different/same cards
  const idea = ideasById[ideaId];
  if (!idea) return;

  isPersonalizing = true;
  renderLoading(appEl, showIdeaList);

  try {
    const brief = await personalizeIdea(idea, lastUserInputs);
    renderIdeaDetail(appEl, idea, brief, showIdeaList, showFavorites, handleToggleStar, handleShare);
  } catch (err) {
    renderError(appEl, err.message || "Something went wrong.", () => {
      isPersonalizing = false;
      handleCardClick(ideaId);
    }, showIdeaList);
  } finally {
    isPersonalizing = false;
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

  const favorites = getFavorites();
  const fav = favorites.find((f) => f.ideaId === sharedIdeaId);
  if (fav && fav.personalizedSnapshot && fav.personalizedSnapshot.features) {
    renderIdeaDetail(appEl, idea, fav.personalizedSnapshot, showInputForm, showFavorites, handleToggleStar, handleShare);
    return true;
  }

  lastUserInputs = {
    skillLevel: idea.difficulty,
    selectedStacks: idea.suggestedStacks,
    hoursPerWeek: 5,
    totalWeeks: idea.estimatedWeeks,
  };
  isPersonalizing = true;
  renderLoading(appEl, showInputForm);
  try {
    const brief = await personalizeIdea(idea, lastUserInputs);
    renderIdeaDetail(appEl, idea, brief, showInputForm, showFavorites, handleToggleStar, handleShare);
  } catch (err) {
    renderError(appEl, err.message || "Something went wrong.", () => {
      isPersonalizing = false;
      tryOpenSharedIdea();
    }, showInputForm);
  } finally {
    isPersonalizing = false;
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

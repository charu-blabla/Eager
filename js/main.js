// js/main.js — Entry point. Owns top-level app state and screen routing.
// Day 5: wires InputForm -> matching.js -> IdeaList. Day 6/7 add the rest.

import { ideas } from "../data/ideas.js";
import { filterIdeas } from "./matching.js";
import { renderInputForm, renderIdeaList } from "./render.js";

const appEl = document.getElementById("app");

let lastUserInputs = null;

function showInputForm() {
  renderInputForm(appEl, handleFormSubmit);
}

function handleFormSubmit(userInputs) {
  lastUserInputs = userInputs;
  const { ideas: matched, note } = filterIdeas(userInputs, ideas);
  renderIdeaList(appEl, matched, note, handleCardClick, showInputForm);
}

function handleCardClick(ideaId) {
  // Day 6 wires this to AI personalization + the detail view.
  console.log("Clicked idea:", ideaId, "with inputs:", lastUserInputs);
}

showInputForm();

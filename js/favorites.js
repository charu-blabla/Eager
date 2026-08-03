// js/favorites.js — All localStorage reads/writes for favorites.
// Schema locked in SCHEMA.md — key: "eager_favorites", array of
// { ideaId, favoritedAt, personalizedSnapshot }.

const STORAGE_KEY = "eager_favorites";

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    return true;
  } catch {
    return false;
  }
}

export function getFavorites() {
  return readAll();
}

export function addFavorite(ideaId, personalizedSnapshot) {
  const favorites = readAll();
  const existing = favorites.find((f) => f.ideaId === ideaId);
  const favoritedAt = existing ? existing.favoritedAt : new Date().toISOString();
  const updated = [
    ...favorites.filter((f) => f.ideaId !== ideaId),
    { ideaId, favoritedAt, personalizedSnapshot },
  ];
  writeAll(updated);
  return updated;
}

export function removeFavorite(ideaId) {
  const favorites = readAll();
  const updated = favorites.filter((f) => f.ideaId !== ideaId);
  writeAll(updated);
  return updated;
}

export function isFavorited(ideaId) {
  return readAll().some((f) => f.ideaId === ideaId);
}

// js/main.js — Entry point. Owns top-level app state and screen routing.
// Today (Day 3): just proves the page loads and JS is wired up correctly.
// Day 5 onward: this file wires matching.js -> render.js -> ai.js -> favorites.js
// together into the real screen flow described in UI-WIREFRAMES.md.

const appEl = document.getElementById('app');

function renderHelloWorld() {
  appEl.innerHTML = `
    <h1>Eager</h1>
    <p>Foundation is running. Real screens start Day 5.</p>
  `;
}

renderHelloWorld();

// js/matching.js — Pure filtering logic, no DOM code.
// Filters the 40-idea bank against user inputs (FR-5), with progressive
// fallback when there are zero exact matches (FR-7), per Blueprint Day 5:
// loosen time-fit first, then stack overlap, then skill level last.

export function filterIdeas(userInputs, ideas) {
  const { skillLevel, selectedStacks, totalWeeks } = userInputs;

  const skillMatches = (idea) => idea.difficulty === skillLevel;
  const stackMatches = (idea) =>
    idea.suggestedStacks.some((s) => selectedStacks.includes(s));
  const timeFits = (idea) => idea.estimatedWeeks <= totalWeeks;

  // 1. Full match: skill + stack + time
  let matched = ideas.filter(
    (i) => skillMatches(i) && stackMatches(i) && timeFits(i)
  );
  if (matched.length > 0) {
    return { ideas: matched, note: null };
  }

  // 2. Loosen time-fit
  matched = ideas.filter((i) => skillMatches(i) && stackMatches(i));
  if (matched.length > 0) {
    return {
      ideas: matched,
      note: "No exact matches — showing ideas that may take longer than your available time.",
    };
  }

  // 3. Loosen stack overlap
  matched = ideas.filter((i) => skillMatches(i));
  if (matched.length > 0) {
    return {
      ideas: matched,
      note: "No stack matches — showing all ideas at your skill level.",
    };
  }

  // 4. Last resort: loosen skill level too, return everything
  return {
    ideas: ideas,
    note: "No exact matches — showing closest results across all ideas.",
  };
}

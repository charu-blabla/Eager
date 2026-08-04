// js/ai.js — All communication with /api/personalize (never calls Anthropic/Gemini directly).
// Day 8: distinguishes network-level failures (offline, DNS, etc.) from HTTP
// error responses, so the user sees an accurate, friendly message either way.

export async function personalizeIdea(idea, userInputs) {
  let response;
  try {
    response = await fetch("/api/personalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea, userInputs }),
    });
  } catch (networkErr) {
    const error = new Error(
      navigator.onLine
        ? "Couldn't reach the server. Please try again."
        : "You appear to be offline. Check your connection and try again."
    );
    error.status = 0;
    throw error;
  }

  if (!response.ok) {
    let message = "Something went wrong generating your brief. Please try again.";
    try {
      const errBody = await response.json();
      if (errBody && errBody.message) message = errBody.message;
    } catch {
      // response wasn't JSON — keep the default message
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return response.json();
}

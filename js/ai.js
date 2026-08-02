// js/ai.js — All communication with /api/personalize (never calls Anthropic directly).

export async function personalizeIdea(idea, userInputs) {
  const response = await fetch("/api/personalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, userInputs }),
  });

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

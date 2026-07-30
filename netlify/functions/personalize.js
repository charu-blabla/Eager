// netlify/functions/personalize.js
// The ONLY server-side code in this project. Its whole job: hold the
// ANTHROPIC_API_KEY safely and proxy personalization requests, so the key
// never reaches the browser. See ARCHITECTURE.md and API.md for the full contract.
//
// TODAY (Day 3): returns hardcoded fake data so the full request path —
// browser -> Netlify Function -> response -> browser — can be proven end to end
// before any real AI logic exists.
// DAY 6: this stub gets replaced with real validation + a real Anthropic API call.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'method_not_allowed' }),
    };
  }

  // Day 3 placeholder response — matches the shape defined in API.md
  // so Day 6 only has to swap the fake data for a real Anthropic call.
  const fakeResponse = {
    features: {
      mustHave: ['Placeholder feature — real AI response arrives Day 6'],
      stretch: [],
    },
    folderStructure: 'placeholder/\n  index.html\n',
    roadmap: [{ week: 1, focus: 'Placeholder roadmap entry' }],
    resumeDescription: 'Placeholder resume description.',
  };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fakeResponse),
  };
};

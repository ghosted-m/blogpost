// Optional summarizer using OpenAI's API (text-davinci or chat completions).
// This file will only be used if OPENAI_API_KEY and SUMMARIZE=true are set.
const fetch = require('node-fetch');

async function summarizeText(text, openaiKey) {
  if (!openaiKey) return null;
  try {
    const prompt = `Summarize the following article in 2-3 sentences:\n\n${text.slice(0, 3000)}`;
    const res = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.3,
        max_tokens: 120
      })
    });
    const data = await res.json();
    const summary = data?.choices?.[0]?.text?.trim();
    return summary || null;
  } catch (err) {
    console.warn('summarizeText error', err.message || err);
    return null;
  }
}

module.exports = { summarizeText };

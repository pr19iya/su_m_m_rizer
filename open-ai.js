const OpenAI = require("openai").default;
const API_KEY = process.env.OPEN_AI_API_KEY;

module.exports = new OpenAI({
  apiKey: API_KEY,
});

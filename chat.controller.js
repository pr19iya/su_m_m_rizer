const { chatConstants, roles } = require("../constants");
const openAi = require("../services/open-ai");
const { getOpenAPIErrorMessage } = require("../utils");

exports.askChat = async (req, res) => {
  try {
    const { messages, type } = req.body;
    const promptMessages = [
      {
        role: roles.SYSTEM,
        content: "You are a great assistant.",
      },
    ];
    if (type === chatConstants.NEW) {
      if (messages && messages.length) {
        promptMessages.push(...messages);
      }
    } else {
      if (!messages) {
        throw new Error("Please provide valid messages");
      }
      promptMessages.push(...messages);
    }

    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: promptMessages,
      temperature: 0.1,
      max_tokens: 100,
    });

    res.json({
      status: "success",
      data: response.choices[0].message,
    });
  } catch (error) {
    const message = getOpenAPIErrorMessage(error.status);
    res.json({
      status: "failure",
      message: message || error.message || "Something Went Wrong",
    });
  }
};

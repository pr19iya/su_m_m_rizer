const { default: puppeteer } = require("puppeteer");
const { summarizeConstants } = require("../constants");
const openAi = require("../services/open-ai");
const { getOpenAPIErrorMessage } = require("../utils");

exports.summarizeContent = async (req, res) => {
  try {
    const { content, type } = req.body;
    let prompt = [];
    if (type === summarizeConstants.KEY_POINTS) {
      prompt = [
        {
          role: "system",
          content: "Give me 5 major points for the provide content",
        },
      ];
    } else {
      prompt = [
        {
          role: "system",
          content: "Summarize the content you are provided within 100 words",
        },
      ];
    }

    if (content && content.length) {
      prompt.push({
        role: "user",
        content: content,
      });
    } else {
      throw new Error("Please provide valid content");
    }
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompt,
      temperature: 0.5,
      max_tokens: 1024,
    });
    res.json({
      status: "success",
      data: response.choices[0].message,
    });
  } catch (err) {
    const message = getOpenAPIErrorMessage(err.status);
    res.json({
      status: "failure",
      message: message || err.message || "Something Went Wrong!",
    });
  }
};

exports.summarizeWebpage = async (req, res) => {
  try {
    const { url } = req.query;
    if (url) {
      const isValid = new URL(url);
      if (!isValid) {
        throw new Error("Please provide valid url");
      }
    } else {
      throw new Error("Please provide an url");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector("body");

    const data = await page.evaluate(() => {
      let content = document.body.innerText;
      return {
        content,
      };
    });

    await browser.close();

    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Summarize this webpage in max of 200 words: ${data.content}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1024,
    });
    res.json({
      status: "success",
      message: "success",
      data: response.choices[0].message,
    });
  } catch (error) {
    const message = getOpenAPIErrorMessage(error.status);
    res.json({
      status: "failure",
      message: message || err.message || "Something Went Wrong!",
    });
  }
};

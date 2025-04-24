# Summarizer

Summarizer is a Chrome extension that helps you get a summary and the major points from a webpage or any given content. It uses the power of OpenAI's GPT-3 model to provide concise summaries of large pieces of text, making it easier for you to digest information quickly and efficiently.

## Features

1. Selection Overlay: Summarizer provides a selection overlay feature where you can select text from any webpage. Once text is selected, you can get a summary of the selected content right on the overlay.

2. Sidebar: Summarizer includes a sidebar feature where you can chat and get the summary of an entire webpage. This makes it easy to get a quick overview of a page's content without having to read through every detail.

3. Chat GPT: This whole project is based on OpenAI's Chat GPT. We use OpenAI's chat completion API to generate the summaries, providing high-quality, contextually relevant summaries of the content.

## Requirements

- Node.js (minimum version 18)

## Setting Up Environment Variables

To set up environment variables for the Summarizer project, you will need to create a `.env` file in the root directory of the project. This file should be based on the provided `.env.sample` file.

Follow these steps to set up your environment variables:

1. Duplicate the `.env.sample` file: In the root directory of the project, make a copy of the `.env.sample` file and rename it to `.env`.

2. Fill in the values: Open the new `.env` file and replace the placeholder values with your actual values. Each line in the `.env` file represents a separate environment variable. The variable name is on the left of the equals sign (`=`) and the variable value is on the right.

3. Save and close the `.env` file: Once you've filled in all the values, save and close the `.env` file. The application will now use these values as your environment variables when running.

## Running the Project

To run the project on your local machine, follow these steps:

1. Clone the repository.
2. Run the command to install dependencies and build the project (this command will be specific to your project, for example: `yarn install && yarn run build`).
3. Open Chrome and navigate to the Manage Extensions page (`chrome://extensions`).
4. Enable "Developer Mode" in the top right corner.
5. Click "Load unpacked" and select the `dist` folder of the generated build.
6. At last run: `yarn run start-server` and `yarn run start-dev-server` to run the server.

## Usage Instructions

Link for the video -> [demo](https://drive.google.com/file/d/1FI4Alh_5PmLUv9xv5WpCVFvwzSacFy4N/view?usp=sharing)

Please note that as this is a Chrome extension, it can only be used in the Google Chrome browser. To use the extension on a page, navigate to the page and click on the Summarizer icon in your extensions toolbar.

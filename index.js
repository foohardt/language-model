/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/**
 *
 * This code was originally taken from TensorFlow.js Example: LSTM Text Generation (see above license text).
 * For current purpose the code original code  was modified and split over index.js and text-generator.js.
 * Code which was not used, has been removed.
 */

import * as tf from "@tensorflow/tfjs";

import { TEXT_DATA_URLS, TextData } from "./data";
import { SaveableLSTMTextGenerator } from "./text-generator";

// UI controls.
const testText = document.getElementById("test-text");
const seedTextInput = document.getElementById("seed-text");
const seedTextWarning = document.getElementById("seed-text-warning");
const predictionTypeRadio = document.getElementById("prediction-type-radio");
const generateLengthInput = document.getElementById("generate-length-input");
const generatedTextInput = document.getElementById("generated-text");
const generatedTextSpinner = document.getElementById("generated-text-spinner");
generatedTextSpinner.style.display = "none";
const sampleLen = 60;
const sampleStep = 3;
let generateLength;

// Type of prediction (next word (0)/sentence (1))
let predictionType = 0;

// Timer used to determine user input
let keyDownTimer;

// Module-global instance of TextData.
let textData;

// Module-global instance of SaveableLSTMTextGenerator.
let textGenerator;

/**
 * Function to load text data and text generator
 * @returns
 */

async function createTextData() {
  let dataIdentifier = "nietzsche"; //textDataSelect.value;
  const url = TEXT_DATA_URLS[dataIdentifier].url;
  if (true /* testText.value.length === 0 */) {
    try {
      console.debug(`Loading text data from URL: ${url} ...`);
      const response = await fetch(url);
      const textString = await response.text();
      testText.value = textString;
      console.debug(
        `Done loading text data ` +
          `(length=${(textString.length / 1024).toFixed(1)}k). ` +
          `Next, please load or create model.`
      );
    } catch (err) {
      console.error("Failed to load text data: " + err.message);
    }
    if (testText.value.length === 0) {
      console.error("ERROR: Empty text data.");
      return;
    }
  } else {
    dataIdentifier = hashCode(testText.value);
  }

  textData = new TextData(
    dataIdentifier,
    testText.value,
    sampleLen,
    sampleStep
  );
}

/**
 * Function to create Text Generator
 */

function createTextGenerator() {
  textGenerator = new SaveableLSTMTextGenerator(textData);
  textGenerator.loadModel();
}

/**
 * A function to call when text generation begins.
 *
 * @param {string} seedSentence: The seed sentence being used for text
 *   generation.
 */
export function onTextGenerationBegin() {
  seedTextInput.disabled = true;
  generatedTextInput.value = "";
  console.log("Generating text...");
  generatedTextSpinner.style.display = "block";
}

function onTextGenerationEnd() {
  seedTextInput.disabled = false;
  generatedTextSpinner.style.display = "none";
}

/**
 * A function to call each time a character is obtained during text generation.
 *
 * @param {string} char The just-generated character.
 */
export async function onTextGenerationChar(char) {
  generatedTextInput.value += char;
  generatedTextInput.scrollTop = generatedTextInput.scrollHeight;
  const charCount = generatedTextInput.value.length;

  await tf.nextFrame();
}

async function run() {
  document.getElementById("predictionTypeRadio0").checked = true;
  generateLength = 20;
  generateLengthInput.value = 20;

  await createTextData();
  createTextGenerator();

  /**
   * Use `textGenerator` to generate random text, show the characters on the
   * screen as they are generated one by one.
   */

  async function generateText() {
    try {
      if (textGenerator == null) {
        console.error("ERROR: Please load text data set first.");
        return;
      }

      const temperature = 0.6; // parseFloat(temperatureInput.value);
      if (!(generateLength > 0)) {
        console.error(
          `ERROR: Invalid generation length: ${generateLength}. ` +
            `Generation length must be a positive number.`
        );
        return;
      }
      if (!(temperature > 0 && temperature <= 1)) {
        console.error(
          `ERROR: Invalid temperature: ${temperature}. ` +
            `Temperature must be a positive number.`
        );
        return;
      }

      let seedSentence;
      let seedSentenceIndices;
      if (seedTextInput.value.length === 0) {
        console.error(`ERROR: Seed text cant have a length of 0.`);
      } else {
        seedSentence = seedTextInput.value;
        if (seedSentence.length < textData.sampleLen()) {
          seedTextWarning.style.color = "red";
          seedTextWarning.innerText = `${
            seedSentence.length
          }/${textData.sampleLen()} `;
          console.error(
            `ERROR: Seed text must have a length of at least ` +
              `${textData.sampleLen()}, but has a length of ` +
              `${seedSentence.length}.`
          );
          return;
        }
        seedTextWarning.style.color = "green";
        seedTextWarning.innerText = `${
          seedSentence.length
        }/${textData.sampleLen()} `;

        seedSentence = seedSentence.slice(
          seedSentence.length - textData.sampleLen(),
          seedSentence.length
        );
        seedSentenceIndices = textData.textToIndices(seedSentence);
      }

      const sentence = await textGenerator.generateText(
        seedSentenceIndices,
        generateLength,
        temperature
      );

      generatedTextInput.value = sentence;

      console.info("Sentence", sentence);
      let splitted = sentence.split(" ");
      console.log(splitted);
      const nextWord = splitted[0].length === 0 ? splitted[1] : splitted[0];
      console.info("Next word", nextWord);

      predictionType == 0 || undefined
        ? (seedTextInput.value = seedTextInput.value + " " + nextWord)
        : (seedTextInput.value = seedTextInput.value + " " + sentence);

      //seedTextInput.value = seedTextInput.value + " " + nextWord;
      onTextGenerationEnd();
      return sentence;
    } catch (err) {
      console.error(
        `ERROR: Failed to generate text: ${err.message}, ${err.stack}`
      );
    }
  }

  async function handleKeyDown() {
    if (keyDownTimer) {
      clearTimeout(keyDownTimer);
      keyDownTimer = setTimeout(await generateText, 1000);
    } else {
      keyDownTimer = setTimeout(await generateText, 1000);
    }
  }

  seedTextInput.addEventListener("keydown", async () => {
    if (textGenerator == null) {
      console.error("ERROR: Load text data set first.");
      return;
    }
    handleKeyDown();
  });

  predictionTypeRadio.addEventListener("change", async () => {
    const radios = document.getElementsByName("inlineRadioOptions");
    let index;
    for (let radio of radios) {
      if (radio.checked) {
        index = +radio.value;
      }
    }
    predictionType = index;
  });

  generateLengthInput.addEventListener("change", () => {
    generateLength = generateLengthInput.value;
  })

  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltipList = [...tooltipTriggerList].map(
    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
  );
}

run();

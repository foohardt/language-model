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
const generatedTextInput = document.getElementById("generated-text");

const sampleLen = 40;
const sampleStep = 3;

// Module-global instance of TextData.
let textData;

// Module-global instance of SaveableLSTMTextGenerator.
let textGenerator;

/**
 * A function to call when text generation begins.
 *
 * @param {string} seedSentence: The seed sentence being used for text
 *   generation.
 */
export function onTextGenerationBegin() {
  generatedTextInput.value = "";
  // logStatus('Generating text...');
  console.log("Generating text...");
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
  const generateLength = 10; //parseInt(generateLengthInput.value);
  const status = `Generating text: ${charCount}/${generateLength} complete...`;
  await tf.nextFrame();
}

export function run() {
  console.debug("Started text generator");
  loadTestText();

  /**
   * Use `textGenerator` to generate random text, show the characters on the
   * screen as they are generated one by one.
   */

  async function generateText() {
    try {
      // disableModelButtons();

      if (textGenerator == null) {
        console.error("ERROR: Please load text data set first.");
        // logStatus('ERROR: Please load text data set first.');
        return;
      }
      const generateLength = 10; //parseInt(generateLengthInput.value);
      const temperature = 0.5; // parseFloat(temperatureInput.value);
      if (!(generateLength > 0)) {
        console.error(
          `ERROR: Invalid generation length: ${generateLength}. ` +
            `Generation length must be a positive number.`
        );
        enableModelButtons();
        return;
      }
      if (!(temperature > 0 && temperature <= 1)) {
        console.error(
          `ERROR: Invalid temperature: ${temperature}. ` +
            `Temperature must be a positive number.`
        );
        enableModelButtons();
        return;
      }

      let seedSentence;
      let seedSentenceIndices;
      if (seedTextInput.value.length === 0) {
        // Seed sentence is not specified yet. Get it from the data.
        [seedSentence, seedSentenceIndices] = textData.getRandomSlice();
        seedTextInput.value = seedSentence;
      } else {
        seedSentence = seedTextInput.value;
        if (seedSentence.length < 0 /* textData.sampleLen() */) {
          console.error(
            `ERROR: Seed text must have a length of at least ` +
              `${textData.sampleLen()}, but has a length of ` +
              `${seedSentence.length}.`
          );
          enableModelButtons();
          return;
        }

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

      console.log(sentence);
      let splitted = sentence.split(" ");
      console.log(splitted[0]);
      //return sentence;
    } catch (err) {
      console.error(
        `ERROR: Failed to generate text: ${err.message}, ${err.stack}`
      );
    }
  }

  async function loadTestText() {
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
    textGenerator = new SaveableLSTMTextGenerator(textData);
    textGenerator.loadModel();
  }

  seedTextInput.addEventListener("keydown", async () => {
    if (textGenerator == null) {
      console.error("ERROR: Load text data set first.");
      return;
    }
    await generateText();
  });
}

run();
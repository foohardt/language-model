# Text Prediction using a LSTM Language model

## Introduction

This repository contains an experimental simulator for characer based text generation using a LSTM network.

## Usage
- Open <a href="http://public.beuth-hochschule.de/~s85393/deep-learning/language-model/" target="_blank" rel="noopener noreferrer">Language Model</a> in web browser
- Start typing text in text area "Seed Text"
- The model requires at least 60 characters beeing able to make prediction on the seed text
- When done typing (at least 60 characters) stop typing and wait for model prediction
- As output of the model the first word of the prediction is concatenated to the users seed text
- Continue typing and let the model continuously predict and add words to your text
- When user stops typing, the app waits for 1s until the model starts predicting and adding text
- During prediction the text area containing seed text is disabled for user input
- You can choose between next word or next sentence prediction using radio buttons below seed text area

## Technical Documentation

This section provides an overview about the technical setup of the project. Project depedencies are listed and crucial components, functions and attributes are explained.

### Local Usage 

- Clone repository
- Open terminal and navigate to project root folder
- In project root folder type `yarn && yarn watch`

### Dependencies

This section contains a list of all project dependencies. 

Name | Description | Reference |
--- | --- | --- | 
| Bootstrap | Bootstrap is a CSS library including JavsScript to style user interfaces and to create user interaction. Within this project Bootstrap v5.2 is used to style user interface and components in a convenient way, and also to add tooltips for context sensitive help | https://getbootstrap.com/ |
| Tensorflow.js | Tensorflow.js makes deep learning available in the browser or within Node.js. In this project it used for model creating, persistence, training and evaluation | https://www.tensorflow.org/js |
| Tensorflow.js VIS| Tensorflow.js VIS is a library to create UI helpers to be used with tensorflow.js. Within this project it is used for visualization of data, model, training and evaluation | https://js.tensorflow.org/api_vis/latest/|

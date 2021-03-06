# Text Prediction using a LSTM Language model

## Introduction

This repository contains an experimental simulator for character based text generation using a LSTM network. It is inspired by the TensorFlow.js LSTM text generation example.

### Overview

The text generator uses a pre-trained LSTM model using tensorflow.js layers API, which is fetched from a given URL and loaded every time the application is loaded. The LSTM model consists of 128 layers and was trainied for 200 epochs on an english written text from Nietzsche (the text can be found within the application). The number of neurons in each layers corresponds to the unique characters in the text it was trainied on, which is 84. As activation function softmax was used and as optimizer categorical cross entropy was used.

### How does it work

The text generation is done at the character level. Therefore the model takes an input tensor of shape [number of examples, sample length, char set size] as one-hot encoding of sequences of characters according to sample length. The characters in the sequences belong to an amount of unique characters with length according to char set size.

Based on the input tensor the model outputs a tensor of shape [number of examples, char set size]. This output tensor represents the model's predicted propabilities of the characters following the input sequence. Based on the models output propabilities the text generator draws a random sample based on the predicted propabilities, which is used to get the next character. When the next character is obtained it is one-hot encoded and concatenated with the previous input sequence to form the input tensor for the next prediction step. This process is repeteated until characters of a given length have been generated. 

### Usage
- Open <a href="http://public.beuth-hochschule.de/~s85393/deep-learning/language-model/" target="_blank" rel="noopener noreferrer">Language Model</a> in web browser
- Start typing text in text area "Seed Text"
- The model requires at least 60 characters beeing able to make prediction on the seed text
- When done typing (at least 60 characters) stop typing and wait for model prediction
- As output of the model the first word of the prediction is concatenated to the users seed text
- Continue typing and let the model continuously predict and add words to your text
- When user stops typing, the app waits for 1s until the model starts predicting and adding text
- During prediction the text area containing seed text is disabled for user input
- You can choose between next word or next sentence prediction using radio buttons below seed text area
- Choose length of generated text by entering a positive number in according input

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
| Yarn | Yarn is a package manager and is used to manage the project's dependencies | https://yarnpkg.com/ | 
| Parcel |  Parcel is a bundler and is used to run the project in local development mode and build the project's static assets for production environment | https://parceljs.org/ |

### Modules

This section contains an overview about the project's javascript modules.

Name | Description | 
--- | --- | 
index.js | Entrypoint for javascript files. Creates instance of TextData. Loads pre-trained model and wires up user interface for user model interaction | 
data.js | Contains class TextData, which is used to create reference text data object for model. Text data object contains functions to draw samples and create text indicies for input tensor creation | 
model.js | Contains function to generate text. Also contains functions to create and compile model | 
| text-generator.js | Contains class LSTMTextGenerator which can be used to create model instances including functions and fit model, and to generate text. Also contains class SaveableLSTMTextGenerator which contains functions to store instance of LSTMTextGenerator | 

### Functions

This section contains an overview about the project's crucials functions used for text generation.

#### index.js
Name | Description
--- | --- |
run() | Wires up user interface and calls functions to load ressources required for text generation |
createTextData()| Creates instance of TextData and fetches text string used for reference |
createTextGenerator() | Creates an instance of SaveableLSTMTextGenerator and loades pre-trained model |
generateText() | Handles text generation. Calls functions to create tokens from seed text and calls model to generate text |

#### data.js
Name | Description
--- | --- |
textToIndices() | Converts text strings to integer indices |
getFromCharSet() | Gets unique character at given index from charset |
getCharSet_() | Gets set of unique characters from training data |  

#### model.js
Name | Description
--- | --- |
generateText() | Generates text based on models prediction for character occurance probabilities |

#### text-generator.js
Name | Description
--- | --- |
generateText() | Calls model to generate text |
loadModel() | Loads pre-trained model from given URL |

## Experiments & Results

### Training
The model was trained with 2, 10, 20, 50, 100, 150 and 200 epochs. Up to 50 epochs, it could be observed that the trained model generated only contentless unrelated characters. Only from 100 epochs on, a kind of grammatical structure was recognizable in the prediction of the model and the first meaningful words were generated. After training over 150 epochs, the grammar and meaning in the model predictions became clearer and meaningful words and coherent content were formed. Also the specific writing style of the Nietzsche text became recognizable. The best result was achieved with 200 epochs. A training with a higher number of epochs was not carried out, since the training with 200 epochs already took a little more than six hours.

### Sentences 
With the present simulator it is possible to generate text based on user input with an artificial neural network. The model was trained with an english text by nietzsche. The text has a specific mode of expression that the model can imitate to a certain extent. The model is also able to write grammatically correct and coherent sentences to a limited extent. In the following example, a partial sentence from nietzsche's text, with which the model was originally trained, was used as the seed text:

"They all pose as though their real opinions had been discovered and attained through the self-evolving of a cold in the [...]"

In three attempts to continue the second part of the sentence with a length of 100 characters based on the above seed text, the model generated the following texts:

1. "of mistance that is also it was love and the expreparing spiritual manifestly seek be so much there"
2. "ir philosophy, is amand the advances of the order had not be man! Morlovely makes all the advance,"
3. "truth had been stupidity, of the society, and constant patic that is the consequent be in its not o"

### Next Word
With the present simulator it is also possible to predict the next word of an user input. To do so, the text generator selects the next full word predicted by the model and concatenates it with the user input. The model does not always succeed in predicting grammatically correct and meaningful words, but it does so regularly and to a limited extent. In the following example, a user input was used and an attempt was made to predict the word "car". The following sentence was used as seed text:

"Marcus has got a car. Marcus really likes his car. His car is very important. Everyday Marcus rides his"

1. "things"
2. "philosphy"
3. "mark"

It is interesting that the model in all three attemps predicted a noun for the next, although this effect was probably be rather random. In no case did the model predict the correct word "car". This effect was observed regardless of how often the word "car" appeared in the seed text.

### Conclusion
In the present experiment, it was proven that text can be generated with an LSTM network. For this purpose, a model was trained with an English text by Nietzsche. As a result, the model was able to generate text based on user input in the specific writing style of the text with which it was trained. The generated text is human readable and grammatically correct, as well as meaningful in terms of content to a limited extent.

The duration of the training has a direct influence on the quality of the model prediction. Longer training leads to better quality text prediction. The training text is decisive for the content and expression of the prediction. 

The present model therefore uses a rather philosophical expression and everyday language is not suitable to predict. Also the provocation of a specific word prediction at the example "car" was not possible, even if the model in its specific expression can continue sets as user input limited meaningfully.

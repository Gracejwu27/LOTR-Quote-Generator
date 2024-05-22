
const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config()

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu= new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_KEY,
  }),
  serviceUrl: 'https://api.us-east.natural-language-understanding.watson.cloud.ibm.com',
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

//get the quotes
app.get('/quotes', async(req, res) =>{
    const Headers = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LOTR_KEY}`,
    }
    try {
      const response = await fetch('https://the-one-api.dev/v2/quote', { headers: Headers });
      if (response.status !== 429) {
        //fetching quote
        const quotes = await response.json();
        const quoteData = quotes.docs[Math.floor(Math.random() * quotes.docs.length)];
        //fetching character
        const rawCharacters = await fetch(`https://the-one-api.dev/v2/character?_id=${quoteData.character}`, { headers: Headers });
        const characters = await rawCharacters.json();

        const characterData = characters.docs[0];
        const APIresponse = {
            quote: quoteData.dialog,
            char: characterData.name === "MINOR_CHARACTER" ? "Minor Character" : characterData.name
          };
          res.json(APIresponse);
      } else {
        // Handle rate limit case, perhaps serve cached data or an error message
        res.status(429).send('Rate limit exceeded');
      }
      
    } catch (error) {
      console.error('Error fetching quotes:', error);
      res.status(500).send('Internal Server Error');
    }
})

//get the positive quote
app.get('/analyze-quote-positive', async(req, res) => {
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LOTR_KEY}`,
      };
    let attempts = 0
    const maxAttempts = 15
    while(attempts < maxAttempts){
        try{
            const response = await fetch("https://the-one-api.dev/v2/quote", {headers});
            if(response.status !== 429){
            const data = await response.json();
            const allQuotes = data.docs;
            const randomIndex = Math.floor(Math.random() * allQuotes.length);
            const quote = allQuotes[randomIndex].dialog; 

            //console.log(char);
            if(quote.length > 15){
                const analyzeParams = {
                    text:  quote,
                    features: {sentiment: {}},
                    language: "en"
                  };
            
                const analysisResults = await nlu.analyze(analyzeParams);
                const sentiment = analysisResults.result.sentiment.document.label;
                if(sentiment === "positive"){
                    const rawCharacters = await fetch(`https://the-one-api.dev/v2/character?_id=${allQuotes[randomIndex].character}`,{
                    headers
                    });
                    const characters = await rawCharacters.json(); 

                    const char = characters.docs[0].name;
                    return res.json({ quote: quote, sentiment: sentiment, char: char });
                }
            }
            attempts++; 
            }else{
                const quotes = require('./quotesPositive.json');
                const randomIndex = Math.floor(Math.random() * quotes.length);
                return res.json({quote: quotes[randomIndex].quote, char: quotes[randomIndex].character})
            }
            
        }catch(error){
            console.log("error fetching quotes");
            console.log(error);
            break;
        }
    }
});

//get the negative quote
app.get('/analyze-quote-negative', async(req, res) => {
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LOTR_KEY}`,
      };
    let attempts = 0
    const maxAttempts = 15
    while(attempts < maxAttempts){
        try{
            const response = await fetch("https://the-one-api.dev/v2/quote", {headers});
            if(response.status !== 429){
            const data = await response.json();
            const allQuotes = data.docs;
            const randomIndex = Math.floor(Math.random() * allQuotes.length);
            const quote = allQuotes[randomIndex].dialog; 
            //console.log(char);
            if(quote.length > 15){
                const analyzeParams = {
                    text:  quote,
                    features: {sentiment: {}},
                    language: "en"
                  };
            
                const analysisResults = await nlu.analyze(analyzeParams);
                const sentiment = analysisResults.result.sentiment.document.label;
                console.log(quote);
                console.log(sentiment);
                if(sentiment === "negative"){
                    const rawCharacters = await fetch(`https://the-one-api.dev/v2/character?_id=${allQuotes[randomIndex].character}`,{
                    headers
                    });
                    const characters = await rawCharacters.json(); 

                    const char = characters.docs[0].name;
                    return res.json({ quote: quote, sentiment: sentiment, char: char });
                }
            }
            attempts++; 
            }else{
                const quotes = require('./quotesNegative.json');
                const randomIndex = Math.floor(Math.random() * quotes.length);
                return res.json({quote: quotes[randomIndex].quote, char: quotes[randomIndex].character})
            }
            
        }catch(error){
            console.log("error fetching quotes");
            console.log(error);
            break;
        }
    }
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(9000);
// /api/analyze-quote-positive.js
const fetch = require('node-fetch'); 
const { IamAuthenticator } = require('ibm-watson/auth');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

// Initialize the IBM Watson NLU client
const nlu = new NaturalLanguageUnderstandingV1({
  version: '2022-04-07',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_KEY,
  }),
  serviceUrl: 'https://api.us-east.natural-language-understanding.watson.cloud.ibm.com',
});

module.exports = async(req, res) => {
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.LOTR_KEY}`,
      };
    let attempts = 0
    const maxAttempts = 15
    while(attempts < maxAttempts){
        try{
            const response = await fetch("https://the-one-api.dev/v2/quote", {headers});
            console.log(response.status);
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
};
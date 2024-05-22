
const fetch = require('node-fetch'); // First, make sure 'node-fetch' is installed

module.exports = async (req, res) => {
    const Headers = {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.LOTR_KEY}`,
    };
  
    try {
      const response = await fetch('https://the-one-api.dev/v2/quote', { headers: Headers });
      console.log(response.status);
      if (response.status !== 429) {
        // Fetching quote
        const quotes = await response.json();
        const quoteData = quotes.docs[Math.floor(Math.random() * quotes.docs.length)];
  
        // Fetching character
        const rawCharacters = await fetch(`https://the-one-api.dev/v2/character?_id=${quoteData.character}`, { headers: Headers });
        const characters = await rawCharacters.json();
  
        const characterData = characters.docs[0];
        const APIresponse = {
          quote: quoteData.dialog,
          char: characterData.name === "MINOR_CHARACTER" ? "Minor Character" : characterData.name
        };
        res.setHeader('Content-Type', 'application/json');
        res.json(APIresponse);
      } else {
        // Handle rate limit case
        res.status(429).send('Rate limit exceeded');
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      res.status(500).send('Internal Server Error');
    }
  };
  
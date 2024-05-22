import React from "react";
import { useState } from "react";
import "./styles.css";

function QuoteGenerator() {
  const [char, setChar] = useState("Gollum");
  const [quote, setQuote] = useState("My Precious");
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    const quotes = require('./quotes.json');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex].quote);
    setChar(quotes[randomIndex].character);
  };

  const getAnalyzedQuotePositive = () => {
    setIsLoading(true)
    fetch('/analyze-quote-positive')
      .then(response => {
        return response.json(); 
      })
      .then(data =>{
        setQuote(data.quote)
        if(data.char === "MINOR_CHARACTER"){
          setChar("Minor Character");
        }else{
          setChar(data.char);
        }
        setIsLoading(false);
      })
      
  }

  const getAnalyzedQuoteNegative = () => {
    setIsLoading(true)
    fetch('/analyze-quote-negative')
      .then(response => {
        return response.json(); 
      })
      .then(data =>{
        setQuote(data.quote)
        if(data.char === "MINOR_CHARACTER"){
          setChar("Minor Character");
        }else{
          setChar(data.char);
        }
        setIsLoading(false);
      })
  }

  const getFunnyQuote = () =>{
    setIsLoading(true);
    const quotes = require('./quotesFunny.json');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex].quote);
    setChar(quotes[randomIndex].character);
    setIsLoading(false);
  }

  const handleClick = async() => {
    setIsLoading(true);
    try{
      const rawQuotes = await fetch('/api/quotes');
      console.log(rawQuotes.status);
      if(rawQuotes.status !== 429){
        const data = await rawQuotes.json();

        setQuote(data.quote);
        setChar(data.char);
       
      }else{
        fetchData();
      }
      setIsLoading(false);
      }catch(error){
        console.log("Error fetching quotes");
      }
  };

  return (
    <div className="quote">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>"{quote}"</h2>
          <h4 className="char"> - {char}</h4>
          <button className="button-74" onClick={handleClick}>
            Random Quote
          </button>
          <button className="button-74" onClick={getAnalyzedQuotePositive}>
            Positive Quote
          </button>
          <button className="button-74" onClick = {getAnalyzedQuoteNegative}>
            Negative Quote
          </button>
          <button className="button-74" onClick = {getFunnyQuote}>
            Funny Quote
          </button>
        </div>
      )}
    </div>
  );
}

export default QuoteGenerator;

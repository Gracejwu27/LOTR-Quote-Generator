import "./styles.css";
import Header from "./Header";
import Navbar from "./Navbar";
import QuoteGenerator from "./QuoteGenerator";
import About from "./About";
import {Route, Routes} from "react-router-dom"

import React from "react";

export default function App() {
  return (
    <div className="App">
      <Header />
      <Navbar/> 
      <div> 
        <Routes>
          <Route path = "/" element = {<QuoteGenerator/>}/>
          <Route path = "/about" element = {<About/>} />
        </Routes>
      </div>
    </div>
  );
}

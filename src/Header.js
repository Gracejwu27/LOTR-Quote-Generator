import React from "react";
import "./styles.css";
import Logo from "./Logo.png";

console.log(Logo)

function Header() {
  return (
    <div className="header">
      <h1>Lord of the Rings Quote Generator</h1>
      <img src={Logo} alt=""/>
    </div>
  );
}

export default Header;

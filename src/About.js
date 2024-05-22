import React from "react";
import "./styles.css"

function About(){
    return(
        <div>
            <h1 className="AboutHeader"> About the Project </h1>
            <h4 className="AboutText"> 
                Here is my silly project. A Lord of the Rings quote generator made for fans of the series who need
                some inspiration, humor, or randomness. The quotes are pulled from 
                <a href = "https://the-one-api.dev/">"The One Api"</a>
                and then analyzed
                according to sentiment using IBM Watson's natural language processing services. This project
                used React as the front-end and Express/Node.js as the backend. 
            </h4>
            <h5 className="AboutFooter">
                Code may be found here: <a href = "https://github.com/Gracejwu27/LOTR-Quote-Generator">
                    LOTR-Quote-Generator
                </a>
            </h5>
        </div>
    )
}

export default About; 
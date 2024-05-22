import React from 'react';
import "./styles.css"
import {Link, useMatch, useResolvedPath} from "react-router-dom";

function Navbar(){
    return(
        <div className="nav">
            <ul className = "nav-link">
                <li>
                    <CustomLink to = "/"> Home </CustomLink>
                </li>
                <li>
                    <CustomLink to = "/about"> About</CustomLink>
                </li>
            </ul>
        </div>
    )
}
function CustomLink({to, children, ...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end: true});
    return(
        <>
        <li className = {isActive ? "active" : ""}>
            <Link to = {to} {...props}>
                {children}
            </Link>
        </li>
        </>
    )
}
export default Navbar; 
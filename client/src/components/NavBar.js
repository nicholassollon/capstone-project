import React, { useState ,useContext} from "react";
import { Link } from "react-router-dom";
import '../NavBar.css'
import Logout from './Logout'
import {UserContext} from './App'

function NavBar() {

  const [isCollapsed, setCollapsed] = useState(true);
  const [user, setUser] = useContext(UserContext)
  
  function uncollapse() {
    return (
      <div className="NavBar" id='open'>
        <a className="barbtn" onClick={() => setCollapsed(!isCollapsed)}>&times;</a>
        <a href="/home">Home</a>
        <a href="/yoursongs">Your Songs</a>
        <a href="about">About/Contact</a>
        <Logout setUser={setUser}></Logout>
      </div>
    );
  }

  function collapse() {
    return (<div className="NavBar">
      <button className="barbtn" onClick={() => setCollapsed(!isCollapsed)}>&#9776;</button>
    </div>
    )
  }

  return <>{(isCollapsed ? collapse() : uncollapse())}</>

}

export default NavBar;

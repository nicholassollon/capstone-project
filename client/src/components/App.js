import React, { useEffect, useState, createContext } from "react";
import { Switch, Route } from "react-router-dom";
import Login from './Login'
import Home from './Home'
import NavBar from './NavBar'
import SongList from './SongList'
import Song from './Song'
import About from './About'
import Signup from './Signup'
import './App.css'

export const UserContext = createContext()

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    //AutoLogin
    fetch("/check_session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });
  }, []);
  //Login screen if not logged in
  if (!user) return <Switch>
    <Route exact path='/signup'>
      <Signup />
    </Route>
    <Route path='/'>
      <Login onLogin={setUser} />
    </Route>
  </Switch>

  //Routes for users to use
  return <React.Fragment>

    <UserContext.Provider value={[user, setUser]}>

      <NavBar></NavBar>

      <Switch>


        <Route exact path='/yoursongs'>
          <SongList></SongList>
        </Route>

        <Route path='/yoursongs/:id'>
          <Song></Song>
        </Route>

        <Route exact path='/about'>
          <About></About>
        </Route>

        <Route  path='/'>
          <Home></Home>
        </Route>

      </Switch>
    </UserContext.Provider>

  </React.Fragment>

}

export default App;
//https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg
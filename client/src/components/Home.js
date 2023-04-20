import React, { useState, useContext } from "react";
import { UserContext } from "./App";
import './Home.css'

function Home() {
    const [user, setUser] = useContext(UserContext)
    const greetings = ["Don't forget to take breaks!", "Good luck writing today!", "Not every idea is good."]

    const greetingSongs = user.user_songs.length === 0
        ? <p>You have no songs, get writing!</p>
        : user.user_songs.length === 1
            ? <p>You have only 1 song, you should write more.</p>
            : <p>You have {user.user_songs.length} songs.</p>;

    function randomGreeting() {
        const index = Math.floor(Math.random() * (greetings.length))
        return greetings[index]
    }

    return <div id="greeting">
        <p>Welcome back, {user.username}</p>
        {greetingSongs}
        <p>{randomGreeting()}</p>
    </div>

}

export default Home
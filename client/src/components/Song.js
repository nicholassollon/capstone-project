import React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from './App'
import Lyrics from './Lyrics'
import Audio from './Audio'
import DropDown from './DropDown'
import './songs.css'

function Song() {

    let song = null;
    const { id } = useParams()
    const [user, setUser] = useContext(UserContext)

    for (const temp of user.user_songs) {
        if (temp.id == id)
            song = temp
    }

    if (!song)
        return <div><p>404 Error</p></div>

    return  <div className="song-container">
      <h1 className="song-title">{song.title}</h1>
      <div className="song-info">
      </div>
      <Lyrics song={song} />
      <div className="audio-player">
        <Audio songId={song.id} />
      </div>
      <div className="dropdown">
        <DropDown />
      </div>
    </div>
}

export default Song

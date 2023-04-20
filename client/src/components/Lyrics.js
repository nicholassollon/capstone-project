import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import './songs.css'

function Lyrics({ song }) {
  const [lyrics, setLyrics] = useState(song.lyrics);

  function handleChange(event) {
    const lyricsValue = event.target.value;
    setLyrics(lyricsValue);
    song.lyrics = lyricsValue;
  
    fetch(`/songs/${song.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({lyrics:lyricsValue})
    })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <form id = 'form'>
      <label>Lyrics</label>
      <textarea id="lyrics" value={lyrics} onChange={handleChange} />
    </form>
  );
}

export default Lyrics;
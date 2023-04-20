import React from 'react'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { UserContext } from './App'
import Card from './Card'
import { Pagination, Container } from 'semantic-ui-react';
import '../SongList.css'

function SongList() {

  const [newName, setNewName] = useState('Untitled')
  const [user, setUser] = useContext(UserContext);
  const [search, setSearch] = useState('')

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [currentData, setData] = useState(user.user_songs.slice(startIndex, endIndex))

  function handleSearch(event) {
    setSearch(event.target.value)
    const newData = []
    for (const song of user.user_songs) {
      //checks if the title includes it and if it does it adds it and continues to next song
      if (song.title.toLowerCase().includes(event.target.value.toLowerCase())) {
        newData.push(song)
        continue;
      }
      //Checks the tags and breaks from the loop if it finds one that matches so it only adds it once
      for (const tag of song.tags) {
        if (tag.name.toLowerCase().includes(event.target.value.toLowerCase())) {
          newData.push(song)
          break;
        }
      }
    }
    setData(newData)
  }

  const handlePageChange = (e, { activePage }) => {
    setActivePage(activePage);
  };


  const history = useHistory();

  const handleSongRoute = (song) => history.push(`./yoursongs/${song.id}`)

  function handleNewText(event) {
    setNewName(event.target.value)
  }

  function newSong(title) {
    if (title.replace(/\s/g, '').length > 0)
      fetch(`/songs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: title })
      }).then(window.location.href = "/yoursongs")
        .catch(error => {
          console.error(error);
        });
    else
      window.alert("Songs must have titles")
  }

  function newTag(title) {

    if (title.replace(/\s/g, '').length > 0)
      fetch(`/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: title })
      }).then(window.location.href = "/yoursongs")
        .catch(error => {
          console.error(error);
        });
    else
      window.alert("Tags must have titles")
  }

  return <React.Fragment>
    <div className='new'>
      <input type='text' value={newName} placeholder='Song/Tag Title' onChange={handleNewText}></input>
      </div><div className = 'new'>
    <button className='new' onClick={() => newTag(newName)}>New Tag+</button>
      <button className='new' onClick={() => newSong(newName)}>New Song+</button>
    </div>
    <Container id='songList'><input type='text' value={search} placeholder='Search For Tags/Titles' id='search' onChange={handleSearch}></input>
      {currentData.map(song => (
        <Card click={() => handleSongRoute(song)} className='songsInList' key={song.id} title={song.title} song={song}></Card>
      ))}
      <Pagination
        id='pagination'
        activePage={activePage}
        onPageChange={handlePageChange}
        totalPages={Math.ceil(user.user_songs.length / itemsPerPage)}
      />
    </Container></React.Fragment>
}

export default SongList

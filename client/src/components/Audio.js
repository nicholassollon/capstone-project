import React, { useState, useEffect } from 'react'
import Recorder from './Recorder'
import './Audio.css'

function Audio({ songId }) {

    const [songFiles, setSongFiles] = useState([]) //file paths
    const [fileIncrement, setIncrement] = useState(false) //Used to refetch the list of audio files every time one is added

    useEffect(() => {
        fetch(`/files/${songId}`).then((response) => response.json()).then((songs) => handleSongFiles(songs));
    }, [fileIncrement])
    
    function handleSongFiles(newFile) {
        setSongFiles([...newFile])
    }


    function makePlayers(){
        const audioList = []
        for(const filePath of songFiles){
            const temp = <audio src={`/serve_file/${filePath.slice(7)}`} controls="controls" />
            audioList.push(temp)}
        return audioList
    }

    return <React.Fragment>
        <Recorder songId={songId} fileIncrement = {setIncrement}></Recorder>
        <div className = 'players' >{makePlayers()}</div>
    </React.Fragment>
}

export default Audio
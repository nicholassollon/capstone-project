import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

function DropDown() {
    const [selectedTag, setSelectedTag] = useState('');
    const [allTags, setAllTags] = useState([])
    
    const { id } = useParams()

    function addTag(tag) {
        fetch(`/songtag/${id}/${tag}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(console.log(tag))
            .catch(error => {
                console.error(error);
            });
    }

    function handleFetchTags(tags) {
        setAllTags(tags);
    }

    useEffect(() => {
        fetch(`/tags`).then((response) => response.json()).then((tags) => handleFetchTags(tags))
            .catch(error => {
                console.error(error);
            });

    }, [])
    const options = makeSelectedTags()

    function handleSelect(event) {
        setSelectedTag(event.target.value);
    }

    function makeSelectedTags() {
        const options = [<option value="">Choose a tag</option>,]
        for (const tag of allTags) {
            options.push(<option value={tag}>{tag}</option>)
        }
        return options
    }

    return <div>
        <label htmlFor="tags">Select a tag:</label>
        <select id="tags" value={selectedTag} onChange={handleSelect}>
            <>{options}</>
        </select>
        <button onClick={() => addTag(selectedTag)}>Set Tag</button>
    </div>
}

export default DropDown
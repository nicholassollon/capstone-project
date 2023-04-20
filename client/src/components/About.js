import React from 'react'
import {useHistory} from 'react-router-dom'
function About() {

    const history = useHistory();

    return <React.Fragment><div id = 'about'>
        <p className = 'about'>Melisma is a songwriting passion project I developed to get all the features I want in a songwriting app, down to one app.</p>
        </div>
        <p className = 'about' id = 'linkedin' onClick = {()=>window.open('https://www.linkedin.com/in/nicholassollon/','_blank')}>Linkedin</p>
        </React.Fragment>
}

export default About
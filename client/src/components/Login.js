import React, { useState } from "react";
import './Login.css'
import { useHistory } from 'react-router-dom';

function Login({ onLogin }) {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    function handleSubmit(e) {
        e.preventDefault();
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
            .then((r) => r.json())
            .then((user) => {
                if (user.error)
                    setError(user.error); // Set error state
                else
                    onLogin(user);
            });
    }

    return <React.Fragment>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div id='error' >Invalid username or password</div>} {/* Render error message if error state is not null */}
            <button type="submit">Login</button>
        </form>
        <button onClick={() => { history.push('./signup') }}>No account? Signup!</button></React.Fragment>

}

export default Login
import React, { useState } from "react";

function Logout({setUser}) {
    function handleLogout() {
        const confirmation = window.confirm('Are you sure you want to logout?')
        if (confirmation)
            fetch("/logout", { method: "DELETE" }).then((r) => {
                if (r.ok) {
                    setUser(null);
                    window.location.href = "/login"
                }
            });
    }
    return <button onClick={()=>handleLogout()}>Logout</button>
}

export default Logout
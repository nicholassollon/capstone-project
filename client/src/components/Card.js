import React from 'react';
import styled from 'styled-components';
import { UserContext } from './App';
import {useContext} from 'react'

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  max-width: 500px;
  max-height: 500px;
  transition: transform 0.2s ease-in-out;
  padding-bottom: 3px;

  &:hover {
    transform: scale(1.05);
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;


function handleClick(user,song){
  fetch(`/songs/${song.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
  })

  for(let temp of user.user_songs)
    if(temp.id == song.id)
        temp = null
    
  window.location.href = "/yoursongs";
}

const Card = ({ title, click, song}) => {
  const [user, setUser] = useContext(UserContext)
  return (
    <CardWrapper onClick={click}>
      <Title>{title}</Title>
      <button onClick={()=>handleClick(user,song)}>Delete</button>
    </CardWrapper>
  );
};

export default Card;





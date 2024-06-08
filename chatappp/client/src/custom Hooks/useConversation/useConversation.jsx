import React, {useState,  useEffect, useCallback } from 'react'

function useConversation(currentUser) {

  const [conversations, setConversations] = useState([]);

  const fetchConversations = useCallback(async() => {
      const res = await fetch(`http://localhost:3000/api/conversations/${currentUser.id}`, {
        method: 'GET',
        headers: {
          "Content-Type" : "application/json",
          } 
      })
      const resData = await res.json();
      setConversations(resData);
  
    }, [])

    useEffect(()=>{
      fetchConversations()
    }, [])

  return conversations;
}

export default useConversation

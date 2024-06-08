import {useCallback, useEffect, useState} from 'react'

function useFetchAllUsers(currentUser) {

    const [allUsers, setAllUsers] = useState([]);

    const fetchAllUsers = useCallback(async() => {
        const res = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
          method: 'GET',
          headers: {
            "Content-Type" : "application/json"
          }
        })
        const resData = await res.json();
        setAllUsers(resData)
      }, []);

    useEffect(() => {
        fetchAllUsers();
    }, [currentUser])
    
  return allUsers;
}

export default useFetchAllUsers

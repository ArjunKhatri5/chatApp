import React, { useCallback, useEffect, useState, useRef } from 'react'
import Batman from '../../assets/batman.svg'
import Input from '../../components/Input'
import {io} from 'socket.io-client';

import useConversation from '../../custom Hooks/useConversation/useConversation';
import useFetchAllUsers from '../../custom Hooks/useFetchAllUsers/useFetchAllUsers';

import {useLocation} from 'react-router-dom';



function Dashborad() {
  
  const location = useLocation();
  const [currentUser, setCurrentUserId] = useState(JSON.parse(localStorage.getItem('user:details')));
  // const [conversations, setConversations] = useState([]);
  // const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [onExistingConvoClick, setOnExistingConvoClick] = useState(false);
  const [messageInputField, setMessageInputField] = useState('');
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isActive, setIsActive] = useState("offline");
  const [darkMode, setDarkMode] = useState(location.state);
  

  
  // display people I have conversations with (left)
  const conversations = useConversation(currentUser);


  // display all users (right)
  const allUsers = useFetchAllUsers(currentUser);




  // console.log("messages+>>>", messages);
  // console.log("curr", currentUser);




  useEffect(()=>{
    setSocket(io("http://localhost:8000"));
  }, [])


  useEffect(()=>{
    socket?.emit('addUser', currentUser?.id)
    socket?.on('getUsers', users => {
      // console.log("activeUsers=>>", users);
      setActiveUsers(users);
      // console.log("active-user:  ", activeUsers);
    })
    
    socket?.on('getMessage', data => {
      setMessages( prev => ({
        ...prev,
        messagesOnly: [...prev.messagesOnly, { user: data.user , message: data.message}]
      }))
    })
  }, [socket])
  
  console.log("messages", messages);





  // check for active users
  useEffect(()=> {
    if(activeUsers){
      console.log("active users are", activeUsers);
      console.log("uuu", messages?.receiver?.receiverId);
      const lol = activeUsers.find( (oneActiveUser) => oneActiveUser.currentUsersId === messages?.receiver?.receiverId);
     if(lol){
      setIsActive(true);
     } else {
      setIsActive(false);
     }
    }
  }, [activeUsers])


  useEffect(()=>{
    messageRef?.current?.scrollIntoView({behavior: "smooth"});    // current stores the referenced element
  }, [messages?.messagesOnly])
  



  // open the message box and display all message of a user when it is clicked 
  const fetchMessage = async(conversationId, user) => {
      let res = await fetch(`http://localhost:3000/api/message/${conversationId}`, {
        method : 'GET',
        headers : {
          "Content-Type" : "application/json"
        }
      });
      const resData = await res.json();
      setMessages({messagesOnly: resData, receiver: user, conversationId});
      setOnExistingConvoClick(false);
  };



  const sendMessage = async() => {

    socket?.emit("sendMessage", {
      conversationId: messages?.conversationId ,
      senderId : currentUser?.id,
      message : messageInputField,
      receiverId: messages?.receiver?.receiverId, 
    })

    const res = await fetch('http://localhost:3000/api/message', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        conversationId: messages?.conversationId ,
        senderId : currentUser?.id,
        message : messageInputField,
        receiverId: messages?.receiver?.receiverId, 
      })
    });

    setMessageInputField('');
  }



  // initiate a new conversation
  const initiateNewConvo = async(userId, user) => {
    const res = await fetch('http://localhost:3000/api/conversation', {
      method: 'POST',
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        senderId: currentUser.id,
        receiverId: userId
      })
    });
    
    const resData = await res.json();
    setOnExistingConvoClick(true);

    if(resData.isAlreadyExists){
      const conversationId = conversations.filter( (convo) => convo.conversationId === resData.isAlreadyExists._id);
      let convo = conversationId[0].conversationId;   // since conversationId is an array with 1 object in it
      alert("Already has an existing conversation with this user")
      fetchMessage(convo, user)
    } else {
      fetchMessage('new', user)
    }
  };


  const darkModeHandler = () => {
    darkMode ? setDarkMode(false) : setDarkMode(true);
    // alert(darkMode)
  };




  return (
    <div className={`w-screen flex h-screen ${darkMode ? 'bg-primaryBg' : 'bg-secondary' }`}>
        <div className='w-[25%] h-full overflow-scroll'>

        <div className='w-auto flex justify-end mr-10 mt-4' >
              <div className='bg-gray-600 rounded-3xl flex items-center p-2 hover:bg-gray-500 text-white' onClick={darkModeHandler}>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>
                {/* <p className='text-xs'>Dark</p> */}
              </div>
        </div>
          
          <div className='flex item-center my-8 mx-14'>
            <div className={`border-2 border-primary rounded-full ${darkMode ? 'bg-gray-600' : 'bg-transparent' }`}>
              <img src={Batman} alt="" width={75} height={75} />
            </div>

            <div className='ml-6'>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-secondary' : 'text-black' }`}>{currentUser?.fullName}</h3>
              <p className={`text-base font-light ${darkMode ? 'text-secondary' : 'text-black' }`}>My account</p>
            </div>
          
          </div>
          <div className='mx-10 mt-6 border-t-2 border-gray-300'>
            <div className='text-primary text-lg pt-2'>Messages</div>
            <div>
              {
                conversations.length > 0 ? 
                conversations.map(( {conversationId, user} ) => {
                  return (
                      <div className={`flex item-center py-5 p-4 rounded-2xl ${darkMode ? 'hover:shadow-lg hover:shadow-[#0A0A0A]' : 'border-b border-b-gray-300 hover:shadow-lg hover:shadow-fuchsia'}`}>
                        
                        <div className='cursor-pointer flex items-center' onClick={() => { fetchMessage(conversationId, user)}} >
                            <div className={`border-2 border-primary rounded-full p-1 ${darkMode ? 'bg-gray-600' : 'bg-transparent' }`}>
                              <img src={Batman} alt="" width={55} height={55} />
                            </div>

                            <div className='ml-6'>
                              <h3 className={`text-lg font-semibold ${darkMode ? 'text-secondary' : 'text-black' }`}>{user?.fullName}</h3>    {/* the question mark handles if the async request from Db is not yet prepared, instead of crashing the code, it shows undefined there (note that it doesn't update the code later automatically but just protects the program from getting crash/error) */}
                              <p className={`text-sm font-light ${darkMode ? 'text-secondary font-semibold' : 'text-gray-500' }`}>{user?.email}</p> 
                            </div>
                        </div>

                      </div>
                  )
                } ) : <div className='mt-10 font-semibold'>No conversations yet...</div>
              }
            </div>
          </div>
        </div>







        <div className={`w-[50%] h-ull  flex flex-col items-center ${darkMode ? 'bg-[#18191A]' : 'bg-white' }`}>
{
  messages?.receiver?.fullName && 
<div className={`w-[75%] h-[65px] my-5 mb-4 rounded-full flex items-center px-14 py-4 ${darkMode ? 'bg-[#212121]' : 'bg-secondary' }`}>

  <div className={`border-2 border-primary rounded-full p-1 cursor-pointer ${darkMode ? 'bg-gray-600' : 'bg-transparent' }`} > 
    <img src={Batman} width={45} height={45} /> 
  </div>

  <div className='ml-6 mr-auto'>
    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>{messages?.receiver?.fullName}</h3>
    <p className='text-xs font-medium text-red-400 mt-0.5'> {isActive ? 'Online' : 'Offline'} </p>
  </div>

    {/* imported from tabler icon website */}
  <div className='cursor-pointer'>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
      </svg>
  </div>
</div>
}

<div className='h-[75%] w-full overflow-scroll'>
    <div className='p-8'>

        {
          messages?.messagesOnly?.length > 0 ? 
          messages.messagesOnly.map( ({message, user: {id} = {} } ) => {
                return (
                  <div className='max-w-[100%] ml-auto' >
                    <div className={`max-w-fit p-4 my-2 ${id === currentUser.id ? 'text-white bg-primary rounded-b-3xl ml-auto rounded-tl-3xl' : 'bg-secondary rounded-tr-3xl rounded-b-3xl' } `}>
                      {message}
                    </div>
                    <div ref={messageRef}></div>
                  </div>
                )
          } ) : <div className={`text-center text-lg font-semibold ${darkMode ? 'text-white' : 'text-black'}`}>No messages, start a new conversation...</div> 
        } 
    </div>
</div>

{ 
  messages?.receiver?.fullName && 
    <div className='p-4 w-full flex'>
      <Input type="text" placeholder='Type a message...' value={messageInputField} onChange={(e)=> {setMessageInputField(e.target.value)}} className='w-[72%]' inputClassName='border-0 shadow-lg hover:shadow-xl rounded-full bg-light outline-none p-3' isDisabled={onExistingConvoClick ? true : false} />

      <div className='cursor-pointer bg-light rounded-full p-2 hover:shadow-lg mx-4'>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-rounded-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />
          <path d="M15 12h-6" />
          <path d="M12 9v6" />
        </svg>
      </div>

      <div className={`cursor-pointer bg-light rounded-full p-2 hover:shadow-lg mx-4 ${!messageInputField && 'pointer-events-none'}`} onClick={()=> {sendMessage()}}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-send-2" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
          <path d="M6.5 12h14.5" />
          </svg>
      </div>

    </div>
}
</div>

        








        <div className='w-[25%] h-[96%] mx-10 mt-5 overflow-scroll'>
            <div className='text-primary text-lg py-2 border-b-2 border-gray-300'>Connect with more people</div>
            <div> 
              {
                  allUsers.length > 0 ? 
                      allUsers.map(( {user, userid} ) => {
                        // console.table(oneUser.userId, currentUser.id);
                        return (
                          // userid !== currentUser.id && 
                              <div className={`flex item-center py-5 p-4 rounded-2xl ${darkMode ? 'hover:shadow-xl hover:shadow-[#0A0A0A]' : 'border-b border-b-gray-300 hover:shadow-lg hover:shadow-fuchsia'}`} onClick={() => { /* ifConvoAlreadyExists(userid, user); */ initiateNewConvo(userid, user); /* fetchMessage('new', user); */ }}> 
                                
                                <div className='cursor-pointer flex items-center'>
                                    <div className={`border-2 border-primary rounded-full p-1 ${darkMode ? 'bg-gray-600' : 'bg-transparent'}`}>
                                      <img src={Batman} alt="" width={55} height={55} />
                                    </div>

                                    <div className='ml-6'>
                                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-secondary' : 'text-black' }`}>{user?.fullName}</h3>    {/* the question mark handles if the async request from Db is not yet prepared, instead of crashing the code, it shows undefined there (note that it doesn't update the code later automatically but just protects the program from getting crash/error) */}
                                      <p className={`text-sm font-light text-gray-500 ${darkMode ? 'text-secondary font-semibold' : 'text-black' }`}>{user?.email}</p> 
                                    </div>
                                </div>

                              </div>
                        ) 
                      } ) : <div className='mt-10 font-semibold'>No users available...</div>
              }
            </div>

        </div>
    </div>
  )
}

export default Dashborad

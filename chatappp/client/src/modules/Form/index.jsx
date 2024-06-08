import React, { useState } from 'react'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'



function Form( { isSigninPage = true} ) {

  const toast = useToast();
  const [darkMode, setDarkMode] = useState(false);

 
  const [data, setData] = useState({
    ...( !isSigninPage && {
      fullName: '',
    }),
    email: '',
    password: '',
  })

  const onSubmitHandler = async(e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/${isSigninPage ? 'login' : 'register'}`, {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data),
    } );



    if(res.status === 400){
      (() =>{
        toast({
          title: `User already Exists!`,
          description: 'Please either login or try other detail',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      })();


    } else {
      const resData = await res.json();
      if(resData.token){
        localStorage.setItem('user:token', resData.token);
        localStorage.setItem('user:details', JSON.stringify(resData.user)); // resData.user is in the form of string, but localstorage need string so, converting object to string
        navigate('/', {state: darkMode});
      }

      (() => {
        toast({
          title: `${isSigninPage ? 'Welcome back' : 'Account created.' }`,
          description: `${isSigninPage ? 'Logged in' : 'We have created your account for you. You may now login' }`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })();
    }
    
  }

  const navigate = useNavigate();
  
  const navigateHandler = () => {
    navigate( `/user/${isSigninPage ? 'sign_up' : 'sign_in'}` )
  }



  const darkModeHandler = () => {
    darkMode ? setDarkMode(false) : setDarkMode(true);
    // alert(darkMode)
  };


  return (
    <div className={` h-screen flex flex-col justify-center items-center ${darkMode ? 'bg-primaryBg' : 'bg-[#e1edff]' } `}>


      <div className='w-full flex justify-end mr-10 mt-4' >
          <div className='bg-gray-600 rounded-3xl flex items-center p-2 hover:bg-gray-500 text-white' onClick={darkModeHandler}>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" /></svg>
            {/* <p className='text-xs'>Dark</p> */}
          </div>
      </div>

      <div className={`w-[500px] h-[600px] m-5 shadow-lg rounded-lg flex flex-col justify-center items-center ${darkMode ? 'bg-secondaryBg' : 'bg-white' }`} >

        <div className={`text-4xl font-extrabold ${darkMode && 'text-white'} `}>Welcome {isSigninPage && 'back'} </div>
        <div className={`text-xl font-light mb-14 ${darkMode && 'text-white'}`}> {isSigninPage ? 'Sign in to explore' : 'Sign up to get Started'} </div>
        

        <form onSubmit={(e) => {onSubmitHandler(e)}} className='w-4/6'>
        {!isSigninPage && (
          <Input
            label="FullName"
            name="Name"
            placeholder="Enter Your Name"
            className="mb-6"
            value={data.fullName}
            onChange={(e) => {
              setData({ ...data, fullName: e.target.value });
            }}

            inputClassName='rounded-lg'
          />
        )}

        <Input
          label="Email"
          name="Email"
          type='email'
          placeholder="Enter Your Email"
          className="mb-6"
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}

          inputClassName='rounded-lg'
        />

        <Input
          label="Password"
          name="Password"
          type='password'
          placeholder="Enter Your Password"
          className="mb-8"
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}

          inputClassName='rounded-lg'
        />

        <Button
          label={isSigninPage ? "Sign in" : "Sign Up"}
          type="Submit"
          className="w-2/3 mb-2"
        />

        </form>

        <div className={` ${darkMode && 'text-[#FFFFFF]'} `}> {isSigninPage ? `Don't have an Account?` : 'Already have an account?'} <span  className='text-primary cursor-pointer underline' onClick={navigateHandler} > {isSigninPage ? 'Sign up' : 'Sign in'} </span></div>
      
      </div>
    </div>
  )
}

export default Form

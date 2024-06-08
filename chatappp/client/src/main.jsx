import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Routes, Navigate } from 'react-router-dom';
//  createBrowserRouter - sync the UI with URL
// createRouterFromElements 

import { ChakraProvider } from '@chakra-ui/react'

import Form from './modules/Form'
import Dashborad from './modules/Dashboard/index.jsx';


const ProtectedRoute = ({children, auth=false}) => {

  // the children parameter allows the ProtectedRoute component to render its child components 
  // and manage their rendering based on the authentication status.

  
  const isLoggedIn = localStorage.getItem('user:token') !== null || false;


  if(!isLoggedIn && auth){
    return (<Navigate to={'/user/sign_in'} />)
  } else if(isLoggedIn && ['/user/sign_in', '/user/sign_up'].includes(window.location.pathname) ){
    return <Navigate to={'/'} />
  }

  return children
}


const router = createBrowserRouter(
  createRoutesFromElements(   
    <Route path='/'>
      <Route path='' element={
        <ProtectedRoute auth={true}>
          <Dashborad/>
        </ProtectedRoute>
      } />
      <Route path='user/sign_in' element={
        <ProtectedRoute>
          <Form isSigninPage={true} />
        </ProtectedRoute>
      } />
      <Route path='/user/sign_up' element={
        <ProtectedRoute>
          <Form isSigninPage={false} />
        </ProtectedRoute>
      } />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
      < RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>,
)

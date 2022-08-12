import React, {useEffect, useState} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {Header} from "../Header";
import {Lists} from "../Lists";
import {RegistrationPage} from "../RegistrationPage";
import {LoginPage} from "../LoginPage";
import {AuthContext} from '../../context/auth-context'
import cookie from 'cookie'
import {getUser} from "../../API/user";

function App() {
  const [isAuth, setIsAuth] = useState(!!cookie.parse(document.cookie).access_token)

  return (
    <AuthContext.Provider value={{isAuth, setIsAuth}}>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/login' element={isAuth ? <Navigate to='/lists'/> : <LoginPage />}/>
          <Route path='/registration' element={isAuth ? <Navigate to='/lists'/> : <RegistrationPage />}/>
          <Route path='/lists' element={isAuth ? <Lists /> : <Navigate to='/login'/>}/>
          <Route path='*' element={<Navigate to={isAuth ? '/lists': '/registration'} />}/>
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export {App};

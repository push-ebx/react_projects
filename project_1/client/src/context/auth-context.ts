import {createContext, useState} from "react";

interface IAuthContext {
  isAuth: boolean,
  setIsAuth: any
}

const AuthContext = createContext<IAuthContext>({isAuth: false, setIsAuth: null})
export {AuthContext}
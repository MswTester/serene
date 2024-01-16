/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {createContext, useState, useEffect} from 'react';
import { User } from 'firebase/auth';
import { Socket } from 'socket.io-client';
import './styles/global.css'

import Login from './login/main';
import Menu from './menu/main';
import Game from './game/main';

export const globalContext = createContext<CT|any>({});

function App() {
  const [hydrated, setHydrated] = useState(false);
  const [lang, setLang] = useState<string>("en");
  const [user, setUser] = useState<User|null>(null);
  const [page, setPage] = useState<Page>("login");
  const [socket, setSocket] = useState<Socket|null>(null);

  useEffect(() => {
    setHydrated(true);

    if(localStorage.getItem("lang")){
      setLang(localStorage.getItem("lang")!)
    }else{
      const adl = navigator.language.split("-")[0]
      localStorage.setItem("lang", adl)
      setLang(adl)
    }
  }, []);
  
  return (hydrated ? <globalContext.Provider value={{
    lang, setLang,
    user, setUser,
    page, setPage,
    socket, setSocket
  }}>
    {page === "login" ? <Login /> :
    page === "menu" ? <Menu /> :
    page === "game" ? <Game /> :
    <></>}
  </globalContext.Provider>: <></>);
}

export default App;

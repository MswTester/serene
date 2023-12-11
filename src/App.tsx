import {createContext, useState, useEffect} from 'react';
import { User } from 'firebase/auth';
import './styles/global.css'

import Login from './login/main';
import Menu from './menu/main';

export const globalContext = createContext<CT|any>({});

function App() {
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User|null>(null);
  const [page, setPage] = useState<Page>("menu");

  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return (hydrated ? <globalContext.Provider value={{
    user, setUser,
    page, setPage,
  }}>
    {page === "login" ? <Login /> :
    page === "menu" ? <Menu /> :
    <></>}
  </globalContext.Provider>: <></>);
}

export default App;

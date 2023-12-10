import React, {useEffect, createContext, useState, Dispatch, SetStateAction} from 'react';
import LoginComp from './login_comp';
import RegisterComp from './register_comp';
import VerifyComp from './verify_comp';

export const LoginContext = createContext<any>({});

export default function Index() {
    const [logPage, setLogPage] = useState<"login"|"register">("login");

    return (<LoginContext.Provider value={{
        logPage, setLogPage,
    }}>
        {logPage === "login" ? <LoginComp /> :
        logPage === 'register' ? <RegisterComp />:
        logPage === 'emailVerify' ? <VerifyComp /> :
        <></>}
    </LoginContext.Provider>)
}
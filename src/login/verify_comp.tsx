import React, {useContext, useEffect} from "react";
import { globalContext } from "../App";
import { LoginContext } from "./main";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../api/firebase";

export default function Index() {
    const {user, setUser} = useContext(globalContext);
    const {logPage, setLogPage} = useContext(LoginContext);

    const sendVerify = async () => {
        if(user) await sendEmailVerification(user);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if(user) setUser(user);
        });

        return () => unsubscribe();
    }, []);

    return <div className="w-full h-full text-card-foreground shadow-sm bg-[#000000] flex justify-center items-center flex-col text-white bg-cover bg-center" data-v0-t="card" style={{backgroundImage: `url(assets/loginbg.png)`}}>
        <div className="bg-[#000000aa] p-10 rounded-xl">
            <div className="flex flex-col space-y-5 p-6">
                <h3 className="font-semibold tracking-tight text-3xl text-center">Serene</h3>
                <p className="text-muted-foreground text-xl text-center">Verify your email</p>
            </div>
            <div className="p-6 space-y-4">
                <p className="text-lg text-center">We have sent you an email to verify your account. Please check your inbox.</p>
            </div>
            <div className="flex items-center p-6">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-[#ffffff] text-black"
                onClick={e => sendVerify()}>
                Resend
                </button>
            </div>
            <div className="flex items-center p-6">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-[#ffffff] text-black"
                onClick={e => setLogPage("login")}>
                Back To Login
                </button>
            </div>
        </div>
    </div>
}
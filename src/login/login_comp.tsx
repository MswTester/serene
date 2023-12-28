import { useContext, useState } from "react";
import { globalContext } from "../App";
import { LoginContext } from "./main";
import { auth, signInWithEmailAndPassword } from "../api/firebase";

export default function Index() {
    const {user, setUser} = useContext(globalContext);
    const {page, setPage} = useContext(globalContext);
    const {logPage, setLogPage} = useContext(LoginContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const login = async () => {
        setLoading(true);
        try{
            const curUser = await signInWithEmailAndPassword(auth, email, password);

            setEmail("");
            setPassword("");
            setLoading(false);
            setUser(curUser.user);
            if(!curUser.user.emailVerified) return setLogPage("emailVerify");
            setPage("menu")
        } catch (err:any){
            setLoading(false);
            switch(err.code) {
                case "auth/invalid-email":
                    setErrorMsg("Invalid email");
                    break;
                case "auth/user-disabled":
                    setErrorMsg("User disabled");
                    break;
                case "auth/user-not-found":
                    setErrorMsg("User not found");
                    break;
                case "auth/wrong-password":
                    setErrorMsg("Wrong password");
                    break;
                default:
                    setErrorMsg("Unknown error");
                    break;
            }
        }
    }

    return (<>
        <div className="w-full h-full shadow-sm bg-[#000000] text-white flex justify-center items-center flex-col" data-v0-t="card" style={{backgroundImage: `url(assets/loginbg.png)`}}>
            {loading && <div className="absolute inset-0 overflow-hidden">
                <img src="assets/placeholder.svg" alt="Animated Background" className="object-cover absolute" width="100" height="100" style={{aspectRatio: "100 / 100", top:'50%', left:'50%', transform:'translate(-50%, -50%)'}} />
                <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>}
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight text-3xl text-center">Serene</h3>
                <p className="text-muted-foreground text-xl text-center">Login to start your adventure</p>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold" htmlFor="email">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black" id="email" placeholder="Enter your email" required={true} type="text" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold" htmlFor="password">Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black" id="password" placeholder="Enter your password" required={true} type="password" />
                </div>
            </div>
            <div className="flex items-center p-6">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-[#ffffff] text-black"
                onClick={e => login()}>
                    Login
                </button>
            </div>
            <div className="mt-4 text-center">
                <span className="text-red-400">{errorMsg}</span>
                <span className="text-green-400">{successMsg}</span>
            </div>
            <div className="text-center mt-4">
                <a className="underline text-blue-400 cursor-pointer" onClick={e => setLogPage("register")}>Don't have an account? Register</a>
            </div>
        </div>
    </>)
}
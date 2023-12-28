import { useState, useContext } from "react";
import { globalContext } from "../App";
import { LoginContext } from "./main";
import { auth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "../api/firebase";
import { User } from "firebase/auth";

export default function Index() {
    const {user, setUser} = useContext(globalContext);
    const {logPage, setLogPage} = useContext(LoginContext);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const register = async () => {
        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }
        if(username.length < 3) {
            setErrorMsg("Username must be at least 3 characters");
            return;
        }
        if(email.length < 3) {
            setErrorMsg("Invald Email");
            return;
        }
        setLoading(true);
        try{
            setErrorMsg("");
            setSuccessMsg("");
            const createdUser = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(createdUser.user, {
                displayName: username,
            });

            await sendEmailVerification(createdUser.user);

            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setLoading(false);
            setUser(createdUser.user);
            setLogPage("emailVerify");
        } catch (err: any) {
            setLoading(false);
            switch(err.code) {
                case "auth/email-already-in-use":
                    setErrorMsg("Email already in use");
                    break;
                case "auth/invalid-email":
                    setErrorMsg("Invalid email");
                    break;
                case "auth/weak-password":
                    setErrorMsg("Weak password");
                    break;
                default:
                    setErrorMsg("Unknown error");
                    break;
            }
        }
    }

    return (<>
        <div className="w-full h-full text-card-foreground shadow-sm bg-[#000000] flex justify-center items-center flex-col text-white" data-v0-t="card" style={{backgroundImage: `url(assets/loginbg.png)`}}>
            {loading && <div className="absolute inset-0 overflow-hidden">
                <img src="assets/placeholder.svg" alt="Animated Background" className="object-cover absolute" width="100" height="100" style={{aspectRatio: "100 / 100", top:'50%', left:'50%', transform:'translate(-50%, -50%)'}} />
                <div className="absolute inset-0 bg-black opacity-60"></div>
            </div>}
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight text-3xl text-center">Serene</h3>
                <p className="text-muted-foreground text-xl text-center">Register to start your adventure</p>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg text-gray-200"
                    htmlFor="username"
                >
                    Username
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black"
                    id="username"
                    placeholder="Enter username"
                    required={true}
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg text-gray-200"
                    htmlFor="email"
                >
                    Email
                </label>
                <input
                    className="text-black flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff]"
                    id="email"
                    required={true}
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg text-gray-200"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    className="text-black flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff]"
                    id="password"
                    placeholder="Enter password"
                    required={true}
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg text-gray-200"
                    htmlFor="confirm_password"
                >
                    Confirm Password
                </label>
                <input
                    className="text-black flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff]"
                    id="confirm_password"
                    placeholder="Confirm password"
                    required={true}
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                </div>
            </div>
            <div className="flex items-center p-6">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 w-full bg-[#ffffff] text-black"
                onClick={e => register()}>
                Register
                </button>
            </div>
            <div className="mt-4 text-center">
                <span className="text-red-400">{errorMsg}</span>
                <span className="text-green-400">{successMsg}</span>
            </div>
            <div className="mt-4 text-center">
                <a className="underline text-blue-400 cursor-pointer" onClick={e => setLogPage("login")}>
                Already have an account? Login
                </a>
            </div>
        </div>
    </>)
}
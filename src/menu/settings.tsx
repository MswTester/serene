import { FC, createContext, useContext, useState } from "react"
import { MenuContext } from "./main"
import { globalContext } from "../App"
import { User, sendPasswordResetEmail, updateEmail, updateProfile } from "firebase/auth"
import { auth } from "../api/firebase"

const SettingsContext = createContext<any>({})

const Main: FC = () => {
    const {user} = useContext(globalContext)
    const [isFetching, setIsFetching] = useState<boolean>(false)
    const [lang, setLang] = useState<string>("en")

    return <div className="flex w-full">
        <div className="flex-1 flex justify-end p-2">Language</div>
        <div className="flex-1 flex justify-start p-2 gap-2">
            <select className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 px-4 py-2 bg-[#ffffff] text-black ${isFetching && "opacity-50"}`} name="lang" id="lang"
            value={lang} onChange={e => setLang(e.target.value)}>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
            </select>
        </div>
    </div>
}

const Video: FC = (props) => {
    return <div className="flex w-full">
        <div className="flex-1 flex justify-end p-2">Resolution</div>
        <div className="flex-1 flex justify-start p-2 gap-2">
            <select name="resolution" id="resolution" className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 px-4 py-2 bg-[#ffffff] text-black`}>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
                <option value="360p">360p</option>
                <option value="240p">240p</option>
                <option value="144p">144p</option>
            </select>
        </div>
    </div>
}

const Audio: FC = () => {
    return <div className="flex w-full">
        <div className="flex-1 flex justify-end p-2">Volume</div>
        <div className="flex-1 flex justify-start p-2 gap-2">
            <input type="range" name="volume" id="volume" min="0" max="100" />
        </div>
    </div>
}

const Account: FC = () => {
    const {user} = useContext(globalContext)
    const [username, setUsername] = useState<string>(user.displayName || "")
    const [email, setEmail] = useState<string>(user.email || "")
    const [isFetching, setIsFetching] = useState<boolean>(false)

    return <>
        <div className="flex w-full">
            <div className="flex-1 flex justify-end p-2">Username</div>
            <div className="flex-1 flex justify-start p-2 gap-2">
                <input
                className={`flex h-8 w-60 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black ${isFetching && "opacity-50"}`}
                type="text" name="username" id="username" value={username} onChange={e => setUsername(e.target.value)}/>
                {user.displayName !== username && <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-8 px-4 py-2 bg-[#ffffff] text-black ${isFetching && "opacity-50"}`}
                onClick={e => {
                    setIsFetching(true);
                    updateProfile(user, {displayName: username}).then(() => setIsFetching(false)).catch(err => alert(err.message))
                }}>Save</button>}
            </div>
        </div>
        <div className="flex w-full">
            <div className="flex-1 flex justify-end p-2">Email</div>
            <div className="flex-1 flex justify-start p-2 gap-2">
                <input
                className={`flex h-8 w-60 rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black ${isFetching && "opacity-50"}`}
                type="text" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)}/>
                {user.email !== email && <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-8 px-4 py-2 bg-[#ffffff] text-black ${isFetching && "opacity-50"}`}
                onClick={e => {
                    setIsFetching(true);
                    updateEmail(user, email).then(() => setIsFetching(false)).catch(err => alert(err.message))
                }}>Save</button>}
            </div>
        </div>
        <div className="flex w-full">
            <div className="flex-1 flex justify-end p-2">Reset Password</div>
            <div className="flex-1 flex justify-start p-2 gap-2">
                <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-8 px-4 py-2 bg-[#ffffff] text-black ${isFetching && "opacity-50"}`}
                onClick={e => {setIsFetching(true);sendPasswordResetEmail(auth, user.email).then(() => setIsFetching(false)).catch(err => alert(err.message))}}
                >Send Email</button>
            </div>
        </div>
    </>
}

export default function Settings() {
    const {setMenuPage, setMsgbox} = useContext(MenuContext)
    const [settingsMenuPage, setSettingsMenuPage] = useState<"main"|"video"|"audio"|"account">("main")

    return <div className="w-full h-full bg-cover text-white bg-black bg-center flex flex-col justify-center items-center overflow-hidden" style={{backgroundImage: `url(assets/mainbg.png)`}}>
        <div className="bg-[rgba(0,0,0,0.3)] w-full h-full">
            <button onClick={e => setMenuPage('main')} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black absolute bottom-5 left-5">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
            >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
            </svg>
            Back to Menu
            </button>
            <div className="flex flex-col justify-center items-center w-full">
                <div className="flex justify-center items-center flex-1 w-full h-full">
                    <div className="flex justify-between items-center w-full">
                        <button onClick={e => setSettingsMenuPage("main")} className={`flex-1 p-2 bg-black bg-opacity-50 ${settingsMenuPage === "main" && "bg-gray-900"}`}>
                            <h3 className="text-2xl">Main</h3>
                        </button>
                        <button onClick={e => setSettingsMenuPage("video")} className={`flex-1 p-2 bg-black bg-opacity-50 ${settingsMenuPage === "video" && "bg-gray-900"}`}>
                            <h3 className="text-2xl">Video</h3>
                        </button>
                        <button onClick={e => setSettingsMenuPage("audio")} className={`flex-1 p-2 bg-black bg-opacity-50 ${settingsMenuPage === "audio" && "bg-gray-900"}`}>
                            <h3 className="text-2xl">Audio</h3>
                        </button>
                        <button onClick={e => setSettingsMenuPage("account")} className={`flex-1 p-2 bg-black bg-opacity-50 ${settingsMenuPage === "account" && "bg-gray-900"}`}>
                            <h3 className="text-2xl">Account</h3>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-start items-center overflow-auto w-full">
                    {settingsMenuPage === "main" ? <Main /> :
                    settingsMenuPage === "video" ? <Video /> :
                    settingsMenuPage === "audio" ? <Audio /> :
                    settingsMenuPage === "account" ? <Account /> :
                    <></>}
                </div>
            </div>
        </div>
    </div>
}
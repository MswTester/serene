import { useContext, useState, createContext, useEffect } from "react";
import { globalContext } from "../App";

import Server from "./server";
import Settings from "./settings";
import About from "./about";

export const MenuContext = createContext<any>({});

export default function Menu() {
    const {setPage} = useContext(globalContext);
    const [menuPage, setMenuPage] = useState<"main"|"server"|"settings"|"about">("main");

    useEffect(() => {
        const keydown = (e:KeyboardEvent) => {
            if(e.code === 'KeyD' && e.altKey){
                e.preventDefault();
                setPage('dev');
            }
        }
        document.addEventListener('keydown', keydown)

        return () => {
            document.removeEventListener('keydown', keydown)
        }
    }, [])
    
    return (<MenuContext.Provider value={{
        menuPage, setMenuPage,
        }}>
            {
                menuPage === "main" ? <div className="w-full h-full bg-cover text-white bg-black bg-center flex flex-col justify-center items-center space-y-7 overflow-hidden" style={{backgroundImage: `url(assets/mainbg.png)`}}>
                    <h3 className="font-semibold text-5xl text-center">Serene</h3>
                    <button onClick={e => setMenuPage("server")} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black font-semibold shadow-md shadow-black" style={{width:'30%', minWidth:'100px', maxWidth:'400px'}}>Server</button>
                    <button onClick={e => setMenuPage("settings")} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black font-semibold shadow-md shadow-black" style={{width:'30%', minWidth:'100px', maxWidth:'400px'}}>Settings</button>
                    <button onClick={e => setMenuPage("about")} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black font-semibold shadow-md shadow-black" style={{width:'30%', minWidth:'100px', maxWidth:'400px'}}>About</button>
                </div>:
                menuPage === "server" ? <Server /> :
                menuPage === "settings" ? <Settings /> :
                menuPage === "about" ? <About /> :
                <></>
            }
    </MenuContext.Provider>);
}
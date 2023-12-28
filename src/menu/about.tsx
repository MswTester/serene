import { useContext } from "react";
import { MenuContext } from "./main";

export default function About() {
    const {setMenuPage} = useContext(MenuContext);
    return <div className="w-full h-full bg-cover text-white bg-black bg-center flex flex-col justify-center items-center overflow-hidden" style={{backgroundImage: `url(assets/mainbg.png)`}}>
        <div className="bg-[rgba(0,0,0,0.3)] w-full h-full flex flex-col justify-center items-center text-center gap-10 font-semibold">
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
            <h3 className="font-semibold text-5xl">Serene</h3>
            <p>Directed by MswTester</p>
            <p>Programmer : MswTester</p>
            <p>Designer : MswTester</p>
        </div>
    </div>
}
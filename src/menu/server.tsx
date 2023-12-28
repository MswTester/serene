import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { globalContext } from "../App";
import { MenuContext } from "./main";

export default function Index(){
    const {setPage, setSocket} = useContext(globalContext);
    const {setMenuPage} = useContext(MenuContext);
    const [servers, setServers] = useState<fetchedServer[]>([]);
    const [msgbox, setMsgbox] = useState<string>("");
    const [search, setSearch] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [port, setPort] = useState<number>(0);

    useEffect(() => {
        localStorage.getItem('serene-servers');

        if(!localStorage.getItem('serene-servers')){
            localStorage.setItem('serene-servers', JSON.stringify([]));
        }

        const servers = JSON.parse(localStorage.getItem('serene-servers')!);
        getServer(servers)
    }, []);

    const addServerToStorage = (address:string, port:number) => {
        let server: Server = {
            address: address,
            port: port
        }
        let servers = JSON.parse(localStorage.getItem('serene-servers')!);
        servers.push(server);
        localStorage.setItem('serene-servers', JSON.stringify(servers));
        getServer(servers)
    }

    const editServer = (idx:number, address:string, port:number) => {
        let server: Server = {
            address: address,
            port: port
        }
        let servers = JSON.parse(localStorage.getItem('serene-servers')!);
        servers[idx] = server;
        localStorage.setItem('serene-servers', JSON.stringify(servers));
        getServer(servers)
    }

    const fetchServerData = async (server:fetchedServer) => {
        try {
            const res = await fetch(`http://${server.address}:${server.port}`);
            const data = await res.json();
            return {
                name: data.name,
                description: data.description,
                date: data.date,
                address: server.address,
                port: server.port,
                maxPlayers: data.maxplayers,
                players: data.onlineplayers,
                online: true
            };
        } catch (error) {
            return {
                name: `${server.address}:${server.port}`,
                description: "Offline",
                date: "Offline",
                address: server.address,
                port: server.port,
                maxPlayers: 0,
                players: 0,
                online: false
            };
        }
    }

    const getServer = async (nonfetched_servers:Server[]) => {
        let fetched_servers:fetchedServer[] = nonfetched_servers.map((server) => {
            return {
                name: `${server.address}:${server.port}`,
                description: "Fetching...",
                date: "Fetching...",
                address: server.address,
                port: server.port,
                maxPlayers: 0,
                players: 0,
                online: false
            }
        });
        setServers(fetched_servers);
        let res_servers:fetchedServer[] = []
        for (const server of fetched_servers) {
            fetchServerData(server).then((serverData:fetchedServer) => {
                res_servers.push(serverData);
                setServers(res_servers);
            });
        }
    }

    return (<div className="w-full h-full bg-cover text-white bg-black bg-center flex flex-col justify-center items-center overflow-hidden" style={{backgroundImage: `url(assets/mainbg.png)`}}>
        <div className="bg-[rgba(0,0,0,0.3)] w-full h-full overflow-auto">
            <div className="flex justify-between items-center p-4 bg-[rgba(255,255,255,0.1)]">
                <button onClick={e => setMenuPage('main')} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black">
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
                <div className="space-y-2">
                <label
                    className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg text-gray-200"
                    htmlFor="map"
                >
                    Search Map
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black"
                    id="map"
                    placeholder="Enter map name"
                    required={true}
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black"
                onClick={e => setMsgbox("addServer")}>
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
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                </svg>
                Add Server
                </button>
            </div>
            {servers.map((server, i) => {
                return server.name.match(search) && <div key={i} className="flex-col justify-start overflow-auto space-y-3 p-3">
                    <div className="border text-card-foreground shadow-sm bg-[#000000a0] rounded-2xl border-none" data-v0-t="card">
                        <div className="flex flex-col space-y-1.5 p-5">
                        <h3 className="font-semibold tracking-tight text-5xl text-white">{server.name}</h3>
                        <p className="text-xl font-semibold text-gray-100">{server.description}</p>
                        <p className="text-lg text-gray-300">Date : {server.date}</p>
                        <p className="text-lg text-gray-300">Address : {server.address}:{server.port}</p>
                        <p className="text-lg text-gray-300">Players : {server.players}/{server.maxPlayers}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex justify-end">
                                {server.online && <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#aaffaa] text-black mr-2"
                                onClick={e => {
                                    let socket = io(`http://${server.address}:${server.port}`)
                                    socket.on('connect', () => {
                                        setSocket(socket)
                                        setPage('game')
                                    })
                                }}>
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
                                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                </svg>
                                Join
                                </button>}
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black mr-2"
                                onClick={e => {
                                    setMsgbox(`editServer ${i}`)
                                    setAddress(server.address)
                                    setPort(server.port)
                                }}>
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
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                                    <path d="m15 5 4 4"></path>
                                </svg>
                                Edit
                                </button>
                                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffaaaa] text-black"
                                onClick={e => {
                                    let servers = JSON.parse(localStorage.getItem('serene-servers')!);
                                    servers.splice(i, 1);
                                    localStorage.setItem('serene-servers', JSON.stringify(servers));
                                    getServer(servers)
                                }}>
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
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            })}
            {msgbox && <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-[#00000080]">
                <div className="flex-col justify-center items-center p-5 bg-[#000000a0] rounded-xl space-y-5">
                    <div className="flex-col justify-center items-center">
                        <p>Server Address</p>
                        <input value={address} onChange={e => setAddress(e.target.value)} type="text" name="" id="" className="flex h-8 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black" placeholder="Enter server address"/>
                    </div>
                    <div className="flex-col justify-center items-center">
                        <p>Server Port</p>
                        <input value={port} onChange={e => setPort(+e.target.value)} type="number" name="" id="" className="flex h-8 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-[#ffffff] text-black" placeholder="Enter server port"/>
                    </div>
                    <div className="flex flex-row justify-between">
                        <button onClick={e => setMsgbox("")} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black">Cancel</button>
                        <button onClick={e => {
                            setAddress('')
                            setPort(0)
                            if(msgbox == "addServer"){
                                addServerToStorage(address, port)
                            } else if(msgbox.split(" ")[0] == "editServer"){
                                editServer(+msgbox.split(" ")[1], address, port)
                            }
                            setMsgbox("")
                        }} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-[#ffffff] text-black">
                            {msgbox == "addServer" ? "Add" :
                            msgbox.split(" ")[0] == "editServer" ? "Edit":
                            ""}
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    </div>);
}
interface CT{
    lang: string;
    setLang: React.Dispatch<React.SetStateAction<string>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    page: Page;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
    socket: SocketIOClient.Socket;
    setSocket: React.Dispatch<React.SetStateAction<SocketIOClient.Socket>>;
}

type Page = "menu" | "login" | "game"

interface Server{
    address: string;
    port: number;
}

interface fetchedServer{
    name: string;
    description: string;
    date: string;
    address: string;
    port: number;
    players: number;
    maxPlayers: number;
    online: boolean;
}

type Point = [number, number];
type Polygon = Point[];

interface RenderObject{
    src:string;
    x:number;
    y:number;
    oWidth:number;
    oHeight:number;
    width:number;
    height:number;
}
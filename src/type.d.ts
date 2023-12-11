interface CT{
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    page: Page;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

type Page = "menu" | "login"

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
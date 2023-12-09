
interface CT{
    user?: User | null;
    setUser?: Dispatch<SetStateAction<User | null>>;
    page?: Page;
    setPage?: Dispatch<SetStateAction<Page>>;
}

type Page = 'menu' | 'login' | 'register' | 'profile' | '404' | 'playing';

interface CT{
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    page: Page;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

type Page = "menu" | "login"
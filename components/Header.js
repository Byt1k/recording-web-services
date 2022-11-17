import Link from "next/link";

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <Link href='/'>
                    <img src='/logo.svg' alt="Logo" />
                </Link>
                <nav className="header__menu">
                    <Link href='/search'>Поиск записей</Link>
                    <Link href='/list'>Список записей</Link>
                    <Link href='/ref'>Справка</Link>
                </nav>
                <div className="header__user">
                    Носова Алина
                    <img src="/header-arrow.svg" alt="arrow"/>
                </div>
            </div>
        </header>
    );
};

export default Header;
import "./index.css";

const Topbar = () => {
    return (
        <header className="top-bar">
            <a className="logo" href="#">LOGO</a>
            <nav className="nav-top-bar">
                <ul className="list-link-top-bar">
                    <li className="link-top-bar"><a href="#">Juntar PDF</a></li>
                    <li className="link-top-bar"><a href="#">Dividir PDF</a></li>
                    <li className="link-top-bar"><a href="#">Comprimir PDF</a></li>
                    <li className="link-top-bar"><a href="#">Converter PDF</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Topbar;
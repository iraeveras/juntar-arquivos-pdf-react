import { Link } from "react-router-dom";
import "./index.css";

const Topbar = () => {
    return (
        <header className="top-bar">
            <a className="logo" href="#">LOGO</a>
            <nav className="nav-top-bar">
                <ul className="list-link-top-bar">
                    <li className="link-top-bar"><Link to="/">Juntar PDF</Link></li>
                    <li className="link-top-bar"><Link to="/converte-excel-pdf">Converter PDF</Link></li>
                    <li className="link-top-bar"><Link to="#">Comprimir PDF</Link></li>
                    <li className="link-top-bar"><Link to="#">Dividir PDF</Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Topbar;
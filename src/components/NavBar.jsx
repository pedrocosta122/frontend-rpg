import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    
    const isAdmin = localStorage.getItem("role") === "admin";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-space-between">
            <div className="navbar-links-group">
                <Link to="/catalogue" className="nav-link">Catálogo de Sistemas</Link>
                <Link to="/library" className="nav-link">Minha Biblioteca</Link>
                
                {isAdmin && (
                    <Link to="/admin" className="nav-link nav-link-admin">Painel Admin</Link>
                )}
            </div>

            <div className="navbar-links-group">
                <Link to="/add-system" className="nav-link nav-link-bold">
                    + Adicionar Sistema
                </Link>
                
                <button onClick={handleLogout} className="nav-link nav-btn-logout">
                    Sair
                </button>
            </div>
        </nav>
    );
}
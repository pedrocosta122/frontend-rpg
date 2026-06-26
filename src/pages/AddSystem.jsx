import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AddSystem() {
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [year, setYear] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");

        if(!token) {
            alert("Você precisa estar logado para cadastrar um sistema");
            navigate("/login");

            return;
        }

        try {
            const responte = await fetch("http://localhost:3000/api/books", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    publisher,
                    year: Number(year)
                })
            });

            if(!responte.ok) {
                throw new Error("Erro ao cadastrar novo sistema no catálogo");
            }

            alert("Sistema cadastrado com sucesso!");

            navigate("/catalogue");
        } catch(error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container form-container">
            <nav className="navbar" style={{ marginBottom: '20px', borderRadius: '8px' }}>
                <Link to="/catalogue" className="nav-link">Voltar ao Catálogo</Link>
            </nav>

            <h1 className="page-title">Cadastrar Novo Sistema</h1>
            
            <form onSubmit={handleCreate} className="standard-form">
                <input 
                    type="text" 
                    placeholder="Nome do Sistema" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-input"
                />
                
                <input 
                    type="text" 
                    placeholder="Editora" 
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    required
                    className="form-input"
                />

                <input 
                    type="number" 
                    placeholder="Ano de Lançamento" 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                    className="form-input"
                />

                {error && <p className="error-msg">{error}</p>}
                
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Salvando..." : "Cadastrar Sistema"}
                </button>
            </form>
        </div>
    );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao realizar o cadastro. Tente novamente.");
            }

            navigate("/login");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container form-container">
            <h1 className="page-title">Criar Nova Conta</h1>
            
            <form onSubmit={handleRegister} className="standard-form">
                <input 
                    type="text" 
                    placeholder="Seu Nome" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                />

                <input 
                    type="email" 
                    placeholder="Seu E-mail" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-input"
                />
                
                <input 
                    type="password" 
                    placeholder="Sua Senha" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="form-input"
                />

                {error && <p className="error-msg">{error}</p>}
                
                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#2b1d0f' }}>
                Já possui uma conta? <Link to="/login" style={{ color: '#8b0000', fontWeight: 'bold' }}>Faça Login</Link>
            </p>
        </div>
    );
}
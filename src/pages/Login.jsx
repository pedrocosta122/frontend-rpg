import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao fazer login. Verifique as suas credenciais.");
            }

            localStorage.setItem("token", data.token);
            navigate("/catalogue");

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container form-container">
            <h1 className="page-title">Acesso ao Sistema</h1>
            
            <form onSubmit={handleLogin} className="standard-form">
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
                    {loading ? "Autenticando..." : "Entrar"}
                </button>
            </form>
            
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#2b1d0f' }}>
                Ainda não tem uma conta? <Link to="/register" style={{ color: '#8b0000', fontWeight: 'bold' }}>Cadastre-se aqui</Link>
            </p>

        </div>
    );
}
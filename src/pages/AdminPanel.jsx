import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editingUserId, setEditingUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({ name: '', email: '', role: '' });
    
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") {
            alert("Acesso negado. Apenas administradores podem acessar esta página.");
            navigate("/catalogue");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://localhost:3000/api/users", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Erro ao buscar a lista de usuários.");

                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        const confirmacao = window.confirm("PERIGO: Tem certeza que deseja excluir este usuário permanentemente do sistema?");
        if (!confirmacao) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Erro ao excluir usuário.");

            alert("Usuário removido com sucesso!");
            setUsers(prevUsers => prevUsers.filter(user => String(user._id || user.id) !== String(userId)));
            
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditClick = (user) => {
        setEditingUserId(user.id || user._id);
        setEditFormData({
            name: user.name || '',
            email: user.email || '',
            role: user.role || 'user'
        });
    };

    const handleSaveEdit = async (userId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });

            if (!response.ok) throw new Error("Erro ao atualizar os dados do usuário.");

            // Atualização Otimista da Interface
            setUsers(prevUsers => prevUsers.map(user => {
                if (String(user.id || user._id) === String(userId)) {
                    return { ...user, ...editFormData };
                }
                return user;
            }));

            setEditingUserId(null);
            alert("Usuário atualizado com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) return <p className="status-msg">Carregando painel de administração...</p>;
    if (error) return <p className="status-msg">Erro: {error}</p>;

    return (
        <div className="app-container">
            <nav className="navbar navbar-space-between">
                <div className="navbar-links-group">
                    <Link to="/catalogue" className="nav-link">Catálogo de Sistemas</Link>
                    <Link to="/library" className="nav-link">Minha Biblioteca</Link>
                </div>
            </nav>

            <h1 className="page-title admin-page-title">Painel do Administrador</h1>
            <p className="admin-page-subtitle">Gerenciamento de Contas de Usuários</p>

            {users.length === 0 ? (
                <p className="status-msg">Nenhum usuário encontrado.</p>
            ) : (
                <ul className="book-list admin-users-list">
                    {users.map(user => (
                        <li key={user.id || user._id} className="book-card user-management-card">
                            
                            {editingUserId === (user.id || user._id) ? (
                                <div className="admin-edit-form">
                                    <div className="admin-edit-row">
                                        <input 
                                            type="text" 
                                            value={editFormData.name} 
                                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                            className="admin-edit-input"
                                            placeholder="Nome"
                                        />
                                        <input 
                                            type="email" 
                                            value={editFormData.email} 
                                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                            className="admin-edit-input"
                                            placeholder="Email"
                                        />
                                        <select 
                                            value={editFormData.role}
                                            onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                                            className="admin-edit-select"
                                        >
                                            <option value="user">Usuário Comum</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                    <div className="user-actions-group">
                                        <button onClick={() => handleSaveEdit(user.id || user._id)} className="action-btn add-btn edit-account-btn">Salvar</button>
                                        <button onClick={() => setEditingUserId(null)} className="action-btn cancel-btn">Cancelar</button>
                                    </div>
                                </div>

                            ) : (
                                <>
                                    <div className="user-info-display">
                                        <h3 className="book-title">{user.name || 'Usuário Sem Nome'}</h3>
                                        <p><strong>Email:</strong> {user.email}</p>
                                        <p>
                                            <strong>Cargo:</strong>{' '}
                                            <span className={user.role === 'admin' ? 'role-badge-admin' : 'role-badge-user'}>
                                                {user.role}
                                            </span>
                                        </p>
                                    </div>
                                    
                                    <div className="user-actions-group">
                                        <button 
                                            onClick={() => handleEditClick(user)} 
                                            className="action-btn edit-account-btn"
                                        >
                                            Editar
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleDeleteUser(user.id || user._id)} 
                                            className="action-btn remove-btn delete-account-btn" 
                                            disabled={user.role === 'admin'}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
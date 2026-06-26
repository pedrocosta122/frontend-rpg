import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import BookCard from '../components/BookCard';

export default function UserLibrary() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const getMyBooks = async () => {
            const token = localStorage.getItem("token");

            if(!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch("${import.meta.env.VITE_API_URL}/api/library", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if(!response.ok) {
                    if(response.status === 401 || response.status === 403) {
                        localStorage.removeItem("token");
                    
                        navigate("/login");
                        throw new Error("Sessão expirada. Faça login novamente");
                    }
                    throw new Error("Erro ao conectar à sua biblioteca.");
                }

                const data = await response.json();

                setBooks(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getMyBooks();
    }, [navigate]);

    const handleUpdate = async (libraryId, updateData) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/library/${libraryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) throw new Error("Erro ao atualizar os dados no servidor.");

            setBooks(prevBooks => prevBooks.map(item => {
                if (String(item.id || item._id) === String(libraryId)) {
                    return { 
                        ...item, 
                        campaignNotes: updateData.campaignNotes, 
                        bookLink: updateData.bookLink !== undefined ? updateData.bookLink : item.bookLink 
                    };
                }
                return item;
            }));

            alert("Informações atualizadas com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRemove = async (bookId) => {
        const confirmation = window.confirm("Tem certeza que deseja remover este sistema da sua biblioteca?");
        if (!confirmation) return;

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/library/${bookId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Erro ao remover o sistema.");

            alert("Sistema removido da sua biblioteca com sucesso!");

            setBooks(books.filter(item => String(item.id || item._id) !== String(bookId)));
            
        } catch (error) {
            alert(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    
    return (
        <div className="app-container">
            <nav className="navbar" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/catalogue" className="nav-link">Catálogo de Sistemas</Link>
                    <Link to="/library" className="nav-link">Minha Biblioteca</Link>
                </div>

                <button onClick={handleLogout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    Sair
                </button>
            </nav>

            <h1 className="page-title">Minha Biblioteca Pessoal</h1>

            {books.length === 0 ? (
                <p className="status-msg">Você ainda não adicionou nenhum sistema à sua biblioteca.</p>
            ) : (
                <ul className="book-list">
                    {books.map(item => {
                        const bookData = item.book || item.bookId || item;

                        return (
                            <BookCard 
                                key={item.id || item._id}
                                book={bookData}
                                isLibrary={true}
                                onAction={() => handleRemove(item.id || item._id)}
                                libraryEntry={item}
                                onUpdate={handleUpdate}
                            />
                        )
                    })}
                </ul>
            )}
        </div>
    );
}
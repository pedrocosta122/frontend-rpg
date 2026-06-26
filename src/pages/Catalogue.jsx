import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';

export default function Catalogue() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/books");

                if(!response.ok) {
                    throw new Error("Erro ao conectar ao catálogo");
                }

                const data = await response.json();

                setBooks(data);
            } catch (error) {
                setError("Falha na comunicação com a API.")
            } finally {
                setLoading(false);
            }
        };

        getBooks();
    }, []);

    const handleAdd = async (bookId) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Você precisa fazer login para adicionar sistemas à sua estante!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/library", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ bookId })
            });

            if (!response.ok) throw new Error("Erro ao adicionar o sistema");
            
            alert("Sistema adicionado à sua biblioteca com sucesso!");
        } catch (error) {
            alert(error.message);
        }
    };

    if(loading) return <p className='status-msg'> Carregando catálogo de RPG...</p>;
    if(error) return <p classname='status-msg' style={{ color: 'red' }}>Erro: {error}</p>;
    
    return (
        <div className='app-container'>
            <nav className='navbar' style={{ justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: '20px'}}>
                    <Link to='/catalogue' className='nav-link'>Catálogo de Sistemas</Link>
                    <Link to='/library' className='nav-link'>Minha Biblioteca</Link>
                </div>

                <Link to='/add-system' className='nav-link' style={{ color: '#8b0000', fontWeight: 'bold' }}>+ Adicionar Sistema</Link>
            </nav>

            <h1 className='page-title'>Catálogo de RPG</h1>

            {books.length === 0 ? (
                <p className='status-msg'>A biblioteca está vazia no momento.</p>
            ) : (
                <ul className='book-list'>
                    {books.map(book => (
                        <BookCard 
                            key={book.id || book._id}
                            book={book}
                            isLibrary={false}
                            onAction={handleAdd}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
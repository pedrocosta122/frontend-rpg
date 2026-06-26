import { useState } from 'react';

export default function BookCard({ book, isLibrary, onAction, libraryEntry, onUpdate }) {
  const bookId = book._id || book.id;
  
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [notes, setNotes] = useState(libraryEntry?.campaignNotes || '');
  const [link, setLink] = useState(libraryEntry?.bookLink || '');

  const handleSave = async () => {
      await onUpdate(libraryEntry.id || libraryEntry._id, { 
          campaignNotes: notes, 
          bookLink: link 
      });
      setIsEditing(false);
  };

  return (
    <li className={`book-card ${isLibrary ? 'book-card-library' : ''}`}>
      <h3 className="book-title">{book.title}</h3>
      <p><strong>Sistema/Editora:</strong> {book.publisher || 'Não informada'}</p>
      <p><strong>Ano de Lançamento:</strong> {book.year || 'Não informado'}</p>
      
      {isLibrary && libraryEntry && (
        <div className="card-details-section">
            <button 
                onClick={() => {
                    setShowDetails(!showDetails);
                    setIsEditing(false);
                }} 
                className="action-btn toggle-details-btn"
            >
                {showDetails ? "Ocultar Informações" : "Ver Notas & Links"}
            </button>
            
            {showDetails && (
                <div className="details-content">
                    {isEditing ? (
                        <div className="edit-mode-container">
                            <label className="form-label">Link do Material (PDF/Site):</label>
                            <input 
                                type="text" 
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="form-input"
                                placeholder="https://..."
                            />
                            
                            <label className="form-label">Minhas Anotações de Campanha:</label>
                            <textarea 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="form-input form-textarea"
                                rows="3"
                                placeholder="Notas sobre mesas, personagens..."
                            />
                            
                            <div className="btn-group">
                                <button onClick={handleSave} className="action-btn add-btn flex-btn">Salvar</button>
                                <button onClick={() => setIsEditing(false)} className="action-btn cancel-btn">Cancelar</button>
                            </div>
                        </div>
                    ) : (
                        <div className="view-mode-container">
                            <p>
                                <strong>Link do Livro:</strong> {libraryEntry.bookLink ? (
                                    <a href={libraryEntry.bookLink} target="_blank" rel="noopener noreferrer" className="external-link">
                                        Acessar Link Externo
                                    </a>
                                ) : <span className="empty-link">Nenhum link adicionado</span>}
                            </p>
                            
                            <p><strong>Anotações:</strong></p>
                            <p className="notes-display">
                                {libraryEntry.campaignNotes || 'Nenhuma anotação registrada ainda.'}
                            </p>
                            
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="action-btn add-btn full-width-btn"
                            >
                                Editar Notas e Link
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      )}

      {onAction && (
        <button 
          onClick={() => onAction(bookId)} 
          className={`action-btn ${isLibrary ? "remove-btn margin-library" : "add-btn margin-catalogue"}`}
        >
          {isLibrary ? "Remover da Estante" : "Adicionar à Biblioteca"}
        </button>
      )}
    </li>
  );
}
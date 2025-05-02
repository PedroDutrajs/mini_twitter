import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../../services/api';
import styles from '../../styles/PostForm.module.css'

const CreatePost = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('O texto do post não pode ficar vazio.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createPost(content, image);
      // após criar, volta ao feed
      navigate('/feed');
    } catch (err: any) {
      console.error('Erro ao criar post:', err);
      setError(err.response?.data?.detail || 'Falha ao criar post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Novo Post</h2>
        {error && <div className={styles.error}>{error}</div>}
        <textarea
          placeholder="O que está pensando?"
          value={content}
          onChange={e => setContent(e.target.value)}
          className={styles.textarea}
          rows={4}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] ?? null)}
          className={styles.fileInput}
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

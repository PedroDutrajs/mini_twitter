import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updatePost } from '../../services/api';
import api from '../../services/api';
import styles from '../../styles/PostForm.module.css';

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // busca dados atuais do post
    api.get(`posts/${postId}/`)
      .then(res => {
        setContent(res.data.content);
      })
      .catch(() => {
        setError('Não foi possível carregar o post.');
      });
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePost(postId, content, imageFile);
      navigate('/feed');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro ao atualizar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Editar Post</h2>
        {error && <div className={styles.error}>{error}</div>}
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          className={styles.textarea}
          rows={4}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImageFile(e.target.files?.[0] ?? null)}
          className={styles.fileInput}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default EditPost;

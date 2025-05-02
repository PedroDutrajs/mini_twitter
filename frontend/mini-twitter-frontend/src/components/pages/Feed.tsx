// src/pages/Feed.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { deletePost } from '../../services/api';
import styles from '../../styles/Feed.module.css';


interface Post {
  id: number;
  author: string; 
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const myUsername = localStorage.getItem('user_username') || '';

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res  = await api.get('feed/', { params: { page } });
      const data = res.data.results ?? res.data;
      setPosts(data);
    } catch (err: any) {
      console.error('Erro ao buscar feed:', err.response || err.message);
      if (err.response?.status === 401) {
        // limpa tudo e redireciona
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_username');
        navigate('/');
        return;
      }
      setError('Não foi possível carregar o feed.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: number) => {
    try {
      await api.post(`posts/${postId}/like/`);
      setPosts(posts.map(p =>
        p.id === postId
          ? {
              ...p,
              likes_count: p.is_liked
                ? p.likes_count - 1
                : p.likes_count + 1,
              is_liked: !p.is_liked,
            }
          : p
      ));
    } catch (err) {
      console.error('Erro ao curtir/descurtir:', err);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!window.confirm('Deseja realmente excluir este post?')) return;
    try {
      await deletePost(postId);
      fetchPosts();
    } catch (err) {
      console.error('Erro ao deletar post:', err);
      alert('Não foi possível excluir o post.');
    }
  };

  if (loading) return <p className={styles.info}>Carregando feed…</p>;
  if (error)   return <p className={styles.error}>{error}</p>;
  if (!posts.length) return <p className={styles.info}>Sem posts para mostrar.</p>;

  return (
    
    <div className={styles.wrapper}>

      <div className={styles.topBar}>
        <h1 className={styles.title}>Seu Feed</h1>
        <button
          onClick={() => navigate('/create')}
          className={styles.newPostButton}
        >
          + Novo Post
        </button>
      </div>

      {posts.map(post => (
        <div key={post.id} className={styles.postCard}>
          <div className={styles.header}>
            <strong>{post.author}</strong>
            <span>{new Date(post.created_at).toLocaleString()}</span>
          </div>

          <p className={styles.content}>{post.content}</p>

          {post.image_url && (
            <img
              src={post.image_url}
              alt="Post"
              className={styles.image}
            />
          )}

          <div className={styles.actions}>
            <button
              onClick={() => toggleLike(post.id)}
              className={styles.likeButton}
            >
              {post.is_liked ? '♥' : '♡'} {post.likes_count}
            </button>

            {post.author === myUsername && (
              <>
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className={styles.editButton}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className={styles.deleteButton}
                >
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;

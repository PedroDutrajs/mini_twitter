// src/pages/ProfilePage.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/ProfilePage.module.css';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Post {
  id: number;
  author: string;
  content: string;
  image_url: string | null;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
}

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const nav = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = async () => {
    try {
      // pega a lista filtrada e extrai o usuário exato
      const resU = await api.get('users/', { params: { search: username } });
      const found = resU.data.find((u: User) => u.username === username);
      if (!found) throw new Error('Usuário não encontrado');
      setUser(found);

      // followers/following counts
      const resF = await api.get(`users/${username}/followers/`);
      setFollowersCount(resF.data.length);
      const resG = await api.get(`users/${username}/following/`);
      setFollowingCount(resG.data.length);

      // posts
      const resP = await api.get(`users/${username}/posts/`);
      setPosts(resP.data);


      // verifica se estou seguindo
      const current = await api.get(`users/${username}/followers/`);
      const me = localStorage.getItem('user_username');
      setIsFollowing(current.data.some((f: any) => f.username === me));
      setError('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Falha ao carregar perfil');
    }
  };

  const toggleFollow = async () => {
    try {
      const url = `users/${username}/${isFollowing ? 'unfollow' : 'follow'}/`;
      await api.post(url);
      setIsFollowing(!isFollowing);
      setFollowersCount(fc => fc + (isFollowing ? -1 : 1));
    } catch {
      alert('Falha ao alterar seguimento');
    }
  };

  useEffect(() => {
    if (!username) nav('/feed');
    else fetchProfile();
  }, [username]);

  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p>Carregando perfil…</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{user.username}</h1>
        <button onClick={toggleFollow} className={styles.followBtn}>
          {isFollowing ? 'Deixar de seguir' : 'Seguir'}
        </button>
      </header>
      <p>Email: {user.email}</p>
      <p>Seguidores: {followersCount}</p>
      <p>Seguindo: {followingCount}</p>

      <section className={styles.postsSection}>
        <h2>Posts de {user.username}</h2>
        {posts.map(p => (
          <div key={p.id} className={styles.postCard}>
            <strong>{p.author}</strong>
            <p>{p.content}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ProfilePage;

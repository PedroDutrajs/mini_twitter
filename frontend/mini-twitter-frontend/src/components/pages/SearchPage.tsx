import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from '../../styles/SearchPage.module.css';

interface User {
  id: number;
  username: string;
  email: string;
}

interface SearchUser extends User {
  isFollowing: boolean;
}

const SearchPage = () => {
  const [term, setTerm] = useState('');
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const myUsername = localStorage.getItem('user_username') || '';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      // 1) busca usuários
      const res = await api.get('users/', { params: { search: term } });
      const fetched: User[] = res.data;

      // 2) verifica para cada usuário se já sigo
      const withFollow = await Promise.all(
        fetched.map(async u => {
          if (u.username === myUsername) {
            return { ...u, isFollowing: false };
          }
          const r = await api.get(`users/${u.username}/followers/`);
          const followers: { username: string }[] = r.data;
          return {
            ...u,
            isFollowing: followers.some(f => f.username === myUsername),
          };
        })
      );

      setUsers(withFollow);
    } catch {
      setError('Erro na busca de usuários.');
    }
  };

  const toggleFollow = async (username: string, isFollowing: boolean) => {
    try {
      const url = `users/${username}/${isFollowing ? 'unfollow' : 'follow'}/`;
      await api.post(url);
      setUsers(users.map(u =>
        u.username === username
          ? { ...u, isFollowing: !isFollowing }
          : u
      ));
    } catch {
      alert('Falha ao alterar status de seguimento.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          placeholder="Buscar usuários..."
          value={term}
          onChange={e => setTerm(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Buscar
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <ul className={styles.list}>
        {users.map(u => (
          <li key={u.id} className={styles.item}>
            <div
              onClick={() => navigate(`/profile/${u.username}`)}
              className={styles.userInfo}
            >
              <strong>{u.username}</strong> ({u.email})
            </div>

            {u.username !== myUsername && (
              <button
                onClick={() => toggleFollow(u.username, u.isFollowing)}
                className={styles.followButton}
              >
                {u.isFollowing ? 'Parar de seguir' : 'Seguir'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;

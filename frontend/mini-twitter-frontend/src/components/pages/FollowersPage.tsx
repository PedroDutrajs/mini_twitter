// src/pages/FollowersPage.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/ListPage.module.css';
import { useNavigate } from 'react-router-dom';

interface User { id: number; username: string; }

const FollowersPage = () => {
  const [list, setList]   = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('user_username')!;

  useEffect(() => {
    api.get(`users/${username}/followers/`)
       .then(r => setList(r.data))
       .catch(() => setError('Falha ao carregar seguidores.'));
  }, [username]);

  return (
    <div className={styles.container}>
      <h1>Seguidores de {username}</h1>
      {error && <p className={styles.error}>{error}</p>}
      <ul className={styles.list}>
        {list.map(u => (
          <li key={u.id} onClick={() => navigate(`/profile/${u.username}`)}>
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersPage;

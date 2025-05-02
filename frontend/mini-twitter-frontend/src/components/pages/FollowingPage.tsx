// src/pages/FollowingPage.tsx
import { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/ListPage.module.css';
import { useNavigate } from 'react-router-dom';

interface User { id: number; username: string; }

const FollowingPage = () => {
  const [list, setList] = useState<User[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('user_username')!;

  useEffect(() => {
    api.get(`users/${username}/following/`)
       .then(r => setList(r.data))
       .catch(() => setError('Falha ao carregar seguindo.'));
  }, [username]);

  return (
    <div className={styles.container}>
      <h1>{username} Seguindo</h1>
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

export default FollowingPage;

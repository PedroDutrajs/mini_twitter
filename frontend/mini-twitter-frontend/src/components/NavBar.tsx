// src/components/NavBar.tsx

import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import api from '../services/api';
import styles from '../styles/NavBar.module.css';

const NavBar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('user_username') || '';
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      await api.post('/logout/', { refresh });
    } catch {
    }
    localStorage.clear();
    navigate('/');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark', !darkMode);
  };

  return (
    <nav className={`${styles.navbar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.left}>
        <span
          className={styles.brand}
          onClick={() => navigate('/feed')}
        >
          MiniTwitter
        </span>

        <NavLink
          to="/feed"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Feed
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Novo Post
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Buscar
        </NavLink>

        <NavLink
          to={`/profile/${username}`}
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Perfil
        </NavLink>

        <NavLink
          to="/followers"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Seguidores
        </NavLink>

        <NavLink
          to="/following"
          className={({ isActive }) =>
            isActive ? styles.active : styles.link
          }
        >
          Seguindo
        </NavLink>
      </div>

      <div className={styles.right}>
        <button
          onClick={toggleDarkMode}
          className={styles.iconButton}
        >
          {darkMode ? '🌞' : '🌙'}
        </button>

        <span className={styles.username}>{username}</span>

        <button
          onClick={handleLogout}
          className={styles.button}
        >
          Sair
        </button>
      </div>
    </nav>
  );
};

export default NavBar;

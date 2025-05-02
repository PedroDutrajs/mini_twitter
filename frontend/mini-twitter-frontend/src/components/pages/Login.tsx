import { useState } from 'react';
import api from '../../services/api';
import styles from '../../styles/Auth.module.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res  = await api.post('/login/', { email, password });
      const data = res.data;

      //Save tokens 
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // Save username
      localStorage.setItem('user_username', data.user.username);

      setError('');
      navigate('/feed');
    } catch (err: any) {
      console.error('Login error:', err.response || err.message);
      setError(err.response?.data.detail || 'Credenciais inválidas.');
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.title}>Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button}>
          Entrar
        </button>
        <a href="/register" className={styles.link}>
          Não tem conta? Cadastre-se
        </a>
      </form>
    </div>
  );
};

export default Login;

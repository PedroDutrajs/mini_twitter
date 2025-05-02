import { useState } from 'react';
import { register } from '../../services/auth';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Auth.module.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      setError('');
      navigate('/'); // Redireciona para a página de login
    } catch (err: any) {
      const apiError = err.response?.data?.errors || err.message;
      setError(JSON.stringify(apiError));
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleRegister} className={styles.form}>
        <h2 className={styles.title}>Cadastro</h2>
        {error && <div className={styles.error}>{error}</div>}
        <input
          type="text"
          placeholder="Nome de usuário"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className={styles.input}
          required
        />
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
          Cadastrar
        </button>
        <a href="/" className={styles.link}>
          Já tem conta? Faça login
        </a>
      </form>
    </div>
  );
};

export default Register;

import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const login = async (email: string, password: string) => {
  const response = await API.post('login/', {
    email,
    password,
  });
  return response.data;
};

export const register = async (username: string, email: string, password: string) => {
    const response = await API.post('register/', {
      username,
      email,
      password,
    });
    return response.data;
  };
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //"http://localhost:8000/api"
});
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createPost = async (content: string, imageFile: File | null) => {
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const res = await api.post('posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  };


  export const updatePost = async (
    postId: number,
    content: string,
    imageFile: File | null
  ) => {
    const formData = new FormData();
    formData.append('content', content);
    if (imageFile !== null) {
      formData.append('image', imageFile);
    }
    const res = await api.put(`posts/${postId}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  };
  
  export const deletePost = async (postId: number) => {
    await api.delete(`posts/${postId}/`);
  };
export default api;

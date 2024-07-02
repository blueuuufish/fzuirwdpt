import { ref } from 'vue';
import { useJwtService } from '@/api/auth/jwtService';

export function useAuthStorage() {
  const TOKEN_KEY = 'access_token';
  const jwtService = useJwtService();

  const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
  };

  const deleteToken = () => {
    localStorage.removeItem(TOKEN_KEY);
  };

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const loadUser = () => {
    const token = getToken();
    if (!token) {
      return null;
    }
    return jwtService.extractUser(token);
  };

  return {
    saveToken,
    deleteToken,
    getToken,
    loadUser,
  };
}

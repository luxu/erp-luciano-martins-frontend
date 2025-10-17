import { ref } from 'vue';
import { api } from 'boot/axios';
import { LocalStorage } from 'quasar';

const user = ref(null);

const storedToken = LocalStorage.getItem('auth_token');
if (storedToken) {
  user.value = { token: storedToken };
}

export default function useAuthUser() {
  /**
   * Login with email and password
   */
  const login = async ({ username, password }) => {
    const { data } = await api.post('/api/v1/auth/token', {
      username,
      password,
    });
    LocalStorage.set('auth_token', data.access);
    user.value = {
      username,
      token: data.access,
    };
    return data;
  };

  /**
   * Logout
   */
  const logout = () => {
    LocalStorage.remove('auth_token');
    user.value = null;
  };

  /**
   * Check if the user is logged in or not
   */
  const isLoggedIn = () => !!LocalStorage.getItem('auth_token');

  return {
    user,
    login,
    logout,
    isLoggedIn,
  };
}

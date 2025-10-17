import { ref } from 'vue';
const user = ref(null);

export default function useAuthUser() {
  /**
   * Login with email and password
   */
  const login = async ({ username, password }) => {
    const { data } = await api.post('/api/v1/auth/token', {
      username,
      password,
    })
    LocalStorage.set('auth_token', data.access)
    return data
  }

  /**
   * Logout
   */
  // const logout = async () => {
  //   const { error } = await supabase.auth.signOut();
  //   if (error) throw error;
  // };

  /**
   * Check if the user is logged in or not
   */
  const isLoggedIn = () => !!user.value;

  return {
    user,
    login,
    isLoggedIn,
    // logout,
  };
}

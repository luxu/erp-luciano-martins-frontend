import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { LocalStorage, Notify } from 'quasar'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

api.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Adiciona um interceptor de resposta
api.interceptors.response.use(
  (response) => {
    // Se a resposta for OK (2xx), apenas retorne-a
    return response;
  },
  (error) => {
    // Captura o erro
    const router = useRouter(); // Use o router

    // Verifica se o erro é 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Token expirado. Redirecionando para login...');
      
      // 1. Opcional: Mostrar uma mensagem ao usuário
      Notify.create({
        type: 'negative',
        message: 'Sua sessão expirou. Por favor, faça login novamente.',
        position: 'top',
        timeout: 3000
      });

      // 2. Limpar o token antigo (do Local Storage, Vuex, Pinia, etc.)
      // Exemplo: localStorage.removeItem('authToken');
      // Chame a sua função de logout do store aqui, se houver.
      
      // 3. Redirecionar para a tela de login
      router.push('/logout'); // Ajuste o caminho conforme sua rota de login
      
      // Impede que o erro continue para o código que fez a requisição
      return Promise.reject(error); 
    }
    
    // Para outros erros (404, 500, 403, etc.), apenas propaga o erro
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }

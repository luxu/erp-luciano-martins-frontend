import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode';
import routes from './routes'
import useAuthUser from '../composables/UseAuthUser'

export default route(function (/* { store, ssrContext } */) {
  // Define a margem de tempo (em minutos) para considerar o token "prestes a expirar".
  // Se a expiração for menor que este limite, tentamos um refresh (ou forçamos o logout).
  const EXPIRY_THRESHOLD_MINUTES = 5;

  // Função auxiliar para decodificar e verificar a validade
function isTokenExpired(token) {
    if (!token) {
      return true; // Se não houver token, ele está "expirado" (inválido)
    }

    try {
      const payload = jwtDecode(token);
      const expDate = new Date(payload.exp * 1000); // exp está em segundos (UNIX timestamp)

      // Checa se o tempo atual é maior ou igual ao tempo de expiração
      const isExpired = new Date() >= expDate;
      
      // Checa se o token está *prestes* a expirar (dentro da margem)
      const nearExpiry = (expDate.getTime() - new Date().getTime()) / 60000 < EXPIRY_THRESHOLD_MINUTES;

      if (isExpired) {
        console.log('Token expirado.');
        return true;
      }
      
      if (nearExpiry) {
        // **Ação proativa de UX:**
        // Aqui, você idealmente chamaria sua função para REFRESH do token
        // se você tiver um 'refresh token' e um endpoint para isso.
        // Se não tiver, trate como expirado para segurança.
        console.log('Token perto de expirar. Tentativa de refresh (ou logout forçado).');
        
        // ***IMPORTANTE:*** // Se você não for implementar o refresh automático, mude o 'return' para 'return true;'
        // para forçar o logout imediato.

        // return true; // <- Força o logout se perto de expirar
        
        // Para este exemplo, vamos considerar válido para demonstrar o guard.
        // No mundo real, aqui você dispararia o processo de refresh silencioso.
      }

      return false; // Token é válido
    } catch (e) {
      // Falha na decodificação (token malformado, inválido)
      console.error('Erro na decodificação do token:', e);
      return true; 
    }
  }
  
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    const { isLoggedIn } = useAuthUser()
    const publicPaths = ['/login']

    if (!publicPaths.includes(to.path) && !isLoggedIn()) {
      next({ path: '/login' })
      return
    }

    if (to.path === '/login' && isLoggedIn()) {
      next({ path: '/' })
      return
    }

    // 1. Verificar se a rota de destino exige autenticação
    if (to.meta.requiresAuth) {
      // 2. Recuperar o token (ajuste de acordo com onde você o armazena)
      const authToken = localStorage.getItem('auth_token');

      if (!authToken || isTokenExpired(authToken)) {
        // 3. O token está ausente ou expirou

        // Limpar qualquer dado de usuário ou token restante
        localStorage.removeItem('auth_token');
        // Chame seu store de autenticação para zerar o estado (se usar Pinia/Vuex)

        // Exibir uma mensagem de erro (opcional)
        // Se estiver usando Quasar, você pode usar a API Notify aqui
        // Notify.create({ message: 'Sua sessão expirou.', type: 'negative' });

        // Redirecionar para a tela de login
        next({ 
          path: '/login',
          query: { redirect: to.fullPath } // Opcional: para redirecionar após login
        });
      } else {
        // 4. Token válido: Permite o acesso
        next();
      }
    } else {
      // 5. Rota não exige autenticação: Permite o acesso
      next();
    }
  });

  return Router
})

import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import useAuthUser from '../composables/UseAuthUser'

export default route(function (/* { store, ssrContext } */) {
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

    next()
  })

  return Router
})

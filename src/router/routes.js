const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/auth/LoginPage.vue')
      }
    ]
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'home', name: 'home', component: () => import('pages/IndexPage.vue') },

      // Gastos
      { path: 'gastos', name: 'gastos', component: () => import('pages/gastos/ListPage.vue') },
      { path: 'form-gasto/:id?', name: 'form-gasto', component: () => import('pages/gastos/FormPage.vue') },

      // Parcelas
      { path: 'parcelas', name: 'parcelas', component: () => import('pages/parcelas/ListPage.vue') },

      // Segmentos
      { path: 'segmentos', name: 'segmentos', component: () => import('pages/segmentos/ListPage.vue') },
      { path: 'form-segmento/:id?', name: 'form-segmento', component: () => import('pages/segmentos/FormPage.vue') },

      // Card Banks
      { path: 'cardbanks', name: 'cardbanks', component: () => import('pages/cardbanks/ListPage.vue') },
      { path: 'form-cardbank/:id?', name: 'form-cardbank', component: () => import('pages/cardbanks/FormPage.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
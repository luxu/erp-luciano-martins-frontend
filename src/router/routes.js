
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/gastos', name: 'gastos', component: () => import('pages/gastos/GastosPage.vue') },
      { path: '/parcelas', name: 'parcelas', component: () => import('pages/parcelas/ParcelasPage.vue') },
      { path: '/segmentos', name: 'segmentos', component: () => import('pages/segmentos/SegmentosPage.vue') },
      { path: '/cardbanks', name: 'cardbanks', component: () => import('pages/cardbanks/ListPage.vue') },
      { path: '/form-cardbank', name: 'form-cardbank', component: () => import('pages/cardbanks/FormPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

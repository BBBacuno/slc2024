const routes = [
  {
    path: '/',
    component: () => import('pages/SLCRegistrationPage.vue')
  },
  {
    path: '/admin',
    component: () => import('pages/AdminDashboard.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    redirect: "/"
  }
]

export default routes

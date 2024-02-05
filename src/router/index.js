import { createRouter, createWebHashHistory } from "vue-router";
import SLCRegistrationPage from "../pages/SLCRegistrationPage.vue"
import AdminDashboard from "../pages/AdminDashboard.vue";
import SLCEvaluationPage from "../pages/SLCEvaluationPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    components: {
      default: SLCRegistrationPage,
    },
  },
  {
    path: '/admin', 
    name: 'Admin',
    components: {
      default: AdminDashboard,
    },
  },
  {
    path: '/eval', 
    name: 'Eval',
    components: {
      default: SLCEvaluationPage,
    },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

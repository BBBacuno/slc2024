import { createRouter, createWebHashHistory } from "vue-router";
import SLCRegistrationPage from "../pages/SLCRegistrationPage.vue";
import SLCConfirmAttendance from "../pages/SLCConfirmAttendance.vue";
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
    path: '/eval', 
    name: 'Eval',
    components: {
      default: SLCEvaluationPage,
    },
  },
  {
    path: '/attendance', 
    name: 'SLCConfirmAttendance',
    components: {
      default: SLCConfirmAttendance,
    },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: "/"
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;

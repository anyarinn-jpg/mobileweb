import { createRouter, createWebHistory } from "@ionic/vue-router";
import LoginPage from "@/views/LoginPage.vue";
import TabsPage from "@/views/TabsPage.vue";
import Tab1 from "@/views/Tab1Page.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/tabs/",
    component: TabsPage,
    children: [
      {
        path: "tab1",
        component: Tab1,
      },
    ],
  },
  {
  path: "/verify-otp",
  component: () => import("@/views/VerifyOtpPage.vue"),
}
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
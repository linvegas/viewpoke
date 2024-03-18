import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";

import "./assets/style.css";

import App from "./App.vue";
import Home from "./Home.vue";
import Pokemon from "./Pokemon.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/pokemon/:name", component: Pokemon },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

createApp(App).use(router).mount('#app');

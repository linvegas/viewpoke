<script setup lang="ts">
import { ref, computed } from "vue";

import Home from "./Home.vue";
import Pokemon from "./Pokemon.vue";

type Routes = {
  [key: string]: any;
};

type Params = {
  [key: string]: string;
};

const routes: Routes = {
  "/": Home,
  "/pokemon/:name": Pokemon,
};

const current_path = ref<string>(window.location.hash);

window.addEventListener('hashchange', () => {
  current_path.value = window.location.hash;
})

const current_view = computed(() => {
  const path = current_path.value.slice(1);
  const route_keys = Object.keys(routes);

  for (let key of route_keys) {
    const pattern = key.replace(/:[^/]+/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);

    const match = path.match(regex)

    if (match) {
      let params: Params = {};
      const param_keys = key.match(/:[^/]+/g) || [];

      param_keys.forEach((k, i) => {
        params[k.slice(1)] = match[i + 1];
      });

      return routes[key];
    }
  }

  return routes[current_path.value.slice(1) || "/"]
})
</script>

<template>
  <component :is="current_view" />
</template>

<!--
<style scoped>
</style>
-->

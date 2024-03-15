<script setup lang="ts">
import { ref, computed } from "vue";

import Home from "./Home.vue";
import Pokemon from "./Pokemon.vue";

type Routes = {
  [key: string]: any;
};

const routes: Routes = {
  "/": Home,
  "/id": Pokemon,
};

const current_path = ref<string>(window.location.hash);

window.addEventListener('hashchange', () => {
  current_path.value = window.location.hash;
})

const current_view = computed(() => {
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

<script setup lang="ts">
import { ref } from "vue";
const id = ref(window.location.hash);
</script>

<template>
  <h1>Pokemon Page</h1>
  <p>{{ id.slice(1) }}</p>
</template>

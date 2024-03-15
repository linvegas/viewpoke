<script setup lang="ts">
import { ref, onMounted } from "vue";

type PokeData = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
};

const poke = ref<PokeData>();

const param_name = ref(window.location.hash.split('/').pop());

onMounted(async () => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${param_name.value}`);
  poke.value = await res.json();
})
</script>

<template>
  <h1>Pokemon Page</h1>
  <p>{{ poke?.name }}</p>
  <p>{{ poke?.id }}</p>
  <img :src="poke?.sprites.front_default" atl="Srite" />
</template>

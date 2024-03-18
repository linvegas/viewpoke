<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute  } from "vue-router";

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

const route = useRoute();

watch(() => route.params.name, fetch_pokemon, {immediate: true})

async function fetch_pokemon(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  poke.value = await res.json();
}
</script>

<template>
  <h1>Pokemon Page</h1>
  <p>{{ poke?.name }}</p>
  <p>{{ poke?.id }}</p>
  <img :src="poke?.sprites.front_default" atl="Srite" />
</template>

<script setup lang="ts">
import { watchEffect, ref } from "vue";
import { useRouter } from "vue-router";

import logo from "./snorlax.png";

type PokeResults = {
  name: string,
  url: string,
}

type PokeResources = {
  results: PokeResults[],
}

const input_suggest = ref<PokeResults[]>([]);

const poke_query = ref("");

watchEffect(async () => {
  let query = poke_query.value;

  if (!query.length || query.length < 2) {
    input_suggest.value = [];
    return
  }

  let data: PokeResources;

  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0")
  data = await res.json();

  input_suggest.value = data.results.filter(v => v.name.includes(query.toLowerCase())) || [];
})

const router = useRouter();

async function handle_search_form() {
  let query = poke_query.value.toLowerCase();

  if (!query.length) return;

  router.push(`/pokemon/${query}`);
}
</script>

<template>
  <main id="layout">
    <section>
      <header>
        <img id="logo" :src="logo" alt="Logo" />
        <h1>ViewPoke</h1>
        <h4>Search for your favorite pokemon</h4>
      </header>
      <form id="poke-form" @submit.prevent="handle_search_form">
        <label for="pokequery"> Search for a pokemon: </label>
        <input
          id="pokequery"
          name="pokequery"
          list="pokenames"
          v-model="poke_query"
          type="text"
          placeholder="Cubone"
          required
        />
        <datalist id="pokenames">
          <option v-for="s in input_suggest" :value="s.name"></option>
        </datalist>
      </form>
      <ul id="suggest-list">
        <li>
          <RouterLink to="/pokemon/pikachu">Pikachu</RouterLink>
        </li>
        <li>
          <RouterLink to="/pokemon/cubone">Cubone</RouterLink>
        </li>
        <li>
          <RouterLink to="/pokemon/snorlax">Snorlax</RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
  main#layout {
    display: grid;
    place-content: center;
    min-height: 100vh;
  }
  section {
    & > *:not(:last-child) {
      margin-bottom: 2rem;
    }
    & > :last-child {
      margin-bottom: 6rem;
    }
  }
  header {
    text-align: center;
    & img#logo {
      max-width: 150px;
      margin-inline: auto;
      margin-bottom: 2.25rem;
      filter: drop-shadow(0 0 30px rgba(135, 206, 235, 0.35));
    }
    & > h1 {
      margin-bottom: 0.5rem;
    }
  }
  form#poke-form {
    text-align: center;
    & label {
      display: none;
    }
  }
  ul#suggest-list {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
</style>

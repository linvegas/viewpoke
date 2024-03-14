<script setup lang="ts">
import { watchEffect, ref } from "vue";

import logo from "./snorlax.png";

type PokeResults = {
  name: string,
  url: string,
}

type PokeResources = {
  results: PokeResults[],
}

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

const resource_data = ref<PokeResources>();
const resource_list = ref<PokeResults[]>([]);
const pokemon_list = ref<PokeData[]>([]);
const input_suggest = ref<PokeResults[]>([]);

const poke_query = ref("");

const RES_URL = "https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0";

watchEffect(async () => {
  let query = poke_query.value;

  if (!query.length) return;

  let data: PokeResources;

  const res = await fetch(RES_URL)
  data = await res.json();

  input_suggest.value = data.results.filter(v => v.name.includes(query.toLowerCase())) || [];
})

async function fetchPokemons() {
  let query = poke_query.value;

  if (!query.length) return;

  const res = await fetch(RES_URL)
  resource_data.value = await res.json();
  resource_list.value = resource_data.value?.results.filter(v => v.name.includes(query.toLowerCase())) || [];

  const pokemonPromises = resource_list.value.map(r =>
    fetch(r.url).then(res => res.json()),
  );

  pokemon_list.value = await Promise.all(pokemonPromises)
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
      <form id="poke-form" @submit.prevent="fetchPokemons">
        <label for="pokequery"> Search for a pokemon: </label>
        <input
          id="pokequery"
          name="pokequery"
          list="pokenames"
          v-model="poke_query"
          type="text"
          placeholder="Cubone"
        />
        <datalist id="pokenames">
          <option v-for="s in input_suggest" :value="s.name"></option>
        </datalist>
      </form>
      <ul id="suggest-list">
        <li>Pikachu</li>
        <li>Cubone</li>
        <li>Snorlax</li>
      </ul>
    </section>
      <!-- <ul id="poke-list">
        <li v-for="p in pokemon_list" >
          <p>{{p.name}} {{p.id}}</p>
          <img :src="p.sprites.front_default" loading="lazy" alt="Sprite" />
        </li>
      </ul> -->
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
    & > * {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 0.5rem;
      padding: 0.15rem 0.3rem;
    }
  }
  /* ul#poke-list {
    padding-block: 4rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    & li > img {
      margin-inline: auto;
    }
  } */
</style>

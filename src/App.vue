<script setup lang="ts">
import { watchEffect, ref } from "vue";

type PokeResult = {
  name: string,
  url: string,
}

type PokeList = {
  results: PokeResult[],
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

const data = ref<PokeList>();
const results = ref<PokeResult[]>([]);
const pokemons = ref<PokeData[]>([]);

const pokeQuery = ref("");

async function fetchPokemons() {
  let query = pokeQuery.value;
  if (!query.length) return;
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0")
  data.value = await res.json();
  results.value = data.value?.results.filter(v => v.name.includes(query)) || [];

  const pokemonPromises = results.value.map(r =>
    fetch(r.url).then(res => res.json()),
  );

  pokemons.value = await Promise.all(pokemonPromises)

  console.log(pokemons.value);
}

</script>

<template>
  <div id="layout">
    <header>
      <h1>ViewPoke</h1>
      <nav>
        <a href="/gallery">Gallery</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <main>
      <form id="poke-form" @submit.prevent="fetchPokemons">
        <label>
          Search for a pokemon: <br>
          <input v-model="pokeQuery" type="text" placeholder="Cubone" />
        </label>
      </form>
      <ul id="poke-list">
        <li v-for="p in pokemons" >
          <p>{{p.name}} {{p.id}}</p>
          <img :src="p.sprites.front_default" loading="lazy" alt="Sprite" />
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
  div#layout {
    width: min(100% - 3rem, 1000px);
    margin-inline: auto;
  }
  header {
    padding-block: 1rem;
    margin-bottom: 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > nav > * {
       margin-left: 1rem;
    }
  }
  form#poke-form {
    text-align: center;
  }
  ul#poke-list {
    padding-block: 4rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    & li > img {
      margin-inline: auto;
    }
  }
</style>

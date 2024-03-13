<script setup lang="ts">
import { watchEffect, ref } from "vue";

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
          <input list="pokenames" name="pokequery" v-model="poke_query" type="text" placeholder="Cubone" />
          <datalist id="pokenames">
            <option v-for="s in input_suggest" :value="s.name"></option>
          </datalist>
        </label>
      </form>
      <ul id="poke-list">
        <li v-for="p in pokemon_list" >
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

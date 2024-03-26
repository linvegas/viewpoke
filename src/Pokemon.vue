<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute  } from "vue-router";

type PokeData = {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      }
    }
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

type PokeSpecie = {
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
    }
  }[]
}

const poke = ref<PokeData>();
const poke_specie = ref<PokeSpecie>();

const route = useRoute();

watch(() => route.params.name, fetch_pokemon, {immediate: true})

async function fetch_pokemon(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  poke.value = await res.json();
  const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${poke.value.id}`);
  poke_specie.value = await res2.json();
}

const captitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

</script>

<template>
  <header>
    <div class="squeeze flex">
      <h1>
        <RouterLink to="/">PokeView</RouterLink>
      </h1>
      <input type="text" :placeholder="poke?.name" />
    </div>
  </header>
  <main v-if="poke" class="squeeze">
    <section class="flex">
      <img :src="poke.sprites.other['official-artwork'].front_default" alt="Srite" />
      <article>
        <h2>{{ captitalize(poke.name) }} #{{ poke.id }}</h2>
        <p id="types">
          <span class="type-card" v-for="t in poke.types">{{ t.type.name }}</span>
        </p>
        <p v-if="poke_specie">
          {{
            poke_specie.flavor_text_entries
              .filter(text => text.language.name === "en")[0]
              .flavor_text
          }}
        </p>
      </article>
    </section>
  </main>
</template>

<style scoped>
  .squeeze {
    width: min(100% - 3rem, 1250px);
    margin-inline: auto;
  }
  .flex {
    display: flex;
    gap: 1rem;
  }
  header {
    border-bottom: 1px solid grey;
    padding-block: 1rem;
    & > div.flex {
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: space-between;
    }
  }
  section.flex {
    flex-wrap: wrap;
    align-items: center;
    gap: 2rem;
    & > * {
      flex-shrink: 1;
      flex-basis: 10ch;
    }
    & > article {
      flex-grow: 2;
    }
  }
  p#types {
    padding-block: 0.5rem;
    & > * {
      margin-right: 0.5rem;
    }
  }
  span.type-card {
    padding: 0.25rem;
    border: 1px solid grey;
    border-radius: 0.5rem;
  }
</style>

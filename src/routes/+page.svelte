<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchCryptoCurrencies } from '$lib/api.js';

    /** @type {import('./$types').PageData} */
    export let data;
  
    onMount(async () => {
      data = await fetchCryptoCurrencies();
      console.log(data)
    });

  </script>
  
  <svelte:head>
    <title>Cryptocurrency List</title>
  </svelte:head>

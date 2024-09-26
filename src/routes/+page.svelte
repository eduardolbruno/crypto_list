<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchCryptoCurrencies } from '$lib/api.js';
    import type { Cryptocurrency } from '$lib/types';

    /** @type {import('./$types').PageData} */
    let cryptocurrencies: Cryptocurrency[] = [];
    let now = new Date(), month, day, year;
	let dateString: string;

    onMount(async () => {
        // setup datetime
        day = (now.getDay() + 1);
        month = now.toLocaleString('en', { month: 'long' });
        year = now.getFullYear();
        dateString = month.charAt(0).toUpperCase() + month.slice(1)+' '+day+', '+year;

        // get crypto data from API
        cryptocurrencies = await fetchCryptoCurrencies();
    });

  </script>
  
  <svelte:head>
    <title>Cryptocurrency List</title>
  </svelte:head>

  <main>
    <h2>Cryptocurrency Prices by Market Cap</h2>
    <p>This tables displays the top 10 cryptocurrencies of {dateString}</p>
    {#if cryptocurrencies.length > 0}
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price (USD)</th>
            <th>24h Change</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          {#each cryptocurrencies as crypto, index}
          <tr>
              <td>{index + 1}</td>
              <td>{crypto.name}</td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td>{crypto.price_change_percentage_24h.toFixed(2)}%</td>
              <td>${crypto.market_cap.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>Loading data...</p>
    {/if}
  </main>

  <style>
    main {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  
    th {
      background-color: #f2f2f2;
    }
  
  </style>

<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchCryptoCurrencies } from '$lib/api.js';
    import type { Cryptocurrency } from '$lib/types';

    /** @type {import('./$types').PageData} */
    let cryptocurrencies: Cryptocurrency[] = [];
    let now = new Date(), month, day, year;
	let dateString: string;
    let error: string | null = null;
    let loading = true;
    let timerId: number;
    let refreshPeriod = 30000; 

    async function fetchData() {
        loading = true;

        try {
            cryptocurrencies = await fetchCryptoCurrencies();
            error = null;
        } catch (e) {
            error = e instanceof Error ? e.message : 'An error occurred';
        } finally {
            loading = false;
        }
    }

    function startRefreshInterval() {
        clearInterval(timerId);
        timerId = setInterval(fetchData, refreshPeriod);
    }

    onMount(() => {
        // setup datetime
        day = (now.getDay() + 1);
        month = now.toLocaleString('en', { month: 'long' });
        year = now.getFullYear();
        dateString = month.charAt(0).toUpperCase() + month.slice(1)+' '+day+', '+year;


        // get crypto data from API
        fetchData();
        startRefreshInterval();

        return () => clearInterval(timerId);

    });

    function handleRefreshPeriodChange(event: Event) {
        refreshPeriod = parseInt((event.target as HTMLSelectElement).value);
        startRefreshInterval();
    }

  </script>
  
  <svelte:head>
    <title>Cryptocurrency List</title>
  </svelte:head>

  <main>
    <h1>Cryptocurrency Prices by Market Cap</h1>
    <h4>This tables displays the top 10 cryptocurrencies of {dateString}</h4>
    <div class="selector-container">
        <label for="refresh-period">Auto-refresh:</label>
        <select id="refresh-period" on:change={handleRefreshPeriodChange}>
            <option value="5000" >5s</option>
            <option value="10000">10s</option>
            <option value="30000" selected >30s</option>
            <option value="60000">1 min</option>
            <option value="300000">5 min</option>
            <option value="600000">10 min</option>
        </select>
    </div>
    {#if loading}
    <p>Loading...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
  <div class="table-container">
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
        {#if cryptocurrencies.length > 0}
        <tbody>
            {#each cryptocurrencies as crypto, index}
            <tr>
                <td>{index + 1}</td>
                <td><b>{crypto.name}</b></td>
                <td>{crypto.symbol.toUpperCase()}</td>
                <td>${crypto.current_price.toFixed(2)}</td>
                <td class:positive={crypto.price_change_percentage_24h > 0}
                    class:negative={crypto.price_change_percentage_24h < 0}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>${crypto.market_cap.toLocaleString()}</td>
                </tr>
            {/each}
        </tbody>
        {:else}
        <p style="text-align: center;">Loading data...</p>
        {/if}
      </table>
  </div>
  
    {/if}
  </main>

  <style>
    main {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .table-container {
        position: relative;
        width: 100%;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 50px;
    }
  
    th, td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  
    th {
      background-color: #f2f2f2;
      font-size: small;
    }
  
    .positive {
      color: green;
    }
  
    .negative {
      color: red;
    }

    .error {
        color: red;
        font-weight: bold;
    }

    select {
        width: 100%;
        padding: 5px;
    }

    
  .selector-container {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: small;
  }

  </style>

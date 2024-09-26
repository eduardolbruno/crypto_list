<script lang="ts">
  import { onMount } from "svelte";
  import {
    fetchCryptoCurrencies,
    fetchHistorical,
    fetchCryptoExtraInfo,
  } from "$lib/api.js";
  import type { Cryptocurrency } from "$lib/types";
  import CryptoChart from "$lib/components/CryptoChart.svelte";
  import CryptoInfoModal from "$lib/components/CryptoInfoModal.svelte";

  /** @type {import('./$types').PageData} */
  let cryptocurrencies: Cryptocurrency[] = [];
  let now = new Date(),
    month,
    day,
    year;
  let dateString: string;
  let error: string | null = null;
  let loading = true;
  let timerId: number;
  let refreshPeriod = 60000;
  let selectedCrypto: Cryptocurrency | null = null;
  let showModal = false;
  let chartData: any = null;
  let detailedInfo: any = null;

  async function fetchData() {
    loading = true;

    try {
      cryptocurrencies = await fetchCryptoCurrencies();
      error = null;
    } catch (e) {
      error = e instanceof Error ? e.message : "An error occurred";
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
    day = now.getDay() + 1;
    month = now.toLocaleString("en", { month: "long" });
    year = now.getFullYear();
    dateString =
      month.charAt(0).toUpperCase() + month.slice(1) + " " + day + ", " + year;

    // get crypto data from API
    fetchData();
    startRefreshInterval();

    return () => clearInterval(timerId);
  });

  function handleRefreshPeriodChange(event: Event) {
    refreshPeriod = parseInt((event.target as HTMLSelectElement).value);
    startRefreshInterval();
  }

  async function handleRowClick(crypto: Cryptocurrency) {
    if (!crypto) return;
    selectedCrypto = crypto;
    showModal = true;

    // Fetch 24-hour historical data for the selected cryptocurrency
    const data = await fetchHistorical(crypto.id);

    chartData = {
      name: crypto.name,
      labels: data.prices.map((price: number[]) =>
        new Date(price[0]).toLocaleTimeString()
      ),
      prices: data.prices.map((price: number[]) => price[1]),
    };

    detailedInfo = await fetchCryptoExtraInfo(crypto.id);
  }

  
 function closeModal() {
    showModal = false;
    selectedCrypto = null;
    chartData = null;
    detailedInfo = null;
  }
</script>

<svelte:head>
  <title>Cryptocurrency List</title>
</svelte:head>

<main>
  <h1>Cryptocurrency Prices by Market Cap</h1>
  <h4>
    This list showcases the top 10 cryptocurrencies ranked by market
    capitalization as of {dateString}
  </h4>
  <div class="selector-container">
    <label for="refresh-period">
      <img class="svg-icon" src="refresh.svg" alt="refresh-icon" title="Auto-Refresh feature" />
    </label>
    <select id="refresh-period" on:change={handleRefreshPeriodChange} title="Auto-Refresh feature">
      <option value="60000" selected>1 min</option>
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
              <tr class="hoverable-row" on:click={() => handleRowClick(crypto)}>
                <td>{index + 1}</td>
                <td><b>{crypto.name}</b></td>
                <td>{crypto.symbol.toUpperCase()}</td>
                <td>${crypto.current_price.toFixed(2)}</td>
                <td
                  class:positive={crypto.price_change_percentage_24h > 0}
                  class:negative={crypto.price_change_percentage_24h < 0}
                >
                  {#if crypto.price_change_percentage_24h >= 0}
                    <img class="svg-icon" src="arrowUp.svg" alt="+" />
                  {:else}
                    <img class="svg-icon" src="arrowDown.svg" alt="-" />
                  {/if}
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

  {#if showModal && selectedCrypto && chartData && detailedInfo}
    <CryptoInfoModal {closeModal} cryptoData={chartData} selectedCrypto={selectedCrypto} detailedInfo={detailedInfo} />
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

  th,
  td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #cccccc;
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
    padding: 5px;
  }

  .selector-container {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: small;
  }

  .hoverable-row {
    transition: background-color 0.4s ease;
  }

  .hoverable-row:hover {
    background-color: #ebe77c;
    cursor: pointer;
  }

  tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  .svg-icon {
    width: 16px;
    height: 16px;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { fetchCryptoCurrencies, fetchHistorical } from "$lib/api.js";
  import type { Cryptocurrency } from "$lib/types";
  import CryptoChart from "$lib/components/CryptoChart.svelte";

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
  let refreshPeriod = 20000;
  let selectedCrypto: Cryptocurrency | null = null;
  let showPopup = false;
  let chartData: any = null;

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
    showPopup = true;

    // Fetch 24-hour historical data for the selected cryptocurrency
    const data = await fetchHistorical(crypto.id);

    chartData = {
      name: crypto.name,
      labels: data.prices.map((price: number[]) =>
        new Date(price[0]).toLocaleTimeString()
      ),
      prices: data.prices.map((price: number[]) => price[1]),
    };
  }

  function closePopup() {
    showPopup = false;
    selectedCrypto = null;
    chartData = null;
  }
</script>

<svelte:head>
  <title>Cryptocurrency List</title>
</svelte:head>

<main>
  <h1>Cryptocurrency Prices by Market Cap</h1>
  <h4>This tables displays the top 10 cryptocurrencies of {dateString}</h4>
  <div class="selector-container">
    <label for="refresh-period">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"
        />
      </svg>
    </label>
    <select id="refresh-period" on:change={handleRefreshPeriodChange}>
      <option value="20000" selected>20s</option>
      <option value="60000">1 min</option>
      <option value="300000">5 min</option>
      <option value="600000">10 min</option>
    </select>
    <button class="refresh-button" on:click={fetchData}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path
          d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"
        />
      </svg>
      Force Refresh
    </button>
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

  {#if showPopup && selectedCrypto && chartData}
    <div class="popup-overlay">
      <div class="popup-content">
        <h2>
          {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()}) - Last 24 Hours
        </h2>
        <CryptoChart cryptoData={chartData} />
        <button class="popup-close-btn" on:click={closePopup}>Close</button>
      </div>
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

  .refresh-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .refresh-button svg {
    width: 16px;
    height: 16px;
  }

  .hoverable-row {
    transition: background-color 0.4s ease;
  }

  .hoverable-row:hover {
    background-color: #f0f0f0;
    cursor: pointer;
  }

  tr:nth-child(even) {
    background-color: #f5f5f5;
  }

  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
  }

  .popup-close-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    text-align: center;
  }
</style>

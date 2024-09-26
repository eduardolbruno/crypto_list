<script lang="ts">
  import CryptoChart from "./CryptoChart.svelte";
  import type { Cryptocurrency } from "$lib/types";

  export let cryptoData: any;
  export let selectedCrypto: Cryptocurrency;
  export let detailedInfo: any;
  export let closeModal: () => void;
</script>

<main>
  <div class="popup-overlay">
    <div class="popup-content">
      <h2>
        {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()}) - Last
        24 Hours
      </h2>
      <div class="detailed-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Current Price:</span>
            <span class="info-value"
              >${selectedCrypto.current_price.toFixed(2)}</span
            >
          </div>
          <div class="info-item">
            <span class="info-label">24h Change:</span>
            <span
              class="info-value class:positive={selectedCrypto.price_change_percentage_24h >
                0} class:negative={selectedCrypto.price_change_percentage_24h <
                0}"
            >
              {#if selectedCrypto.price_change_percentage_24h >= 0}
                <img class="svg-icon" src="arrowUp.svg" alt="+" />
              {:else}
                <img class="svg-icon" src="arrowDown.svg" alt="-" />
              {/if}
              {selectedCrypto.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">Market Cap:</span>
            <span class="info-value"
              >${selectedCrypto.market_cap.toLocaleString()}</span
            >
          </div>
          <div class="info-item">
            <span class="info-label">24h Volume:</span>
            <span class="info-value"
              >${detailedInfo.market_data.total_volume.usd.toLocaleString()}</span
            >
          </div>
          <div class="info-item">
            <span class="info-label">Circulating Supply:</span>
            <span class="info-value"
              >{detailedInfo.market_data.circulating_supply.toLocaleString()}
              {selectedCrypto.symbol.toUpperCase()}</span
            >
          </div>
          <div class="info-item">
            <span class="info-label">All-Time High:</span>
            <span class="info-value"
              >${detailedInfo.market_data.ath.usd.toFixed(2)} ({new Date(
                detailedInfo.market_data.ath_date.usd
              ).toLocaleDateString()})</span
            >
          </div>
        </div>
      </div>
      <CryptoChart cryptoData={cryptoData} />
      <button class="popup-close-btn" on:click={closeModal}>x</button>
    </div>
  </div>
</main>

<style>

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
    position: relative;
  }

  .detailed-info {
    margin-top: 30px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .info-item {
    background-color: #f5f5f5;
    padding: 15px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }

  .info-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 5px;
  }

  .info-value {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .popup-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
  }

  .svg-icon {
    width: 16px;
    height: 16px;
  }
</style>

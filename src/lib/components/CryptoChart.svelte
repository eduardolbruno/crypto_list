<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "chart.js/auto";

  export let cryptoData: any;
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      new Chart(ctx, {
        type: "line",
        data: {
          labels: cryptoData.labels,
          datasets: [
            {
              label: `${cryptoData.name} Price (USD)`,
              data: cryptoData.prices,
              borderColor: "rgb(235, 231, 124)",
              tension: 0.1,
            },
          ],
        },
      });
    }
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100%;
    height: 500px;
  }
</style>

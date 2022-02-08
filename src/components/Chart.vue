<template>
  <div>
    <canvas id="chart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";

export default {
  name: "Chart",
  created() {
    Chart.register(...registerables);
  },
  mounted() {
    let target = document.getElementById("chart");
    let data = {
      labels: ["January", "February"],
      datasets: [
        {
          label: "Data One",
          backgroundColor: "#f87979",
          data: [40, 20],
        },
      ],
    };

    let config = {
      type: "line",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Total USD Volume",
          },
        },
      },
    };
    new Chart(target, config);
  },
};
</script>
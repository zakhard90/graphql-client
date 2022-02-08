<template>
  <div>
    <canvas id="chart" width="400" height="200"></canvas>
  </div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { Chart, registerables } from "chart.js";
import moment from "moment";
import store from "../store";

Chart.register(...registerables);

const getTime = () => {
  return moment().format("DD-MM-YYYY");
};

const formatNumber = (number) => {
  let locale = "en-IN";
  return new Intl.NumberFormat(locale, { maximumSignificantDigits: 3 }).format(
    number
  );
};

const formatDate = (date) => {
  return moment.unix(date).format("DD-MM-YYYY");
};

const getLineData = (dataset) => {
  console.log(dataset.tokenDayDatas);
  let data = [...dataset.tokenDayDatas].reverse();
  const line = data.map((d) => {
    return d.totalLiquidityUSD;
  });
  const labels = data.map((d) => {
    return formatDate(d.date);
  });

  return { data: line, labels };
};

const renderChart = (lineData, token) => {
  let target = document.getElementById("chart").getContext("2d");
  if (target !== null) {
    let data = {
      labels: lineData.labels,
      datasets: [
        {
          label: `${token.name} ${token.symbol}`,
          backgroundColor: "#333",
          data: lineData.data,
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
    const chart = Chart.getChart(target);
    if (chart !== undefined) {
      chart.destroy();
    }

    new Chart(target, config);

    return true;
  } else {
    return false;
  }
};

export default defineComponent({
  data() {
    return {
      store,
    };
  },

  setup() {
    const now = getTime();
    watch(
      () => [store.dataset, store.token],
      ([dataset, token], [prevDataset, prevToken]) => {
        if (token.id !== prevToken.id) {
          renderChart(getLineData(dataset, token), token);
        }
      }
    );

    return {
      now,
    };
  },
});
</script>
<template>
  <div>
    <canvas id="chart" width="400" height="200"></canvas>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Chart, registerables } from "chart.js";
import moment from "moment";
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
  let data = [...dataset.tokenDayDatas].reverse();
  const line = data.map((d) => {
    return d.totalLiquidityUSD;
  });
  const labels = data.map((d) => {
    return formatDate(d.date);
  });

  return { data: line, labels };
  // toRefs()
};

const renderChart = (lineData, token) => {
  let target = document.getElementById("chart");
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
    return new Chart(target, config);
  } else {
    return false;
  }
};

export default defineComponent({
  mounted() {
    renderChart(this.lineData, this.token);
  },
  props: {
    dataset: {
      type: Object,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const now = getTime();
    const lineData = getLineData(props.dataset, props.token);
    return {
      now,
      lineData,
    };
  },
});
</script>
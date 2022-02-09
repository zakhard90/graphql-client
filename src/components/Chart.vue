<template>
  <div class="mt-6">
    <canvas id="chart" width="400" height="200"></canvas>
    <progress
      id="initialProgress"
      max="1"
      value="0"
      style="width: 100%; height: 0.25rem;"
    ></progress>
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
  return moment.unix(date).format("DD.MM");
};

const getLineData = (dataset) => {
  if (dataset !== undefined && dataset !== null) {
    let data = [...dataset.tokenDayDatas].reverse();
    const line = data.map((d) => {
      return d.totalLiquidityUSD;
    });
    const labels = data.map((d) => {
      return formatDate(d.date);
    });
    return { data: line, labels };
  } else {
    return null;
  }
};

const renderChart = (lineData, token) => {
  if (lineData !== undefined && lineData !== null) {
    let target = document.getElementById("chart").getContext("2d");
    const initProgress = document.getElementById("initialProgress");
    if (target !== null) {
      let data = {
        labels: lineData.labels,
        datasets: [
          {
            label: `${token.name} ${token.symbol}`,
            backgroundColor: "#5691f1",
            data: lineData.data,
          },
        ],
      };

      let config = {
        type: "line",
        data: data,
        options: {
          responsive: true,
          elements: {
            line: {
              borderColor: "#295599",
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Total USD Volume",
            },
          },
          scales: {
            x: {
              grid: {
                color: "#193054",
              },
              ticks: {
                color: "#ffffff",
                callback: function (val, index) {
                  return index % 4 === 0 ? this.getLabelForValue(val) : "";
                },
              },
            },
            y: {
              grid: {
                color: "#193054",
              },
              ticks: {
                color: "#ffffff",
                callback: function (val, index) {
                  return val / 1e6 + " M";
                },
              },
            },
          },
          animation: {
            duration: 2000,
            onProgress: function (context) {
              if (context.initial) {
                initProgress.value = context.currentStep / context.numSteps * 2;
              } 
            },
            onComplete: function (context) {
              if (context.initial) {
                console.log("Initial animation finished");
              } 
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
        if (
          prevDataset == undefined ||
          JSON.stringify(dataset) != JSON.stringify(prevDataset) ||
          prevToken.id == undefined ||
          token.id !== prevToken.id
        ) {
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
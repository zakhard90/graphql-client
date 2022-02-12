<template>
  <div class="mt-2">
    <canvas id="chart"> </canvas>
    <progress
      id="initialProgress"
      max="1"
      value="0"
      style="width: 100%; height: 0.2rem"
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

// wip
const aggregateMonthly = (dataset) => {
  let output = { volumeDataset: [] };
  dataset.volumeDataset.forEach((d, i) => {
    let d1 = {
      ...d,
      date: moment(d.date * 1000)
        .startOf("month")
        .unix(),
    };
    output.volumeDataset[i] = d1;
  });

  let group = output.volumeDataset.reduce((rv, x) => {
    (rv[x["date"]] = rv[x["date"]] || []).push(x);
    return rv;
  }, {});

  output.volumeDataset = [];
  let i = 0;
  for (let m in group) {
    let g = {
      ...group[m][0],
      totalLiquidityUSD: group[m].reduce(
        (a, b) => Number(a) + (Number(b["totalLiquidityUSD"]) || 0),
        0
      ),
    };
    output.volumeDataset[i++] = g;
  }
  output.volumeDataset.reverse();
  return output;
};

const getLineData = (dataset) => {
  if (dataset !== undefined && dataset !== null) {
    let data = [...dataset.volumeDataset].reverse();

    const line = data.map((d) => {
      return d.totalLiquidityUSD;
    });
    const labels = data.map((d) => {
      if (store.interval.id === "M") {
        return moment(d.date * 1000).format("MMM");
      } else {
        return moment(d.date * 1000).format("DD.MM");
      }
    });
    return { data: line, labels };
  } else {
    return null;
  }
};

const renderChart = (lineData, token) => {
  if (lineData !== undefined && lineData !== null) {
    const target = document.getElementById("chart").getContext("2d");
    const initProgress = document.getElementById("initialProgress");
    const spinner = document.getElementById("spinner");

    const ratio = window.innerWidth < 720 ? 1 : 16 / 9;

    if (target !== null) {
      let data = {
        labels: lineData.labels,
        datasets: [
          {
            label: `${token.name} ${token.symbol}`,
            backgroundColor: "#f700e4",
            data: lineData.data,
          },
        ],
      };

      let config = {
        type: "line",
        data: data,
        options: {
          aspectRatio: ratio,
          maintainAspectRatio: true,
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
              color: "#295599",
              text: "Total Liquidity Volume (USD)",
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
                  return store.interval.id == "M" || index % 5 === 0
                    ? this.getLabelForValue(val)
                    : "";
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
                initProgress.value =
                  (context.currentStep / context.numSteps) * 2;
              }
            },
            onComplete: function (context) {
              if (context.initial) {
                spinner.classList.add("hidden");
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
      () => [store.dataset, store.token, store.interval.id],
      ([dataset, token, interval], [prevDataset, prevToken, prevInterval]) => {
        if (
          prevDataset == undefined ||
          JSON.stringify(dataset) != JSON.stringify(prevDataset)
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
<template>
  <div class="greetings">
    <h1 class="green">Charts</h1>
    <Selector />
    <Chart />
    <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
    <div></div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";
import Selector from "./Selector.vue";

import { useQuery } from "@vue/apollo-composable";
import { queryDailyVolumeUSD } from "../queries/dailyVolumeUSD";

export default {
  components: {
    Selector,
    Chart,
  },
  data: () => ({
    loaded: false,
    chartdata: null,
  }),
  async mounted() {
    this.loaded = false;
    try {
      const variables = {
        token: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        from: 1640995200,
        to: 1643673600
      };
      const { result, loading, error } = await useQuery(
        queryDailyVolumeUSD,
        variables
      );

      this.chartdata = result;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
  },
};
</script>

<style scoped>
</style>

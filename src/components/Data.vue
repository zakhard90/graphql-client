<template>
  <div>
    <h1 class="green">Uniswap Liquidity Trends</h1>
    <Selector />
    <div v-if="loading">Loading data...</div>
    <div v-else>
      <Chart :dataset="dataset" :token="store.token" />
    </div>
    <div></div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";
import Selector from "./Selector.vue";

import { reactive, toRefs } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { queryDailyVolumeUSD } from "../queries/dailyVolumeUSD";
import store from "../store";

const getChartData = (token) => {
  try {
    const variables = {
      token: token,
      from: 1640995200,
      to: 1643673600,
    };

    let { result, loading, error } = useQuery(queryDailyVolumeUSD, variables);
    const queryResult = reactive({ dataset: result, loading, error });
    return toRefs(queryResult);
  } catch (e) {
    console.error(e);
  }
};

export default {
  components: {
    Selector,
    Chart,
  },
  data() {
    return {
      store,
    };
  },
  setup() {
    const { dataset, loading, error } = getChartData(store.token.id);
    return {
      dataset,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
</style>

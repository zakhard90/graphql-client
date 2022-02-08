<template>
  <div>
    <h1 class="green">Uniswap Liquidity Trends</h1>
    <Selector />
    <div v-if="loading"></div>
    <Chart />
    <div></div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";
import Selector from "./Selector.vue";

import { reactive, toRefs, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { queryDailyVolumeUSD } from "../queries/dailyVolumeUSD";
import store from "../store";

const getChartData = (tokenId) => {
  try {
    const variables = {
      token: tokenId,
      from: 1640995200,
      to: 1643673600,
    };

    const { result, loading, error, refetch } = useQuery(
      queryDailyVolumeUSD,
      variables
    );

    store.dataset = result;
    watch(
      () => store.token,
      (token, prev) => {
        if (token.symbol !== prev.symbol) {
          variables.token = token.id;
          console.log(token.id);
          refetch(variables);
        }
      }
    );

    const queryResult = reactive({
      dataset: result,
      loading,
      error,
    });
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
      loading,
      dataset,
    };
  },
};
</script>

<style scoped>
</style>

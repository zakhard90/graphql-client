<template>
  <div>
    <h1 class="text-3xl text-slate-900 dark:text-white mb-4">
      Uniswap Liquidity Trends
    </h1>
    <Selector />
    <div v-if="!loading">
      <Chart />
    </div>
    <div></div>
  </div>
</template>

<script>
import Chart from "./Chart.vue";
import Selector from "./Selector.vue";

import { defineComponent, reactive, toRefs, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { queryDailyVolumeUSD } from "../queries/dailyVolumeUSD";
import moment from "moment";
import store from "../store";

const getChartData = () => {
  try {
    const variables = {
      token: store.token.id,
      from: moment(store.date.from.getTime()).unix(),
      to: moment(store.date.to.getTime()).unix(),
    };
  
    const { result, loading, error, refetch } = useQuery(
      queryDailyVolumeUSD,
      variables
    );

    watch(
      () => [store.token, store.date.from, store.date.to],
      ([token, dateFrom, dateTo], [prevToken, prevDateFrom, prevDateTo]) => {
        if (
          prevToken === undefined ||
          token.symbol !== prevToken.symbol ||
          dateFrom.getTime() !== prevDateFrom.getTime() ||
          dateTo.getTime() !== prevDateTo.getTime()
        ) {
          variables.token = token.id;
          variables.from = moment(dateFrom.getTime()).unix();
          variables.to = moment(dateTo.getTime()).unix();
          console.log(variables);
          refetch(variables);
        }
      }
    );

    store.dataset = result;

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

export default defineComponent({
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
    const { loading } = getChartData();
    return {
      loading,
    };
  },
});
</script>

<style scoped>
</style>

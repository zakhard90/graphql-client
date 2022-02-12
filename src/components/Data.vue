<template>
  <div>
    <h1
      class="
        text-xl text-center
        md:text-3xl md:text-left
        text-slate-900
        dark:text-white
        mb-2 md:mb-4 
      "
    >
      Uniswap V2 Liquidity
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

import { defineComponent, reactive, toRefs, watch, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { queryDailyVolumeUSD } from "../queries/dailyVolumeUSD";
import moment from "moment";
import store from "../store";

const getChartData = () => {
  try {
    const spinner = document.getElementById("spinner");
    const variables = ref({
      token: store.token.id,
      from: moment(store.date.from.getTime()).startOf("day").unix(),
      to: moment(store.date.to.getTime()).unix(),
    });

    store.query = queryDailyVolumeUSD;

    const { result, loading, error, refetch } = useQuery(
      store.query,
      variables
    );

    watch(
      () => [store.token, store.date.from, store.date.to, store.interval.id],
      (
        [token, dateFrom, dateTo, interval],
        [prevToken, prevDateFrom, prevDateTo, prevInterval]
      ) => {
        if (
          prevToken === undefined ||
          token.symbol !== prevToken.symbol ||
          dateFrom.getTime() !== prevDateFrom.getTime() ||
          dateTo.getTime() !== prevDateTo.getTime() ||
          interval !== prevInterval
        ) {
          spinner.classList.remove("hidden");
          variables.token = token.id;
          variables.from = moment(dateFrom.getTime()).startOf("day").unix();
          variables.to = moment(dateTo.getTime()).unix();         

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

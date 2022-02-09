<template >
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <div class="flex mb-4 -mx-2 h-24">
      <div class="w-1/3 h-12 px-2">
        <label class="block text-gray-700 mb-2 dark:text-white">Token</label>
        <select
          class="
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            dark:bg-slate-800 dark:text-white
          "
          v-model="store.token"
        >
          <option disabled value="">Please select a token</option>
          <option v-for="token in result.tokens" :key="token.id" :value="token">
            {{ token.symbol }} - {{ token.name }}
          </option>
        </select>
      </div>
      <div class="w-1/3 h-12 px-2">
        <label class="block text-gray-700 mb-2 dark:text-white"
          >Date range</label
        >
        <Datepicker
          v-model="dateRange"
          :format="dateFormat"
          :enableTimePicker="false"
          :maxDate="new Date()"
          @update:modelValue="updateDates(dateRange)"
          range
          multiCalendars
          dark
        ></Datepicker>
      </div>
      <div class="w-1/3 h-12 px-2">
        <label class="block text-gray-700 mb-2 dark:text-white">Interval</label>
        <select
          class="
            appearance-none
            border
            rounded
            w-full
            py-2
            px-3
            text-gray-700
            dark:bg-slate-800 dark:text-white
          "
          v-model="store.interval"
        >
          <option disabled value="">Please select an interval</option>
          <option
            v-for="interval in intervals"
            :key="interval.id"
            :value="interval"
          >
            {{ interval.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <div></div>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { queryTopFiveTokens } from "../queries/topFiveTokens";

import Datepicker from "vue3-date-time-picker";
import moment from "moment";
import store from "../store";

import "vue3-date-time-picker/dist/main.css";

const updateDates = (dateRange) => {
  console.log(dateRange);
  console.log(Math.floor(dateRange[0].getTime() / 1000));
  store.date.from = moment(dateRange[0].getTime()).toDate();
  console.log(Math.floor(dateRange[1].getTime() / 1000));
  store.date.to = moment(dateRange[1].getTime()).toDate();
};

export default defineComponent({
  components: { Datepicker },

  data() {
    return {
      store,
      dateRange: store.date.range,
      dateFormat: "dd-MM-yyyy",
      intervals: [
        {
          id: "H",
          name: "Hourly",
        },
        {
          id: "D",
          name: "Daily",
        },
        {
          id: "M",
          name: "Monthly",
        },
      ],
    };
  },
  setup() {
    const { result, loading, error } = useQuery(queryTopFiveTokens);
    watch(result, (result) => {
      if (result.tokens !== undefined && result.tokens.length > 0) {
        store.token = result.tokens[0];
      }
    });

    return {
      result,
      loading,
      error,
      updateDates,
    };
  },
});
</script>
<template >
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <div v-else>
    <label>Token </label>
    <select v-model="store.token">
      <option disabled value="">Please select a token</option>
      <option v-for="token in result.tokens" :key="token.id" :value="token">
        {{ token.symbol }} - {{ token.name }}
      </option>
    </select>
  </div>
  <div></div>
</template>

<script>
import { useQuery } from "@vue/apollo-composable";
import { queryTopFiveTokens } from "../queries/topFiveTokens";
import store from "../store";
export default {
  data() {
    return {
      store,
    };
  },
  setup() {
    const { result, loading, error } = useQuery(queryTopFiveTokens);
    
    return {
      result,
      loading,
      error,
    };
  },
};
</script>
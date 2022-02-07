
<template>
  <div class="greetings">
    <h1 class="green">Charts</h1>

    <h6>Tokens</h6>
    <p v-if="error">Something went wrong...</p>
    <p v-if="loading">Loading...</p>
    <p v-else v-for="token in result.tokens" :key="token.id">
      {{ token.symbol }} - {{ token.name }}
    </p>
    <div></div>
  </div>
</template>

<script>
// import { ref, reactive } from "vue"
import { useQuery } from "@vue/apollo-composable";
import { queryTopFiveTokens } from "../queries/topFiveTokens";

export default {
  setup() {
    const { result, loading, error } = useQuery(queryTopFiveTokens);
    console.log(result);
    return {
      result,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
</style>

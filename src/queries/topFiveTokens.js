import gql from "graphql-tag";

export const queryTopFiveTokens = gql
    `
      query TopFiveTokens {
        tokens(
          first: 5
          orderBy: tradeVolumeUSD
          orderDirection: desc
          where: { name_not_contains: "delta.financial" }
        ) {
          id
          symbol
          name
          tradeVolumeUSD
        }
      }
    `;
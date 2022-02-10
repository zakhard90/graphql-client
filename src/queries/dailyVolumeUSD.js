import gql from "graphql-tag";

export const queryDailyVolumeUSD = gql
    `
      query DailyVolumeUSD ($token: String!, $from: Int!, $to: Int!){
        volumeDataset: tokenDayDatas (
            first: 1000,
            orderBy: date,
            orderDirection: desc, 
            where: {
              token : $token,
              date_gte: $from, 
              date_lt: $to
              }
            ){
            token {symbol} 
            date    
            totalLiquidityUSD
        }
      }
    `;   
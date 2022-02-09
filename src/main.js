import { createApp, provide, h } from 'vue'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import './index.css'

const { VITE_GRAPH_URL } = import.meta.env

const httpLink = new HttpLink({
    uri: VITE_GRAPH_URL,
})

console.log(import.meta.env.VITE_GRAPH_URL)

const apollo = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
})

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apollo)
    },
    render: () => h(App),
})

app.mount('#app');

import { createClient, cacheExchange, fetchExchange } from '@urql/vue'
import { retryExchange } from '@urql/exchange-retry'
import { getAuthApiUrl } from './utils/getAuthApiUrl'

export const graphqlAuthClient = createClient({
  url: getAuthApiUrl(),
  exchanges: [
    cacheExchange,
    retryExchange({
      initialDelayMs: 1000,   // Retry once per second
      maxDelayMs: 1000,      // Keep consistent 1-second intervals
      maxNumberAttempts: 60,  // Retry for 60 seconds total
      retryIf: error => {
        // Only retry on HTTP 502 (Bad Gateway) - deployment indicator
        return error.response && error.response.status === 502
      }
    }),
    fetchExchange
  ],
  fetchOptions: {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  }
})
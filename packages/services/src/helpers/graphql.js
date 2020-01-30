import { request } from 'graphql-request'

export default (query) => request(process.env.GRAPHQL_ENDPOINT, query)

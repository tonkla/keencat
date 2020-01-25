import { promisify } from 'util'
import axios from 'axios'
import dotenv from 'dotenv'
import { GraphQLClient } from 'graphql-request'
import jwt from 'jsonwebtoken'
import redis from 'redis'

import { Category, Product } from '../typings/common'

dotenv.config()

function getRedisClient() {
  const url = process.env.REDIS_URL || ''
  return redis.createClient(url)
}

async function getGraphQLClient() {
  try {
    const apiUrl = process.env.API_URL || ''
    const appId = process.env.APP_ID || ''
    const appSecret = process.env.APP_SECRET || ''
    const redisc = getRedisClient()
    const hget = promisify(redisc.hget).bind(redisc)
    const accessToken = await hget(appId, 'accessToken')
    if (accessToken) {
      const data: any = jwt.decode(accessToken)
      if (data && data.exp * 1000 > Date.now()) {
        return new GraphQLClient(`${apiUrl}/graphql`, {
          headers: { authorization: accessToken },
        })
      }
    }
    const { data } = await axios.post(`${apiUrl}/login`, {
      source: 'msg',
      username: appId,
      password: appSecret,
    })
    if (data && data.accessToken) {
      redisc.hset(appId, 'accessToken', data.accessToken)
      return new GraphQLClient(`${apiUrl}/graphql`, {
        headers: { authorization: data.accessToken },
      })
    }
    return null
  } catch (e) {
    return null
  }
}

async function getPageAccessToken(pageId: string): Promise<string> {
  try {
    const redisc = getRedisClient()
    const hget = promisify(redisc.hget).bind(redisc)
    const pageAccessToken = await hget(pageId, 'pageAccessToken')
    if (pageAccessToken) return pageAccessToken

    const gqlc = await getGraphQLClient()
    if (gqlc) {
      const q = `query GetPageAccessToken($pageId: ID!) {
      getPageAccessToken(pageId: $pageId)
    }`
      const v = { pageId }
      const { getPageAccessToken } = await gqlc.request(q, v)
      if (getPageAccessToken) {
        redisc.hset(pageId, 'pageAccessToken', getPageAccessToken)
        return getPageAccessToken
      }
    }
    return ''
  } catch (e) {
    return ''
  }
}

async function getCategories(pageId: string): Promise<Category[]> {
  try {
    const client = await getGraphQLClient()
    if (client) {
      const q = `query GetCategories($pageId: ID) {
      getCategories(pageId: $pageId) {
        id
        name
      }
    }`
      const v = { pageId }
      const { getCategories } = await client.request(q, v)
      return getCategories ? getCategories : []
    }
    return []
  } catch (e) {
    return []
  }
}

async function getProducts(pageId: string, categoryId: string): Promise<Product[]> {
  try {
    const client = await getGraphQLClient()
    if (client) {
      const q = `query GetProducts($pageId: ID, $categoryId: ID) {
      getProducts(pageId: $pageId, categoryId: $categoryId) {
        id
        name
      }
    }`
      const v = {
        pageId,
        categoryId,
      }
      const { getProducts } = await client.request(q, v)
      return getProducts ? getProducts : []
    }
    return []
  } catch (e) {
    return []
  }
}

async function resetPageAccessToken(pageId: string): Promise<boolean> {
  try {
    const redisc = getRedisClient()
    redisc.hdel(pageId, 'pageAccessToken')
    return true
  } catch (e) {
    return false
  }
}

export default {
  getCategories,
  getPageAccessToken,
  getProducts,
  resetPageAccessToken,
}

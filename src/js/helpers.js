import { FIN_MODEL_PREP_BASE_URL } from "./conifg"
import { FINNHUB_BASE_URL } from "./conifg"
import { ALPHA_VANTAGE_BASE_URL } from "./conifg"
import { POLYGON_IO_BASE_URL } from "./conifg"
import { TIMEOUT_SEC } from "./conifg"
import { apiKeys } from './conifg'
import { LIMIT } from './conifg'

const timeout = function(seconds) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('The server took too long to respond. Please try again later.'))
        }, seconds * 1000)
    })
}

export const AJAX = async function(url) {
    try {
        const fetchPromise = fetch(url)
        const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)])
        const data = await response.json()
        if (!response.ok) throw new Error(data.message)
        return data
    } catch (error) {
        throw error
    }
}

export const getFinModelPrepScreenerUrl = function(exchange) {
    return `${FIN_MODEL_PREP_BASE_URL}stock-screener?exchange=${exchange}&limit=${LIMIT}&apikey=${apiKeys.financialModelingPrep}`
}

export const getFinModelPrepProfilerUrl = function(symbol) {
    return `${FIN_MODEL_PREP_BASE_URL}profile/${symbol}?apikey=${apiKeys.financialModelingPrep}`
}

export const getFinnhubProfileUrl = function(symbol) {
    return`${FINNHUB_BASE_URL}?symbol=${symbol}&token=${apiKeys.finnhub}`
}

export const getAlphaVantageOverviewUrl = function(symbol) {
    return`${ALPHA_VANTAGE_BASE_URL}?symbol=${symbol}&function=OVERVIEW&apikey=${apiKeys.alphaVantage}`
}

export const getPolygonAggregateUrl = function(symbol, todayTimestamp, pastTimestamp) {
    return`${POLYGON_IO_BASE_URL}aggs/ticker/${symbol}/range/1/day/${pastTimestamp}/${todayTimestamp}?&limit=30&apiKey=${apiKeys.polygon_io}`
}

export const getTimestamps = function(daysAgo) {
    const today = new Date()
    const todayTimestamp = today.getTime()
    const someDaysAgo = new Date()
    someDaysAgo.setDate(today.getDate() - daysAgo)
    const someDaysAgoTimestamp = someDaysAgo.getTime()
    return [todayTimestamp, someDaysAgoTimestamp]
}
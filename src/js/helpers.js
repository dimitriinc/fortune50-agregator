import { TimeoutError } from './errors'
import * as config from './conifg'

const timeout = function(seconds) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError())
        }, seconds * 1000)
    })
}

export const delay = function(seconds) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), seconds * 1000)
    })
}

export const AJAX = async function(url) {
    try {
        const fetchPromise = fetch(url)
        const response = await Promise.race([fetchPromise, timeout(config.TIMEOUT_SEC)])
        const data = await response.json()
        if (!response.ok) throw new Error(data.message)
        return data
    } catch (error) {
        throw error
    }
}

export const getFinModelPrepScreenerUrl = function(exchange) {
    return `${config.FIN_MODEL_PREP_BASE_URL}stock-screener?exchange=${exchange}&limit=${config.LIMIT}&apikey=${config.apiKeys.financialModelingPrep}`
}

export const getFinModelPrepProfilerUrl = function(symbol) {
    return `${config.FIN_MODEL_PREP_BASE_URL}profile/${symbol}?apikey=${config.apiKeys.financialModelingPrep}`
}

export const getFinnhubProfileUrl = function(symbol) {
    return`${config.FINNHUB_BASE_URL}?symbol=${symbol}&token=${config.apiKeys.finnhub}`
}

export const getAlphaVantageOverviewUrl = function(symbol) {
    return`${config.ALPHA_VANTAGE_BASE_URL}?symbol=${symbol}&function=OVERVIEW&apikey=${config.apiKeys.alphaVantage}`
}

export const getAlphaVantageIncomeUrl = function(symbol) {
    return `${config.ALPHA_VANTAGE_BASE_URL}?symbol=${symbol}&function=INCOME_STATEMENT&apikey=${config.apiKeys.alphaVantage}`
}

export const getPolygonAggregateUrl = function(symbol, pastTimestamp, todayTimestamp) {
    return`${config.POLYGON_IO_BASE_URL}aggs/ticker/${symbol}/range/1/day/${pastTimestamp}/${todayTimestamp}?&limit=30&apiKey=${config.apiKeys.polygon_io}`
}

export const getDates = function(daysAgo) {
    const today = new Date()
    const someDaysAgo = new Date()
    someDaysAgo.setDate(today.getDate() - daysAgo)
    return [someDaysAgo, today]
}

export const compressStockPrices = function(stockPrices) {
    const compressionRatio = stockPrices.length / config.COMPRESSED_SIZE
    const compressedArray = []

    for (let i = 0; i < config.COMPRESSED_SIZE; i++) {
        const startIndex = Math.floor(i * compressionRatio)
        const endIndex = Math.floor((i + 1) * compressionRatio)
        const segment = stockPrices.slice(startIndex, endIndex)
        const average = segment.reduce((sum, price) => sum + price, 0) / segment.length
        compressedArray.push(parseFloat(average.toFixed(2)))
    }

    return compressedArray
}

export const createGraphTimestamps = function(pastDate, todayDate) {
    const numberOfIntervals = config.COMPRESSED_SIZE
    const timestamps = []
    const startTime = pastDate.getTime()
    const endTime = todayDate.getTime()
    const interval = (endTime - startTime) / numberOfIntervals

    for (let i = 0; i < numberOfIntervals; i++) {
        const date = new Date(startTime + i * interval)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(2);

        const formattedDate = `${day}/${month}/${year}`;
        timestamps.push(formattedDate)
    }

    return timestamps
}
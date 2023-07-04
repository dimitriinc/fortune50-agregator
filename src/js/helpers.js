import * as config from './conifg'

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
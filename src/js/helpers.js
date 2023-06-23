import { FIN_MODEL_PREP_BASE_URL } from "./conifg"
import { FINNHUB_BASE_URL } from "./conifg"
import { ALPHA_VANTAGE_BASE_URL } from "./conifg"
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
    return `${FIN_MODEL_PREP_BASE_URL}?exchange=${exchange}&limit=${LIMIT}&apikey=${apiKeys.financialModelingPrep}`
}

export const getFinnhubProfileUrl = function(symbol) {
    return`${FINNHUB_BASE_URL}?symbol=${symbol}&token=${apiKeys.finnhub}`
}

export const getAlphaVantageOverviewUrl = function(symbol) {
    return`${ALPHA_VANTAGE_BASE_URL}?symbol=${symbol}&function=OVERVIEW&apikey=${apiKeys.alphaVantage}`
}
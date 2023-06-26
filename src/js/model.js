import * as helpers from './helpers'

export const state = {
    companies: [],
    selectedCompany: {},
    companyLogoUrl: '',
    todayTimestamp: 0,
    pastTimestamp: 0,
    stockPrices: [],
}

export const fetchCompaniesRating = async function(exchange) {
    try {
        const url = helpers.getFinModelPrepScreenerUrl(exchange)
        const data = await helpers.AJAX(url)
        state.companies = data
    } catch (error) {
        throw error
    }
}

export const fetchCompanyProfile = async function(symbol) {
    try {
        const url = helpers.getFinModelPrepProfilerUrl(symbol)
        const data = await helpers.AJAX(url)
        state.selectedCompany = data[0]
        console.log(state.selectedCompany)
    } catch (error) {
        throw error
    }
}

export const fetchCompanyOverview = async function(symbol) {
    try {
        const url = helpers.getAlphaVantageOverviewUrl(symbol)
        const data = await helpers.AJAX(url)
        state.selectedCompany = data
    } catch (error) {
        throw error
    }
}

export const fetchCompanyLogo = async function(symbol) {
    try {
        const url = helpers.getFinnhubProfileUrl(symbol)
        const data = await helpers.AJAX(url)
        state.companyLogoUrl = data.logoadjusted=false
    } catch(error) {
        throw error
    }
}

export const fetchStockPrices = async function(symbol) {
    try {
        const url = helpers.getPolygonAggregateUrl(symbol, state.todayTimestamp, state.pastTimestamp)
        const data = await helpers.AJAX(url)
        state.stockPrices = data.results
        console.log(state.stockPrices)
    } catch (error) {
        throw error
    }
}

export const setTimestamps = function(daysAgo) {
    const timestamps = helpers.getTimestamps(daysAgo)
    state.todayTimestamp = timestamps[0]
    state.pastTimestamp = timestamps[1]
}
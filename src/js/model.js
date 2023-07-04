import * as helpers from './helpers'

export const state = {
    companies: [],
    selectedCompany: {},
    companyLogoUrl: '',
    today: 0,
    dayInPast: 0,
    stockPrices: [],
    compressedStockPrices: [],
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
        console.log(data[0]);
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
        console.log(data);
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
        const url = helpers.getPolygonAggregateUrl(symbol, state.dayInPast.getTime(), state.today.getTime())
        const data = await helpers.AJAX(url)
        const stockPrices = data.results.map(obj => obj.c)
        state.compressedStockPrices = helpers.compressStockPrices(stockPrices)
        console.log(state.compressedStockPrices)
    } catch (error) {
        throw error
    }
}

export const setDates = function(daysAgo) {
    const dates = helpers.getDates(daysAgo)
    state.dayInPast = dates[0]
    state.today = dates[1]
}
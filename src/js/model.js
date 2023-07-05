import * as helpers from './helpers'
import { SELECT_MODE, SELECT_COMPANY, SELECT_EXCHANGE, stockExchanges } from './conifg'

export const state = {
    companies: [],
    selectedCompany: {},
    selectedExchange: stockExchanges.nasdaq,
    today: undefined,
    dayInPast: undefined,
    compressedStockPrices: [],
    modeSelected: false,
}

export const setDates = function(daysAgo) {
    const dates = helpers.getDates(daysAgo)
    state.dayInPast = dates[0]
    state.today = dates[1]
}

export const fetchCompaniesRating = async function(exchange) {
    try {
        const url = helpers.getFinModelPrepScreenerUrl(exchange)
        const data = await helpers.AJAX(url)
        state.companies = data
        state.selectedExchange = exchange
        persistSelectedExchange()
    } catch (error) {
        throw error
    }
}

export const fetchCompanyProfile = async function(symbol) {
    try {
        const url = helpers.getFinModelPrepProfilerUrl(symbol)
        const data = await helpers.AJAX(url)
        state.selectedCompany = data[0]
        persistSelectedCompany()
    } catch (error) {
        throw error
    }
}

export const fetchCompanyOverview = async function(symbol) {
    try {
        const url = helpers.getAlphaVantageOverviewUrl(symbol)
        const data = await helpers.AJAX(url)
        state.selectedCompany = data
        persistSelectedCompany()
    } catch (error) {
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

export const persistSelectedMode = function(selected) {
    localStorage.setItem(SELECT_MODE, String(selected))
    state.modeSelected = selected
}

export const persistSelectedCompany = function() {
    localStorage.setItem(SELECT_COMPANY, JSON.stringify(state.selectedCompany))
}

export const persistSelectedExchange = function(exchange) {
    localStorage.setItem(SELECT_EXCHANGE, exchange)
}

export const actualizeStateOnInit = function () {
    try {
        localStorage.getItem(SELECT_MODE) === 'true' ? state.modeSelected = true : state.modeSelected = false
        const company = localStorage.getItem(SELECT_COMPANY)
        if (company) state.selectedCompany = JSON.parse(company)
        const exchange = localStorage.getItem(SELECT_EXCHANGE)
        exchange !== 'undefined' ? state.selectedExchange = exchange : state.selectedExchange = stockExchanges.nasdaq
    } catch(error) {
        console.error(error)
        throw new Error(error.message)
        
    }
    
}

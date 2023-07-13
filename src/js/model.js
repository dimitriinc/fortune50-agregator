import * as helpers from './helpers'
import { SELECT_MODE, SELECT_COMPANY, SELECT_EXCHANGE, stockExchanges } from './conifg'

export const state = {
    companies: [],
    selectedCompany: {},
    selectedExchange: stockExchanges.nasdaq,
    selectedIndex: 0,
    today: undefined,
    dayInPast: undefined,
    compressedStockPrices: [],
    graphTimestamps: [],
    modeSelected: false,
    companyStats: {},
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

        data.forEach((company, index) => {
            const { companyName: name, symbol, marketCap } = company
            const stateCompany = {
                name,
                symbol,
                marketCap,
                index: index
            }

            state.companies.push(stateCompany)
        })

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

export const fetchCompanyOverview = async function(symbolInput) {
    try {
        const url = helpers.getAlphaVantageOverviewUrl(symbolInput)
        const data = await helpers.AJAX(url)

        const { Name: name, Description: description, Sector: sector, Address: address, MarketCapitalization: marketCap, Symbol: symbol} = data
        state.selectedCompany = {
            name,
            symbol,
            description,
            sector,
            address,
            marketCap
        }

        persistSelectedCompany()

        if (Object.keys(data).length === 0) throw new Error("The company's data can't be reached")

    } catch (error) {
        console.error(error);
        throw error
    }
}

export const fetchStockPrices = async function(symbol = state.selectedCompany.symbol) {
    try {
        const url = helpers.getPolygonAggregateUrl(symbol, state.dayInPast.getTime(), state.today.getTime())
        const data = await helpers.AJAX(url)

        if (!data.results) throw new Error("The company's stock prices can't be accessed")
        
        const stockPrices = data.results.map(obj => obj.c)
        state.compressedStockPrices = helpers.compressStockPrices(stockPrices)
        state.graphTimestamps = helpers.createGraphTimestamps(state.dayInPast, state.today)
    } catch (error) {
        throw error
    }
}

export const fetchCompanyIncomeStatement = async function(symbol) {
    try {
        const url = helpers.getAlphaVantageIncomeUrl(symbol)
        const data = await helpers.AJAX(url)

        const { totalRevenue, grossProfit, depreciation, interestIncome } = data.annualReports[0]
        state.companyStats = {
            totalRevenue,
            grossProfit,
            depreciation,
            interestIncome,
        }        
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
        throw new Error(error.message)
        
    }
    
}

export const updateSelectedIndex = function(index) {
    state.selectedIndex = index
}

export const getSelectedSymbol = function() {
    return state.companies[state.selectedIndex].symbol
}

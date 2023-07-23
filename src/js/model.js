import * as helpers from './helpers'
import * as errors from './errors'
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
    // modeSelected: false,
    companyStats: {},
    statistics: {
        totalRevenue: new Map(),
        grossProfit: new Map(),
        depreciation: new Map(),
        interestIncome: new Map()
    },
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

        state.companies = []

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

// ================== API calls that are not in use currently =========================================

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

    return new Promise(async (resolve, reject) => {

        try {
            const url = helpers.getAlphaVantageOverviewUrl(symbolInput)
            const data = await helpers.AJAX(url)
    
            if (Object.keys(data).length === 0) throw new errors.InfoError()
            if (Object.keys(data).length === 1) throw new errors.InfoError('We have reached our daily API call limit of 100 for today. Come back tomorrow :/')
    
            const { Name: name, Description: description, Sector: sector, Address: address, MarketCapitalization: marketCap, Symbol: symbol} = data
                        
            state.selectedCompany = {
                name,
                symbol,
                description,
                sector,
                address,
                marketCap
            }
    
            resolve("Info promise is resolved")
    
        } catch (error) {
            reject(error)
        }

    })
    
}

// ========================================================================================================


// SELECTED API CALLS

export const fetchStockPrices = async function(symbol = state.selectedCompany.symbol) {

    return new Promise(async (resolve, reject) => {

        try {

            const url = helpers.getPolygonAggregateUrl(symbol, state.dayInPast.getTime(), state.today.getTime())
            const data = await helpers.AJAX(url)    
            if (!data.results) throw new errors.GraphError()

            const stockPrices = data.results.map(obj => obj.c)
            state.compressedStockPrices = helpers.compressStockPrices(stockPrices)
            state.graphTimestamps = helpers.createGraphTimestamps(state.dayInPast, state.today)

            resolve("Graph promise is resolved")

        } catch (error) {
            reject(error)
        }

    })

}

export const fetchTickerDetails = async function(ticker) {

    return new Promise(async (resolve, reject) => {

        try {
            const url = helpers.getPolygonTickerDetailsUrl(ticker)
            const data = await helpers.AJAX(url)
            const results = data.results

            if (!results) throw new errors.InfoError()

            const address = [results.address.address1, results.address.city, results.address.state].join(', ')

            const {name, ticker: symbol, description, market_cap: marketCap, sic_description: sector, homepage_url: website} = results

            state.selectedCompany = {
                name,
                symbol,
                description,
                marketCap,
                sector,
                address,
                website
            }
            
            resolve("Info promise is resolved")

            
        } catch (error) {
            reject(error)
        }
    })
}


export const fetchCompanyIncomeStatement = async function(symbol) {

    return new Promise(async (resolve, reject) => {

        try {

            const url = helpers.getAlphaVantageIncomeUrl(symbol)
            const data = await helpers.AJAX(url)
    
            if (Object.keys(data).length === 0) throw new errors.StatsError()
            if (Object.keys(data).length === 1) throw new errors.InfoError('We have reached our daily API call limit of 100 for today. Come back tomorrow :/')

            if (!data.annualReports) throw new errors.StatsError()


            for (let i = data.annualReports.length - 1; i >= 0 ; i--) {
                const year = data.annualReports[i].fiscalDateEnding.slice(0,4)
                state.statistics.totalRevenue.set(year, +data.annualReports[i].totalRevenue)
                state.statistics.grossProfit.set(year, +data.annualReports[i].grossProfit)
                state.statistics.depreciation.set(year, +data.annualReports[i].depreciation)
                state.statistics.interestIncome.set(year, +data.annualReports[i].interestIncome)
            }
            
            resolve("Stats promise is resolved")

        } catch (error) {
            reject(error)
        }
    })
    
}

//==================================================================================================//

// export const persistSelectedMode = function(selected) {
//     localStorage.setItem(SELECT_MODE, String(selected))
//     state.modeSelected = selected
// }

// export const persistSelectedCompany = function() {
//     localStorage.setItem(SELECT_COMPANY, JSON.stringify(state.selectedCompany))
// }

export const persistSelectedExchange = function(exchange) {
    localStorage.setItem(SELECT_EXCHANGE, exchange)
}

export const actualizeStateOnInit = function () {
    try {
        // localStorage.getItem(SELECT_MODE) === 'true' ? state.modeSelected = true : state.modeSelected = false
        // const company = localStorage.getItem(SELECT_COMPANY)
        // if (company) state.selectedCompany = JSON.parse(company)

        const exchange = localStorage.getItem(SELECT_EXCHANGE)
        exchange ? state.selectedExchange = exchange : state.selectedExchange = stockExchanges.nasdaq
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

export const getSelectedName = function() {
    return state.companies[state.selectedIndex].name
}

export const setCompanySymbol = function(symbol) {
    state.selectedCompany.symbol = symbol
}

export const setCompanyName = function(name) {
    state.selectedCompany.name = name
}
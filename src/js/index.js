import _ from 'lodash'
import apiKeys from './conifg'
import { LIMIT } from './conifg'
import { stockExchanges } from './conifg'

async function getCompanyProfileModelingPrep(symbol) {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKeys.financialModelingPrep}`)
    const data = await response.json()
    console.log(data)
}

async function getCompanyOverviewAlphaVantage(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKeys.alphaVantage}`)
    const data = await response.json()
    console.log(data)
    displayCompanyInfo(data)
    return data
}

function displayCompanyInfo(data) {
    const element = document.createElement('div')
    element.setAttribute('style', 'padding: 3rem')
    element.innerHTML = _.join([data.Name, data.MarketCapitalization], ': ')
    document.body.appendChild(element)

}

async function getNasdaqCompaniesMarketStack() {

    const response = await fetch(`http://api.marketstack.com/v1/exchanges/XNAS/tickers?access_key=${apiKeys.marketstack}&limit=${LIMIT}`)
    const data = await response.json()

    console.log(data.data.tickers)
}

async function getTickersMarketstack(stockExchange) {
    const response = await fetch(`http://api.marketstack.com/v1/tickers?access_key=${apiKeys.marketstack}&exchange=${stockExchange}&limit=${LIMIT}`)
    const data = await response.json()
    const companiesArray = data.data

    companiesArray.forEach((company, index) => {
        displayCompany(company, index)
    })

    console.log(data.data)
}

getTickersMarketstack(stockExchanges.tokyoStockExchange)

function displayCompany(company, index) {
    const element = document.createElement('div')
    element.innerHTML = `${index + 1}<br><br>${company.name}`
    element.setAttribute('style', 'padding:1rem;margin:1rem;border:1px solid blue;text-align:center')
    document.body.appendChild(element)
}

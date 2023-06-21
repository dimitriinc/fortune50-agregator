import '../scss/style.scss'
import apiKeys from './conifg'
import { LIMIT } from './conifg'
import { stockExchanges } from './conifg'

const gridContainer = document.querySelector('.grid-container')

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

async function getStockScreenerFinModelPrep(exchange) {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/stock-screener?&exchange=${exchange}&limit=${LIMIT}&apikey=${apiKeys.financialModelingPrep}`)
    const data = await response.json()
    console.log(data)
    data.forEach((company, index) => {
        displayCompany(company, index)
    })
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

function displayCompany(company, index) {
    const marketCap = formatMarketCap(company.marketCap)
    const html = `
        <div class="grid-item" data-symbol="${company.symbol}">
            <div class="grid-item--rating">
                <span class="grid-item--rating--content">${index + 1}</span>
            </div>
            <div class="grid-item--card">
                <div class="grid-item--card--name">
                    <div class="grid-item--card--name--company-name">${company.companyName}</div>
                    <div class="grid-item--card--name--symbol">${company.symbol}</div>
                </div>
                <div class="grid-item--card--marketcap">${marketCap}</div>
            </div>
        </div> 
    `
    document.body.insertAdjacentHTML('beforeend', html)
}

function formatMarketCap(marketCap) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
    })
    return formatter.format(marketCap)
}

getStockScreenerFinModelPrep(stockExchanges.euroNext)


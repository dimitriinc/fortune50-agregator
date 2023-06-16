import _ from 'lodash'
import apiKeys from './conifg'
import printMe from './print'

function component() {
    const element = document.createElement('div')
    const button = document.createElement('button')
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    element.setAttribute('style', 'color:red;')

    button.innerHTML = 'Click ME!'
    button.addEventListener('click', printMe)

    element.appendChild(button)

    return element
}

document.body.appendChild(component())

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
    const apiKey = apiKeys.marketstack
    const exchange = 'NASDAQ'
    const limit = 50
    const sort = 'DESC'

    const response = await fetch(`http://api.marketstack.com/v1/tickers?access_key=${apiKey}&exchange=${exchange}&limit=${limit}&sort=${sort}`)
    const data = await response.json()

    console.log(data)
}

async function getCompaniesNasdaq() {
    const response = await fetch(`https://api.nasdaq.com/api/screener/stocks?marketcap=mega&table=COMPANY&limit=50&api_key=${apiKeys.nasdaq}`)
    console.log(response)
}

getCompaniesNasdaq()

// const colliers = getCompanyOverview('CIGI')
// const apple = getCompanyOverview('AAPL')

// const comparisonElement = document.createElement('div')
// comparisonElement.innerHTML = `${colliers.MarketCapitalization > apple.MarketCapitalization ? 'Colliers is biggern than Apple' : 'Apple is bigger than Colliers'}`
// document.body.appendChild(comparisonElement)



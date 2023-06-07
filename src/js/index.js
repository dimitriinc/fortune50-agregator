import _ from 'lodash'
import apiKeys from './conifg'

function component() {
    const element = document.createElement('div')
    element.innerHTML = _.join(['Hello', 'webpack'], ' ')
    element.classList.add('hello')

    return element
}

document.body.appendChild(component())

async function getCompanyProfile(symbol) {
    const response = await fetch(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${apiKeys.financialModelingPrepApiKey}`)
    const data = await response.json()
    console.log(data)
}

async function getCompanyOverview(symbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKeys.alphaVantageApiKey}`)
    const data = await response.json()
    console.log(data)
}

// getCompanyOverview('IBM')

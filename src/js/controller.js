import '../scss/style.scss'
import * as model from './model'
import view from './view'
import { stockExchanges } from './conifg'
import { DAYS_AGO_MONTH, DAYS_AGO_QUARTER, DAYS_AGO_YEAR, SHOW_EMAIL, SHOW_SIGNATURE } from './conifg'

async function init() {

    view.renderHeader()
    view.renderMain()
    view.renderFooter()

    window.addEventListener('hashchange', onHashChange)
    window.location.hash = stockExchanges.newYorkStockExchange
    onHashChange()
    
    model.setTimestamps(DAYS_AGO_MONTH)    
    model.fetchStockPrices("GOOG")
}

async function onHashChange() {
    try {
        view.renderSpinner()
        const stockExchange = window.location.hash.slice(1)
        await model.fetchCompaniesRating(stockExchange)

        view.highlightExchange(stockExchange)
        model.state.companies.forEach((company, index) => {
            view.renderCompany(company, index)
        })
        view.showGrid()
        view.hideSpinner()
    } catch (error) {
        console.error(error)
        view.renderError(error.message)
    }
}




init()



